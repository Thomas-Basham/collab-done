import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, signOut, session } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await signIn({ email, password });

      if (error) throw error;
      router.push("/");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex-center flex ">
      <div className="col-6 form-widget">
        <p className="description">Sign in</p>
        <div>
          <input
            className="inputField"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputField"
            id="password"
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
              handleLogin(email, password);
            }}
            className="button block"
            disabled={loading}
          >
            <span>{loading ? "Loading" : "sign in"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
