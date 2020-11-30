const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: {
        app: path.join(__dirname, 'src', 'index.tsx')
    },
    target: 'web',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            // {
            //     test: /\.(png|jpg|gif)$/i,
            //     use: [{
            //         loader: 'url-loader',
            //         options: {
            //             limit: 8192,
            //         },
            //     }, ],
            // },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.PNG$|\.svg$|\.woff(2)?$|\.ttf$|\.eot$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            // filename: './public/index.html',
            favicon: './src/favicon.ico'
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        // new WebpackPwaManifest({
        //     name: 'Broccoli & Co.',
        //     short_name: 'manifest',
        //     description: 'Broccoli & Co. Official Website',
        //     background_color: '#ffffff',
        //     crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
        //     icons: [{
        //         src: path.resolve('src/broccoli.png'),
        //         sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        //     }, ]
        // })
    ]
}