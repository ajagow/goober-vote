import styled from "@emotion/styled";

const INK = "#1a1a1a";
const YELLOW = "#FFE45E";
const PAPER = "#FFFDF7";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  padding: 14px 24px;
  background: ${PAPER};
  border-bottom: 3px solid ${INK};
`;

const LogoWrapper = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
`;

const IconChip = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 3px solid ${INK};
  background: ${YELLOW};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 ${INK};
  transform: rotate(-4deg);
  font-weight: 700;
  font-size: 16px;
  color: ${INK};
  flex-shrink: 0;
`;

const Wordmark = styled.span`
  font-family: "Archivo", sans-serif;
  font-weight: 700;
  font-size: 19px;
  color: ${INK};
`;

export default function Navbar() {
  return (
    <Nav>
      <LogoWrapper href="/">
        <IconChip>?</IconChip>
        <Wordmark>GooberVote</Wordmark>
      </LogoWrapper>
    </Nav>
  );
}
