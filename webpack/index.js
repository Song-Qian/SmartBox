/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   webpack.config 入口配置
 */
var path = require('path');
var extractTextPlugin = require('extract-text-webpack-plugin');
var basicExtract =  new extractTextPlugin({ filename : "assets/Css/basic.css", allChunks: true });
var skinExtract = new extractTextPlugin({ filename: "assets/Css/Skin/skin-default.css", allChunks: true});
var entry = require("./entry");
var output = require("./output");
var rules = require("./rules");
var resolve = require("./resolve");
var devServer = require("./devServer");
var plugins = require("./plugins")

module.exports = {
  entry,
  output,
  module: {
    rules: [
      ...rules(basicExtract, skinExtract)
    ]
  },
  resolve,
  devServer,
  plugins: [
    basicExtract,
    skinExtract,
    ...plugins()
  ],
  performance: {
    hints: process.env.NODE_ENV === 'production' ? false : false
  },
  //生产时，请将此处的devtool改成false
  devtool: process.env.NODE_ENV === 'production' ? false : "source-map"
}