const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

let outputs = {
  worker: 'worker.js',
  client: 'public/index.js',
}

let SRC_PATH = path.join(__dirname, './src')
let TEST_PATH = path.join(__dirname, './test')
let CLIENT_PATH = path.join(__dirname, './client')

module.exports = {
  entry: {
    worker: './src/index.ts',
    client: './client/index.ts',
  },
  output: {
    filename: (pathData) => outputs[pathData.chunk.name],
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-module-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [SRC_PATH, TEST_PATH],
        options: {
          instance: 'service-worker',
        },
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [CLIENT_PATH],
        options: {
          instance: 'browser',
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public', to: 'public' }],
    }),
  ],
}
