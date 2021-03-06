/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   路径语法糖配置
 */

var path = require("path")

module.exports =  {
    extensions : ['.js', '.vue', '.json', '.sass', '.scss'],
    alias: {
        '~' : path.join(__dirname, '../', 'src'),
        'vue$': 'vue/dist/vue.esm.js'
    }
}