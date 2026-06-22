import styled from "@emotion/styled";

export const BORDER = "#000"
export const ACCENT = "#FF5C5C";
export const YELLOW = "#FFE45E"

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

export const Button = styled.button`
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 14px;
    cursor: pointer;
    border: 3px solid ${BORDER};
    box-shadow: 3px 3px 0 #1a1a1a;
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