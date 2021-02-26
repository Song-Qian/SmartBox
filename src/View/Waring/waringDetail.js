/**
 * Developer    :   hongguangCao
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   告警管理详情查看逻辑页面窗口
 */
import moment from 'moment'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import RESTFULAPI from '~/Scripts/Util/RestfulApi'


export default (function() {
    return {
        name : 'WaringDetail',
        props : {
            id : {
                default : 0,
                type : Number
            }
        },
        data() {
            return {
                color : '#F56C6C',
                arr : [],
                detail : {}
            }
        },
        methods : { 
            //时间戳转换为时间
            DateTimeFormate(number){
                if(number){
                    return moment.unix(number).format('YYYY-MM-DD HH:mm:ss');
                }
                return '';
            },
            async getAlarmInfo(){
                let me = this;
                let response =  await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getAlarmInfo, {
                        alarmId : me.id
                        }, {
                    emulateJSON : true,
                    emulateHTTP : false
                });
                console.info(response);
                if(response.status === 200){
                    me.detail = response.body.model;
                }
            },
            async getDealInfoDate(){
                let me = this;
                let response =  await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getDealInfoDate, {
                        alarmId : me.id
                        }, {
                    emulateJSON : true,
                    emulateHTTP : false
                });
                if(response.status === 200){
                    me.arr = response.body.model;
                }
            }
            
        },
        mounted() {
            let me = this;
            me.getAlarmInfo();
            me.getDealInfoDate();
           
        }
    }
})()