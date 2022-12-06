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

  const [loading, setLoading] = useState(true);

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
    setLoading(true);

    let queryString = ``;
    const queryArray = [];
    if (keyword.trim()) {
      queryArray.push(`keyword=${keyword}`);
    }

    if (queryArray.length > 0) {
      queryString = `?${queryArray.join("&")}`;
    }

    navigate({
      pathname: "/post",
      search: queryString,
    });
    const response = await fetch(`http://localhost:4000/api/posts${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setError(null);
      setPosts(json.posts);
      setPagination({
        startPage: json.startPage,
        endPage: json.endPage,
        currentPage: json.currentPage,
        totalPage: json.totalPage,
      });
      setLoading(false);
    }
  };

  const onClickPagination = async (page: number) => {
    setLoading(true);

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
      setLoading(false);
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
        setLoading(false);
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
      {loading && <div className="loading">Loading...</div>}
      {!loading && (
        <>
          {posts.length <= 0 && <div className="empty">No Post List</div>}
          <StyledOrderedList>
            {posts &&
              posts.map((post, idx) => (
                <StyledPostLi key={`post-${post._id}`}>
                  <StyledPostLink to={`/post/${post._id}`}>
                    {idx + 1}. {post.name}
                  </StyledPostLink>
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
              {Array.from(
                { length: pagination.endPage - pagination.startPage + 1 },
                (_, i) => i,
              ).map((i) => (
                <StyledPaginationLi key={`post-list-page-${i}`}>
                  <StyledPaginationLiButton
                    onClick={() => onClickPagination(i + pagination.startPage)}
                  >
                    {i + pagination.startPage}
                  </StyledPaginationLiButton>
                </StyledPaginationLi>
              ))}
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
        </>
      )}
    </StyledPostList>
  );
};

export default PostListPage;

const StyledPostList = styled.div`
  margin: 20px 0 0 40px;
`;

const StyledSearchSection = styled.form`
  /* margin-left: 40px; */
  margin-bottom: 20px;
`;

const StyledSearchInput = styled.input`
  margin-right: 20px;
`;

const StyledOrderedList = styled.ol`
  list-style: none;
  padding-left: 0;
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

const StyledPaginationDiv = styled.div``;

const StyledPaginationUl = styled.ul`
  list-style: none;
  display: flex;
  padding-left: 0;
`;

const StyledPaginationLi = styled.li``;

const StyledPaginationLiButton = styled.button``;
