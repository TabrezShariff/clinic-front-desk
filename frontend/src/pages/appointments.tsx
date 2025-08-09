import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Modal from "@/components/Modal";
import UISelect, { SelectOption } from "@/components/UISelect";
import { FaCalendarCheck, FaEdit, FaSearch, FaPlus, FaCalendarAlt, FaTimes } from "react-icons/fa";

function formatTime(timeslot?: string) {
  if (!timeslot) return "-";
  const date = new Date(timeslot);
  if (isNaN(date.getTime())) return timeslot;
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function AppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [newTime, setNewTime] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [newOpen, setNewOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ patientName: "", doctorId: "", time: "" });
  const [doctors, setDoctors] = useState<any[]>([]);

  const doctorOptions: SelectOption[] = useMemo(
    () => doctors.map((d) => ({ value: String(d.id), label: d.name })),
    [doctors]
  );

  async function refresh() {
    if (!token) return;
    const params = new URLSearchParams();
    if (selectedDate) params.set("date", selectedDate);
    const data = await apiFetch<any[]>(`/appointments${params.toString() ? `?${params}` : ""}`, "GET", undefined, token);
    setAppointments(data);
  }

  async function loadDoctors() {
    if (!token) return;
    const data = await apiFetch<any[]>(`/doctors`, "GET", undefined, token);
    setDoctors(data);
  }

  useEffect(() => {
    refresh().catch(console.error);
    loadDoctors().catch(console.error);
  }, [token, selectedDate]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments.filter((a) => {
      const matchQuery = q
        ? `${a.patient?.name} ${a.doctor?.name} ${a.timeslot}`.toLowerCase().includes(q)
        : true;
      const matchStatus = statusFilter ? a.status?.toLowerCase() === statusFilter.toLowerCase() : true;
      return matchQuery && matchStatus;
    });
  }, [appointments, search, statusFilter]);

  async function cancelAppointment(appt: any) {
    if (!token) return;
    await apiFetch(`/appointments/${appt.id}`, "DELETE", undefined, token);
    await refresh();
  }

  async function updateAppointment() {
    if (!token || !editing) return;
    await apiFetch(`/appointments/${editing.id}`, "PATCH", { timeslot: newTime }, token);
    setEditing(null);
    setNewTime("");
    await refresh();
  }

  async function updateStatus(appt: any, status: string) {
    if (!token) return;
    await apiFetch(`/appointments/${appt.id}`, "PATCH", { status }, token);
    await refresh();
  }

  async function scheduleNew() {
    if (!token) return;
    const patient = await apiFetch(`/patients`, "POST", { name: newAppt.patientName, phone: "", notes: "" }, token);
    const payload = {
      patient,
      doctor: doctors.find((d) => String(d.id) === String(newAppt.doctorId)),
      timeslot: newAppt.time,
      status: "booked",
    };
    await apiFetch(`/appointments`, "POST", payload, token);
    setNewOpen(false);
    setNewAppt({ patientName: "", doctorId: "", time: "" });
    await refresh();
  }

  return (
    <ProtectedRoute>
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold inline-flex items-center gap-2">
              <FaCalendarCheck className="text-blue-600" /> Appointment Management
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select
              className="px-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter: All</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>

            <button
              onClick={() => setIsDateOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <FaCalendarAlt />
              {selectedDate ? selectedDate : "Date"}
            </button>

            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-9 pr-3 py-2 border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
                placeholder="Search patients"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => setNewOpen(true)}
              className="ml-auto inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              <FaPlus /> Schedule New Appointment
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Doctor</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
                {visible.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-2">{a.patient?.name}</td>
                    <td className="px-4 py-2">{a.doctor?.name}</td>
                    <td className="px-4 py-2">{formatTime(a.timeslot)}</td>
                    <td className="px-4 py-2">
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a, e.target.value)}
                        className="px-3 py-1.5 text-sm border rounded-md bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700"
                      >
                        <option value="booked">Booked</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                          onClick={() => { setEditing(a); setNewTime(a.timeslot ?? ""); }}
                          aria-label="Reschedule"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-red-600 text-white hover:bg-red-700"
                          onClick={() => cancelAppointment(a)}
                          aria-label="Cancel appointment"
                          title="Cancel appointment"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                      No appointments
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          isOpen={!!editing}
          title="Reschedule Appointment"
          onClose={() => setEditing(null)}
          actions={(
            <>
              <button className="px-4 py-2 rounded border" onClick={() => setEditing(null)}>Close</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={updateAppointment}>Save</button>
            </>
          )}
        >
          <label className="block text-sm mb-2">New time</label>
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="HH:MM AM/PM"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 rounded-md w-full"
          />
        </Modal>

        <Modal
          isOpen={newOpen}
          title="Schedule New Appointment"
          onClose={() => setNewOpen(false)}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Patient</label>
              <input
                placeholder="Enter patient name"
                className="border p-2 rounded-md w-full"
                value={newAppt.patientName}
                onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Doctor</label>
              <UISelect
                placeholder="Select a doctor"
                value={newAppt.doctorId}
                options={doctorOptions}
                onChange={(v) => setNewAppt({ ...newAppt, doctorId: v })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Time</label>
              <input
                placeholder="HH:MM AM/PM"
                className="border p-2 rounded-md w-full"
                value={newAppt.time}
                onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={scheduleNew}>Schedule Appointment</button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isDateOpen} onClose={() => setIsDateOpen(false)} title="Pick a date">
          <div className="space-y-2">
            <input
              type="date"
              className="border p-2 rounded-md w-full"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => setIsDateOpen(false)}>Apply</button>
            </div>
          </div>
        </Modal>
      </>
    </ProtectedRoute>
  );
}
