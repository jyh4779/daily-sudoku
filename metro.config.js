// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
	const defaultConfig = await getDefaultConfig(__dirname);
	const { assetExts, sourceExts } = defaultConfig.resolver;

	return mergeConfig(defaultConfig, {
		transformer: {
			babelTransformerPath: require.resolve('react-native-svg-transformer')
		},
		resolver: {
			// png, jpg 등 기존 assetExts는 그대로 유지하면서 svg만 source로 이동
			assetExts: assetExts.filter(ext => ext !== 'svg'),
			sourceExts: [...sourceExts, 'svg']
		}
	});
})();
