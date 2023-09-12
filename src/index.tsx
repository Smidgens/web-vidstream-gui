import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { GlobalStyles } from "./GlobalStyles";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.css";
import "@mdi/font/css/materialdesignicons.min.css";

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyles/>
		<App/>
	</React.StrictMode>,
	document.getElementById("root"),
);