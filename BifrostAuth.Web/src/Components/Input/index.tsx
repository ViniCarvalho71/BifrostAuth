import type { InputProps } from "../../Types/Input";
import { InputContainer, StyledInput } from "./style";


const Input = (props : InputProps) => {
  return (
    <InputContainer width={props.width} height={props.height}>
      <StyledInput type={props.type} placeholder={props.placeholder} name={props.name} />
    </InputContainer>
  );
};

export default Input;