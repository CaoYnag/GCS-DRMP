const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "./"),
  entry: {
    main: "./src/main",
    vendors: "./src/vendors"
  },
  output: {
    path: path.join(__dirname, "./dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              loaders: {
                less: ExtractTextPlugin.extract({
                  use: [
                    "css-loader?minimize",
                    "autoprefixer-loader",
                    "less-loader"
                  ],
                  fallback: "vue-style-loader"
                }),
                css: ExtractTextPlugin.extract({
                  use: ["css-loader", "autoprefixer-loader", "less-loader"],
                  fallback: "vue-style-loader"
                })
              }
            }
          },
          {
            loader: "iview-loader",
            options: {
              prefix: false
            }
          }
        ]
      },
      {
        test: /iview\/.*?js$/,
        loader: "babel-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader?minimize", "autoprefixer-loader"],
          fallback: "style-loader"
        })
      },
      {
        test: /\.less/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader?minimize", "autoprefixer-loader", "less-loader"],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: "url-loader?limit=1024"
      },
      {
        test: /\.(html|tpl)$/,
        loader: "html-loader"
      }
    ],
    unknownContextCritical: false,
    unknownContextRegExp: /^.\/.*$/
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue: "vue/dist/vue.esm.js",
      cesium: path.resolve(__dirname, "./node_modules/cesium/Source")
    }
  }
};
