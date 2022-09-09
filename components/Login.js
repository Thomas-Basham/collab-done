import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useAuth } from '../contexts/auth'
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  
  
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, signOut, session   } = useAuth();
  
  console.log(email, password)
  
  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await signIn({ email, password })
      
      if (error) throw error
      router.push('/')
        
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex-center flex ">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + Next.js</h1>
        <p className="description">
          Sign in 
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
              handleLogin(email, password)
            }}
            className="button block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'sign in'}</span>
          </button>
        </div>
      </div>
      <style jsx>{`
        .note {
          background-color: #f2f0ff;
          color: #3a2d68;
          max-width: 400px;
          border-radius: 5px;
          margin-top: 1em;
          padding: 1em;
          margin: 2em;
        }
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          min-height: 90vh;
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .title a {
          color: #0070f3;
          text-decoration: none;
        }
        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
        .title,
        .description {
          text-align: center;
        }
        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
        .logo {
          height: 1em;
        }
      `}</style>



    </div>
    
  )
}