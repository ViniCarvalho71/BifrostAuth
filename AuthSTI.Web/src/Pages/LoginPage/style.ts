import styled from "styled-components";

export const PageContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px;
	background-image: url("/bg_login.jpg");
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
`;

export const LoginBox = styled.div`
	width: 100%;
	max-width: 380px;
    height: 500px;
	display: flex;
	flex-direction: column;
	align-items: center;
    justify-content: center;
	gap: 18px;
	padding: 28px;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	background: #ffffff;

	h2 {
		margin: 0 0 8px;
	}
`;

export const Button = styled.button`
    margin-top: 40px;
	margin-inline: auto;
	display: flex;
	width: 200px;
	height: 40px;
	border: 1px solid #b696ff;
	border-radius: 8px;
	background: #ffffff;
    justify-content: center;
    align-items: center;
	color: #b696ff;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s ease, transform 0.1s ease;

	&:hover {
		background: #b983f8;
        color: #ffffff;
	}

	&:active {
		transform: translateY(1px);
	}

	&:focus-visible {
		outline: 2px solid #0f62fe;
		outline-offset: 2px;
	}
`;

export const Title = styled.h2`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 40px;
    color: #a064ff;
    margin-bottom: 16px;
`;

export const Link = styled.a`
    color: #a064ff;
    text-decoration: none;
    cursor: pointer;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    &:hover {
        color: #b983f8;
    }
`;

