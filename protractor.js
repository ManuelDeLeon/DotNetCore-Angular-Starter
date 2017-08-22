require("babel-core/register");
exports.config = {
  allScriptsTimeout: 99999,

  // The address of a running selenium server.
  seleniumAddress: "http://localhost:4444/wd/hub",

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      args: ["--headless"]
    }
  },

  baseUrl: "http://localhost:5000/",

  framework: "jasmine",

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ["ClientTests/*.e2e.js"],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true,
    includeStackTrace: true
  },
  params: {
    logon: {
      username: "MCAdmin",
      password: "MCAdmin"
    }
  }
};
