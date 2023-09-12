import {
	ConfigValues,
} from "./types";
import { FormProp } from "../form";
import * as Constants from "./constants";

type DrawerValues = Omit<ConfigValues, "constraints.skip_variants">;
type PropMap = Readonly<Record<keyof DrawerValues,FormProp>>;

export const FORM_PROPS:PropMap = {
	"source_video.path":{
		placeholder:"video.mp4, https://mysite.com/myvideo.mp4...",
		tooltip:"File path or remote URL"
	},
	"source_video.resolution":{
		options:Constants.resolutionOptions,
		tooltip:"Expected resolution of input"
	},
	"source_video.framerate":{
		options:Constants.STANDARD_FRAMERATES,
		tooltip:"Expected framerate of input"
	},
	"source_video.bitrate":{
		type:"number",
		presets:Constants.BITRATE_PRESETS,
		tooltip:"Highest quality BR (assumed to be less or equal to that of input file)"
	},
	"encoding.h264_preset":{
		options:Constants.AVC_PRESET_OPTIONS,
		tooltip:`
		-preset <mode>
		<br/>
		Encoder preset
		`
	},
	"variants.sizes":{
		options:Constants.SIZE_MODE_OPTIONS,
		tooltip:`
		Resolution selection based on input size
		`,
	},
	"variants.bitrates":{
		options:Constants.bitrateOptions,
		tooltip:`
		How bitrate variants
		`,
	},
	"variants.initial_bitrate_factor":{
		tooltip:`
		Used to compute highest bitrate in each resolution tier based on bitrate and size of input bitrate and size
		<br/>
		br = ((w * h) / (qw * qh))^factor * qbr
		`,
		min:0.4,
		max:0.9,
		step:0.01,
		labelFormatter:(v) => `${v}`,
	},
	"stream.buffer_scale":{
		tooltip:`
		-bufsize <bitrate * scale>
		<br/>
		Optimal range (may vary by content): 1-2
		`,
		min:1,
		max:3,
		step:0.1,
		labelFormatter:(v) => `${v} x Max BR`,
	},
	"stream.segment_length":{
		// tooltip:"stuff",
		tooltip:`
		-hls_time <seconds>
		<br/>
		Minimum fragment length.
		`,
		min:1,
		max:10,
		step:0.1,
		labelFormatter:(v) => `${v}s`,
	},
	"stream.segment_type":{
		tooltip:`
		-hls_segment_type <type>
		<br/>
		fMP4 output is supported by both DASH and HLS, although platform support may vary
		`,
		options:Constants.segmentTypeOptions
	},
	"job.hardware_acceleration":{
		tooltip:`
		-hwaccel <mode> <br/>
		--c:v h264_nvenc <br/>
		Hardware dependent. Using encoder mode requires h264_nvenc.
		<br/>
		Large jobs require more VRAM.`,
		options:Constants.gpuOptions,
	},
	"output.overwrite_output":{
		type:"toggle",
		tooltip:"ffmpeg -y ..."
	}
};