import webpack from 'webpack';
import baseConfig from './webpack.config.babel';

let config = Object.create(baseConfig);

// noinspection JSUnresolvedFunction
config.plugins = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    }
  })
];

config.output.filename = '[name].min.js';

// noinspection JSUnusedGlobalSymbols
export default config;
