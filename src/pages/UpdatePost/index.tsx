import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { tokenState } from "../../atom";

const UpdatePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [accessToken, setAccessToken] = useRecoilState(tokenState);

  const [isLoading, setIsLoading] = useState(true);

  // input handler
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const post = { _id: id, name, description };

    // Validation
    if (!post.name) {
      setError("Please enter a name");
      return;
    }

    if (!post.description) {
      setError("Please enter a description");
      return;
    }

    const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(post),
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

  useEffect(() => {
    if (!accessToken && !sessionStorage.getItem("accessToken")) {
      navigate(-1);
      return;
    }

    const sessionToken = sessionStorage.getItem("accessToken") ?? "";
    if (!accessToken && sessionToken) {
      setAccessToken(sessionToken);
    }

    const fetchPost = async () => {
      const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") ?? ""}`,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      }

      if (response.ok) {
        if (!json.data.isAbleModified) {
          navigate(-1);
          return;
        }
        setError(null);
        setName(json.data.name);
        setDescription(json.data.description);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, []);

  return (
    <StyledForm onSubmit={handleSubmit}>
      {isLoading && <StyledPostLoadingDiv>Loading...</StyledPostLoadingDiv>}
      {!isLoading && (
        <>
          <h3>Update a Post</h3>
          <StyledNameInputDiv>
            <label>Post Name : </label>
            <input type="text" onChange={handleChangeName} value={name} maxLength={20} />
          </StyledNameInputDiv>
          <StyledDescriptionInputDiv>
            <label>Post Description : </label>
            <textarea
              onChange={handleChangeDescription}
              value={description}
              maxLength={100}
              cols={200}
            />
          </StyledDescriptionInputDiv>
          <button>Update Post</button>
          {error && <div className="error">{error}</div>}
        </>
      )}
    </StyledForm>
  );
};

export default UpdatePostPage;

const StyledForm = styled.form`
  margin-left: 30px;
`;

const StyledNameInputDiv = styled.div`
  margin-bottom: 10px;
`;

const StyledDescriptionInputDiv = styled.div`
  margin-bottom: 10px;
  height: 100%;

  textarea {
    display: block;
    width: 320px;
    resize: none;
    height: 300px;
  }
`;

const StyledPostLoadingDiv = styled.div``;
