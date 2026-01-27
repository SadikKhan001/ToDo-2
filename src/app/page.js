"use client";

import { useEffect, useState, useMemo } from "react";

export default function Home() {
  const statusArray = ["Pending", "Current", "Completed"];

  const [currentStatus, setCurrentStatus] = useState("Pending");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [tasks, setTasks] = useState([]);

  const [showError, setShowError] = useState(false);

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const [showForm, setShowForm] = useState(false);

  const handleClose = () => {
    setShowForm(false);
  };

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  const filteredTasks = useMemo(() => {
    if (selectedStatus === "All Status") {
      return tasks;
    }
    return tasks.filter((item) => item.status === selectedStatus);
  }, [tasks, selectedStatus]);

  const handleAddTasks = async () => {
    try {
      if (!task.title || !task.description) {
        setShowError(true);
        return;
      }

      if (editIndex !== null) {
        await fetch(`/api/tasks/${tasks[editIndex]._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
      } else {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
      }

      const updated = await fetch("/api/tasks");
      setTasks(await updated.json());

      setTask({
        title: "",
        description: "",
        status: "Pending",
      });

      setEditIndex(null);
      setCurrentStatus("Pending");
      setShowError(false);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="sticky top-0 z-50 backdrop-blur-md bg-gray-800/80 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide text-white">
          📋 Your Daily To-Do List
        </h1>

        <button
          onClick={() => {
            setTask({ title: "", description: "", status: "Pending" });
            setCurrentStatus("Pending");
            setEditIndex(null);
            setShowError(false);
            setShowForm(true);
          }}
          className="bg-purple-500 hover:bg-purple-600 transition px-5 py-2 rounded-full text-sm font-semibold text-black shadow"
        >
          ➕ Add New Task
        </button>
      </div>

      <div className="w-auto max-w-sm mx-5 mt-4">
        <label className="block mb-1 text-sm font-semibold text-white">
          Select Status
        </label>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Current">Current</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            ▼
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 ml-4 mr-4">
        {filteredTasks.map((item, idx) => (
          <div
            key={item._id}
            className="relative rounded-2xl border border-gray-700 bg-gray-900/70 backdrop-blur
                 p-5 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <span
              className={`absolute top-4 right-4 px-3 py-1 text-xs rounded-full font-semibold
        ${
          item.status === "Completed"
            ? "bg-green-500/20 text-green-400"
            : item.status === "Current"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400"
        }`}
            >
              {item.status}
            </span>

            <div className="bg-slate-900  p-5 rounded-xl w-full max-w-full">
              <h3 className="text-white line-clamp-2 break-all">
                {item.title}
              </h3>

              <p className="text-white line-clamp-3 break-all">
                {item.description}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setTask(item);
                    setCurrentStatus(item.status);
                    setEditIndex(idx);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-blue-500/80 hover:bg-blue-600 text-sm py-2 rounded-lg transition"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={async () => {
                    const taskId = tasks[idx]._id;

                    await fetch(`/api/tasks/${taskId}`, {
                      method: "DELETE",
                    });

                    setTasks((prev) =>
                      prev.filter((task) => task._id !== taskId)
                    );
                  }}
                  className="flex-1 bg-red-500/80 hover:bg-red-600 text-sm py-2 rounded-lg transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-md bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition px-3 py-1 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center mb-6 text-white">
              {editIndex === null ? "➕ Add New Task" : "✏️ Update Task"}
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={task.title}
                placeholder="Title"
                onChange={(e) => {
                  setShowError(false);
                  setTask((prev) => ({ ...prev, title: e.target.value }));
                }}
                className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="text"
                value={task.description}
                placeholder="Description"
                onChange={(e) => {
                  setShowError(false);
                  setTask((prev) => ({ ...prev, description: e.target.value }));
                }}
                className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {showError && (
                <p className="text-red-400 text-sm text-center bg-red-500/20 px-2 py-1 rounded-md">
                  Title and description are required
                </p>
              )}
            </div>

            {/* Status Buttons */}
            <div className="flex justify-center gap-3 mt-4">
              {statusArray.map((status, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStatus(status);
                    setTask((prev) => ({ ...prev, status: status }));
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                status === currentStatus
                  ? "bg-green-500/30 text-white border border-green-400"
                  : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
              }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddTasks}
              className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-black font-semibold py-2 rounded-full transition"
            >
              {editIndex === null ? "➕ Add Task" : "✏️ Update Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
