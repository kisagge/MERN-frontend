import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

type PostType = {
  _id: string;
  name: string;
  description: string;
};

interface PaginationPropsType {
  currentPage: number;
  endPage: number;
  startPage: number;
  totalPage: number;
}

const PostListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [posts, setPosts] = useState<PostType[]>([]);

  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>("");
  const [pagination, setPagination] = useState<PaginationPropsType>({
    startPage: 1,
    endPage: 1,
    currentPage: 1,
    totalPage: 1,
  });

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
    const queryArray = [];
    if (keyword.trim()) {
      queryArray.push(`keyword=${keyword}`);
    }

    const page = searchParams.get("page") ?? "1";

    if (Number(page) !== 1) {
      queryArray.push(`page=${page}`);
    }

    if (queryArray.length > 0) {
      queryString = `?${queryArray.join("&")}`;
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
      setPosts(json.posts);
      setPagination({
        startPage: json.startPage,
        endPage: json.endPage,
        currentPage: json.currentPage,
        totalPage: json.totalPage,
      });
    }
  };

  // onClick handler
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

      // refetch
      let queryString = ``;
      const queryArray = [];
      if (keyword.trim()) {
        queryArray.push(`keyword=${keyword}`);
      }

      const page = searchParams.get("page") ?? "1";

      if (Number(page) !== 1) {
        queryArray.push(`page=${page}`);
      }

      if (queryArray.length > 0) {
        queryString = `?${queryArray.join("&")}`;
      }

      const res = await fetch(`http://localhost:4000/api/posts${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (res.ok) {
        setPosts(json.posts);
        setPagination({
          startPage: json.startPage,
          endPage: json.endPage,
          currentPage: json.currentPage,
          totalPage: json.totalPage,
        });
      }
    }
  };

  const onClickPagination = async (page: number) => {
    let queryString = ``;
    const queryArray = [];
    if (keyword.trim()) {
      queryArray.push(`keyword=${keyword}`);
    }
    if (page !== 1) {
      queryArray.push(`page=${page}`);
    }

    if (queryArray.length > 0) {
      queryString = `?${queryArray.join("&")}`;
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
      setPosts(json.posts);
      setPagination({
        startPage: json.startPage,
        endPage: json.endPage,
        currentPage: json.currentPage,
        totalPage: json.totalPage,
      });
    }
  };

  useEffect(() => {
    const fetchPosts = async (keyword: string, page: string) => {
      let queryString = ``;
      setKeyword(keyword);
      const queryArray = [];
      if (keyword.trim()) {
        queryArray.push(`keyword=${keyword}`);
      }

      if (Number(page) !== 1) {
        queryArray.push(`page=${page}`);
      }

      if (queryArray.length > 0) {
        queryString = `?${queryArray.join("&")}`;
      }

      const response = await fetch(`http://localhost:4000/api/posts${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (response.ok) {
        setPosts(json.posts);
        setPagination({
          startPage: json.startPage,
          endPage: json.endPage,
          currentPage: json.currentPage,
          totalPage: json.totalPage,
        });
      }
    };

    fetchPosts(searchParams.get("keyword") ?? "", searchParams.get("page") ?? "1");
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
      {posts.length <= 0 && <div className="empty">No Post List</div>}
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
      <StyledPaginationDiv>
        <StyledPaginationUl>
          {pagination.currentPage > 1 && (
            <StyledPaginationLi>
              <StyledPaginationLiButton
                onClick={() =>
                  onClickPagination(pagination.startPage > 1 ? pagination.startPage - 1 : 1)
                }
              >
                start
              </StyledPaginationLiButton>
            </StyledPaginationLi>
          )}
          {Array.from({ length: pagination.endPage - pagination.startPage + 1 }, (_, i) => i).map(
            (i) => (
              <StyledPaginationLi>
                <StyledPaginationLiButton
                  onClick={() => onClickPagination(i + pagination.startPage)}
                >
                  {i + pagination.startPage}
                </StyledPaginationLiButton>
              </StyledPaginationLi>
            ),
          )}
          {pagination.currentPage < pagination.totalPage && pagination.totalPage > 1 && (
            <StyledPaginationLi>
              <StyledPaginationLiButton
                onClick={() =>
                  onClickPagination(
                    pagination.totalPage > pagination.endPage
                      ? pagination.endPage + 1
                      : pagination.totalPage,
                  )
                }
              >
                end
              </StyledPaginationLiButton>
            </StyledPaginationLi>
          )}
        </StyledPaginationUl>
      </StyledPaginationDiv>
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

const StyledPaginationDiv = styled.div``;

const StyledPaginationUl = styled.ul`
  list-style: none;
  display: flex;
`;

const StyledPaginationLi = styled.li``;

const StyledPaginationLiButton = styled.button``;
