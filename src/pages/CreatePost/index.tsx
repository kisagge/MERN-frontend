import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { getMyInfo } from "../../api/userApi";
import { tokenState } from "../../atom";

const CreatePostPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [accessToken, setAccessToken] = useRecoilState(tokenState);

  // input handler
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const post = { name, description };

    // Validation
    if (!post.name) {
      setError("Please enter a name");
      return;
    }

    if (!post.description) {
      setError("Please enter a description");
      return;
    }

    const response = await fetch("http://localhost:4000/api/posts", {
      method: "POST",
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

    getMyInfo(sessionToken);
  }, []);

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h3>Add a New Post</h3>
      <StyledNameInputDiv>
        <label>Post Name </label>
        <input type="text" onChange={handleChangeName} value={name} maxLength={20} />
      </StyledNameInputDiv>
      <StyledDescriptionInputDiv>
        <label>Post Description</label>
        <textarea
          onChange={handleChangeDescription}
          value={description}
          maxLength={100}
          cols={200}
        />
      </StyledDescriptionInputDiv>
      <button>Add Post</button>
      {error && <div className="error">{error}</div>}
    </StyledForm>
  );
};

export default CreatePostPage;

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
