import { FC } from "react";
import styled from "styled-components";
import { createRef } from "react";

export const Code:FC<{
	text:string;
}> = (props) => {

	const el = createRef<HTMLTextAreaElement>();

	const handleCopy = () => {
		if(!el.current){ return; }
		el.current.select();
		document.execCommand("copy");
	};

	return (
		<CommandArea style={{
			position: "relative",
		}}>
			<CopyInput
			ref={el}
			readOnly
			value={ props.text }
			/>

			<CodeWrapper>
				<code>
					{ props.text }
				</code>
			</CodeWrapper>

			<CopyButton
			onClick={ handleCopy }
			/>
		</CommandArea>
	);
};


const CodeWrapper = styled.pre`
	background:rgba(0,0,0,0.02);
	padding:1em;
	border-radius:0.5em;
`;

const CopyInput = styled.textarea`
	position: absolute;
	opacity:0;
	pointer-events: none;
`;

const CommandArea = styled.div`
	&:not(:hover) {
		.copy-btn {
			opacity:0;
		}
	}

	.copy-btn {
		transition:all .3s;
	}

	&:hover {
		.copy-btn {
			opacity:1;

		}
	}
`;


const CopyButton:FC<{
	onClick?:() => void;
}> = (props) => {

	const handleClick = () => {
		if(props.onClick){
			props.onClick();
		}
	};

	return (
		<CopyButtonWrapper
		onClick={ handleClick }
		className="shadow copy-btn sm"
		>
			Copy
			{/* <Icon name="content-copy"/> */}
		</CopyButtonWrapper>
	)
};

const CopyButtonWrapper = styled.button`
	all:unset;
	position:absolute;
	top:0;
	right:0;
	margin:1em;
	border-radius: 0.25em;
	/* background:rgb(100,100,100); */
	background:#fff;
	
	/* color:#fff; */
	color:#000;

	/* border:1px solid #c9c9c9; */


	padding:0.5em 0.75em;


	&.sm {
		padding:0.25em 0.5em;

	}

	&:hover {
		background:#dadada;
		/* background:rgb(120,120,120); */
	}
	

`;