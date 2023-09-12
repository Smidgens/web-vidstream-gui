import {
	ResolutionPresets,
	BitrateMode,
	Size2D,
	VideoData,
} from "./types";
import { STANDARD_RESOLUTIONS } from "./constants";

// https://www.reddit.com/r/Twitch/comments/5gnv08/a_comprehensive_look_at_framerate_resolution/

// bpp = (bit rate x 1000) / (pixel width * pixel height * frame rate)
export const calculateBPP = (w:number, h:number, br:number, fr:number) => {
	return (br) / (w * h * fr)
};

// derive bitrate for target resolution from quality variant
// example: power of.75 rule

// ((w x h) / (qw x qh))ᶠᵃᶜᵗᵒʳ x qbr

// New Bitrate = ((New Pixel Width * New Pixel Height) / (GQ Pixel Width * GQ Pixel Height)) ^ (factor) * GQ Bitrate
export const computeFactor = (nw:number, nh:number, qw:number, qh:number, qbr:number, f:number = 0.75) => {
	const ns = nw * nh;
	const qs = qw * qh;
	return Math.round(Math.pow(ns / qs, f) * qbr);
};

export const roundValue = (v:number, precision:number = 2) => {
	if(precision === 0){
		return Math.round(v);
	}
	const f = Math.pow(10, precision);
	const rv = Math.round(v * f) / f;
	return rv;
};

/**
	1M = 1000000 bits
	https://castr.io/blog/what-is-video-bitrate/

	todo: something clever with regex
*/
export const formatBitrate = (v:number) => {
	// const vv = Math.round(v / 1000000);
	// const f = "Mbps";
	// return `${vv} ${f}`
	return v.toString();
};

export const getBitrateVariants = (v:VideoData, mode?:string) => {
	const r = [ v ];
	let n = 4;

	if(mode === BitrateMode.Simple1 || !mode){
		return r;
	}

	if(mode === BitrateMode.SimpleSpaced2){
		n = 2;
	}
	else if(mode === BitrateMode.SimpleSpaced3){
		n = 3;
	}
	else if(mode === BitrateMode.SimpleSpaced4){
		n = 4;
	}

	const space = v.br / n;
	for(let i = 1; i < n; i++){
		const br = Math.round(v.br - (i * space));
		r.push({
			...v,
			br,	
		});
	}
	return r;
};

export const getVideoVariants = (cfg:{
	source:VideoData;
	scaleMode?:string;
	brMode?:string;
	brFactor:number;
	floor:number;
}) => {

	const {
		source:s,
		scaleMode,
		brMode,
		floor,
		brFactor
	} = cfg;

	return getResolutionVariants({
		source:s,
		mode:scaleMode,
		brFactor,
	})
	.map(rv => getBitrateVariants(rv, brMode))
	.flat()
	.filter(size => size.w > floor && size.h > floor);
};

export const getResolutionVariants = (cfg:{
	source:VideoData;
	mode?:string;
	brFactor:number;
}) => {

	const {
		source:s,
		mode,
		brFactor,
	} = cfg;

	let resolutions:string[] = [];
	if(mode === ResolutionPresets.Video360){
		resolutions = STANDARD_RESOLUTIONS;
	}
	else {
		resolutions = getHalvedResolutions(s);
	}
	let sizes:Size2D[] = Array.from(new Set(resolutions))
	.map(r => r.split("x"))
	.map(([ w, h ]) => ({
		w:Number(w),
		h:Number(h),
	}));
	
	sizes = sizes.filter(size => {
		return size.w < s.w
	});

	const variants = sizes
	.map(v => {
		const br = computeFactor(v.w, v.h, s.w, s.h, s.br, brFactor);
		return {
			...v,
			fr:s.fr,
			br,
		}
	});
	const r = [
		s,
		...variants,
	];
	r.sort((a, b) => {
		return b.w - a.w;
	});
	return r;
};

const getHalvedResolutions = (s:VideoData):string[] => {
	const sizes:Size2D[] = [];
	let last = {
		w:s.w,
		h:s.h,
	};

	// keep cutting in half
	let i = 1;
	while(last.w > 0 && last.h  > 0){
		const s = 0.5;
		last = {
			w:s * last.w,
			h:s * last.h,
		};
		sizes.push(last);
		i++;
	}

	return sizes.map(s => `${s.w}x${s.h}`);

};


export const injectStringVars = (s:string, vars:Record<string,any>) => {
	Object.keys(vars)
	.forEach(k => {
		s = s.replaceAll(`$${k}`, vars[k]);
	});
	return s;
};