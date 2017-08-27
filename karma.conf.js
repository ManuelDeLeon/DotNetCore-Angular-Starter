// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
var path = require("path");
var runCodeCoverage = process.argv.indexOf("--env.coverage") >= 0;
var webpackConfig = require("./webpack.config.js")().filter(
  config => config.target !== "node"
);
var reporters = ["progress"];
var bootFile = "./ClientApp/boot-tests.ts";
if (runCodeCoverage) {
  bootFile = "./ClientApp/boot-coverage.ts";
  reporters.push("karma-remap-istanbul");
  webpackConfig[0].module.rules.push({
    test: /(?:^|[^LoanDTO])\.ts$/,
    include: [path.resolve(__dirname, "./ClientApp")],
    use: "sourcemap-istanbul-instrumenter-loader?force-sourcemap=true",
    exclude: [/\.spec\.ts$/],
    enforce: "post"
  });
}

module.exports = function(config) {
  config.set({
    basePath: ".",
    frameworks: ["jasmine"],
    files: ["./wwwroot/dist/vendor.js", bootFile],
    preprocessors: {
      [bootFile]: ["webpack"]
    },
    reporters: reporters,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless"],
    mime: { "application/javascript": ["ts", "tsx"] },
    singleRun: false,
    webpack: webpackConfig,
    webpackMiddleware: { stats: "errors-only" },
    remapIstanbulReporter: {
      reports: {
        html: "./ClientCoverage"
      }
    },
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--no-sandbox",
          "--headless",
          "--disable-gpu",
          // Without a remote debugging port, Google Chrome exits immediately.
          " --remote-debugging-port=9222"
        ]
      }
    }
  });
};
