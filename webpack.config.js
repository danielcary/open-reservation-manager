const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
    entry: './webapp/App.tsx',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-typescript",
                            "@babel/preset-react"
                        ],
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    plugins: [new HtmlWebpackPlugin({ filename: 'index.html' })],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'app.js',
    },
},

];
