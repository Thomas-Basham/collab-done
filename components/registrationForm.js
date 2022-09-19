import styles from "../styles/form.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { supabase } from "../utils/supabaseClient";

export default function Form() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (email != emailConfirmation) {
      setEmailError('Emails must match')
    } else setEmailError(null);
    if (password != passwordConfirmation) {
      setPasswordError('Passwords must match')
    } else setPasswordError(null);


  });

  console.log(email, emailConfirmation)
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
          type="email"
          placeholder="Confirm Email"
          value={emailConfirmation}
          onChange={(e) => setEmailConfirmation(e.target.value)}
        />
        <small>{emailError}</small>
        <input
          className="inputField"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="inputField"
          type="password"
          value={passwordConfirmation}
          placeholder="Confirm Password"
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
                <small>{passwordError}</small>

      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            registerUser(email, password);
          }}
          className="button block"
          disabled={loading || emailError || passwordError}
        >
          <span>{loading ? "Loading" : "Register"}</span>
        </button>
      </div>
    </div>
  );
}
