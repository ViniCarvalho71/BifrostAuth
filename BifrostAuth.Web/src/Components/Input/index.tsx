import type { InputProps } from "../../Types/Input";
import { InputContainer, StyledInput } from "./style";

const Input = ({ width, height, ...inputProps }: InputProps) => {
  return (
    <InputContainer width={width} height={height}>
      <StyledInput {...inputProps} />
    </InputContainer>
  );
};

export default Input;