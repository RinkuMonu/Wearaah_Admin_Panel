import React from "react";
import UserProfile from "./basic";
import { useAuth } from "../../serviceAuth/context";

export default function ProfilePage() {
  
  return (
    <div className="p-6 min-h-screen space-y-8 bg-gray-50">
      <UserProfile />
    </div>
  );
}
