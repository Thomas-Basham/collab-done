// import { useState } from 'react'
// import { supabase } from '../utils/supabaseClient'

// export default function Auth() {
//   const [loading, setLoading] = useState(false)
//   const [email, setEmail] = useState('')

//   const handleLogin = async (email) => {
//     try {
//       setLoading(true)
//       const { error } = await supabase.auth.signInWithOtp({ email })
//       if (error) throw error
//       alert('Check your email for the login link!')
//     } catch (error) {
//       alert(error.error_description || error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

  

//   return (
//     <div className="row flex-center flex">
//       <div className="col-6 form-widget">
//         <h1 className="header">Supabase + Next.js</h1>
//         <p className="description">
//           Sign in via magic link with your email below
//         </p>
//         <div>
//           <input
//             className="inputField"
//             type="email"
//             placeholder="Your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <button
//             onClick={(e) => {
//               e.preventDefault()
//               handleLogin(email)
//             }}
//             className="button block"
//             disabled={loading}
//           >
//             <span>{loading ? 'Loading' : 'Send magic link'}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  console.log(email, password)

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + Next.js</h1>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputField"
            type="password"
            value={password}
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
            <span>{loading ? 'Loading' : 'Send magic link'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}