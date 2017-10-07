var webpack = require('webpack');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
	entry: "./src/client/app.js",
	output: {
		path: "/Users/khaymahd/workspace/pet/lina/temp",
		filename: 'bundle.js'
	},
	module: {
		 rules: [{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		 },{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
				options: { presets: ['es2015'] }
			}],
		 }]
	},
	plugins: PROD ? [
	    new webpack.optimize.UglifyJsPlugin({
	      compress: { warnings: false }
	    })
	] : []
};
