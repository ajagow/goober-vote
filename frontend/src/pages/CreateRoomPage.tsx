import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import styled from "@emotion/styled";
import { ACCENT, API_URL, BORDER, Button, PageLayout, YELLOW } from "../contants";
import { Checkbox } from "../components/Checkbox";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
  margin-top: 12px;
`;

const AddOptionButton = styled(Button)`
  font-weight: 500;
  border: 3px dashed ${BORDER};
  margin-top: 4px;
  box-shadow: none;
  color: black;
`;

const CreateRoomButton = styled(Button)`
  font-weight: 600;
  background: ${ACCENT};
  color: white;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.15s ease;
`;

const OptionRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid black;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${YELLOW};
  color: black;
`;



export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [singleVote, setSingleVote] = useState(false);

  const navigate = useNavigate();

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const addOptionField = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const removeOptionField = (index: number) => {
    if (options.length <= 1) {
      alert("A poll needs at least one option.");
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const createRoom = async () => {
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || cleanOptions.length < 1) {
      alert("Add a question and at least one option.");
      return;
    }

    const res = await fetch(`${API_URL}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options: cleanOptions, single_vote: singleVote }),
    });
    const data = await res.json();

    navigate(`/room/${data.room_id}`);
  };

  return (
    <PageLayout>
      <h2>Create a voting room</h2>
      <InputWrapper>
        <Input label="question" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)}/>
        {options.map((opt, i) => (
          <OptionRow key={i}>
            <Input
              label={`Option ${i}`}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
            />
            <RemoveButton onClick={() => removeOptionField(i)} aria-label={`Remove option ${i + 1}`}>
              ×
            </RemoveButton>
          </OptionRow>
        ))}
        <AddOptionButton onClick={addOptionField}>
          + add option
        </AddOptionButton>

        <Checkbox
          checked={singleVote}
          updateChecked={setSingleVote}
          label="limit to one vote per person"
        />
      </InputWrapper>
      <CreateRoomButton onClick={createRoom}>create room</CreateRoomButton>
    </PageLayout>
  );
}