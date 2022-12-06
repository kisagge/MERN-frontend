import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { tokenState } from "../../atom";

type DetailPostType = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isAbleModified: boolean;
  userId: string;
};

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

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<DetailPostType | null>(null);

  const [accessToken, setAccessToken] = useRecoilState(tokenState);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [pagination, setPagination] = useState<PaginationPropsType>({
    startPage: 1,
    endPage: 1,
    currentPage: 1,
    totalPage: 1,
  });

  // onClick handler
  const onClickDeleteButton = async () => {
    const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setError(null);
      navigate("/post");
    }
  };

  const fetchComments = async (page: number) => {
    const queryString = page > 1 ? `?page=${page}` : "";
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/comments/${id}${queryString}`,
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
    const fetchPost = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/posts/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") ?? ""}`,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        setPost(json.data);
        setIsLoading(false);
      }
    };

    const sessionToken = sessionStorage.getItem("accessToken") ?? "";
    if (!accessToken && sessionToken) {
      setAccessToken(sessionToken);
    }

    fetchPost();

    fetchComments(1);
  }, []);

  return (
    <StyledDetailPostDiv>
      {isLoading && <StyledPostLoadingDiv>Loading...</StyledPostLoadingDiv>}
      {!isLoading && post && (
        <>
          <h3>Name</h3>
          <p>{post.name}</p>
          <h3>Writer</h3>
          <p>{post.userId}</p>
          <h3>Description</h3>
          <p>{post.description}</p>
          <h3>Created At</h3>
          <p>{post.createdAt}</p>
          <h3>Updated At</h3>
          <p>{post.updatedAt}</p>
          {post.isAbleModified && (
            <>
              <StyledPostUpdateLink to={`/post/update/${id}`}>update</StyledPostUpdateLink>
              <StyledPostDeleteButton
                onClick={(e) => {
                  e.preventDefault();
                  onClickDeleteButton();
                }}
              >
                Delete
              </StyledPostDeleteButton>
            </>
          )}
          {error && <StyledErrorDiv>{error}</StyledErrorDiv>}
        </>
      )}
      <StyledCommentsSection>
        <h4>Comments</h4>
        <StyledCommentUl>
          {comments.map((comment) => {
            return <li key={`comment-${comment._id}`}>{comment.content}</li>;
          })}
        </StyledCommentUl>
      </StyledCommentsSection>
    </StyledDetailPostDiv>
  );
};

export default PostDetailPage;

const StyledDetailPostDiv = styled.div`
  margin-left: 30px;
`;

const StyledPostUpdateLink = styled(Link)`
  margin-right: 10px;
`;

const StyledPostDeleteButton = styled.button``;

const StyledPostLoadingDiv = styled.div``;

const StyledErrorDiv = styled.div``;

const StyledCommentsSection = styled.div`
  margin-top: 50px;
`;

const StyledCommentUl = styled.div`
  list-style: none;
`;
