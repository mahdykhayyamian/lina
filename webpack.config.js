module.exports = {
	entry: "./src/client/app.js",
	output: {
		path: "./temp",
		filename: "bundle.js"
	},
	module: {
		loaders: [{
			test:/\.css$/,
			loader: "style!css" 
		},{ 
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}]
	}
};
