import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

type DetailPostType = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const PostDetailPage = () => {
  const { id } = useParams();

  const [post, setPost] = useState<DetailPostType | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        setPost(json);
      }
    };

    fetchPost();
  }, []);

  return (
    <StyledDetailPostDiv>
      {post && (
        <>
          <h3>Name</h3>
          <p>{post.name}</p>
          <h3>Description</h3>
          <p>{post.description}</p>
          <h3>Created At</h3>
          <p>{post.createdAt}</p>
          <h3>Updated At</h3>
          <p>{post.updatedAt}</p>
        </>
      )}
    </StyledDetailPostDiv>
  );
};

export default PostDetailPage;

const StyledDetailPostDiv = styled.div`
  margin-left: 30px;
`;
