import {
	BitrateMode,
	ResolutionPresets,
	SegmentType,
	GPUMode,
} from "./types";

export const STANDARD_RESOLUTIONS = [
	"1280x720",
	"1920x1080",
	"3840x2160",
	"5760x3240",
	"7680x4320",
].sort((a,b) => b.localeCompare(a));

export const AVC_PRESET_OPTIONS = [
	"Ultra Fast",
	"Super Fast",
	"Very Fast",
	"Faster",
	"Fast",
	"Medium",
	"Slow",
	"Slower",
	"Very Slow",
]
.map(o => ({ value:o.replaceAll(" ", "").toLowerCase(), text:o, }))

export const SIZE_MODE_OPTIONS = [
	ResolutionPresets.AutoHalved,
	ResolutionPresets.Video360,
]
.map(o => ({ text:o, value:o, }));

export const bitrateOptions = [
	BitrateMode.Simple1,
	BitrateMode.SimpleSpaced2,
	BitrateMode.SimpleSpaced3,
	BitrateMode.SimpleSpaced4,
]
.map(o => ({ text:o, value:o, }));

export const STANDARD_FRAMERATES = [
	24,
	30,
	60,
]
.map(o => ({
	text:`${o}hz`,
	value:o,
}));

export const resolutionOptions = STANDARD_RESOLUTIONS.map(o => ({
	value:o,
}));

export const BITRATE_PRESETS = ((arr:number[]) => {
	const r:Record<string,number> = {};
	arr.forEach(v => r[`${v}M`] = v * 1000000);
	return r;
})([ 1, 10, 15, 20, 25, 50 ]);

export const segmentTypeOptions = [
	SegmentType.MPEGTS,
	SegmentType.FMP4,
].map(v => ({ value:v, text:v.toLocaleUpperCase() }));


export const gpuOptions = [
	GPUMode.None,
	GPUMode.Cuda,
	GPUMode.CudaEncoder,
].map(v => ({ value:v }));