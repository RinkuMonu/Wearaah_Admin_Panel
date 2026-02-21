import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="text-center mt-20 ">
      <h1 className="text-4xl font-bold text-red-500">403</h1>
      <p>You don't have permission to access this page</p>
      <button>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to home
        </Link>
      </button>
    </div>
  );
}
