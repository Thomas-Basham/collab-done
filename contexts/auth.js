// import { createContext, useContext, useState, useEffect } from "react";


// const AuthContext = createContext();

// export function useAuth() {
//   const auth = useContext(AuthContext);
//   if (!auth) throw new Error("You forgot AuthProvider!");
//   return auth;
// }

// export function AuthProvider(props) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [session, setSession] = useState(null);
//   const [state, setState] = useState({
//     isLoading,
//     session,
//     handleLogin,
//     // logout,
// });
//   useEffect(() => {
//     let mounted = true;

//     async function getInitialSession() {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       // only update the react state if the component is still mounted
//       if (mounted) {
//         if (session) {
//           setSession(session);
//         }

//         setIsLoading(false);
//       }
//     }

//     getInitialSession();

//     const { subscription } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setSession(session);
//       }
//     );

//     return () => {
//       mounted = false;

//       subscription?.unsubscribe();
//     };
//   }, []);

//   async function handleLogin (email, password) {
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email,
//         password: password,
//       });
//       if (error) throw error;
//     } catch (error) {
//       alert(error.error_description || error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

// //   function logout() {
// //     const newState = {
// //       tokens: null,
// //       user: null,
// //     };
// //     setState((prevState) => ({ ...prevState, ...newState }));
// //   }

//   return (
//     <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
//   );
// }



import React, { useContext, useState, useEffect } from 'react'
import { supabase } from "../utils/supabaseClient";

const AuthContext = React.createContext()

export function AuthProvider({ children }) {
    const [session, setSession] = useState()
    const [isLoading, setIsLoading] = useState(true)
  
    // useEffect(() => {
    //   // Check active sessions and sets the user
    //   const {
    //     data: { session },
    //   } =  supabase.auth.getSession();

  
    //   setUser(session?.user ?? null)
    //   setLoading(false)
  
    //   // Listen for changes on auth state (logged in, signed out, etc.)
    //   const {subscription } = supabase.auth.onAuthStateChange(
    //     async (_event, session) => {
    //       setUser(session?.user ?? null)
    //       setLoading(false)
    //     }
    //   )
  
    //   return () => {
    //     subscription?.unsubscribe()
    //   }
    // }, [])
  
    // Will be passed down to Signup, Login and Dashboard components
   
    useEffect(() => {
        let mounted = true;
    
        async function getInitialSession() {
          const {
            data: { session },
          } = await supabase.auth.getSession();
    
          // only update the react state if the component is still mounted
          if (mounted) {
            if (session) {
              setSession(session);
            }
    
            setIsLoading(false);
          }
        }
    
        getInitialSession();
    
        const { subscription } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session);
          }
        );
    
        return () => {
          mounted = false;
    
          subscription?.unsubscribe();
        };
      }, []);

    const value = {
      signUp: (data) => supabase.auth.signUp(data),
      signIn: (data) => supabase.auth.signIn(data),
      signOut: () => supabase.auth.signOut(),
      session,
    }
  
    return (
      <AuthContext.Provider value={value}>
        {!isLoading && children}
      </AuthContext.Provider>
    )
  }

  export function useAuth() {
    return useContext(AuthContext)
  }