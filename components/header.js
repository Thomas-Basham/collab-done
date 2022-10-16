import Link from "next/link";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
export default function Header({ session, signOut }) {
  return (
    <header className="">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <h1>COLLAB DONE</h1>
          </Navbar.Brand>
          <h5>Finish Your Musical Ideas</h5>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <br></br>
          <Navbar.Collapse id="responsive-navbar-nav ">
            <Nav className=" justify-content-between" style={{ display: session && "none" }}>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Signup</Nav.Link>
            </Nav>

            {
              <Nav className=" justify-content-between " style={{ width: '30vw', display: !session?.user && "none" }}>
                <Nav.Link onClick={signOut()}>Sign Out</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/upload-song">Upload</Nav.Link>
                <Nav.Link href="/messages">Messages</Nav.Link>
              </Nav>
            }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
