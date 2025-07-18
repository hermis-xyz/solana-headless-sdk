import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import webpack from 'webpack';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export default {
  mode: 'production',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/solana-headless-sdk/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    alias: {
      '@solana/web3': '@solana/web3.js',
      
      './polyfills/index.js': path.resolve(__dirname, '../../packages/core/src/polyfills/index.ts'),
      
      '@hermis/solana-headless-react': path.resolve(__dirname, '../../packages/react-core/src'),
      '@hermis/solana-headless-core': path.resolve(__dirname, '../../packages/core/src'),
      '@hermis/solana-headless-adapter-base': path.resolve(__dirname, '../../packages/adapter-base/src')
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/index.js'),
      fs: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      assert: require.resolve('assert/'),
      constants: require.resolve('constants-browserify'),
      util: require.resolve('util/'),
      url: require.resolve('url/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../../packages/react-core/src'),
          path.resolve(__dirname, '../../packages/core/src'),
          path.resolve(__dirname, '../../packages/adapter-base/src')
        ],
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                jsx: 'react-jsx'
              }
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: [
          path.resolve(__dirname, '../../packages/core/src'),
          path.resolve(__dirname, '../../packages/react-core/src'),
          path.resolve(__dirname, '../../packages/adapter-base/src')
        ],
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: /from\s+['"]([^'"]+)\.js['"]/g,
                  replace: 'from "$1"'
                },
                {
                  search: /import\s+(['"])@solana\/web3\1/g,
                  replace: 'import $1@solana/web3.js$1'
                },
                {
                  search: /from\s+(['"])@solana\/web3\1/g,
                  replace: 'from $1@solana/web3.js$1'
                }
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: './index.webpack.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/index.css', to: 'styles.css' },
        { from: './public/vite.svg', to: 'vite.svg' },
      ],
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'global': 'globalThis',
    })
  ],
  devtool: 'source-map'
};