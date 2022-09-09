import Layout from "../components/layout";

// export default function Home() {
//   return (
//     <>
//       <Layout>
//         <div className="container">
//           <p className="blurb">
//             Hello, world!
//           </p>
//         </div>
//       </Layout>

//       <style jsx>{`
//         .blurb {
//           font-size: 2em;
//           text-align: center;
//           color: #502776;
//           padding: 1em;
//         }
//         .container {
//           min-height: 90vh;
//           padding: 0 0.5rem;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: left;
//           padding-top: 9em;
//           font-size: 1.1em;
//         }
//         row {
//           flex: 1;
//           display: flex;
//           flex-direction: row;
//           justify-content: center;
//           align-items: center;
//         }
//         a {
//           color: inherit;
//           text-decoration: none;
//         }
//         .description {
//           text-align: left;
//           line-height: 1.5;
//           font-size: 1.5rem;
//         }
//         code {
//           background: #fafafa;
//           border-radius: 5px;
//           padding: 0.75rem;
//           font-size: 1.1rem;
//           font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
//             DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
//         }
//         .grid {
//           display: flex;
//           align-items: left;
//           justify-content: left;
//           flex-wrap: wrap;
//           flex-direction: column;
//           max-width: 800px;
//           margin-left: 2rem;
//         }
//         .logo {
//           height: 10em;
//         }
//         @media (max-width: 600px) {
//           .grid {
//             width: 100%;
//             flex-direction: column;
//           }
//           row {
//             flex-direction: column;
//           }
//         }
//       `}</style>

//       <style jsx global>{`
//         html,
//         body {
//           padding: 0;
//           margin: 0;
//           font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
//             Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
//             sans-serif;
//           color: #3a2e69;
//         }
//         * {
//           box-sizing: border-box;
//         }
//       `}</style>
//     </>
//   );
// }




import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'
import Account from '../components/Account'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session)
        }

        setIsLoading(false)
      }
    }

    getInitialSession()

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      mounted = false

      subscription?.unsubscribe()
    }
  }, [])

  return (
    <Layout>
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        {!session ? (
          <Auth />
        ) : (
          <Account key={session.user.id} session={session} />
        )}
      </div>
    </Layout>
  )
}