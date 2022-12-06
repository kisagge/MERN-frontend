import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { getMyInfo } from "../api/userApi";
import { tokenState, userIdState } from "../atom";

const Navbar = () => {
  const sessionToken = sessionStorage.getItem("accessToken") ?? "";

  const [accessToken, setAccessToken] = useRecoilState(tokenState);

  const [userId, setUserId] = useRecoilState(userIdState);

  // onClick sign out
  const onClickSignOut = () => {
    sessionStorage.removeItem("accessToken");
    useResetRecoilState(tokenState);
  };

  useEffect(() => {
    if (sessionToken) {
      setAccessToken(sessionToken);
    }

    const fetchUserInfo = async () => {
      const { ok, json } = await getMyInfo(sessionToken);
      if (ok) {
        setUserId(json.data.userId);
      }
    };

    if (sessionStorage.getItem("accessToken")) {
      fetchUserInfo();
    }
  }, []);

  return (
    <StyledHeader>
      <h1>
        <StyledLogoLink to="/">Main</StyledLogoLink>
      </h1>
      <StyledContainer>
        <StyledLi>
          <div>
            <StyledLiLink to="/post">Post List</StyledLiLink>
          </div>
        </StyledLi>
        {accessToken && (
          <StyledLi>
            <div>
              <StyledLiLink to="/create">Create Post</StyledLiLink>
            </div>
          </StyledLi>
        )}
        {!accessToken && (
          <StyledLi>
            <div>
              <StyledLiLink to="/register">Register</StyledLiLink>
            </div>
          </StyledLi>
        )}
        {!accessToken && (
          <StyledLi>
            <div>
              <StyledLiLink to="/sign-in">Sign In</StyledLiLink>
            </div>
          </StyledLi>
        )}
        {accessToken && (
          <StyledLi>
            <div>
              <StyledLiLink to="/" onClick={onClickSignOut}>
                Sign Out
              </StyledLiLink>
            </div>
          </StyledLi>
        )}
        {accessToken && (
          <StyledLi>
            <p>{userId}</p>
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
  div {
    width: 100%;
    text-align: center;
    padding-top: 15px;
  }
`;

const StyledLiLink = styled(Link)`
  text-decoration: none;
  margin: 0 auto;
`;
