import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  // get the session from the context
  const { session, loading } = useContext(AuthContext);
  return { session, loading };
};

export default useAuth;
