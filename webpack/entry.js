/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   入口文件配置
 */
var path = require("path");

module.exports =  {
    'vue-all' : [
        'vue',
        'vue-router',
        'vuex',
        'vue-resource'
    ],
    'element-ui' : 'element-ui',
    'echarts' : 'echarts/echarts.all',
    'lodash': 'lodash/index.js',
    'moment' : 'moment/src/moment',
    'ol' : 'ol',
    'xlsx' : 'xlsx/xlsx.js',
    'utils' : [ 
        path.join(__dirname, '../','src/Scripts/Util/CapabilitySet'), 
        path.join(__dirname, '../', 'src/Scripts/Util/Keys-SHA-ES6'), 
        path.join(__dirname, '../', 'src/Scripts/Util/RestfulApi'), 
        path.join(__dirname, '../', 'src/Scripts/Util/uuid')
    ],
    'app' : path.join(__dirname, '../', 'src/main.js')
}