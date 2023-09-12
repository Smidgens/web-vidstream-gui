/**
https://ottverse.com/hls-packaging-using-ffmpeg-live-vod/
*/

import {
	VideoData,
} from "./types";
import * as Utils from "./utils";

import {
	SegmentType,
	FFEncoder,
	GPUMode,
} from "./types";

enum Macros {
	Newline = " \\\n",
}

type ManifestConfig = {
	videoPath?:string;
	variants:VideoData[];
	segmentLength:number;
	segmentType:string;
	bufferScale:number;
	preset:string;
	gpuMode:string;
	bitrateFactor:number;
	flags:{
		overwriteOutput:boolean;
	}
};

export const getManifestCommand = (c:ManifestConfig) => {

	const {
		gpuMode
	} = c;

	const path = c.videoPath || "video.mp4";
	
	const input = initInput({
		file:path,
		videos:c.variants,
		preset:c.preset,
		gpuMode,
		overwriteOutput:c.flags.overwriteOutput,
		// encoder:FFEncoder.H264,
		
	});
	const output = mapOutputs(c.variants, input.streams, c.bufferScale);
	const playlist = initPlaylist({
		videos:c.variants,
		segmentLength:c.segmentLength,
		segmentType:c.segmentType,
		// c.variants, c.segmentLength
	});
	return [
		input.cmd,
		output.cmd,
		playlist.cmd,
	].join(Macros.Newline);
};

const getStreamLabels = (videos:VideoData[]) => {
	return videos.map((v,i) => {
		return [
			`${i < 10 ? "0" : ""}${i}`,
			`${v.h}p`,
		].join("-");
	});
};

const initInput = (config:{
	file:string;
	videos:VideoData[];
	preset:string;
	gpuMode:string;
	overwriteOutput:boolean;
	// encoder:FFEncoder;
}) => {

	const {
		file,
		videos,
		preset,
		gpuMode,
		overwriteOutput,
	} = config;

	const flags:string[] = [];

	if(overwriteOutput){
		flags.push("y");
	}

	const preArgs:Record<string,any> = {};

	let encoder = FFEncoder.H264;

	if(gpuMode === GPUMode.CudaEncoder){
		encoder = FFEncoder.H264_NVIDIA;
	}

	if(gpuMode === GPUMode.Cuda || gpuMode === GPUMode.CudaEncoder){
		preArgs["hwaccel"] = ({
			[GPUMode.Cuda]:"cuda",
			[GPUMode.CudaEncoder]:"cuda",
		} as any)[GPUMode.Cuda];
	}

	const streams = getStreamLabels(videos); // resolution ids

	const sharedArgs:Record<string,any> = {
		...preArgs,

		"i":file,
		...getEncodingArgs({
			preset,
			encoder,
		}),
	};

	const cmd = [
		`ffmpeg`,
		...flags.map(f => `-${f}`),
		...Object.keys(sharedArgs).map(k => {
			return `-${k} ${sharedArgs[k]}`
		}),
	].join(Macros.Newline);

	return {
		streams,
		cmd,
	};
};

const mapOutputs = (videos:VideoData[], streams:string[], bufferScale:number) => {
	const lines = videos.map((v, i) => {
		return mapStreamVariant({
			streamIndex:i,
			streamLabel:`${0}`,
			br:v.br,
			bufScale:bufferScale,
			scale:`${v.w}x${v.h}`
		});
	});

	const cmd = lines.join(Macros.Newline);

	return {
		cmd,
	};
};

const mapStreamVariant = (config:{
	streamIndex:number;
	streamLabel:string;
	br:number;
	bufScale:number;
	scale:string;
}) => {

	const {
		streamIndex,
		streamLabel,
		br,
		bufScale,
		scale,
	} = config;

	const rate = Utils.formatBitrate(br);
	const maxrate = rate;
	const minrate = maxrate;
	const bfsize = Utils.formatBitrate(br * bufScale);

	const args:Record<string,any> = {
		"map":`${streamLabel}`,
		[`s:${streamIndex}`]:scale,
		[`b:v:${streamIndex}`]:rate,
		[`minrate:v:${streamIndex}`]:minrate,
		[`maxrate:v:${streamIndex}`]:maxrate,
		[`bufsize:v:${streamIndex}`]:bfsize,
	};
	return Object.keys(args).map(k => {
		return `-${k} ${args[k]}`;
	}).join(" ");
};


const initPlaylist = (config:{
	videos:VideoData[];
	segmentLength:number;
	segmentType:string;
}) => {
	
	const {
		videos,
		segmentLength,
		segmentType,
	} = config;

	// const segmentType = "mpegts";
	const masterFile = "master.m3u8";

	const map = videos.map((v,i) => {
		return `v:${i}`;
	}).join(" ");
	
	const args:Record<string,any> = {
		"f":"hls",
		"hls_allow_cache":"1",
		"hls_time":segmentLength,
		"hls_playlist_type":"vod",
		"hls_flags":"independent_segments",
		"hls_segment_type":segmentType,
		// init file
		...(segmentType === SegmentType.FMP4 ? {
			"hls_fmp4_init_filename":"init.mp4"
		} : {}),
		"hls_segment_filename":"stream/%v/data%02d.ts",
		"master_pl_name":masterFile,
		"var_stream_map":`"${map}" stream/%v/index.m3u8`,
	};

	const cmd = Object.keys(args)
	.map(k => `-${k} ${args[k]}`)
	.join(Macros.Newline);
	
	return {
		cmd,
	};
};

const getEncodingArgs = (cfg:{
	preset?:string;
	streamIndex?:number;
	encoder?:FFEncoder;
}) => {

	const {
		preset,
		streamIndex,
	} = cfg;

	const encoder = cfg.encoder || FFEncoder.H264;

	const selector = streamIndex !== undefined ? `:${streamIndex}` : "";

	const encoderOpts:Record<FFEncoder,Record<string,any>> = {
		[FFEncoder.H264]:{
			"x264-params":`"nal-hrd=cbr:force-cfr=1"`,
		},
		[FFEncoder.H264_NVIDIA]:{
			"cbr":"1",
			"rc":"cbr"
		}
	};

	const encoderArgs:Record<string,any> = {
		[`c:v${selector}`]:encoder,
		"profile:v":"main",
		"level:v":"5.2",
		...encoderOpts[encoder],
		"movflags":"faststart",
		"preset":preset || "medium",
		"keyint_min":"48",
		"sc_threshold":"0",
		"g":"48",
	};
	return encoderArgs;

};