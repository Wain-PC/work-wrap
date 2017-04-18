// Karma configuration
// Generated on Wed Mar 29 2017 18:20:05 GMT+0300 (Russia TZ 2 Standard Time)

module.exports = function (config) {
	var configuration = {
		basePath: '',
		frameworks: ['mocha', 'sinon-chai'],
		files: [
			'node_modules/promise-polyfill/promise.min.js',
			'index.js',
			'test/test.js'
		],
		exclude: [],

		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},

		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE'],
		singleRun: true,
		concurrency: Infinity
	};

	if(process.env.TRAVIS) {
		configuration.browsers = ['PhantomJS', 'Firefox', 'Chrome_travis_ci'];
	}

	config.set(configuration);
};
