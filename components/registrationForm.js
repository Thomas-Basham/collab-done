import styles from "./form.module.css";
import { useRouter } from "next/router";
import { useState } from 'react'

import { supabase } from "../utils/supabaseClient";

// export default async function registerUser(req, res) {
//   const { email, password } = req.body;
//   let { user, error } = await supabase.auth.signIn({
//     email: email,
//     password: password,
//   });
//   console.log({ error });
//   console.log({ user });
//   if (error) return res.status(401).json({ error: error.message });
//   return res.status(200).json({ user: user });
// }

export default function Form() {
  const router = useRouter();

  // const registerUser = async (event) => {
  //   event.preventDefault();

  //   const { user, session, error } = await supabase.auth.signUp(
  //     {
  //       email: event.target.email,
  //       password: event.target.password,
  //     },
  //     {
  //       data: {
  //         first_name: event.target.name,
  //       },
  //     },
  //     {
  //       redirectTo: process.env.PRODUCTION_URL,
  //     }
  //   );
  //   console.log(user);
  //   // if (user) router.push(`/welcome?email${user.email}`);
  //   // console.log(`Just registered ${user.email} to DB.`);
  // };


  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  console.log(email, password)

  const registerUser = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      if (error) throw error
      router.push('/login')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="col-6 form-widget">
    <h1 className="header">Supabase + Next.js</h1>
    <p className="description">
    Register
    </p>
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
          e.preventDefault()
          registerUser(email, password)
        }}
        className="button block"
        disabled={loading}
      >
        <span>{loading ? 'Loading' : 'Register'}</span>
      </button>
    </div>
  </div>
);
}
