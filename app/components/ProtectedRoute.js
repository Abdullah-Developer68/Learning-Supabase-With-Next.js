"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "../hooks/UseAuth";

const ProtectedRoute = ({children}) => {
  const session = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (session === null || session === undefined) {
      router.push("/Auth");
    }
  }, [session, router]);
  
  // Show loading state while checking auth
  if (!session) {
    return <div>Loading...</div>; // or a spinner
  }
  
  return children;
};

export default ProtectedRoute;
