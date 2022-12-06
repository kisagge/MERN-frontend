import { useEffect, useState } from "react";
import styled from "styled-components";

interface CommentType {
  _id: string;
  content: string;
  isAbleModified: boolean;
  userId: string;
}

interface PaginationPropsType {
  currentPage: number;
  endPage: number;
  startPage: number;
  totalPage: number;
}

const CommentSection = (props: { postId: string }) => {
  const { postId } = props;

  const [comments, setComments] = useState<CommentType[]>([]);
  const [pagination, setPagination] = useState<PaginationPropsType>({
    startPage: 1,
    endPage: 1,
    currentPage: 1,
    totalPage: 1,
  });

  const [commentContent, setCommentContent] = useState("");

  const fetchComments = async (page: number) => {
    const queryString = page > 1 ? `?page=${page}` : "";
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/comments/${postId}${queryString}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") ?? ""}`,
        },
      },
    );

    const json = await response.json();

    if (response.ok) {
      setComments(json.data.comments);
      setPagination({
        startPage: json.data.startPage,
        endPage: json.data.endPage,
        currentPage: json.data.currentPage,
        totalPage: json.data.totalPage,
      });
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, []);

  return (
    <StyledCommentsSection>
      <h4>Comments</h4>
      <StyledCommentUl>
        {comments.map((comment) => {
          return (
            <li key={`comment-${comment._id}`}>
              {comment.content} - {comment.userId}
            </li>
          );
        })}
      </StyledCommentUl>
      <StyledCommentFormSection>
        <h5>Content</h5>
      </StyledCommentFormSection>
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
