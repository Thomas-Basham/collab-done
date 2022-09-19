import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
export default function Header({ session, signOut }) {
  return (
    <header className="">
      {" "}
      <nav >
      <Row>
        <Col>
        <Link href="/">
          <a>
            <h3>COLLAB DONE </h3>
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
      </nav>
    </header>
  );
}
