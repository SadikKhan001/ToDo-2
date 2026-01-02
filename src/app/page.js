"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const statusArray = ["Pending", "Current", "Completed"];

  const [currentStatus, setCurrentStatus] = useState("Pending");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("None");
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
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTasks = () => {
    if (task.title.length <= 0 || task.description.length <= 0) {
      setShowError(true);
      return;
    }

    if (editIndex !== null) {
      const updatedTasks = tasks.map((t, index) =>
        index === editIndex ? task : t
      );
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, task]);
    }
    setTask({
      title: "",
      description: "",
      status: "Pending",
    });

    setCurrentStatus("Pending");
    setShowError(false);
    setShowForm(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen w-screen">
      <div className="bg-gray-700 px-6 min-w-full flex justify-between items-center py-2">
        <p>Your Daily To-Do List</p>

        <button
          onClick={() => {
            setTask({
              title: "",
              description: "",
              status: "Pending",
            });
            setCurrentStatus("Pending");
            setEditIndex(null); // important
            setShowError(false);
            setShowForm(true);
          }}
          className="text-black text-md bg-purple-400 px-4 py-1 rounded-full"
        >
          ➕ Add new task
        </button>
      </div>
      <div
        className="mt-3 ml-5 text-black"
        value={selectedStatus}
        onChange={(e) => {
          const filteredStatus = tasks.filter(
            (item) => item.status === selectedStatus
          );
          setSelectedStatus(e.target.value);
          console.log("tasks=", filteredStatus);
        }}
      >
        <select className="bg-white">
          <option>Pending</option>
          <option>Current</option>
          <option>Completed</option>
          <option>None</option>
        </select>
      </div>
      {/* {tasks.length > 0 && ( */}
      {true && (
        <div className="grid grid-cols-4 flex gap-3 w-full px-4 py-3">
          {tasks.map((item, idx) => {
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800 to-gray-900 
               border border-gray-700 rounded-2xl 
               px-5 py-4 shadow-lg hover:shadow-xl 
               transition-all duration-200 relative"
              >
                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  Title: {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-2 leading-relaxed">
                  Description: {item.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between w-full mb-2">
                  {/* Status Chip */}
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full w-full text-center
                      ${
                        item.status === "Completed"
                          ? "bg-green-500/20 text-green-400 border border-green-500/40"
                          : item.status === "Current"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                          : "bg-red-500/20 text-red-400 border border-red-500/40"
                      }`}
                  >
                    {item.status}
                  </span>

                  {/* Optional index / meta */}
                  {/* <span className="text-xs text-gray-500">
                    #{idx + 1}
                  </span> */}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTask(item);
                      setCurrentStatus(item.status);
                      setEditIndex(idx);
                      setShowForm(true);
                    }}
                    className="bg-gray-500 rounded-lg px-3 py-1 w-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const filteredTasks = tasks.filter(
                        (_, index) => index !== idx
                      );
                      setTasks(filteredTasks);
                    }}
                    className="bg-red-500 rounded-lg px-3 py-1 w-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="w-full min-h-screen absolute flex justify-center items-center top-0 left-0">
          <div className="h-100 w-150 bg-gray-800 relative rounded-3xl flex flex-col justify-center items-center ">
            <button
              onClick={() => {
                handleClose();
              }}
              className="text-black bg-purple-100 px-4 py-1 rounded-full absolute top-5 right-5"
            >
              X
            </button>

            <div className="w-[60%]">
              <div className="">
                <input
                  type="text"
                  value={task.title}
                  placeholder="Title"
                  onChange={(e) => {
                    const text = e.target.value;
                    setShowError(false);
                    // console.log(`Title text is: ${text}`);
                    setTask((prev) => ({
                      ...prev,
                      title: text,
                    }));
                  }}
                  className="bg-gray-600 block text-white px-4 py-2 outline-none rounded-full w-full"
                />
                <input
                  type="text"
                  value={task.description}
                  placeholder="Description"
                  onChange={(e) => {
                    const text = e.target.value;
                    setShowError(false);
                    // console.log(`Desc text is: ${text}`);
                    setTask((prev) => ({
                      ...prev,
                      description: text,
                    }));
                  }}
                  className="bg-gray-600 block text-white px-4 py-2 outline-none rounded-full w-full mt-2"
                />

                {showError && (
                  <p className="mt-2 border border-red-600 rounded-md bg-red-600/20 px-2 text-sm text-center text-red-600">
                    Title and description are required
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-3 mt-4">
                {statusArray.map((item, idx) => {
                  return (
                    <button
                      onClick={() => {
                        setCurrentStatus(item);
                        setTask((prev) => ({
                          ...prev,
                          status: item,
                        }));
                      }}
                      key={idx}
                      value={task.status}
                      className={`border border-green-100 px-4 py-2 rounded-full cursor-pointer ${
                        item === currentStatus && "bg-green-200/30"
                      }`}
                    >
                      <p className="text-green-100 text-sm">{item}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  handleAddTasks();
                }}
                className="bg-purple-400 mt-4 w-full rounded-full px-6 font-semibold text-sm py-2 text-black"
              >
                {editIndex === null ? "➕Add Task" : "✏️Update Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
