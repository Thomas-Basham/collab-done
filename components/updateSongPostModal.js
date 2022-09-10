import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Avatar from "../components/Avatar";
import { useAuth } from "../contexts/auth";
import { useRouter } from "next/router";
import useResource from "../hooks/useResource";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function updateSongPostModal({show, setShow}) {
console.log('showwwwww', show)
  return (
    <Modal
      show={true}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <div className="row flex-center flex">
        <div className="col-6 form-widget">
          <div>
            <label htmlFor="artist">Artist</label>
            <input id="artist" type="text" value={username} disabled />
          </div>
          <div>
            <label htmlFor="genre">Genre</label>
            <input
              id="genre"
              type="text"
              value={genre || ""}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="website">Description</label>
            <input
              id="description"
              type="text"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="needs">Needs</label>
            <input
              id="needs"
              type="text"
              value={needs || ""}
              onChange={(e) => setNeeds(e.target.value)}
            />
          </div>

          <div>
            <button
              className="button primary block"
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? "Loading ..." : "Upload"}
            </button>
          </div>
        </div>
      </div>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
