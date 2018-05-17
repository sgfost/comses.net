const webpack = require('webpack');
const stringify = require('stringify-object');

const externalWebpackConfig = require('./webpack.conf');
const webpackConfig = {};
webpackConfig['module'] = externalWebpackConfig['module'];
webpackConfig['resolve'] = externalWebpackConfig['resolve'];
webpackConfig['plugins'] = externalWebpackConfig['plugins'].filter(plugin =>
    plugin instanceof webpack.DefinePlugin || plugin instanceof webpack.ProvidePlugin);
webpackConfig['devtool'] = 'inline-source-map';

console.log(stringify({resolve: webpackConfig.resolve, module: webpackConfig.module, devtool: webpackConfig.devtool}));

module.exports = function (config) {
    config.set({
        files: [
            {pattern: 'src/**/*.spec.ts', watched: false}
        ],
        frameworks: ['mocha', 'chai', 'sinon'],
        preprocessors: {
            'src/**/*.spec.ts': ['webpack', 'sourcemap']
        },
        proxies: {
            '': {
                'target': 'http://cms:8000/',
                'changeOrigin': true
            }
        },
        webpack: webpackConfig,
        client: {
            captureConsole: true
        },
        reporters: ['mocha', 'coverage'],
        browsers: ['ChromeCustom'],
        singleRun: true,

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

    	customLaunchers: {
                ChromeCustom: {
                    base: 'ChromeHeadless',
                    flags: ['--no-sandbox']
                }       
    	},
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
	    crossOriginAttribute: false
    });
};
