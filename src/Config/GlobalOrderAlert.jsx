import { useEffect, useRef, useState } from "react";
import api from "../serviceAuth/axios";

const GlobalOrderAlert = () => {
  const [liveOrders, setLiveOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [timers, setTimers] = useState({});
  const audioRef = useRef(null);

  // 🔊 init audio
  useEffect(() => {
    audioRef.current = new Audio("/ringtone-you-would-be-glad-to-know.mp3");

    const unlockAudio = () => {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        })
        .catch(() => {});

      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
  }, []);

  // 🔊 start loop
  const startSound = () => {
    if (!audioRef.current) return;

    // 🔥 already playing hai to dubara mat chalao
    if (!audioRef.current.paused) return;

    audioRef.current.loop = true;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  // 🔇 stop sound
  const stopSound = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.loop = false;
  };

  // 📡 listen global event
  useEffect(() => {
    const handleOrder = (e) => {
      const data = e.detail;

      setLiveOrders((prev) => [data, ...prev]);
      setPendingCount((prev) => prev + 1);
      setTimers((prev) => ({
        ...prev,
        [data.orderId]: 30,
      }));
      startSound();
    };

    window.addEventListener("new_order", handleOrder);

    return () => {
      window.removeEventListener("new_order", handleOrder);
    };
    
  }, []);

  // ❌ remove order
  const removeOrder = (orderId) => {
    setLiveOrders((prev) => {
      const updated = prev.filter((o) => o.orderId !== orderId);

      if (updated.length === 0) {
        stopSound();
      }

      return updated;
    });

    setTimers((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  // ✅ accept order
  const handleAccept = async (orderId) => {
    try {
      //   await api.put(`/order/accept/${orderId}`);

      removeOrder(orderId);

      setPendingCount((prev) => {
        const newCount = prev - 1;

        if (newCount <= 0) stopSound();

        return newCount;
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) {
            updated[id] -= 1;
          } else {
            delete updated[id]; // 🔥 direct cleanup
            setLiveOrders((orders) => {
              const filtered = orders.filter((o) => o.orderId !== id);

              if (filtered.length === 0) stopSound();

              return filtered;
            });
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-5 right-5 z-[9999] space-y-3">
      {liveOrders.map((order) => (
        <div
          key={order.orderId}
          className="bg-white shadow-lg p-4 rounded-lg w-80"
        >
          <h4 className="font-bold">New Order 🚀</h4>
          <p className="text-sm text-gray-500">#{order.orderNumber}</p>

          <div>
            <p className="text-[18px] font-semibold text-red-500">
              ⏳ {timers[order.orderId] ?? 0} sec left
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleAccept(order.orderId)}
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => removeOrder(order.orderId)}
              className="flex-1 bg-gray-200 py-2 rounded"
            >
              Ignore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GlobalOrderAlert;
