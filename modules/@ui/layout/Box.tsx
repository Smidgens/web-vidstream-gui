import styled from "styled-components";
import React, { FC, CSSProperties } from "react";

export class Box {

	static get Abs(){
		return AbsBox;
	}

	static get RelFill(){
		return RelFillBox;
	}

	static get FlexFill(){
		return FlexBox;
	}
	
	static get Ratio(){
		return RatioBox;
	}
}

const AbsBox = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
`;

const RelFillBox = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;

interface IFlexBox {
	className?:string;
	style?:CSSProperties;
};

const FlexBox:FC<IFlexBox> = ({ className, style, children }) => {
	return (
		<div className={`flex-fill`} style={{ position:"relative" }}>
			<AbsBox
			className={`${className || ""}`}
			style={ style }
			>
				{children}
			</AbsBox>
		</div>
	);
};


interface IRatioBox extends React.AllHTMLAttributes<HTMLDivElement> {
	ratio?: number;
}

const RatioBox: FC<IRatioBox> = ({ className, children, ratio }) => {
	return (
		<RatioWrapper ratio={ratio || 100}>
			<AbsBox className={className || ""}>{children}</AbsBox>
		</RatioWrapper>
	);
};

const RatioWrapper = styled.div<{ ratio: number }>`
	padding-top: ${({ ratio }) => ratio}%;
	width:100%;
	position: relative;
`;
