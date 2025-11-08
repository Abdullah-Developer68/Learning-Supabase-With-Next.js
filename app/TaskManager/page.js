"use client";
import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import useAuth from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function TaskManager() {
  const session = useAuth();
  const email = session?.user?.email;
  console.log("User email from session:", email);
  // states
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  // This holds the tasks that exist already and can be updated or deleted
  const [tasks, setTasks] = useState([]);
  const [newDescription, setNewDescription] = useState("");

  // submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Task:", newTask);

    const { data, error } = await supabase
      .from("Task")
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error("Error inserting task:", error);
      return;
    }

    // To avoid the ESLint error and cascading renders, update tasks state by adding the new task directly instead of refetching all data.
    // This prevents unnecessary re-renders and improves performance.
    if (data) {
      setTasks((prevTasks) => [...prevTasks, data]);
    }

    setNewTask({ title: "", description: "" });
  };

  // Update email in newTask whenever session changes.
  // This is done because when the user sign in, he is redirected
  // to the TaskManager, but it takes time for session to be fetched
  // from supabase, so during that time it is undefined and when
  // the session arrives we use this useEffect to set the email in newTask.
  useEffect(() => {
    const updateEmail = async () => {
      setNewTask((prev) => ({ ...prev, email: session?.user?.email }));
    };
    updateEmail();
  }, [session]);

  // fetch all the available tasks
  useEffect(() => {
    // Define the async function inside useEffect to avoid ESLint warning about calling setState (setTasks) synchronously in the effect body.
    // This prevents cascading renders by ensuring setState is called within an async callback, not directly in the effect.
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("Task")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching tasks:", error);
        return;
      } else {
        // Filter out tasks with null or empty titles to avoid rendering errors
        const validTasks = data.filter((task) => task && task.title);
        setTasks(validTasks);
        console.log("Fetched tasks:", data);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    console.log("Attempting to delete task with id:", id);

    // This actually DELETES the row from the database, not just nullifies it
    const { data, error } = await supabase
      .from("Task")
      .delete()
      .eq("id", id)
      .select(); // Add .select() to see what was deleted

    console.log("Delete response:", { data, error });

    if (error) {
      console.error("Error deleting task:", error);
      return;
    }

    // Update the tasks state to remove the deleted task from UI
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };
  const updateTaskDescription = async (id) => {
    const { data, error } = await supabase
      .from("Task")
      .update({ description: newDescription })
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error updating task description:", error);
      return;
    }

    // Update the tasks state to reflect the updated description
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, description: newDescription } : task,
      ),
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
          <header className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
              Supabase Tasks
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Plan, create, and track your tasks in one place
            </h1>
            <p className="text-base text-zinc-400 sm:text-lg">
              Add new todos, update descriptions, and keep your workspace tidy
              with instant Supabase sync.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,360px),1fr]">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg sm:p-8">
              <h2 className="text-2xl font-semibold text-white">
                Add new task
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Provide a clear title and a short description to keep everything
                organized.
              </p>

              <form
                className="mt-8 flex flex-col gap-6"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="task-title"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Title
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    placeholder="Plan weekly sprint"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600/30"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="task-description"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="task-description"
                    placeholder="Outline priorities and blockers for the week."
                    className="h-28 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600/30"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200/40"
                >
                  Add task
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-lg sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  Current tasks
                </h2>
                <span className="inline-flex w-fit rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-400">
                  {tasks.length} total
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">
                Update descriptions inline or remove tasks you no longer need.
              </p>

              <div className="mt-6 space-y-5">
                {tasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-10 text-center text-sm text-zinc-400">
                    No tasks yet. Add your first task to get started.
                  </div>
                ) : (
                  <ul className="grid gap-5 md:grid-cols-2">
                    {tasks
                      .filter((task) => task && task.title)
                      .map((task) => (
                        <li
                          key={task.id}
                          className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 shadow-lg transition hover:border-zinc-500"
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                              <div>
                                <h3 className="text-xl font-semibold text-white">
                                  {task.title}
                                </h3>
                                <p className="mt-1 text-sm text-zinc-400">
                                  {task.description}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="self-start rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                              >
                                Delete
                              </button>
                            </div>

                            <div className="flex flex-col gap-2">
                              <label
                                htmlFor={`task-update-${task.id}`}
                                className="text-xs font-medium uppercase tracking-widest text-zinc-500"
                              >
                                Update description
                              </label>
                              <textarea
                                id={`task-update-${task.id}`}
                                value={newDescription}
                                placeholder="Write an updated summary for this task."
                                className="h-24 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600/30"
                                onChange={(e) =>
                                  setNewDescription(e.target.value)
                                }
                              />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => updateTaskDescription(task.id)}
                                className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200/40"
                              >
                                Save changes
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
