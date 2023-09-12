// SForm.tsx
// configurable form

import { Icon } from "@ui";
import { FC } from "react";
import styled from "styled-components";
import { GUID } from "@utils";
import { FormSection } from "./FormSection";
import ReactTooltip from "react-tooltip";

export type FormProp = {
	label?:string;
	tooltip?:string;
	placeholder?:string;
	options?:{
		text?:string;
		value:any;
	}[];
	group?:string;
	type?:"number"|"toggle";
	min?:number;
	max?:number;
	step?:number;
	labelFormatter?:(v:any) => string;
	presets?:Record<string,any>;
}

enum DrawerType {
	Unknown = "unknown",
	Dropdown = "dropdown",
	Slider = "slider",
	Number = "number",
	Toggle = "toggle"
};

export const SForm:FC<{
	form:Record<string,FormProp>;
	values:Record<string,any>;
	onChange?:(v:Record<string,any>) => void;
}> = (props) => {

	const handlePropChange = (k:string, v:any) => {
		props.values[k] = v;
		props.onChange && props.onChange(props.values);
	};

	const gprops = groupProps(props.form);

	const ddprops = gprops.map(group => {

		const glabel = labelizeKey(group.key);

		const ggprops = Object.keys(group.props).map(pk => {
			const prop = group.props[pk];
			const Drawer = getDrawerForProp(prop);
			const value = props.values[pk];
			const label = inferPropLabel(pk, prop);

			const tooltip = prop.tooltip;

			const handleChange = (v:any) => {
				handlePropChange(pk, v);
			};

			return (
				<div
				key={ pk }
				className="row my-2"
				>
					<div className="col-md-2">
						{/* <label htmlFor={ pk }>
							{ label }
						</label> */}
						<FormLabel
						fieldId={ pk }
						text={ label }
						tooltip={ tooltip }
						/>
					</div>
					<div className="col-md-10">
						<Drawer
						fieldId={ pk }
						config={ prop }
						value={ value }
						onChange={ handleChange }
						/>
					</div>
				</div>
			);
		});

		return (
			<FormSection
			title={ glabel }
			key={ group.key }
			className="mb-3"
			>
				{ ggprops }
			</FormSection>
		);
	});

	return (
		<div>
			{ ddprops }
		</div>
	);
};

const groupProps = (props:Record<string,FormProp>) => {

	const m:Record<string,Record<string,FormProp>> = {};

	const r:{
		key:string;
		props:Record<string,FormProp>;
	}[] = [];

	Object.keys(props)
	.forEach(k => {
		const p = props[k];
		const g = inferPropGroup(k, p);
		if(!m[g]){
			m[g] = {};
			r.push({
				key:g,
				props:m[g],
			});
		}
		m[g][k] = p;
	});
	return r;
};

const labelizeKey = (k:string) => {
	return k.split("_")
	.map(w => `${w[0].toUpperCase()}${w.slice(1)}`)
	.join(" ");
};

const inferPropLabel = (key:string, prop:FormProp) => {
	const [ _, name ] = key.split(".");
	return labelizeKey(name);
};

const inferPropGroup = (key:string, prop:FormProp) => {
	if(prop.group){
		return prop.group;
	}
	const [ prefix ] = key.split(".");
	return prefix;
};

const getDrawerForProp = (p:FormProp) => {
	return getDrawerComponent(inferDrawerType(p));
};

const getDrawerComponent = (t:DrawerType):any => {
	return typeDrawers[t] || FormInput
};

const inferDrawerType = (p:FormProp):DrawerType => {
	const ks = Object.keys(typeResolvers);
	const i = ks.findIndex(k => typeResolvers[k](p));
	return i > -1 ? ks[i] as DrawerType : DrawerType.Unknown;
};

const typeResolvers:Record<string, TypeResolver> = {
	[DrawerType.Dropdown]:(p) => Boolean(p.options),
	[DrawerType.Slider]:(p) => p.min !== undefined && p.max !== undefined,
	[DrawerType.Number]:(p) => p.type === "number",
	[DrawerType.Toggle]:(p) => p.type === "toggle",
}

type TypeResolver = (p:FormProp) => boolean;

const FormLabel:FC<{
	fieldId?:string;
	text?:string;
	className?:string;
	tooltip?:string;
}> = (props) => {

	const cls = `${props.className} form-label`;
	
	const tt = props.tooltip ? (
		<>
			<span className="mx-1"/>
			<IconTooltip text={ props.tooltip }/>
		</>
	) : null;

	return (
		<label className={ cls } htmlFor={ props.fieldId }>
			{ props.text }
			{ tt }
		</label>
	);
};

