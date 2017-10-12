import webpack from 'webpack';
import path from 'path';

// noinspection JSUnresolvedFunction, JSUnusedGlobalSymbols
export default {
  entry: {
    'jquery.parallax': './src/jquery.parallax.js',
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [require.resolve('babel-preset-es2015'), { 'modules': false }]
            ]
          }
        },
        exclude: /(node_modules|bower_components)/,
      },
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      'bower_components',
    ],
  },
  output: {
    path: path.resolve(__dirname,  'dist'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
};