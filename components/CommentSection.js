import Link from "next/link";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function CommentSection(props) {
  const [comment, setComment] = useState(null);

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(comment);
    setComment("");

    const songDuration = props.songDetails.getDuration();
    const currentTime = props.songDetails.getCurrentTime();

    const commentPosition = currentTime / songDuration;
    console.log(commentPosition);
    // console.log(props.songDetails.getDuration())
    // console.log(props.songDetails.getCurrentTime())
  };

  const testJsonData = {
    comments: [
      { user: "John", comment: "Niiiiccee!", time: "2002" },
      { user: "Anna", comment: "🔥🔥🔥" },
      { user: "Peter", comment: "Sweet, love this part" },
    ],
  };

  return (
    <>
      <div className="row">
        <div id="spacer" className="col-2"></div>
        <div className="col">
          <form onSubmit={onFormSubmit}>
            <input
              type="text"
              autocomplete="off"
              placeholder="Write a comment"
              aria-invalid="false"
              aria-describedby=""
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></input>
            <button hidden type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
