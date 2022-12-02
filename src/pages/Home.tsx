import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

type PostType = {
  _id: string;
  name: string;
  description: string;
};

const HomePage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
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

  return (
    <StyledHome>
      <ol className="post-list">
        {posts &&
          posts.map((post) => (
            <li key={`post-${post._id}`}>
              <Link to={`/post/${post._id}`}>{post.name}</Link>
            </li>
          ))}
      </ol>
    </StyledHome>
  );
};

export default HomePage;

const StyledHome = styled.div`
  margin: 20px;
`;
