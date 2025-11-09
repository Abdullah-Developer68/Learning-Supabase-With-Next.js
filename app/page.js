"use client";
import TaskManager from "./TaskManager/page";
import Auth from "./Auth/page";
import useAuth from "./hooks/UseAuth";
export default function Home() {
  const { session, loading } = useAuth();
  if (loading) {
    return <div>Loading ....</div>;
  }
  return <>{session ? <TaskManager /> : <Auth />}</>;
}
