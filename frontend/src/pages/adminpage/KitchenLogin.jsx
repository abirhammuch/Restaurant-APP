import { useContext, useEffect, useState } from "react";
import { FaLock } from "react-icons/fa6";
import { MdEmail, MdRestaurant } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const KitchenLogin = () => {
  const { backendUrl, navigate } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("kitchentoken")) {
      navigate("/kitchen", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/kitchen/login`,
        {
          email,
          password,
        },
      );
      if (!response.data.success) {
        toast.error(response.data.message || "Invalid kitchen credentials");
        return;
      }

      localStorage.setItem("kitchentoken", response.data.kitchentoken);
      toast.success("Kitchen login successful");
      navigate("/kitchen", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Kitchen login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl text-orange-600">
            <MdRestaurant />
          </div>
          <h1 className="text-3xl font-bold text-[#3d2418]">Kitchen Staff</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage incoming orders
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block text-sm font-semibold text-gray-700">
            Kitchen email
            <span className="relative mt-2 block">
              <MdEmail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="kitchen@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-10 py-2.5 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </span>
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Password
            <span className="relative mt-2 block">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter kitchen password"
                required
                className="w-full rounded-lg border border-gray-300 px-10 py-2.5 font-normal outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in to kitchen"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KitchenLogin;
