import Link from "next/link";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import Avatar from "./Avatar";
import { useAuth } from "../contexts/auth";
import useResource from "../hooks/useResource";

export default function CommentSection(props) {
  const { session, username, absoluteAvatar_urlAuth } = useAuth();
  const { createComment, comments, getComments } = useResource();

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
    let values = {
      commentPosition: commentPosition,
      user: session.user.id,
      comment: comment,
      songID: props.songID,
      avatarURl: absoluteAvatar_urlAuth,
    };
    createComment(values);
    getComments();
  };

  const displayComment = (comment, position) => {
    setViewCommentPosition(position);
    setViewComment(comment);
  };
  let fillteredComments = comments.filter(
    (comment) => comment.songID === props.songID
  );
  return (
    session?.user && (
      <>
        <div className="row ">
          <div id="spacer" className="col-2"></div>
          <div className="col ">
            {fillteredComments.map((data, i) => {
              return (
                <div
                  key={i}
                  className=""
                  onMouseEnter={() =>
                    displayComment(data.comment, data.commentPosition)
                  }
                  style={{
                    display: "inline",
                    cursor: "default",
                    position: "relative",
                    left:
                      data.commentPosition < 90
                        ? `${data.commentPosition}%`
                        : `${data.commentPosition - 24}%`,
                  }}
                >
                  <img
                    src={data.avatarURl}
                    alt="Avatar"
                    className="avatar image d-inline"
                    style={{ height: "15px", width: "15px" }}
                  />
                </div>
              );
            })}
            <p
              className=""
              style={{
                position: "relative",
                left:
                  viewCommentPosition < 90
                    ? `${viewCommentPosition}% `
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
    )
  );
}
