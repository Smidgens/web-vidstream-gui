
export class Sort {

	static sortArrayByDate<T>(arr:T[], primer:(it:T) => Date){
		return arr.sort((a, b) => primer(b).getTime() - primer(a).getTime());
	}

	private constructor(){}
}