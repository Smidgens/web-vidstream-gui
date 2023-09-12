import { Num } from "./num";

export class LinearMath {

	static unitCoordinatesFromRot(rotation:number, precision:number = 10){
		return {
			x:Num.round(cos(360 - rotation), precision),
			y:Num.round(sin(360 - rotation), precision)
		};
	}

	static lerp(v: number, i: number, n: number){
		return (i / (n - 1)) * v;
	};

	private constructor(){}
}

const cos = (a:number) => Math.cos(a*Math.PI/180);
const sin = (a:number) => Math.sin(a*Math.PI/180);