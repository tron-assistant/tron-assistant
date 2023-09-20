const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');

var base_config = {
  entry: {
    index: './src/index.tsx',
    contentScript: './src/extension-scripts/contentScript.js',
    background: './src/extension-scripts/background.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      chunks: ['index'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          filter: (filepath) => !filepath.endsWith('index.html'),
        },
      ],
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({})],
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      util: require.resolve('util/'),
    },
  },
};

module.exports = (env, argv) => {
  let config;
  if (argv.mode === 'development') {
    config = Object.assign({}, base_config, {
      mode: 'development',
      devtool: 'inline-source-map',
      watch: true,
      output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
      },
      plugins: [
        ...base_config.plugins,
        new Dotenv({
          path: `./.env.development`,
        }),
      ],
    });
  } else if (argv.mode === 'production') {
    config = Object.assign({}, base_config, {
      mode: 'production',
      output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
      },
      plugins: [
        ...base_config.plugins,
        new Dotenv({
          path: `./.env.production`,
        }),
      ],
    });
  }

  return config;
};
