/**
 * Developer    :   SongQian
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   告警管理逻辑页面窗口
 */
import moment from 'moment'
import _ from 'lodash'
import { mapActions } from 'vuex'


export default (function() {
    return {
        name : 'Waring',
        data() {
            return {
                search : {
                    deviceName : '',
                    deviceType : '',
                    errorTime : '',
                    errorProject : '',
                    username : '',
                    resolveStatus : '',
                    resolveTime : ''
                },
                tableList :  [
                    { name : '1路口',devieTypeTable : 'WTOE-VE', type : '设备停电', time : '2019-03-01 2:23:23',dealMan : '张三', state : '未处理',dealTime : ''  },
                    { name : '2路口',devieTypeTable : 'WTOE-VN', type : '空开跳闸', time : '2019-03-02 12:23:23',dealMan : '李四', state : '未处理',dealTime : ''  },
                    { name : '3路口',devieTypeTable : 'WTOE-VE', type : '设备停电', time : '2019-03-01 2:24:23',dealMan : '张三', state : '未处理',dealTime : ''  },
                    { name : '4路口',devieTypeTable : '摄像机', type : '摄像机故障', time : '2019-03-04 14:24:24',dealMan : '李四', state : '已派工',dealTime : '2019-03-04 14:44:44'  },
                    { name : '5路口',devieTypeTable : 'WTOE-VE', type : '设备停电', time : '2019-03-01 2:23:23',dealMan : '张三', state : '未处理',dealTime : ''  },
                    { name : '6路口',devieTypeTable : 'WTOE-VN', type : '网线故障', time : '2019-03-08 08:20:23',dealMan : '李四', state : '未处理',dealTime : ''  },
                    { name : '7路口',devieTypeTable : 'WTOE-VE', type : '管理网络异常', time : '2019-04-04 2:28:28',dealMan : '张三', state : '未处理',dealTime : ''  },
                    { name : '8路口',devieTypeTable : '摄像机', type : '摄像机故障', time : '2019-03-09 14:29:24',dealMan : '李四', state : '已派工',dealTime : '2019-03-10 19:01:44'  },
                    { name : '9路口',devieTypeTable : 'WTOE-VE', type : '设备停电', time : '2019-03-01 2:23:23',dealMan : '张三', state : '已完成',dealTime : '2019-03-11 11:00:00'  },
                    { name : '10路口',devieTypeTable : 'WTOE-VN', type : '网线故障', time : '2019-03-08 08:20:23',dealMan : '李四', state : '未处理',dealTime : ''  },
                    { name : '11路口',devieTypeTable : 'WTOE-VE', type : '管理网络异常', time : '2019-04-04 2:28:28',dealMan : '张三', state : '已忽略',dealTime : '2019-04-13 13:00:00'  },
                    { name : '12路口',devieTypeTable : '摄像机', type : '摄像机故障', time : '2019-03-09 14:29:24',dealMan : '李四', state : '已派工',dealTime : '2019-03-14 19:01:44'  },
                    { name : '13路口',devieTypeTable : '闪光灯', type : '设备掉电', time : '2019-03-15 2:15:23',dealMan : '张三', state : '已完成',dealTime : '2019-03-17 15:00:00'  },
                    { name : '14路口',devieTypeTable : '补光灯', type : '设备掉电', time : '2019-03-20 08:25:23',dealMan : '李四', state : '未处理',dealTime : ''  },
                    { name : '15路口',devieTypeTable : '光传输设备', type : '管理网络异常', time : '2019-04-16 2:28:28',dealMan : '张三', state : '已忽略',dealTime : '2019-04-17 13:00:00'  },
                    { name : '16路口',devieTypeTable : '摄像机', type : '摄像机故障', time : '2019-03-22 22:29:24',dealMan : '李四', state : '已派工',dealTime : '2019-03-25 19:25:25'  },
                    { name : '17路口',devieTypeTable : '摄像机', type : '摄像机故障', time : '2019-04-02 12:22:22',dealMan : '李四', state : '已派工',dealTime : '2019-04-03 19:01:44'  },
                    { name : '18路口',devieTypeTable : '闪光灯', type : '设备掉电', time : '2019-04-15 2:15:23',dealMan : '张三', state : '已完成',dealTime : '2019-04-17 15:00:00'  },
                    { name : '19路口',devieTypeTable : '补光灯', type : '设备掉电', time : '2019-04-20 08:25:23',dealMan : '李四', state : '未处理',dealTime : ''  },
                    { name : '20路口',devieTypeTable : '光传输设备', type : '管理网络异常', time : '2019-04-16 2:28:28',dealMan : '张三', state : '已忽略',dealTime : '2019-04-17 13:00:00'  },
                    { name : '21路口',devieTypeTable : '摄像机', type : '摄像机故障 ', time : '2019-04-22 22:29:24',dealMan : '李四', state : '已派工',dealTime : '2019-04-25 19:25:25'  }
                ],
                pagination : {
                    page : 1,
                    pageSize : 10,
                    total : 100
                },
                changeStateDailog : {
                    Isshow : false,
                    radio : '未处理',
                    remark : ''
                },
                form : { 
                    name : '',
                    devieTypeTable : '',
                    type : '',
                    time : '',
                    dealMan : '',
                    state : '',
                    dealTime : ''
                }
            }
        },
        computed : {
            getFilterData() {
                let me = this;
                let data = _.clone(me.tableList);
                if(me.search.deviceName){
                    data = data.filter(it => it.name.indexOf(me.search.deviceName) > -1);
                }
                if(me.search.deviceType){
                    console.info(me.search.deviceType)
                    data = data.filter(it => it.devieTypeTable.indexOf(me.search.deviceType) > -1);
                }
                if(me.search.errorTime){
                    data = data.filter(it => moment(it.time).isAfter(me.search.errorTime[0]) && moment(it.time).isBefore(me.search.errorTime[1]));
                }
                if(me.search.errorProject){
                    data = data.filter(it => it.type.indexOf(me.search.errorProject) > -1);
                }
                if(me.search.username){
                    data = data.filter(it => it.dealMan.indexOf(me.search.username) > -1);
                }
                if(me.search.resolveStatus){
                    data = data.filter(it => it.state.indexOf(me.search.resolveStatus) > -1);
                }
                if(me.search.resolveTime){
                    data = data.filter(it => moment(it.dealTime).isAfter(me.search.resolveTime[0]) && moment(it.dealTime).isBefore(me.search.resolveTime[1]));
                }
                return data;
            },
            getDataTable() {
                let me = this;
                //_.drop(arr, int) _.take(arr, int)
                return _.take(_.drop(me.getFilterData, (me.pagination.page - 1) * me.pagination.pageSize), me.pagination.pageSize);
            },
            getTotal() {
                let me = this;
               return  me.getFilterData.length;
            }
        },
        methods : { 
            handleSizeChange(val) {   //切换每页条数时，触发的方法
                let me = this;
               me.pagination.pageSize = val;
            },
            handleCurrentChange(val) {          //点击下一页或某一页时，出发啊的方法
                console.log(`当前页: ${val}`);
            },
            handleQueryDetail (entity) {
                let me = this;
                me.save(entity);
                me.$router.push({ name : 'messageDetail'})
            },
            changeState(val){
                let me = this;
                me.changeStateDailog.Isshow = true;
                me.form = val;
                me.changeStateDailog.radio = val.state;
                me.changeStateDailog.remark = '';
            },
            searchDate(){
                
            },
            clearSearch(){
                let me = this;
                me.search.deviceName = '';
                me.search.deviceType = '';
                me.search.errorTime = '';
                me.search.errorProject = '';
                me.search.username = '';
                me.search.resolveStatus = '';
                me.search.resolveTime = ''
            },
            closeDialog() {
                let me = this;
                me.changeStateDailog.remark = '';
            }, 
            ...mapActions({
                'save' : 'Warning/save'
            })
        },
        mounted() {
        }
    }
})()