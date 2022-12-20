import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
export default function ErrorModal(props) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (props.errorMessage || props.errorMessageAuth) {
      setShowModal(true);
    }
    if (props.errorMessageAuth) {
      setShowModal(true);
    }
  });

  const handleClose = () => {
    props.setErrorMessageAuth(null);
    props.setErrorMessage(null);
    setShowModal(false);
  };
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => handleClose()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>There seems to have been an error</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>{props.errorMessageAuth || props.errorMessage}</div>
        </Modal.Body>
      </Modal>
    </>
  );
}
