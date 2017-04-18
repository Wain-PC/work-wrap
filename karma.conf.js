// Karma configuration
// Generated on Wed Mar 29 2017 18:20:05 GMT+0300 (Russia TZ 2 Standard Time)

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'sinon-chai'],
		files: [
			'node_modules/promise-polyfill/promise.min.js',
			'index.js',
			'test/test.js'
		],
		exclude: [],
		reporters: ['progress'],

		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE'],
		singleRun: true,
		concurrency: Infinity
	})
};
