/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   生产依赖插件配置
 */
var htmlPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = function() {
    var htmlPlugins = new htmlPlugin({
        title : '智能监控站运维管理软件',
        filename : './index.html',
        template : path.resolve(__dirname, '../', 'index.html'),
        favicon : false,
        chunks : ['vue-all', 'element-ui', 'echarts',  'moment', 'lodash', 'ol', 'xlsx', 'app', 'utils', 'load']
    });

    var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
        name : ['vue-all', 'moment', 'lodash', 'element-ui', 'echarts',  'ol', 'xlsx', 'app', 'utils', 'load'],
        minChunks : 2
    });

    var bannerPlugin = new webpack.BannerPlugin({
        banner : `Developer :   SongQian
Time    :   2019-04-16
eMail   :   onlylove1172559463@vip.qq.com
Description :   武汉微创光电股份有限公司 - 智能机箱`,
        raw : false,
        entryOnly : false,
        test : /(\.vue|\.js)/,
        exclude : /node_modules/
    });

    var extensionPlugin = [];

    if(process.env.NODE_ENV === 'production') {
        
        var definePlugin = new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: '"production"'
            }
        });

        var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            test : /\.(vue|js)$/,
            compress: {
                warnings: false,
                drop_debugger : true,
                dead_code : true,    //删除没有引用的代码
                sequences : 20,    //使用逗号运算符
                conditionals : true,  //优化if条件表达式
                booleans : true,     //优化boolean值
                drop_console: true   //删除console
            },
            output : {
                beautify : true
            }
        });

        var loaderPlugin = new webpack.LoaderOptionsPlugin({
            minimize: true
        });


        extensionPlugin.push(definePlugin, uglifyJsPlugin, loaderPlugin);
    }

    return [
        htmlPlugins,
        commonsChunkPlugin,
        bannerPlugin,
        ...extensionPlugin
    ]
}