import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  // get the session from the context
  const session = useContext(AuthContext);
  return session;
};

export default useAuth;
