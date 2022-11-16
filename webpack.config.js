const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: {
            test: /\.scss$/,
            use: ['style-loader', 'scc-loader', 'sass-loader']
        }
    }
}