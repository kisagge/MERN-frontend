import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { tokenState } from "../../atom";

const SignInPage = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const tokenHandler = useSetRecoilState(tokenState);

  // input handler
  const handleChangeUserId = (e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value);
  const handleBlurUserId = () => setUserId(userId.trim());

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleBlurPassword = () => setPassword(password.trim());

  // submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = { userId, password };

    const response = await fetch("http://localhost:4000/api/user/sign-in", {
      method: "POST",
      body: JSON.stringify(user),
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
      sessionStorage.setItem("accessToken", json.token);
      tokenHandler(json.token);
      navigate("/");
    }
  };

  return (
    <StyledSignInForm onSubmit={handleSubmit}>
      <h3>Sign In</h3>
      <StyledUserIdInputDiv>
        <label>User Id : </label>
        <input
          type="text"
          placeholder="user id"
          maxLength={15}
          onChange={handleChangeUserId}
          onBlur={handleBlurUserId}
          value={userId}
        />
      </StyledUserIdInputDiv>
      <StyledPasswordInputDiv>
        <label>Password : </label>
        <input
          type="password"
          placeholder="password"
          maxLength={14}
          onChange={handleChangePassword}
          onBlur={handleBlurPassword}
          value={password}
          autoComplete="off"
        />
      </StyledPasswordInputDiv>
      <StyledSignInButton>Sign In</StyledSignInButton>
      {error && <StyledErrorDiv>{error}</StyledErrorDiv>}
    </StyledSignInForm>
  );
};

export default SignInPage;

const StyledSignInForm = styled.form`
  margin-left: 30px;
`;

const StyledUserIdInputDiv = styled.div`
  margin-bottom: 10px;
  width: 300px;
  display: flex;
  justify-content: space-between;
`;

const StyledPasswordInputDiv = styled.div`
  margin-bottom: 10px;
  width: 300px;
  display: flex;
  justify-content: space-between;
`;

const StyledSignInButton = styled.button``;

const StyledErrorDiv = styled.div``;
