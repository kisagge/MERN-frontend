import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

type PostType = {
  _id: string;
  name: string;
  description: string;
};

const PostListPage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:4000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        setPosts(json);
      }
    };

    fetchPosts();
  }, []);

  // onClick Handler
  const onClickDeleteButton = async (id: string) => {
    const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
      method: "DELETE",
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setError(null);
      const newPosts = posts.filter((post) => post._id !== id);
      setPosts(newPosts);
    }
  };

  return (
    <StyledPostList>
      <StyledOrderedList>
        {posts &&
          posts.map((post, idx) => (
            <StyledPostLi key={`post-${post._id}`}>
              <StyledPostLink to={`/post/${post._id}`}>
                {idx + 1}. {post.name}
              </StyledPostLink>
              <div>
                <StyledPostLink to={`/post/update/${post._id}`}>update</StyledPostLink>
                <StyledPostButton onClick={() => onClickDeleteButton(post._id)}>
                  Delete
                </StyledPostButton>
              </div>
            </StyledPostLi>
          ))}
        {error && <div className="error">{error}</div>}
      </StyledOrderedList>
    </StyledPostList>
  );
};

export default PostListPage;

const StyledPostList = styled.div`
  margin: 20px;
`;

const StyledOrderedList = styled.ol`
  list-style: none;
`;

const StyledPostLi = styled.li`
  width: 400px;
  display: flex;
  justify-content: space-between;
`;

const StyledPostLink = styled(Link)`
  text-decoration: none;
  margin-right: 10px;
`;

const StyledPostButton = styled.button``;
