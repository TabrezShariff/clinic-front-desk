import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { token } = useAuth();

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
        <div className="text-center animate-[fadeIn_.4s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Clinic Management System</h1>
          <p className="mb-8 text-gray-300 text-lg">Please log in to continue</p>
          <Link 
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:scale-[.99] transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const cardClass = "bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-0.5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight">Front Desk Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_.4s_ease-out]">
          <Link href="/queue" className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
            <div className={cardClass}>
              <h2 className="text-xl font-semibold mb-2">Queue Management</h2>
              <p className="text-gray-600 dark:text-gray-300">View and manage patient queue</p>
            </div>
          </Link>
          
          <Link href="/appointments" className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
            <div className={cardClass}>
              <h2 className="text-xl font-semibold mb-2">Appointments</h2>
              <p className="text-gray-600 dark:text-gray-300">Manage patient appointments</p>
            </div>
          </Link>
          
          <Link href="/doctors" className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
            <div className={cardClass}>
              <h2 className="text-xl font-semibold mb-2">Doctors</h2>
              <p className="text-gray-600 dark:text-gray-300">View doctor information</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
