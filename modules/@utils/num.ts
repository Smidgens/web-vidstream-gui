export class Num {

	static round(v:number, d:number){
		return Number((v).toFixed(d));
	}
	
	static clampRange(v:number, min:number, max:number){
		if(v < min){ return min; }
		if(v > max){ return max; }
		return v;
	}

	private constructor(){}

}