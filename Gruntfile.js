'use strict';

module.exports = function (grunt) {
	grunt.registerTask('default', 'CSS Linter with reporter', function () {
		let fs = require('fs'),
		http = require('http'),
		ejs = require('ejs'),
		path = require('path'),
		stylelint = require('stylelint'),
		def = this.async(),
		options = this.options({
			files: 'scss/*.scss',
			syntax: 'scss',
			template: 'template.ejs',
			rules: require(process.cwd() + '/' + '.stylelintrc.json'),
			output: 'reports/csslinter.html'
		});

		stylelint.lint({
			config: options.rules,
			files: options.files,
			formatter: 'json',
			syntax: options.syntax
		}).then(data => {
			let reportOutput = ejs.render(fs.readFileSync(options.template, 'UTF8'), {
				title: 'SCSS Lint results',
				results: data.results
			});
			fs.writeFile(options.output, reportOutput , result => {
				if (result) {
					console.error('Error writing css lint report: ' + result);
				} else {
					console.log('Report done see at file:///' + process.cwd() + '/' + options.output);
				}
				def();
			});
		}).catch(error => {
			console.error('Error');
			console.error(error.stack);
		});
	});
};
