import styled from "styled-components";

const HomePage = () => {
  return (
    <StyledHome>
      <h2>Main Page</h2>
      <p>MERN Basic Project입니다.</p>
    </StyledHome>
  );
};

export default HomePage;

const StyledHome = styled.div`
  margin: 20px;
`;
