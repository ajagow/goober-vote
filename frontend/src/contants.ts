import styled from "@emotion/styled";
export const API_URL = process.env.REACT_APP_API_URL;

export const BORDER = "#000"
export const ACCENT = "#FF5C5C";
export const YELLOW = "#FFE45E"
export const BLUE = "#3bbaf5"

export const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 480px;
    margin: 60px auto;
    padding: 24px;
    border-radius: 14px;

    @media (min-width: 600px) {
        border: 3px dashed ${BORDER};
        background: #FFFDF7;
    }
`

export const Button = styled.button<{backgroundColor?: string}>`
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 14px;
    cursor: pointer;
    border: 3px solid ${BORDER};
    box-shadow: 3px 3px 0 #1a1a1a;
    ${({ backgroundColor }) => backgroundColor && `background: ${backgroundColor};`}
`

export const Pill = styled.button`
    background: transparent;
    box-shadow: unset;
    border-radius: 999px;
    font-weight: 700;
    border: 2px solid ${BORDER};
    cursor: pointer;
    padding: 10px 16px;
`

export const Card = styled.div`
    border: 3px solid ${BORDER};
    box-shadow: 3px 3px 0 #1a1a1a;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    cursor: pointer;
    background: white;
`
export const ErrorBanner = styled.div`
  padding: 10px 14px;
  border-radius: 12px;
  background: #FBE0DC;
  margin-bottom: 14px;
  font-weight: 700;
  font-size: 14px;
  color: #993C1D;
`;