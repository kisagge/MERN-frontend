import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { tokenState } from "../atom";

const Navbar = () => {
  const sessionToken = sessionStorage.getItem("accessToken");

  const [accessToken, setAccessToken] = useRecoilState(tokenState);

  // onClick sign out
  const onClickSignOut = () => {
    sessionStorage.removeItem("accessToken");
    useResetRecoilState(tokenState);
  };

  useEffect(() => {
    if (sessionToken) {
      setAccessToken(sessionToken);
    }
  }, []);

  return (
    <StyledHeader>
      <h1>
        <StyledLogoLink to="/">Main</StyledLogoLink>
      </h1>
      <StyledContainer>
        <StyledLi>
          <StyledLiLink to="/post">Post List</StyledLiLink>
        </StyledLi>
        {accessToken && (
          <StyledLi>
            <StyledLiLink to="/create">Create Post</StyledLiLink>
          </StyledLi>
        )}
        {!accessToken && (
          <StyledLi>
            <StyledLiLink to="/register">Register</StyledLiLink>
          </StyledLi>
        )}
        {!accessToken && (
          <StyledLi>
            <StyledLiLink to="/sign-in">Sign In</StyledLiLink>
          </StyledLi>
        )}
        {accessToken && (
          <StyledLi>
            <StyledLiLink to="/" onClick={onClickSignOut}>
              Sign Out
            </StyledLiLink>
          </StyledLi>
        )}
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
