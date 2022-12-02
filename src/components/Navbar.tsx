import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  return (
    <StyledHeader>
      <h1>Project</h1>
      <StyledContainer>
        <StyledLink>
          <Link to="/">Post List</Link>
        </StyledLink>
        <StyledLink>
          <Link to="/create">Create Post</Link>
        </StyledLink>
      </StyledContainer>
    </StyledHeader>
  );
};

export default Navbar;

const StyledHeader = styled.header`
  height: 75px;
  padding: 1rem;
  color: white;
  background: teal;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledContainer = styled.ul`
  list-style: none;
`;

const StyledLink = styled.li`
  margin-right: 30px;
  float: left;
`;
