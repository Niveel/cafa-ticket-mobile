const { withNativeWind } = require("nativewind/metro");
const {
    getSentryExpoConfig
} = require("@sentry/react-native/metro");
const path = require("path");

const config = getSentryExpoConfig(__dirname);

// 👇 make CSS support explicit
if (!config.resolver.sourceExts.includes("css")) {
    config.resolver.sourceExts.push("css");
}

config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    "uc.micro": path.resolve(__dirname, "vendor/uc.micro"),
};

module.exports = withNativeWind(config, {
    input: "./global.css",
});
