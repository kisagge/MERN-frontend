import { ChangeEvent, FormEvent, useState } from "react";
import styled from "styled-components";

const CreatePostPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);

  // input handler
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  // submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const post = { name, description };

    const response = await fetch("http://localhost:4000/api/posts", {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    } else {
      setError(null);
      setName("");
      setDescription("");
      console.log("new post added", json);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h3>Add a New Post</h3>
      <StyledNameInputDiv>
        <label>Post Name : </label>
        <input type="text" onChange={handleChangeName} value={name} maxLength={20} />
      </StyledNameInputDiv>
      <StyledDescriptionInputDiv>
        <label>Post Description : </label>
        <input type="text" onChange={handleChangeDescription} value={description} maxLength={100} />
      </StyledDescriptionInputDiv>
      <button>Add Post</button>
      {error && <div className="error">{error}</div>}
    </StyledForm>
  );
};

export default CreatePostPage;

const StyledForm = styled.form``;

const StyledNameInputDiv = styled.div``;

const StyledDescriptionInputDiv = styled.div``;
