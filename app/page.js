"use client";
import TaskManager from "./TaskManager/page";
import Auth from "./Auth/page";
import useAuth from "./hooks/UseAuth";
export default function Home() {
  const session = useAuth();
  return <>{session ? <TaskManager /> : <Auth />}</>;
}
