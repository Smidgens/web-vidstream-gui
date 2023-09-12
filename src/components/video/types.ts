
export enum ResShorthands {
	Res4K = "3840x2160",
	Res6K = "5760x3240",
	Res8K = "7680x4320",
}

export enum ResolutionPresets {
	AutoHalved = "auto-halved",
	Video360 = "video-360"
};

export enum SegmentType {
	MPEGTS = "mpegts",
	FMP4 = "fmp4"
};

export enum FFEncoder {
	H264 = "libx264",
	H264_NVIDIA = "h264_nvenc",
};

export enum H264Preset {
	UltraFast = "ultrafast",
	SuperFast = "superfast",
	VeryFast = "veryfast",
	Faster = "faster",
	Fast = "fast",
	Medium = "medium",
	Slow = "slow",
	Slower = "slower",
	VerySlow = "veryslow",
};

export enum GPUMode {
	None = "none",
	Cuda = "nvidia-cuda",
	CudaEncoder = "nvidia-cuda-nvenc",
};

export enum BitrateMode {
	Simple1 = "fixed-1",
	SimpleSpaced2 = "fixed-2-spaced",
	SimpleSpaced3 = "fixed-3-spaced",
	SimpleSpaced4 = "fixed-4-spaced"
};

export type LadderConfig = {
	w:number;
	h:number;
	br:number;
	fr:number;
	preset?:string;
	segmentLength:number;
	bufferScale:number;
	sizingMode?:string;
	bitrateMode?:string;
};

export type Size2D = {
	w:number;
	h:number;
};

export type VideoData = {
	w:number;
	h:number;
	br:number;
	fr:number;
};


export type ConfigValues = {
	"source_video.path":string,
	"source_video.resolution":string;
	"source_video.framerate":number;
	"source_video.bitrate":number;
	"encoding.h264_preset":string;
	"variants.sizes":string;
	"variants.initial_bitrate_factor":number;
	"variants.bitrates":string;
	"stream.buffer_scale":number;
	"stream.segment_length":number;
	"stream.segment_type":string;
	"constraints.skip_variants":string[];
	"job.hardware_acceleration":string;
	"output.overwrite_output":boolean;
};