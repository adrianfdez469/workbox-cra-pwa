const workboxPlugin = require('workbox-webpack-plugin');
const rewireUnplug = require('react-app-rewire-unplug');
const path = require('path');

module.exports = {
    webpack: function(config, env) {

        config = rewireUnplug(config, env, {
            pluginNames: ['GenerateSW', 'SWPrecacheWebpackPlugin']
        });
        config.plugins.push(new workboxPlugin.InjectManifest({
            swSrc: path.join(__dirname, 'public', 'sw.js'),
            swDest: 'sw.js'
        }))
        return config;
    }
}