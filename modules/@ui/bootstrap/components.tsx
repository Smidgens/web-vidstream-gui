import React, { FC } from "react";
import { ColWidths } from "./types";

interface IContainer extends React.AllHTMLAttributes<HTMLDivElement> {
	fluid?: boolean;
	slim?: boolean;
}

export const Container: FC<IContainer> = props => {

	const { slim, fluid } = props;

	if(slim){
		return (
			<div className={`xcontainer ${props.className || ""}`} style={props.style}>
				<div className="row">
					<div className="col-md-8 offset-md-2">
						{props.children}
					</div>
				</div>
			</div>
		);
	}

	const cls = `container${fluid ? "-fluid" : ""} ${props.className || ""}`;
	return (
		<div className={cls} style={props.style}>
			{props.children}
		</div>
	);
};

interface IRow {
	noGutters?: boolean;
}

export const Row: FC<IRow> = props => {
	const cls = `row ${props.noGutters ? "no-gutters" : ""}`;
	return <div className={cls}>{props.children}</div>;
};

interface ICol extends React.AllHTMLAttributes<HTMLDivElement> {
	xs?: ColWidths;
	sm?: ColWidths;
	md?: ColWidths;
	lg?: ColWidths;
	xl?: ColWidths;
}

export const Col: FC<ICol> = props => {
	const { xs, sm, md, lg, xl } = props;

	let cls = "";

	if (xs) {
		cls += ` col-xs-${xs}`;
	}
	if (sm) {
		cls += ` col-sm-${sm}`;
	}
	if (md) {
		cls += ` col-md-${md}`;
	}
	if (lg) {
		cls += ` col-lg-${lg}`;
	}
	if (xl) {
		cls += ` col-lg-${xl}`;
	}

	if (!cls.length) {
		cls += "col";
	}

	return <div className={`${cls} ${props.className || ""}`}>{props.children}</div>;
};
