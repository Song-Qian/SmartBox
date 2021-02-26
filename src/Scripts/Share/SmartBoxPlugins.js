/**
 * Developer    :   SongQian
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   本系统应用风格UI组件
 */

 import SmartBoxDialog from './Dialog/SmartBoxDialog.vue'
 import SmartBoxMap from './Map/SmartBoxMap.vue'
 import SmartBoxIntersection from './Intersection/SmartBoxIntersection.vue'

 export default (function() {
     return {
         install(Vue, options) {
            Vue.component(SmartBoxDialog.name, SmartBoxDialog);
            Vue.component(SmartBoxMap.name, SmartBoxMap);
            Vue.component(SmartBoxIntersection.name, SmartBoxIntersection);
         }
     }
 })()