import { FC } from "react";
import { default as Home } from "./pages/index";

export const App:FC = () => {
	return (
		<div className="container py-3">
			<Home/>
		</div>
	);
};