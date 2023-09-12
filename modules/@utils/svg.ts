export class VectorUtils {

	static pathFromCoordinates(points: number[]): string {
		let d = "M";
		for (let i = 0; i < points.length - 1; i += 2) {
			d += ` ${points[i]} ${points[i + 1]}`;
		}
		d += "Z";
		return d;
	};

	private constructor() {}
}