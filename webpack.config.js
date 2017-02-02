const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (env) => {
  // Configuration in common to both client-side and server-side bundles
  const isDevBuild = !(env && env.prod);
  const sizeUp = (env && env.size);
  const sharedConfig = {
    stats: { modules: false },
    context: __dirname,
    resolve: { extensions: [ '.js', '.ts' ] },
    output: {
      filename: '[name].js',
      publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
    },
    module: {
      rules: [
        // ??? { test: /\.json$/, loader: 'json-loader' },
        { test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] },
        { test: /\.html$/, use: 'html-loader?minimize=false' },

        // Styles in /Components are loaded as text/string from the components
        { test: /\.css$/, include: [path.resolve(__dirname, "ClientApp/Components")], use: ['to-string-loader', 'css-loader'] },
        { test: /\.scss$/, include: [path.resolve(__dirname, "ClientApp/Components")], use: ['to-string-loader', 'css-loader', 'sass-loader'] },

        // Styles in /Styles are loaded straight into the page header
        { test: /\.css$/, include: [path.resolve(__dirname, "ClientApp/Styles")], use: ExtractTextPlugin.extract({ loader: ['css-loader'] }) },
        { test: /\.scss$/, include: [path.resolve(__dirname, "ClientApp/Styles")], use: ExtractTextPlugin.extract({ loader: ['css-loader', 'sass-loader'] }) },

        { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
      ]
    },
    plugins: [new CheckerPlugin(), new ExtractTextPlugin("styles.css")]
  };

  // Configuration for client-side bundle suitable for running in browsers
  const clientBundleOutputDir = './wwwroot/dist';
  const clientBundleConfig = merge(sharedConfig, {
    entry: { 'main-client': './ClientApp/boot-client.ts' },
    output: { path: path.join(__dirname, clientBundleOutputDir) },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./wwwroot/dist/vendor-manifest.json')
      })
    ].concat(isDevBuild ? [
      // Plugins that apply in development builds only
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map', // Remove this line if you prefer inline source maps
        moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
      })
    ] : [
      // Plugins that apply in production builds only
      new webpack.optimize.UglifyJsPlugin()
    ].concat( sizeUp ? new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../../ClientSize/main-client.html'
    }) : []) )
  });

  // Configuration for server-side (prerendering) bundle suitable for running in Node
  const serverBundleConfig = merge(sharedConfig, {
    resolve: { mainFields: ['main'] },
    entry: { 'main-server': './ClientApp/boot-server.ts' },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./ClientDist/vendor-manifest.json'),
        sourceType: 'commonjs2',
        name: './vendor'
      })
    ],
    output: {
      libraryTarget: 'commonjs',
      path: path.join(__dirname, './ClientDist')
    },
    target: 'node',
    devtool: isDevBuild ? 'inline-source-map' : 'hidden-source-map'
  });

  return [clientBundleConfig, serverBundleConfig];
}
