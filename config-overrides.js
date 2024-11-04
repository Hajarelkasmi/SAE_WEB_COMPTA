const webpack = require('webpack');

module.exports = function override(config, env) {
    // Ajouter les polyfills nécessaires
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "process": require.resolve("process/browser"),
        "vm": require.resolve("vm-browserify"),
        "process": require.resolve('process/browser'),
        "buffer": require.resolve('buffer/'),
    };

    // Ajouter les plugins pour gérer process
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    );

    return config;
};
