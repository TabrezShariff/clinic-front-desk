import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { FaUserShield, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data:any = await apiFetch("/auth/login", "POST", { email, password });
      setToken(data.access_token);
      router.push("/queue");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaUserShield className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold">Staff Login</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 active:scale-[.99] disabled:bg-blue-300 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
