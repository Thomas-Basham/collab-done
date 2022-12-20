
import SongFeed from "../components/SongFeed";
import { Row, Col, Container } from "react-bootstrap";
export default function Home() {
  return (
    <>
      <Container fluid="md">
        <Row>
          <Col>
            <SongFeed profilePage={false} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
