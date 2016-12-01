module.exports = function (config) {
	config.set({

		basePath: '',

		frameworks: ['jasmine'],

		files: [
			'node_modules/core-js/client/shim.js',

			// System.js for module loading
			'node_modules/systemjs/dist/system-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',

			// Zone.js dependencies
			'node_modules/zone.js/dist/zone.js',
			'node_modules/zone.js/dist/proxy.js',
			'node_modules/zone.js/dist/sync-test.js',
			'node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/zone.js/dist/async-test.js',
			'node_modules/zone.js/dist/fake-async-test.js',

			// RxJs.
			{ pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
			{ pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

			{ pattern: 'karma-test-shim.js', included: true, watched: true },

			// paths loaded via module imports
			// Angular itself
			{ pattern: 'node_modules/@angular/**/*.js', included: false, watched: true },
			{ pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: true },

			// Our built application code
			{ pattern: 'index.js', included: false, watched: true },
			{ pattern: 'src/**/*.js', included: false, watched: true },

			// paths to support debugging with source maps in dev tools
			{ pattern: 'src/**/*.ts', included: false, watched: false },
		],

		htmlReporter: {
			outputDir: 'karma_html', // where to put the reports
			reportName: 'summary', // report summary filename; browser info by default
		},

		preprocessors: {
			'src/**/!(*spec|*mock).js': ['coverage']
		},

		coverageReporter: {
			type: 'html',
			dir: 'karma_html/',
			subdir : 'coverage'
		},

		reporters: ['progress', 'html', 'coverage'],
		plugins: ['karma-jasmine', 'karma-html-reporter', 'karma-chrome-launcher', 'karma-coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chromium'],
		singleRun: true
	})
}
