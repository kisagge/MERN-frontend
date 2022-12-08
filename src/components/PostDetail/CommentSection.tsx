import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";

interface CommentType {
  _id: string;
  content: string;
  isAbleModified: boolean;
  userId: string;
}

const CommentSection = (props: { postId: string }) => {
  const { postId } = props;

  const [comments, setComments] = useState<CommentType[]>([]);

  const [commentContent, setCommentContent] = useState("");

  // input handler
  const commentChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(e.target.value);
  };

  // fetch Comments
  const fetchComments = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken") ?? ""}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      setComments(json.data.comments);
    }
  };

  // create Comment
  const createComment = async (content: string) => {
    const comment = {
      content,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/comments/create/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") ?? ""}`,
        },
        body: JSON.stringify(comment),
      },
    );

    const json = await response.json();

    if (response.ok) {
      if (!json.result) {
        alert("Failed to add comment");
        return;
      }
      setComments([...comments, json.data.comment]);
    }

    if (!response.ok) {
      alert(json.error);
    }
  };

  // delete Comment
  const deleteComment = async (commentId: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") ?? ""}`,
        },
      },
    );

    const json = await response.json();

    if (response.ok) {
      if (!json.result) {
        alert("Failed to delete the comment");
        return;
      }
      const newComments = comments.filter((comment) => comment._id !== commentId);
      setComments(newComments);
      return;
    }
  };

  const onClickAddCommit = async () => {
    console.log(111);
    await createComment(commentContent);
    setCommentContent("");
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <StyledCommentsSection>
      <h4>Comments</h4>
      <StyledCommentUl>
        {comments.map((comment) => {
          return (
            <li key={`comment-${comment._id}`}>
              {comment.content} - {comment.userId}
              {comment.isAbleModified && (
                <StyledCommentDeleteButton
                  onClick={async (e) => {
                    e.preventDefault();
                    await deleteComment(comment._id);
                  }}
                >
                  X
                </StyledCommentDeleteButton>
              )}
            </li>
          );
        })}
      </StyledCommentUl>
      <StyledCommentFormSection>
        <h5>Comment Content</h5>
        <textarea value={commentContent} onChange={commentChangeHandler} />
      </StyledCommentFormSection>
      <StyledCommentButton onClick={async () => onClickAddCommit()}>
        Add a comment
      </StyledCommentButton>
    </StyledCommentsSection>
  );
};

export default CommentSection;

const StyledCommentsSection = styled.div`
  margin-top: 50px;
`;

const StyledCommentUl = styled.div`
  list-style: none;
`;

const StyledCommentFormSection = styled.form``;

const StyledCommentButton = styled.button``;

const StyledCommentDeleteButton = styled.button``;
