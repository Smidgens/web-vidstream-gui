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
		color:#181818;
		display:inline;
		padding:0.25em 0.5em;
		border-top-left-radius:0.25em;
		border-top-right-radius:0.25em;
		margin-right:auto;
		margin-left: 1em;
	}

	.box {
		padding:1em;
		border:1px solid rgba(0,0,0,0.2);
		border-radius: 0.25em;
	}

`;