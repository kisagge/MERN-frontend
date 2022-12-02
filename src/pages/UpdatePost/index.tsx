import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const UpdatePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    const fetchPost = async () => {
      const response = await fetch(`http://localhost:4000/api/posts/${id}`, {
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
        setName(json.name);
        setDescription(json.description);
      }
    };

    fetchPost();
  }, []);

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h3>Update a Post</h3>
      <StyledNameInputDiv>
        <label>Post Name : </label>
        <input type="text" onChange={handleChangeName} value={name} maxLength={20} />
      </StyledNameInputDiv>
      <StyledDescriptionInputDiv>
        <label>Post Description : </label>
        <input type="text" onChange={handleChangeDescription} value={description} maxLength={100} />
      </StyledDescriptionInputDiv>
      <button>Update Post</button>
      {error && <div className="error">{error}</div>}
    </StyledForm>
  );
};

export default UpdatePostPage;

const StyledForm = styled.form``;

const StyledNameInputDiv = styled.div``;

const StyledDescriptionInputDiv = styled.div``;
