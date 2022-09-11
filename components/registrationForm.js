import styles from "../styles/form.module.css";
import { useRouter } from "next/router";
import { useState } from "react";

import { supabase } from "../utils/supabaseClient";

export default function Form() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const registerUser = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="col-6 form-widget">
      <h1 className="header">COLLAB DONE</h1>
      <p className="description">Register</p>
      <div>
        <input
          className="inputField"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="inputField"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            registerUser(email, password);
          }}
          className="button block"
          disabled={loading}
        >
          <span>{loading ? "Loading" : "Register"}</span>
        </button>
      </div>
    </div>
  );
}
