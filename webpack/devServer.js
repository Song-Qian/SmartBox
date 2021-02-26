/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   本地webpack开发环境server代理配置
 */
var path = require("path");

module.exports = {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    contentBase: path.join(__dirname, "../", "dist"),
    proxy: {
        '/api': {
            target: process.env.NODE_ENV === 'development' ? 'http://localhost:9550/' : 'http://10.0.0.225:9550/',
            pathRewrite: {
                '^/api': ''
            }
        }
    }
}