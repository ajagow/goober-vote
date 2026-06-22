import styled from "@emotion/styled";

type CheckboxProps = {
  checked: boolean;
  updateChecked: (checked: boolean) => void;
  label: string;
};

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  user-select: none;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const CheckboxBox = styled.div<{ checked: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 3px solid #1a1a1a;
  background: ${({ checked }) => (checked ? "#FFE45E" : "white")};
  box-shadow: 2px 2px 0 #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #1a1a1a;
  }
`;


export const Checkbox = ({ checked, updateChecked, label }: CheckboxProps) => {
  return (
    <CheckboxLabel>
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        onChange={(e) => updateChecked(e.target.checked)}
      />
      <CheckboxBox checked={checked}>
        {checked && (
          <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>✓</span>
        )}
      </CheckboxBox>
      {label}
    </CheckboxLabel>
  );
};