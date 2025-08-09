import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { FaClinicMedical, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { setToken } = useAuth();
  const router = useRouter();

  function isActive(href: string) {
    return router.pathname === href;
  }

  function handleLogout() {
    setToken(null);
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold group" aria-label="Go to homepage">
            <FaClinicMedical className="text-blue-600 group-hover:scale-110 transition-transform duration-200" size={20} />
            <span className="hidden sm:inline">Clinic Front Desk</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/queue"
              className={`hover:text-blue-600 transition-colors ${isActive("/queue") ? "text-blue-600" : ""}`}
            >
              Queue
            </Link>
            <Link
              href="/appointments"
              className={`hover:text-blue-600 transition-colors ${isActive("/appointments") ? "text-blue-600" : ""}`}
            >
              Appointments
            </Link>
            <Link
              href="/doctors"
              className={`hover:text-blue-600 transition-colors ${isActive("/doctors") ? "text-blue-600" : ""}`}
            >
              Doctors
            </Link>
          </div>

          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm hover:text-red-500 transition-colors" aria-label="Logout">
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
