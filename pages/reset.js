import { supabase } from "../utils/supabaseClient";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function reset() {
  const [email, setEmail] = useState(null);
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log('RECOVERY EVENT TRIGGERED')
        const newPassword = prompt("What would you like your new password to be?");
        const { data, error } = await supabase.auth.update({
          password: newPassword,
        })
  
        if (data) alert("Password updated successfully!")
        if (error) alert("There was an error updating your password.")
      }
    })
  })
  const handleSubmit = async (e) => {
    console.log(email);

    e.preventDefault();
    try{
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email
      )
      if (error){
        throw error;
      } if (data) {
        console.log(data)
      }

    }catch (error) {
      alert(error.message);
    } finally {
    }
  };



  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="email"
          placeholder = "Please enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default reset;