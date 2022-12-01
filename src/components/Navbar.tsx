import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  return (
    <StyledHeader>
      <h1>Project</h1>
      <div className="container">
        <Link to="/">Post List</Link>
      </div>
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
