import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { tokenState } from "../../atom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const setAccessToken = useSetRecoilState(tokenState);

  // input handler
  const handleChangeUserId = (e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value);
  const handleBlurUserId = () => setUserId(userId.trim());

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleBlurEmail = () => setEmail(email.trim());

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleBlurPassword = () => setPassword(password.trim());

  const handleChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);
  const handleBlurConfirmPassword = () => setConfirmPassword(confirmPassword.trim());

  // submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!userId || !email || !password || !confirmPassword) {
      const errorList = [];
      if (!userId) {
        errorList.push("user id");
      } else if (!email) {
        errorList.push("email");
      } else {
        errorList.push("password");
      }

      setError(`Please enter ${errorList[0]}`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords are not matched");
      return;
    }

    const user = { userId, email, password };

    const response = await fetch("http://localhost:4000/api/user/register", {
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
      alert("Complete register!");
      navigate("/sign-in");
    }
  };

  // mounted
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("accessToken") ?? "";
    if (sessionToken) {
      setAccessToken(sessionToken);
      navigate(-1);
    }
  }, []);

  return (
    <StyledRegisterForm onSubmit={handleSubmit}>
      <h3>Register</h3>
      <StyledUserIdInputDiv>
        <label>User Id</label>
        <input
          type="text"
          placeholder="user id"
          maxLength={15}
          onChange={handleChangeUserId}
          onBlur={handleBlurUserId}
          value={userId}
        />
      </StyledUserIdInputDiv>
      <StyledEmailInputDiv>
        <label>Email</label>
        <input
          type="email"
          placeholder="email"
          maxLength={40}
          onChange={handleChangeEmail}
          onBlur={handleBlurEmail}
          value={email}
        />
      </StyledEmailInputDiv>
      <StyledPasswordInputDiv>
        <label>Password</label>
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
      <StyledConfirmPasswordInputDiv>
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="confirm password"
          maxLength={14}
          onChange={handleChangeConfirmPassword}
          onBlur={handleBlurConfirmPassword}
          value={confirmPassword}
          autoComplete="off"
        />
      </StyledConfirmPasswordInputDiv>
      <StyledSubmitButton>register</StyledSubmitButton>
      {error && <StyledErrorDiv>{error}</StyledErrorDiv>}
    </StyledRegisterForm>
  );
};

export default RegisterPage;

const StyledRegisterForm = styled.form`
  margin-left: 30px;
`;

const StyledUserIdInputDiv = styled.div`
  label {
    display: block;
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
  }
`;

const StyledEmailInputDiv = styled.div`
  label {
    display: block;
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
  }
`;

const StyledPasswordInputDiv = styled.div`
  label {
    display: block;
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
  }
`;

const StyledConfirmPasswordInputDiv = styled.div`
  label {
    display: block;
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
  }
`;

const StyledSubmitButton = styled.button`
  margin-bottom: 10px;
`;

const StyledErrorDiv = styled.div``;
