import styled from "@emotion/styled";
import { BLUE, Button } from "../contants";
import { useState } from "react";

const CopyLinkButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  border: 2px solid #1a1a1a;
  background: ${BLUE};
  padding: 8px 14px;
  height: 40px;
  color: black;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
  }
`;

const CopyLinkLabel = styled.span`
  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileLabel = styled.div`
  @media (min-width: 600px) {
    display: none;
  }
`;

export const CopyButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("failed to copy text:", err);
    }
  };
  return (
    <CopyLinkButton onClick={handleCopy} aria-label="Copy room link">
      <MobileLabel aria-hidden="true">{copied ? "✓" : "⧉"}</MobileLabel>
      <CopyLinkLabel>{copied ? "copied!" : "copy link"}</CopyLinkLabel>
    </CopyLinkButton>
  );
};
