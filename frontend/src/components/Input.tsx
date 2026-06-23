import styled from "@emotion/styled";

import { BORDER } from "../contants";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 14px;
  border: 3px solid ${BORDER};
  box-shadow: 3px 3px 0 #1a1a1a;
  outline: none;
`;

export const Input = ({ label, ...inputProps }: InputProps) => {
  return <StyledInput {...inputProps} />;
};
