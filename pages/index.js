import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/auth";
import SongFeed from "../components/SongFeed";
import { Row, Col, Container } from "react-bootstrap";
export default function Home(props) {
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
