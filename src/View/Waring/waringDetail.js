/**
 * Developer    :   hongguangCao
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   告警管理详情查看逻辑页面窗口
 */
import moment from 'moment'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default (function() {
    return {
        name : 'WaringDetail',
        data() {
            return {
                color : '#F56C6C',
                arr : [1,2,3,4,5,6,7,8]
            }
        },
        computed : {
           ...mapGetters({
               'detail' : 'Warning/getEntity'
           })
        },
        methods : { 
           
        },
        mounted() {
            let me = this;
            if(me.detail.state === "未处理"){
                me.color = '#FDB643';
            }else if (me.detail.state === '已派工'){
                me.color = '#05A2F4';
            }else if (me.detail.state === '已完成'){
                me.color = '#61FD44';
            }else if (me.detail.state === '已忽略'){
                me.color = '#969696';
            }
        }
    }
})()