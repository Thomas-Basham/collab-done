import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

function PasswordReset() {
  const [password, setPassword] = useState(null);

  const [hash, setHash] = useState(null);

  useEffect(() => {
    setHash(window.location.hash);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //   now we will change the password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="password"
          required
          value={password}
          placeholder="Please enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PasswordReset;
