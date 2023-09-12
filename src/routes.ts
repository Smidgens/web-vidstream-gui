import { default as Home } from "@pages/index";
export enum RoutePath {
	Home = "/"
}

export const routes:{
	path:string;
	component:any;
	label?:string;
}[] = [
	{
		path:RoutePath.Home,
		component:Home,
	}
];