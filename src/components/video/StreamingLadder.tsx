import { FC, useState } from "react";
import * as Utils from "./utils";
import * as Manifest from "./manifest";
import { GUID } from "@utils";
import {
	BitrateMode,
	ResolutionPresets,
	VideoData,
	SegmentType,
	GPUMode,
	H264Preset,
	ConfigValues,
	ResShorthands,
} from "./types";
import { SForm } from "../form";
import { useMemo } from "react";
import { Code as CodeBlock } from "../Code";
import styled from "styled-components";
import { useEffect } from "react";
import {
	FORM_PROPS,
} from "./form-props";

const DEFAULT_VALUES:Readonly<ConfigValues> = {
	"source_video.path":"",
	"source_video.resolution":ResShorthands.Res4K,
	"source_video.bitrate":20 * 1000000,
	"source_video.framerate":24,
	"encoding.h264_preset":H264Preset.Slow,
	"variants.sizes":ResolutionPresets.Video360,
	"variants.bitrates":BitrateMode.SimpleSpaced2,
	"variants.initial_bitrate_factor":0.75,
	"stream.buffer_scale":1.5,
	"stream.segment_length":1,
	"stream.segment_type":SegmentType.MPEGTS,
	"constraints.skip_variants":[],
	"job.hardware_acceleration":GPUMode.None,
	"output.overwrite_output":true,
};

export const StreamingLadder:FC = () => {

	const getVariantIdentifier = (v:VideoData) => {
		return `s=${v.w}x${v.h},br=${v.br},fr=${v.fr}`;
	};

	const isExcluded = (v:VideoData) => {
		const k = getVariantIdentifier(v);
		const ev = parsedFormData["constraints.skip_variants"];
		const i = ev.findIndex(vv => vv === k);
		return i > -1;
	};

	const ivalue = JSON.stringify(DEFAULT_VALUES);

	const [ formData, setFormData ] = useState(ivalue);
	const [ lastSave, setLastSave ] = useState(0);

	const parsedFormData = useMemo<ConfigValues>(() => {
		return JSON.parse(formData);
	}, [ formData ]);

	const mfConfig = useMemo(() => {
		const [ w, h ] = parsedFormData["source_video.resolution"]
		.split("x")
		.map(v => Number(v));
		return {
			input:{
				w,
				h,
				br:parsedFormData["source_video.bitrate"],
				fr:parsedFormData["source_video.framerate"]
			},
			sizeMode:parsedFormData["variants.sizes"],
			bitrateMode:parsedFormData["variants.bitrates"],
		};
	}, [ parsedFormData ]);

	const variants = useMemo(() => {

		const brFactor = parsedFormData["variants.initial_bitrate_factor"];

		return Utils.getVideoVariants({
			source:mfConfig.input,
			scaleMode:mfConfig.sizeMode,
			brMode:mfConfig.bitrateMode,
			brFactor:brFactor,
			floor:300
		})
	}, [ mfConfig ]);

	const filteredVariants = useMemo(() => {
		return variants.filter(v => {
			return !isExcluded(v);
		})
	}, [ variants ]);

	const totalVariantKeys = useMemo<string[]>(() => {
		return variants.map(v => getVariantIdentifier(v));
	}, [ parsedFormData["constraints.skip_variants"] ]);

	const configPreview = useMemo(() => {
		const skipped = parsedFormData["constraints.skip_variants"].filter(v => {
			return totalVariantKeys.includes(v);
		});
		return JSON.stringify({
			...parsedFormData,
			"constraints.skip_variants":skipped,
		}, null, "\t");
	}, [ parsedFormData ]);

	const saveHandler = () => {
		const t =  Date.now();
		if(t < lastSave + 100){ return; }
		setLastSave(t);
	};

	useEffect(() => saveHandler(), [ formData ])

	const toggleExcludedVariant = (v:VideoData) => {
		const ev = parsedFormData["constraints.skip_variants"];
		const k = getVariantIdentifier(v);
		const i = ev.findIndex(vv => vv === k);
		if(i < 0){
			ev.push(k);
		}
		else {
			ev.splice(i, 1);
		}
		handleOnValues(parsedFormData);
	};

	const handleOnValues = (v:any) => {
		setFormData(JSON.stringify(v));
	};

	const mfcmd = Manifest.getManifestCommand({
		videoPath:parsedFormData["source_video.path"],
		variants:filteredVariants,
		segmentLength:parsedFormData["stream.segment_length"],
		bufferScale:parsedFormData["stream.buffer_scale"],
		segmentType:parsedFormData["stream.segment_type"],
		preset:parsedFormData["encoding.h264_preset"],
		gpuMode:parsedFormData["job.hardware_acceleration"],
		bitrateFactor:parsedFormData["variants.initial_bitrate_factor"],
		flags:{
			overwriteOutput:parsedFormData["output.overwrite_output"]
		}
	});

	const headers = [
		"Resolution",
		"Target Bitrate (bps)",
		"Framerate",
		"BPP (Bits Per Pixel)",
		"Skip",
	];

	const theaders = headers.map(ht => {
		return (
			<th key={ GUID.getGUID() } className="text-center">
				{ ht }
			</th>
		);
	});

	const trows = variants.map(v => {
		const bpp = Utils.calculateBPP(v.w, v.h, v.br, v.fr);

		const skip = isExcluded(v);

		const cols = [
			`${v.w} x ${v.h}`,
			Utils.formatBitrate(Utils.roundValue(v.br, 0)),
			v.fr,
			Utils.roundValue(bpp, 3),
			(
				<div className="d-flex">
					<input
					className="form-check-input shadow-none mx-auto"
					type="checkbox"
					checked={ skip }
					onChange={ () => toggleExcludedVariant(v) }
					/>
				</div>
			)
		]
		.map(c => (
			<td key={ GUID.getGUID() }>
				{ c }
			</td>
		));

		const cls = `${ skip ? "muted" : "" }`;

		return (
			<LadderRow
			key={ GUID.getGUID() }
			className={ cls }
			>
				{ cols }
			</LadderRow>
		);
	});

	return (
		<div>
			<SForm
			form={ FORM_PROPS }
			values={ parsedFormData }
			onChange={ handleOnValues }
			/>
			<div className="my-3"/>
			<table className="table table-bordered border-dark">
				<thead>
					<tr>
						{ theaders }
					</tr>
				</thead>
				<tbody>
					{ trows }
				</tbody>
			</table>

			<CodeBlock
			text={ mfcmd }
			/>

			<CodeBlock
			text={ configPreview }
			/>

		</div>
	);
};


const LadderRow = styled.tr`
	&.muted {
		td {
			background:rgba(0,0,0,0.05);
		}
		td:not(:last-child){
			color:rgba(0,0,0,0.3);
		}
	}
`;