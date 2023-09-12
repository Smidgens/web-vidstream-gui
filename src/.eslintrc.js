
const rules = {};

const disableRule = (plugin, r, v) => rules[`${plugin}/${r}`] = v;
const disableRules = (plugin, arr, v) => arr.forEach(r => disableRule(plugin, r, v));

const disabledRules = {
	"@typescript-eslint":[
		"no-unused-vars",
	],
	"react-hooks":[
		"exhaustive-deps",
	],
}

Object.keys(disabledRules)
.forEach(k => disableRules(k, disabledRules[k], "off"))

module.exports = {
	extends: [
		"react-app",
	],
	rules,
};