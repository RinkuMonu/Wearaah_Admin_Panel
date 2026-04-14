
import { useSearchParams } from "react-router-dom";
import UserProfile from "./basic";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="p-6 min-h-screen space-y-8 bg-gray-50">
      <UserProfile sellerId={id} />
    </div>
  );
}