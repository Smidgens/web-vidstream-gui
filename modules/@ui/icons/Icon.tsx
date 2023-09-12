import { FC, CSSProperties } from "react";
import styled from "styled-components";

export const Icon:FC<{
	name:string;
	spin?:boolean;
	className?:string;
	style?:CSSProperties;
}> = (props) => {
	const {
		name,
		className,
		spin,
	} = {
		...props,
	};
	const cls = `mdi mdi-${name} ${spin ? 'mdi-spin' : ''} ${className}`;
	const style = props.style || {};
	return <IconSpan className={cls} style={style} />;
};

const IconSpan = styled.span`
	display: inline-block;
	&::before { font-size: 1.2em; }
`;
