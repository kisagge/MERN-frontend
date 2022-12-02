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
                <StyledPostButton>Delete</StyledPostButton>
              </div>
            </StyledPostLi>
          ))}
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
