import Link from "next/link";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function CommentSection(props) {
  const [comment, setComment] = useState(null);
  const [viewComment, setViewComment] = useState(null);
  const [viewCommentPosition, setViewCommentPosition] = useState(null);

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(comment);
    setComment("");

    const songDuration = props.songDetails.getDuration();
    const currentTime = props.songDetails.getCurrentTime();

    const commentPosition = (currentTime / songDuration) * 100;
    console.log(commentPosition);
    // console.log(props.songDetails.getDuration())
    // console.log(props.songDetails.getCurrentTime())
  };

  const testJsonData = {
    comments: [
      {
        user: "John",
        comment: "Niiiiccee!",
        commentPosition: 8.76126660341556,
      },
      {
        user: "John",
        comment: "Niiiiccee!",
        commentPosition: 10,
      },
      {
        user: "John",
        comment: "Niiiiccee!",
        commentPosition: 15,
      },
      {
        user: "Anna",
        comment: "🔥🔥🔥",
        commentPosition: 65,
      },
      {
        user: "Anna",
        comment: "🔥🔥🔥",
        commentPosition: 65,
      },
      {
        user: "Anna",
        comment: "🔥🔥🔥",
        commentPosition: 66,
      },
      {
        user: "Anna",
        comment: "🔥🔥🔥",
        commentPosition: 69,
      },
      {
        user: "Anna",
        comment: "🔥🔥🔥",
        commentPosition: 67,
      },
      {
        user: "Peter",
        comment: "Sweet, love this part",
        commentPosition: 100,
      },
      {
        user: "Peter",
        comment: "Sweet, love this part",
        commentPosition: 100,
      },
      {
        user: "Peter",
        comment: "Sweet, love this part",
        commentPosition: 100,
      },
    ],
  };

  const displayComment = (comment, position) => {
    setViewCommentPosition(position);
    setViewComment(comment);
  };
  return (
    <>
      <div className="row">
        <div id="spacer" className="col-2"></div>
        <div className="col " style={{ justifyContent: "none" }}>
          {testJsonData.comments.map((data, i) => {
            return (
              <div
                key={i}
                className=""
                onMouseEnter={() =>
                  displayComment(data.comment, data.commentPosition)
                }
                style={{
                  display: "inline",
                  position: "relative",
                  left:
                    data.commentPosition < 80
                      ? `${data.commentPosition}%`
                      : `${data.commentPosition - 13}%`,
                }}
              >
                **
                {/* <p className="d-inline">{data.user}</p>

<p className="d-inline">{data.comment}</p> */}
              </div>
            );
          })}
          <p
            className=""
            style={{
              position: "relative",
              left:
                viewCommentPosition < 80
                  ? `${viewCommentPosition}%`
                  : `${viewCommentPosition - 13}%`,
            }}
          >
            {viewComment}
          </p>
        </div>
      </div>
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
