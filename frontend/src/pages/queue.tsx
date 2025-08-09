import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";
import { FaUserClock, FaPlus, FaTimes } from "react-icons/fa";

export default function QueuePage() {
  const { token } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [addOpen, setAddOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", notes: "" });

  async function refresh() {
    if (!token) return;
    const url = `/queue${filter ? `?status=${encodeURIComponent(filter)}` : ""}`;
    const data = await apiFetch(url, "GET", undefined, token);
    setQueue(data);
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [token, filter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter((item) =>
      `${item.patient?.name} ${item.queueNumber} ${item.status}`
        .toLowerCase()
        .includes(q)
    );
  }, [queue, query]);

  async function updateStatus(id: number, status: string) {
    if (!token) return;
    await apiFetch(`/queue/${id}/status`, "PATCH", { status }, token);
    await refresh();
  }

  async function updateUrgency(id: number, urgency: "Normal" | "Urgent") {
    if (!token) return;
    await apiFetch(`/queue/${id}/priority`, "PATCH", { priority: urgency === "Urgent" ? 1 : 0 }, token);
    await refresh();
  }

  async function addPatientToQueue() {
    if (!token) return;
    const patient = await apiFetch(`/patients`, "POST", newPatient, token);
    await apiFetch(`/queue`, "POST", { patient, status: "waiting" }, token);
    setAddOpen(false);
    setNewPatient({ name: "", phone: "", notes: "" });
    await refresh();
  }

  async function removeEntry(id: number) {
    if (!token) return;
    await apiFetch(`/queue/${id}`, "DELETE", undefined, token);
    await refresh();
  }

  return (
    <ProtectedRoute>
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold inline-flex items-center gap-2">
              <FaUserClock className="text-blue-600" /> Queue Management
            </h1>
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              >
                <option value="">All</option>
                <option value="waiting">Waiting</option>
                <option value="with_doctor">With Doctor</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="text"
                placeholder="Search patients"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
                <FaPlus /> Add New Patient to Queue
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((q) => (
              <div key={q.id} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-900 grid place-content-center font-medium">
                    {q.queueNumber}
                  </div>
                  <div>
                    <div className="font-semibold">{q.patient?.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{q.status.replace("_", " ")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={q.status}
                    onChange={(e) => updateStatus(q.id, e.target.value)}
                    className="px-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
                  >
                    <option value="waiting">Waiting</option>
                    <option value="with_doctor">With Doctor</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select
                    defaultValue={q.priority > 0 ? "Urgent" : "Normal"}
                    onChange={(e) => updateUrgency(q.id, e.target.value as any)}
                    className="px-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
                  >
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>
                  <button
                    onClick={() => removeEntry(q.id)}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-red-600 text-white hover:bg-red-700"
                    title="Remove from queue"
                    aria-label="Remove"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-gray-500 py-12">No results</div>
            )}
          </div>
        </div>

        <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Patient">
          <div className="grid grid-cols-1 gap-3">
            <input
              placeholder="Full name"
              className="border p-2 rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            />
            <input
              placeholder="Phone"
              className="border p-2 rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            />
            <textarea
              placeholder="Notes"
              className="border p-2 rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              value={newPatient.notes}
              onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button className="px-4 py-2 rounded border" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={addPatientToQueue}>Add to Queue</button>
      </div>
        </Modal>
      </>
    </ProtectedRoute>
  );
}
