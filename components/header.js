import Link from "next/link";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
export default function Header({ session, signOut }) {
  return (
    <header className="">
      {/* <nav >
      <Row>
        <Col>
        <Link href="/">
          <a>
            <h1>COLLAB DONE </h1>
          </a>
        </Link>{" "}
        </Col>
        <Col>
        <div className="actions">
          {session ? (
            <>
              <Link href="/">
                <a>
                  <h3 onClick={signOut()}>Sign Out &rarr;</h3>
                </a>
              </Link>

              <Link href="/profile">
                <a>
                  <h3>Profile &rarr;</h3>
                </a>
              </Link>
              <Link href="/upload-song">
                <a>
                  <h3>Upload &rarr;</h3>
                </a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup">
                <a>
                  <h3>Sign Up &rarr;</h3>
                </a>
              </Link>

              <Link href="/login">
                <a>
                  <h3>Login &rarr;</h3>
                </a>
              </Link>
            </>
          )}
        </div>
        </Col>
      </Row>
      </nav> */}




      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/"><h1>COLLAB DONE</h1></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
  <Nav className="me-auto" style={{display: session && "none"}}>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/signup">Signup</Nav.Link>
            
          </Nav> 
{      <Nav style={{display:  !session?.user &&   "none"}}>
            <Nav.Link  onClick={signOut()}>Sign Out</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link  href="/upload-song">
              Upload
            </Nav.Link>
          </Nav>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  );
}
