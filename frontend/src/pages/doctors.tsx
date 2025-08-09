/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";
import { FaUserMd, FaSearch } from "react-icons/fa";

export default function DoctorsPage() {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [viewing, setViewing] = useState<any | null>(null);

  async function refresh() {
    if (!token) return;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (specialization) params.set("specialization", specialization);
    if (location) params.set("location", location);
    if (availability) params.set("availability", availability);
    const data = await apiFetch<any[]>(`/doctors${params.toString() ? `?${params}` : ""}`, "GET", undefined, token);
    setDoctors(data);
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [token]);

  const specializations = useMemo(() => Array.from(new Set(doctors.map((d) => d.specialization))), [doctors]);
  const locations = useMemo(() => Array.from(new Set(doctors.map((d) => d.location))), [doctors]);

  return (
    <ProtectedRoute>
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-xl font-bold mb-4">Available Doctors</h1>

          <div className="flex flex-wrap gap-3 items-center mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-9 pr-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
                placeholder="Search by name, specialization, location"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">All specializations</option>
              {specializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">Any availability</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Off Duty">Off Duty</option>
            </select>
            <button onClick={refresh} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-[.99]">Apply</button>
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 grid place-content-center">
                    <FaUserMd />
                  </div>
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-gray-500">{doc.specialization}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${doc.availability === 'Available' ? 'bg-green-100 text-green-800' : doc.availability === 'Busy' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{doc.availability}</span>
                  <button className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition" onClick={() => setViewing(doc)}>
                    View Schedule
                  </button>
                </div>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="text-center text-gray-500 py-12">No doctors found</div>
            )}
          </div>
        </div>

        <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title={viewing ? `${viewing.name} — Schedule` : "Schedule"}>
          <p className="text-sm text-gray-500">This is a placeholder schedule. Integrate with your availability source.</p>
          <ul className="list-disc pl-5 text-sm">
            <li>Today 2:00 PM</li>
            <li>Today 4:30 PM</li>
            <li>Tomorrow 9:00 AM</li>
          </ul>
        </Modal>
      </>
    </ProtectedRoute>
  );
}
