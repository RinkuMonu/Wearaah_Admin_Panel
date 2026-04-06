import { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";
import { connectSocket, disconnectSocket } from "../Config/sokect";
import Swal from "sweetalert2";
import { playSound } from "../Config/audio";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [unseenCount, setUnseenCount] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [token, setTokenState] = useState(
    localStorage.getItem("authToken") || null,
  );
  const [user, setUser] = useState(null);
  const [sellerData, setSellerData] = useState(null);

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("authToken");
      setTokenState(null);
      setUser(null);
    }
  };
  const fetchProfile = async () => {
    if (!token) return;

    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setToken(null);
    }
  };
  const fetchSellerData = async () => {
    if (!token) return;

    try {
      const res = await api.get("/auth/seller/me");
      // console.log("Seller Data:", res.data);
      setSellerData(res.data);
    } catch (err) {
      console.error("Failed to fetch seller data:", err);
      setToken(null);
    }
  };
  useEffect(() => {
    if (!user?.user?._id) return;

    const socket = connectSocket(user.user._id);

    const handler = (data) => {
      setUnseenCount((prev) => prev + 1);

      window.dispatchEvent(new CustomEvent("new_order", { detail: data }));
    };

    socket.on("new_order", handler);

    return () => {
      socket.off("new_order", handler);
    };
  }, [user]);

  useEffect(() => {
    fetchProfile();
    if (user && user?.user?.role === "seller") {
      fetchSellerData();
    }
  }, [token]);

  const fetchMissedOrders = async () => {
    try {
      const res = await api.get("/order/unseen");
      if (res.data.count > 0) {
        setUnseenCount(res?.data?.count || 0);
        Swal.fire({
          title: `${res?.data?.count} New Orders`,
          text: "You have new orders pending",
          icon: "info",
        });
        try {
          playSound();
        } catch {
          console.log("AudionotPlay");
        }
        // audio.play().catch(() => {});
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user && user?.user?.role == "seller" && !user?.user?._id) {
      fetchMissedOrders();
    }
  }, [user]);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
    }
  }, [token]);

  const fetchWallet = async () => {
    if (!token) return;
    try {
      const res = await api.get("/auth/get/wallet");
      setWalletAmount(res.data?.availableBalance || 0);
    } catch (error) {
      console.log("wallet getting", error);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setToken,
        setUser,
        fetchProfile,
        setUnseenCount,
        sellerData,
        unseenCount,
        fetchMissedOrders,
        fetchWallet,
        walletAmount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
