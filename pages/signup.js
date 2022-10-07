import Form from "../components/registrationForm";
import Layout from "../components/layout";
import { useAuth } from "../contexts/auth";

export default function Signup() {
  // const { signInOauth } = useAuth();

  return (
    <>
      <p className="note">Sign Up to Start Collaborating</p>
      <Form />

      
    </>
  );
}
