import styled from "styled-components";

const RegisterPage = () => {
  return (
    <StyledRegisterForm>
      <h3>Register</h3>
      <StyledUserIdInputDiv>
        <label>User Id</label>
        <input type="text" />
      </StyledUserIdInputDiv>
    </StyledRegisterForm>
  );
};

export default RegisterPage;

const StyledRegisterForm = styled.form``;

const StyledUserIdInputDiv = styled.div``;