const IconTooltip:FC<{
	text:string;
}> = (props) => {

	return (
		<span
		data-tip={ props.text }
		data-multiline
		// data-html
		data-class="text-left"
		>
			<ReactTooltip/>
			<Icon name="information-outline" className="text-secondary"/>
		</span>
	)
};


const FormSlider:FC<{
	fieldId:string;
	config:{
		min:number;
		max:number;
		step?:number;
		presets?:Record<string,number>;
		labelFormatter?:(v:number) => string;
	},
	value:number;
	onChange:(v:number) => void;
}> = (props) => {


	const vlabel = !props.config.labelFormatter ? null : (
		<ValueLabel>
			{ props.config.labelFormatter(props.value) }
		</ValueLabel>
	);

	return (
		<div>
			<input
			id={ props.fieldId }
			type="range"
			min={ props.config.min }
			max={ props.config.max }
			step={ props.config.step }
			value={ props.value }
			className="form-range shadow-nonex"
			onChange={(e) => props.onChange(Number(e.target.value))}
			/>
			{ vlabel }
		</div>
	);
};

const FormDropdown:FC<{
	fieldId:string;
	config:{
		options:{
			text?:string;
			value:any;
		}[];
	};
	value?:any;
	onChange?:(v:any) => void;
}> = (props) => {

	const doptions = props.config.options.map(o => {
		const t = o.text || o.value.toString();
		return (
			<option
			value={ o.value }
			key={ GUID.getGUID() }
			>
				{ t }
			</option>
		);
	});

	return (
		<select
		id={ props.fieldId }
		value={ props.value }
		onChange={e => props.onChange && props.onChange(e.target.value)}
		className="form-select shadow-nonex">
			{ doptions }
		</select>
	);
};

const FormInput:FC<{
	fieldId:string;

	config:{
		placeholder?:string;	
	},

	value?:string;
	onChange?:(v:string) => void;
}> = (props) => {
	return (
		<input
		id={ props.fieldId }
		className="form-control"
		placeholder={ props.config.placeholder }
		value={ props.value }
		onChange={e => props.onChange && props.onChange(e.target.value)}
		/>
	);
};

const FormNumber:FC<{
	fieldId:string;
	config:{
		presets?:Record<string,number>;
	}
	value:number;
	onChange?:(v:number) => void;
}> = (props) => {


	const min = 0;
	
	const ppicker = props.config.presets ? (
		<PresetPicker
		presets={ props.config.presets }
		onPick={ v => props.onChange && props.onChange(v) }
		/>
	) : null;


	return (
		<div className="input-group">
			<input
			id={ props.fieldId }
			className="form-control shadow-nonex"
			type="number"
			min={ min }
			value={ props.value }
			onChange={ (e) => props.onChange && props.onChange(Number(e.target.value))}
			/>
			{ ppicker }
		</div>
	);
};

const FormSwitch:FC<{
	fieldId:string;
	value:boolean;
	onChange?:(v:boolean) => void;
}> = (props) => {

	const handleToggle = () => {
		props.onChange && props.onChange(!props.value);
	};

	return (
		
		<div className="form-check form-switch"
		>
			<input
			type="checkbox"
			id={ props.fieldId }
			className="form-check-input"
			checked={ props.value }
			onChange={handleToggle}
			style={{
				cursor:"pointer"
			}}
			/>
		</div>
	);
};


const typeDrawers:Record<string,any> = {
	[DrawerType.Slider]:FormSlider,
	[DrawerType.Dropdown]:FormDropdown,
	[DrawerType.Number]:FormNumber,
	[DrawerType.Toggle]:FormSwitch,
};

const ValueLabel = styled.small`
	margin:0;
	text-align:center;
	width:100%;
`;

const PresetPicker:FC<{
	presets:Record<string,any>;
	onPick:(v:any) => void;
}> = (props) => {

	const handlePick = (v:any) => {
		props.onPick(v);
	};

	const doptions = Object.keys(props.presets).map(k => {
		return (
			<li
			key={ GUID.getGUID() }
			>
				<button
				className="dropdown-item btn-sm"
				onClick={ () => handlePick(props.presets[k]) }
				>
					{ k }
				</button>
			</li>
		);
	});

	return (
		<>
			<button
			className="shadow-nonex btn btn-sm btn-outline-secondary dropdown-toggle"
			type="button"
			data-bs-toggle="dropdown"
			aria-expanded="false"
			>
				<Icon name="cog"/>
			</button>
			<ul className="dropdown-menu">
				{ doptions }
			</ul>
		</>
	);
};