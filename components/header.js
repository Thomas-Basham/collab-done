import { Container, Nav, Navbar } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { TiMessages } from "react-icons/ti";
import { FaSignOutAlt } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { FcUpload } from "react-icons/fc";
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
            <Nav
              activeKey={location.pathname}
              className=" justify-content-between"
              style={{ display: session && "none" }}
            >
              <Nav.Link href="/login" className="d-flex align-items-center ">
                <AiOutlineLogin /> &nbsp; Login
              </Nav.Link>
              <Nav.Link href="/signup" className="d-flex align-items-center ">
                {" "}
                &nbsp; Signup
              </Nav.Link>
            </Nav>

            <Nav
              className=" justify-content-between "
              style={{ width: "30vw", display: !session?.user && "none" }}
              activeKey={location.pathname}
            >
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/profile" className="d-flex align-items-center ">
                <CgProfile /> &nbsp; Profile
              </Nav.Link>
              <Nav.Link
                href="/upload-song"
                className="d-flex align-items-center "
              >
                <FcUpload /> &nbsp; Upload
              </Nav.Link>
              <Nav.Link href="/messages" className="d-flex align-items-center ">
                <TiMessages /> &nbsp; Messages
              </Nav.Link>
              <Nav.Link
                className="d-flex align-items-center "
                onClick={signOut()}
              >
                <FaSignOutAlt /> &nbsp; Sign Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
