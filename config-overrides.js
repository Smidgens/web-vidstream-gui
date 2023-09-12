const { alias, aliasJest } = require("react-app-rewire-alias");

const aliasMap = {
	"@components": "src/components/",
	"@pages":"src/pages/"
};

// app modules
// <name> -> modules/@<name>
[
	"ui",
	"utils",
	"video",
].forEach(m => aliasMap[`@${m}`] = `modules/@${m}`);

[
	"ui/code"
].forEach(m => aliasMap[`@${m}`] = `modules/@${m.replace("/", "-")}`);

module.exports = function override(config) {
	alias(aliasMap)(config);
	return config;
};

module.exports.jest = aliasJest(aliasMap);