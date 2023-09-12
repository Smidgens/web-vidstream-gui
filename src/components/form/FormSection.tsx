import { FC } from "react";
import styled from "styled-components";

export const FormSection:FC<{
	title:string;
	className?:string;
}> = (props) => {

	const cls = props.className;

	return (
		<BoxWrapper className={ cls }>
			<div className="title">
				{ props.title }
			</div>
			<div className="box">
				{ props.children }
			</div>
		</BoxWrapper>
	);
};

const BoxWrapper = styled.div`
	display:flex;
	flex-direction: column;
	.title {
		background:rgba(0,0,0,0.1);
		display:inline;
		padding:0.25em 0.5em;
		border-radius: 0.2em 0.2em 0em 0em;
		margin-right:auto;
		margin-left: 1em;
		font-weight: bold;
	}

	.box {
		padding:1em;
		border:1px solid rgba(0,0,0,0.1);
		border-radius: 0.2em;
	}

`;