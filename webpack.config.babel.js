import webpack from 'webpack';
import path from 'path';

// noinspection JSUnresolvedFunction, JSUnusedGlobalSymbols
export default {
  entry: {
    'jquery.parallax': './src/main.js',
  },
  externals: {
    // don't bundle jquery
    jquery: 'jQuery',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|dist|test)/,
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|dist|test)/,
        loader: 'babel-loader!ts-loader',
      },
    ]
  },
  resolve: {
    modules: ['node_modules', 'src', 'build'],
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
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
