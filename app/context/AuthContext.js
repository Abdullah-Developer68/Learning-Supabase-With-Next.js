import { createContext, useEffect, useState } from "react";
import supabase from "../supabase-client";

// initialize context
const AuthContext = createContext(null);

// create provider component
const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get session from supabase on component mount
    const fetchSession = async () => {
      const currentSession = await supabase.auth.getSession();
      setSession(currentSession.data.session);
      setLoading(false);
      console.log(currentSession);
    };
    fetchSession();

    // change the session based on its current value
    // When user logs in this will automatically update the session state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );
  }, []);

 

  return (
    <>
      <AuthContext value={{ session, loading }}>{children}</AuthContext>
    </>
  );
};

export { AuthContext, AuthProvider };
