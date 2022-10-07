import Auth from "../components/Login";
import { Container } from "react-bootstrap";
import Link from "next/link";
export default function Login() {
  return (
    <>
      <Container fluid>
        <Auth />
      </Container>
      <Link href={"/signup"}>
        <p className="note" style={{ cursor: "pointer" }}>
          If you don't have an account, register here
        </p>
      </Link>
      <Link href={"/forgot-password"}>
        <p className="note" style={{ cursor: "pointer" }}>
          Forgot your password? Reset here. 
        </p>
      </Link>
      
    </>
  );
}
