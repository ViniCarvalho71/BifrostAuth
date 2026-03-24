import styled from "styled-components";

type InputContainerProps = {
	width: string;
	height: string;
};

export const InputContainer = styled.div<InputContainerProps>`
	width: ${({ width }) => width};
	height: ${({ height }) => height};
	margin-inline: auto;
`;

export const StyledInput = styled.input`
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border: 1px solid #e7c8fa;
	border-radius: 8px;
	padding: 0 12px;
	font-size: 14px;
	color: #6b7280;
	outline: none;
	transition: border-color 0.2s ease, box-shadow 0.2s ease;

	&:focus {
		border-color: #b87aff;
		box-shadow: 0 0 0 3px rgba(122, 0, 204, 0.15);
	}

	&::placeholder {
		color: #8a9199;
	}
`;
