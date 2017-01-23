// Load required polyfills and testing libraries
import "angular2-universal-polyfills";
import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy.js";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import * as testing from "@angular/core/testing";
import * as testingBrowser from "@angular/platform-browser-dynamic/testing";

// There"s no typing for the `__karma__` variable. Just declare it as any
declare var __karma__: any;
declare var require: any;

__karma__.loaded = function () {
	// Prevent Karma from running prematurely
};

// First, initialize the Angular testing environment
testing.getTestBed().initTestEnvironment(
	testingBrowser.BrowserDynamicTestingModule,
	testingBrowser.platformBrowserDynamicTesting()
);

// Then we find all the files
const context = require.context(".", true, /\.spec\.ts$/); // Just the spec files.

// And load the modules
context.keys().map(context);

// Finally, start Karma to run the tests
__karma__.start();
