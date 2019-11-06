const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");
const path = require("path");
const webpackBaseConfig = require("./webpack.base.config.js");
const fs = require("fs");
const portfinder = require("portfinder");
const utils = require("./utils");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

fs.open("./src/config/env.js", "w", function(err, fd) {
  const buf = 'export default "development";';
  // fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
  fs.write(fd, buf, 0, "utf-8", function(err, written, buffer) {});
});

const devWebpackConfig = merge(webpackBaseConfig, {
  devtool: "#source-map",
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: "warning",
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join("/", "index.html")
        }
      ]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: "localhost",
    port: 8080,
    open: false,
    overlay: true
      ? {
          warnings: false,
          errors: true
        }
      : false,
    publicPath: "/",
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      filename: "vendors.js"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/template/index.ejs",
      inject: false
    }),
    new CopyWebpackPlugin([
      {
        from: "./static",
        to: "static",
        ignore: [".*"]
      },
      {
        from: "./node_modules/cesium/Build/Cesium/Workers",
        to: "Workers"
      },
      {
        from: path.join("./node_modules/cesium/Source", "Assets"),
        to: "Assets"
      },
      {
        from: path.join("./node_modules/cesium/Source", "Widgets"),
        to: "Widgets"
      },
      {
        from: "src/images",
        to: "images"
      }
    ]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify("../")
    })
  ]
});
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = 8080;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
            ]
          },
          onErrors: true ? utils.createNotifierCallback() : undefined
        })
      );

      resolve(devWebpackConfig);
    }
  });
});
