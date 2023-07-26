const path = require('path');

module.exports = {
    mode: 'development',
    entry: "/src/app.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
        open: true
    },
    devtool: 'source-map',
};