import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

type PostType = {
  _id: string;
  name: string;
  description: string;
};

const PostListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [posts, setPosts] = useState<PostType[]>([]);

  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>("");

  // input handler
  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleBlurKeyword = () => {
    setKeyword(keyword.trim());
  };

  // handle Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let queryString = ``;
    if (keyword.trim()) {
      queryString += `keyword=${keyword}`;
    }

    if (queryString.length > 0) {
      queryString = `?${queryString}`;
    }

    navigate(`/post${queryString}`);
    const response = await fetch(`http://localhost:4000/api/posts${queryString}`, {
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

  useEffect(() => {
    const fetchPosts = async (keyword: string) => {
      let queryString = ``;
      setKeyword(keyword);
      if (keyword.trim()) {
        queryString += `keyword=${keyword}`;
      }

      if (queryString.length > 0) {
        queryString = `?${queryString}`;
      }

      const response = await fetch(`http://localhost:4000/api/posts${queryString}`, {
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

    fetchPosts(searchParams.get("keyword") ?? "");
  }, []);

  return (
    <StyledPostList>
      <StyledSearchSection onSubmit={handleSubmit}>
        <StyledSearchInput
          type="text"
          value={keyword}
          onChange={handleChangeKeyword}
          onBlur={handleBlurKeyword}
        />
        <button>Search</button>
      </StyledSearchSection>
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

const StyledSearchSection = styled.form`
  margin-left: 40px;
`;

const StyledSearchInput = styled.input`
  margin-right: 20px;
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
