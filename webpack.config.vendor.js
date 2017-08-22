const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

module.exports = env => {
  const extractCSS = new ExtractTextPlugin("vendor.css");
  const isDevBuild = !(env && env.prod);
  const cssLoader = isDevBuild ? "css-loader" : "css-loader?minimize";
  const sizeUp = env && env.size;
  const sharedConfig = {
    stats: { modules: false },
    resolve: { extensions: [".js"] },
    module: {
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
          use: "url-loader?limit=100000"
        },
        {
          test: require.resolve("jquery"),
          use: [
            {
              loader: "expose-loader",
              options: "jQuery"
            },
            {
              loader: "expose-loader",
              options: "$"
            }
          ]
        }
      ]
    },
    entry: {
      vendor: [
        "@angular/common",
        "@angular/compiler",
        "@angular/core",
        "@angular/http",
        "@angular/forms",
        "@angular/platform-browser",
        "@angular/platform-browser-dynamic",
        "@angular/router",
        "@angular/platform-server",
        "angular2-universal",
        "angular2-universal-polyfills",
        "bootstrap",
        "bootstrap/dist/css/bootstrap.css",
        "font-awesome/css/font-awesome.min.css",
        "./node_modules/summernote/dist/summernote.css",
        "./node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.css",
        "es6-shim",
        "es6-promise",
        "event-source-polyfill",
        "expose-loader?jQuery!jquery",
        "./node_modules/signalr/jquery.signalR.js",
        "zone.js"
      ]
    },
    output: {
      publicPath: "/dist/",
      filename: "[name].js",
      library: "[name]_[hash]"
    },
    plugins: [
      new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
      new webpack.ContextReplacementPlugin(
        /\@angular\b.*\b(bundles|linker)/,
        path.join(__dirname, "./ClientApp")
      ), // Workaround for https://github.com/angular/angular/issues/11580
      new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
    ]
  };

  const clientBundleConfig = merge(sharedConfig, {
    output: { path: path.join(__dirname, "wwwroot", "dist") },
    module: {
      rules: [
        { test: /\.css(\?|$)/, use: extractCSS.extract({ use: cssLoader }) }
      ]
    },
    plugins: [
      extractCSS,
      new webpack.DllPlugin({
        path: path.join(__dirname, "wwwroot", "dist", "[name]-manifest.json"),
        name: "[name]_[hash]"
      }),
      new DuplicatePackageCheckerPlugin()
    ].concat(
      isDevBuild
        ? []
        : [new webpack.optimize.UglifyJsPlugin()].concat(
            sizeUp
              ? new BundleAnalyzerPlugin({
                  analyzerMode: "static",
                  reportFilename: "../../ClientSize/vendor.html"
                })
              : []
          )
    )
  });

  const serverBundleConfig = merge(sharedConfig, {
    target: "node",
    resolve: { mainFields: ["main"] },
    output: {
      path: path.join(__dirname, "ClientDist"),
      libraryTarget: "commonjs2"
    },
    module: {
      rules: [{ test: /\.css(\?|$)/, use: ["to-string-loader", cssLoader] }]
    },
    entry: { vendor: ["aspnet-prerendering"] },
    plugins: [
      new webpack.DllPlugin({
        path: path.join(__dirname, "ClientDist", "[name]-manifest.json"),
        name: "[name]_[hash]"
      })
    ]
  });
  return [clientBundleConfig, serverBundleConfig];
};
