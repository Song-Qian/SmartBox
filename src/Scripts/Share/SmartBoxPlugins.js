/**
 * Developer    :   SongQian
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   本系统应用风格UI组件
 */

 import SmartBoxDialog from './Dialog/SmartBoxDialog.vue'

 export default (function() {
     return {
         install(Vue, options) {
            Vue.component(SmartBoxDialog.name, SmartBoxDialog);
         }
     }
 })()