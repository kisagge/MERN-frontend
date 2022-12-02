import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  return (
    <StyledHeader>
      <h1>
        <StyledLogoLink to="/">Main</StyledLogoLink>
      </h1>
      <StyledContainer>
        <StyledLi>
          <StyledLiLink to="/post">Post List</StyledLiLink>
        </StyledLi>
        <StyledLi>
          <StyledLiLink to="/create">Create Post</StyledLiLink>
        </StyledLi>
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

const StyledLogoLink = styled(Link)`
  text-decoration: none;
`;

const StyledContainer = styled.ul`
  list-style: none;
`;

const StyledLi = styled.li`
  margin-right: 30px;
  float: left;
`;

const StyledLiLink = styled(Link)`
  text-decoration: none;
`;
