/**
 * Developer    :   SongQian
 * Time         :   2019-06-04
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   智能机箱交通设备UI页面
 */
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import RESTFUL from '~/Scripts/Util/RestfulApi'
import { CapabilityFactory } from '~/Scripts/Util/CapabilitySet'

export default (function () {
    return {
        name: 'Traffic',
        props: {
            id: {
                default: "",
                type: String | Number
            }
        },
        data() {
            return {
                dialogShow : false,
                alarmShow : false,
                listenStatus : false,
                alarmTableShow : false,
                hasStudy : false,
                deviceMac : '',
                search : {
                    alarmDesc : '',
                    errorProject : '',
                    alarmTime : []
                },
                pagination : {
                    page : 1,
                    pageSize : 10,
                    total : 10
                },
                treeProps: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                signal : {
                    name : "",
                    status : "",
                    voltage_status : "",
                    learn_status : "",
                    airswitch : []
                },
                dialogData : {
                    deviceInfo : null,
                    environment : {
                        input_vol : "",
                        input_ac: "",
                        dev_temp : "",
                        fan_statu : "",
                        hot_statu : "",
                        thunder : [],
                        water_status : "",
                        lean_angle :　"",
                        humidity : ""
                    },
                },
                deviceInfoDailog: {
                    Isshow: false,
                    deviceTilt: {
                        frontValue: 0,
                        afterValue: 0,
                        leftValue: 0,
                        rightValue: 0,
                        upValue: 0,
                        downValue: 0
                    }
                },
                alarmInfo : [],
                alarmInfoDataSource : [],
                boxState : [],
                devicedTypeList: [],
                SignalLightData : [],
                alaramItemList : [],
                debug_board : false,
                intersection : {
                    E : {
                        //东向车道配置
                        lane : 0, //东向车道数据
                        sidewalkStop : 0, //东向数据控制南北右侧人行红灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且红灯）
                        sidewalkRun : 0, //东向数据控制南北右侧人行绿灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且绿灯）
                        sidewalkText : 0, //东向数据控制南北右侧人行信号灯读秒 (value >= 0 读秒数， -1 读秒故障， -2 无读秒灯)
                        sidewalkLightMode : 0, //东向数据控制人行灯模式， 0灯在西人行道， 1灯在南和北的东向人行道, ? 无信号灯, 优先级：0 值 > 1值（E=0，N、S = 1，则东人行灯覆盖北向、南向人行灯）
                        roads : [
                            // [  value = [default 默认灯色, run 绿灯， wait 黄灯, stop 红灯, none 无灯, wait-flash 黄闪], 
                            //    value = [0-∽ 读秒, -1 机动车信号灯读秒故障, -3 机动车信号灯无读秒], 
                            //    value = [right 左转地标，left 左转地标,straight 直行地标], 
                            //    value = [run 红灯故障, wait 黄灯故障, stop 红灯故障, run-stop 组合故障]
                            // ]
                            // ['run', 15, 'right', ""], //第一车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['wait', 24, 'straight', "stop"], //第二车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['stop', 25, 'straight', "run"], //第三车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['none', 26, 'left', ""] //第四车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                        ]
                    },
                    W : {
                        //西向车道配置
                        lane : 0, //西向车道数据
                        sidewalkStop : 0, //西向数据控制南北左侧人行红灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且红灯）
                        sidewalkRun : 0, //西向数据控制南北左侧人行绿灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且绿灯）
                        sidewalkText : 0, //西向数据控制南北左侧人行信号灯读秒 (value >= 0 读秒数， -1 读秒故障， -2 无读秒灯)
                        sidewalkLightMode : 0, //西向数据控制人行灯模式， 0灯在西人行道， 1灯在南和北的西向人行道, ? 无信号灯, 优先级：0 值 > 1值（W=0，N、S = 1，则西人行灯覆盖北向、南向人行灯）
                        roads : [
                            // [  value = [default 默认灯色, run 绿灯， wait 黄灯, stop 红灯, none 无灯, wait-flash 黄闪], 
                            //    value = [0-∽ 读秒, -1 机动车信号灯读秒故障, -3 机动车信号灯无读秒], 
                            //    value = [right 左转地标，left 左转地标,straight 直行地标], 
                            //    value = [run 红灯故障, wait 黄灯故障, stop 红灯故障, run-stop 组合故障]
                            // ]
                            // ['run', 28, 'left', ""], //第一车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['wait', 29, 'straight', "stop"], //第二车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['stop', 30, 'straight', "run"], //第三车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['none', 31, 'right', ""] //第四车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                        ]
                    },
                    S : {
                        //南向车道配置
                        lane : 0, //南向车道数据
                        sidewalkStop : 0, //南向数据控制东西下方人行红灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且红灯）
                        sidewalkRun : 0, //南向数据控制东西下方人行绿灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且绿灯）
                        sidewalkText : 0, //南向数据控制东西下方人行信号灯读秒 (value >= 0 读秒数， -1 读秒故障， -2 无读秒灯)
                        sidewalkLightMode : 0, //南向数据控制人行灯模式， 0灯在南人行道， 1灯在东和西的南向人行道, ? 无信号灯, 优先级：0 值 > 1值（S=0，E、W = 1，则南人行灯覆盖东向、西向人行灯）
                        roads : [
                            // [  value = [default 默认灯色, run 绿灯， wait 黄灯, stop 红灯, none 无灯, wait-flash 黄闪], 
                            //    value = [0-∽ 读秒, -1 机动车信号灯读秒故障, -3 机动车信号灯无读秒], 
                            //    value = [right 左转地标，left 左转地标,straight 直行地标], 
                            //    value = [run 红灯故障, wait 黄灯故障, stop 红灯故障, run-stop-wait 组合故障]
                            // ]
                            // ['stop', 33, 'left', "wait"], //第一车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['wait', 34, 'straight', "stop"], //第二车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['stop', 35, 'straight', ""], //第三车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['none', 36, 'right', ""] //第四车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                        ]
                    },
                    N : {
                        //北向车道配置
                        lane : 0, //北向车道数据
                        sidewalkStop : 0, //北向数据控制东西上方人行红灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且红灯）
                        sidewalkRun : 0, //北向数据控制东西上方人行绿灯信号灯 （0 灭， 1 亮， 2 默认， 3 故障， 4 无灯, 5 故障且绿灯）
                        sidewalkText : 0, //北向数据控制东西上方人行信号灯读秒 (value >= 0 读秒数， -1 读秒故障， -2 无读秒灯)
                        sidewalkLightMode : 0, //北向数据控制人行灯模式， 0 灯在北人行道， 1灯在东和西的北向人行道, ? 无信号灯, 优先级：0 值 > 1值（N=0，E、W = 1，则北人行灯覆盖东向、西向人行灯）
                        roads : [
                            // [  value = [default 默认灯色, run 绿灯， wait 黄灯, stop 红灯, none 无灯, wait-flash 黄闪], 
                            //    value = [0-∽ 读秒, -1 机动车信号灯读秒故障, -3 机动车信号灯无读秒], 
                            //    value = [right 左转地标，left 左转地标,straight 直行地标], 
                            //    value = [run 红灯故障, wait 黄灯故障, stop 红灯故障, run-stop 组合故障]
                            // ]
                            // ['run', 38, 'right', "wait"], //第一车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['wait', 39, 'straight', "stop"], //第二车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['stop', 40, 'straight', ""], //第三车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                            // ['none', 41, 'left', ""] //第四车道 [车道信号灯, 信号灯读秒， 行车标志, 灯故障]
                        ]
                    }
                }
            }
        },
        computed : {
            ...mapGetters({
                'User' : 'User/getUser',
                'getHeartInterval' : 'Sys/getHeartInterval'
            }),
            getIntrsection() {
                let me = this;
                return me.SignalLightData && me.SignalLightData.some(it => it.voltage !== 0) ? "" : "\n未检测到信号灯";
            },
        },
        watch : {
            id : {
                handler(){
                    let me = this;
                    me.loadDeviceType();
                    me.queryInfo();
                    me.querySignalLight();
                    me.queryIntersectionInfo();
                    me.getAlarmItemList();
                    me.queryAlarmDataSource();
                },
                immediate : true,
                deep : false
            }
        },
        methods : {
            alarmShowDialog(){
                let me=this;
                me.alarmShow=true;
                me.queryAlarmDataSource()
            },
            //设备类型下拉框
            async loadDeviceType() {
                let me = this;
                let res = await me.$http.get(RESTFUL.injective.Api.DeviceType.QueryAll, null, { emulateJSON: false, emulateHTTP: false });
                if(res.status === 200 && res.body.success) {
                    me.devicedTypeList = res.body.model.map(it => ({ label :it.typeName, value : it.typeCode }));
                }
            },
            //一键倾斜调校
            async leanThresholdControl(){
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行配置操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.dialogData.deviceInfo.ONLINE_STATUS){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);//加载的背景打开
                let id = me.id;
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    {
                        commandCode: 'gm010',
                        body: [id]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                    me.changeLoadState(false);
                if (response.body.success && response.body.model.msgcode === '0') {
                    me.$message.success("调校成功", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return void 0;
                }
                me.$message.error("调校失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
            },
            //设备倾斜告警阈值设置
            async leftThresholdSet() {
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行配置操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.dialogData.deviceInfo.ONLINE_STATUS){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);//加载的背景打开
                let id = me.id;
                let slopeSetValue = `[1:${me.deviceInfoDailog.deviceTilt.frontValue}]@[2:${me.deviceInfoDailog.deviceTilt.afterValue}]@[3:${me.deviceInfoDailog.deviceTilt.leftValue}]@[4:${me.deviceInfoDailog.deviceTilt.rightValue}]@[5:${me.deviceInfoDailog.deviceTilt.upValue}]@[6:${me.deviceInfoDailog.deviceTilt.downValue}]`;
                        
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    {
                        commandCode: 'gm009',
                        body: [id, slopeSetValue]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                me.changeLoadState(false);
                if (response.body.success && response.body.model.msgcode === '0') {
                    me.$message.success("阈值设置成功", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    me.deviceInfoDailog.Isshow = false;
                    return void 0;
                }
                me.$message.error("设置失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
            },
            //获取查询条件中异常项目的数据（告警表中有多少就显示多少，不需要全部显示出来）
            async getAlarmItemList(){
                let me = this;
                let response =  await me.$http.post(RESTFUL.injective.Api.AlarmInfo.getAlarmItemList, {}, {
                    emulateJSON : false,
                    emulateHTTP : true
                });
                if(response.body.success) {
                    me.alaramItemList = _.filter(response.body.model, it => it != null) || [];
                }
            },
            formatTimer(val) {
                return moment.unix(val).format('YYYY-MM-DD HH:mm:ss');
            },
            handleSizeChange(val) {   //切换每页条数时，触发的方法
                let me = this;
                me.pagination.page = 1;
                me.pagination.pageSize = val;
            },
            handleCurrentChange(val) {      //点击下一页或某一页时，出发的方法
                let me = this;
                me.pagination.page = val;
                me.queryAlarmDataSource();
            },
            async reStoreSetting() {
                let me = this;
                this.$confirm("此操作会恢复出厂设置，是否继续?", '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: "el-button--success", 
                    cancelButtonClass: 'el-button--warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    me.changeLoadState(true);
                    let response = me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: "gm020",
                            body: [me.decToHex(me.deviceMac)]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        }
                    );
                    me.changeLoadState(false);
                    if (response.body.success) {
                        me.$message.success("恢复完成", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return void 0;
                    }
                    me.$message.success("恢复失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                })
            },
            async reStart() {
                let me = this;
                this.$confirm("此操作会重启设备，是否继续?", '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: "el-button--success", 
                    cancelButtonClass: 'el-button--warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    me.changeLoadState(true);
                    let response = me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: "gm019",
                            body: [me.decToHex(me.deviceMac)]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        }
                    );
                    me.changeLoadState(false);
                    if (response.body.success) {
                        me.$message.success("恢复完成", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return void 0;
                    }
                    me.$message.success("恢复失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                })
            },
            async modifyLearn(hasOpen) {
                let me = this;
                let msg = hasOpen ? "此操作开启学习功能，是否继续?" : "此操作将清除学习记录，是否继续?";
                me.$confirm(msg, '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: "el-button--success", 
                    cancelButtonClass: 'el-button--warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    me.changeLoadState(true);
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: hasOpen ? 'gm038' : 'gm039',
                            body: [me.id]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        }
                    );
                    me.changeLoadState(false);
                    if (response.body.success) {
                        let message = hasOpen ? "开始学习成功,10分钟后将学习完毕" : "清除学习信息成功";
                        me.hasStudy = hasOpen;
                        me.$message.success(message, "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return void 0;
                    }
                    this.hasStudy = !hasOpen;
                    me.$message.success("下发失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                }).catch(() => {
                    me.hasStudy = !hasOpen;
                })
            },
            //10进制转16进制的mac地址方法
            decToHex(dec){
                let hex = (dec).toString(16);
                while(hex.length<12){
                    hex = "0" + hex;
                }
                hex = hex.toUpperCase();
                hex = _.chunk(hex,2).join(":").replace(/\,/g,"");
                return hex;
            },
            async queryAlarmDataSource() {
                let me = this;
                let response =  await me.$http.post(RESTFUL.injective.Api.AlarmInfo.getGridDate, {
                    alarmDesc : me.search.alarmDesc,
                    errorProject : me.search.errorProject,
                    deviceId : me.id,
                    errorStartTime : me.search.alarmTime && me.search.alarmTime[0] || '',
                    errorEndTime :  me.search.alarmTime && me.search.alarmTime[1] || '',
                    page : me.pagination.page,
                    pageSize : me.pagination.pageSize
                }, {
                    emulateJSON : false,
                    emulateHTTP : true
                });
                if(response.status === 200){
                    let dataGrid = response.body.model;
                    me.alarmInfoDataSource = dataGrid;
                    me.pagination.total = response.body.totalCount;
                }
            },
            async queryInfo(id = 0) {
                let me = this;
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.query,
                    {
                        methodName: 'queryDeviceInfo',
                        body: [id || me.id]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    }
                );
                if (response.body.success) {
                    let queryDevPerformMap = response.body.model.queryDevPerformMap;    //查询的所有性能级的数据
                    me.alarmInfo = response.body.model.queryAlarmInfoMap;
                    me.dialogData.deviceInfo = response.body.model.queryDeviceInfoMap;
                    let queryOutDevInfo = response.body.model.queryOutDeviceInfoMap;
                    queryOutDevInfo = queryOutDevInfo.filter(it => it.OUTDEV_TYPE === 6);
                    me.signal.name = queryOutDevInfo[0] && queryOutDevInfo[0].OUTDEV_NAME || "";
                    me.signal.status = queryOutDevInfo[0] && (queryOutDevInfo[0].DETECT_RES && "正常" || "异常") || "";
                    me.deviceMac = response.body.model.queryDeviceInfoMap.DEV_MAC;
                    let SIGNAL_POWER = queryDevPerformMap.filter(it => it.PERFORM_NAME === "SIGNAL_POWER");
                    if(SIGNAL_POWER.length) {
                        let capability = { 
                            id : SIGNAL_POWER[0].ID, 
                            perform_name : SIGNAL_POWER[0].PERFORM_NAME, 
                            perform_type : SIGNAL_POWER[0].PERFORM_TYPE, 
                            data_type : SIGNAL_POWER[0].DATA_TYPE, 
                            perform_value : SIGNAL_POWER[0].PERFORM_VALUE, 
                            perform_description  : SIGNAL_POWER[0].PERFORM_DESCRIPTION
                        }
                        SIGNAL_POWER = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                        me.signal.voltage_status = SIGNAL_POWER.valueOf()[1][1];
                    }

                    let AIRSWITCH_STATUS = queryDevPerformMap.filter(it => it.PERFORM_NAME === "AIRSWITCH_STATUS");
                    if(AIRSWITCH_STATUS.length) {
                        let capability = {
                            id : AIRSWITCH_STATUS[0].ID,
                            perform_name : AIRSWITCH_STATUS[0].PERFORM_NAME,
                            perform_type : AIRSWITCH_STATUS[0].PERFORM_TYPE,
                            data_type : AIRSWITCH_STATUS[0].DATA_TYPE,
                            perform_value : AIRSWITCH_STATUS[0].PERFORM_VALUE,
                            perform_description : AIRSWITCH_STATUS[0].PERFORM_DESCRIPTION
                        }
                        AIRSWITCH_STATUS = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                        me.signal.airswitch = AIRSWITCH_STATUS.valueOf();
                    }

                    let SIGNAL_LEARN =  queryDevPerformMap.filter(it => it.PERFORM_NAME === "SIGNAL_LEARN");
                    if(SIGNAL_LEARN.length) {
                        let capability = {
                            id : SIGNAL_LEARN[0].ID,
                            perform_name : SIGNAL_LEARN[0].PERFORM_NAME,
                            perform_type : SIGNAL_LEARN[0].PERFORM_TYPE,
                            data_type : SIGNAL_LEARN[0].DATA_TYPE,
                            perform_value : SIGNAL_LEARN[0].PERFORM_VALUE,
                            perform_description : SIGNAL_LEARN[0].PERFORM_DESCRIPTION
                        }
                        SIGNAL_LEARN = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                        me.signal.learn_status = SIGNAL_LEARN.valueOf();
                        me.listenStatus = SIGNAL_LEARN.valueOf() != '未学习';
                    }

                    let deviceControl = queryDevPerformMap.filter(it => it.DATA_TYPE === 3);    //设备监控
                    me.boxState = deviceControl
                            .map(it => ({ ...it, index: it.PERFORM_VALUE === "1", PERFORM_DESCRIPTION : it.PERFORM_DESCRIPTION === '锁舌状态' ? '远程开锁' : it.PERFORM_DESCRIPTION }))
                            .filter(it => ['FAN_CFG_STATUS'].indexOf(it.PERFORM_NAME) === -1);
                    // let fanControlModelList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("FAN_MODE") > -1);
                    // if(fanControlModelList.length>0){
                    //     let fanControlModel = fanControlModelList[0].PERFORM_VALUE;
                    //     if(fanControlModel == "1"){     //如果是温度控制，则在设备控制中不能显示风扇的开关按钮
                    //         me.boxState = me.boxState.filter(it => it.PERFORM_NAME != "FAN_CFG_STATUS");
                    //     }
                    // }
                    for(let dev_perform of queryDevPerformMap) {
                        let capability = {
                            id : dev_perform.ID,
                            perform_name : dev_perform.PERFORM_NAME,
                            perform_type : dev_perform.PERFORM_TYPE,
                            data_type : dev_perform.DATA_TYPE,
                            perform_value : dev_perform.PERFORM_VALUE,
                            perform_description : dev_perform.PERFORM_DESCRIPTION
                        }

                        if(capability.perform_name === "SIGNAL_POWER") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            let [[, input_vol = ""]] = cf.valueOf();
                            me.dialogData.environment.input_vol = input_vol;
                        }

                        // if(capability.perform_name === "INPUT_CURRENT") {
                        //     let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                        //     me.dialogData.environment.input_vol = cf.valueOf();
                        // }
                        
                        if(capability.perform_name === "DEV_TEMP") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            me.dialogData.environment.dev_temp = cf.valueOf();
                        }

                        if(capability.perform_name === "FAN_WORK_STATUS") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            me.dialogData.environment.fan_statu = cf.valueOf();
                        }

                        if(capability.perform_name === "HEATER_WORK_STATUS") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            me.dialogData.environment.hot_statu = cf.valueOf();
                        }

                        if(capability.perform_name === "THUNDER_DEFENCE") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            let thunder = cf.valueOf();
                            me.dialogData.environment.thunder = thunder;
                        }

                        if(capability.perform_name === "WATER_STATUS") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            me.dialogData.environment.water_status = cf.valueOf();
                        }
                        
                        if(capability.perform_name === "LEAN_ANGLE") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            me.dialogData.environment.lean_angle = cf.perform_value.map((item, n) => {
                                return item[1] === 0 ? "" : ["", `前倾${item[1]}度`, `后倾${item[1]}度`, `左倾${item[1]}度`, `右倾${item[1]}度`, `上倾${item[1]}度`, `下倾${item[1]}度`][n + 1];
                            }).filter(it => it !== "").join(",") || "不倾斜";
                        }

                        if(capability.perform_name === "DEV_HUMIDITY") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            me.dialogData.environment.humidity = cf.valueOf();
                        }

                        if(capability.perform_name === "LEAN_THRESHOLD") {
                            let cf = CapabilityFactory.getInstance().createCapability(capability.perform_name, capability);
                            let [frontValue, afterValue, leftValue, rightValue, upValue, downValue] = cf.perform_value;
                            me.deviceInfoDailog.deviceTilt.frontValue = frontValue[1];//前
                            me.deviceInfoDailog.deviceTilt.afterValue = afterValue[1];//后
                            me.deviceInfoDailog.deviceTilt.leftValue = leftValue[1];//左
                            me.deviceInfoDailog.deviceTilt.rightValue = rightValue[1];//右
                            // me.deviceInfoDailog.deviceTilt.upValue = upValue[1];//上
                            // me.deviceInfoDailog.deviceTilt.downValue = downValue[1];//下
                        }
                    }

                }
            },
            async sortDeviceControl(val, perFormName) {
                let me = this;
                let msg = [
                    { FAN_CFG_STATUS : "此操作将会关闭风扇，是否继续?", DOOR_DEFENCE_STATUS : "此操作将会关闭门布防状态，是否继续?", LOCKTONGUE_STATUS : "注意，只能远程开锁，不能远程关锁!" },
                    { FAN_CFG_STATUS : "此操作将会开启风扇，是否继续?", DOOR_DEFENCE_STATUS : "此操作将会开启门布防状态，是否继续?", LOCKTONGUE_STATUS : "此操作将会远程开锁，是否继续?" }
                ][val && 1 || 0][perFormName];
                this.$confirm(msg, '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: "el-button--success", 
                    cancelButtonClass: 'el-button--warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    me.changeLoadState(true);//加载的背景打开
                    if (perFormName === "FAN_CFG_STATUS") {   //风扇开关控制
                        let response = await me.$http.post(
                            RESTFUL.injective.Api.Command.Send,
                            {
                                commandCode: 'gm018',
                                body: [me.decToHex(me.deviceMac), val ? "1" : "0", '0']
                            },
                            {
                                emulateJSON: false,
                                emulateHTTP: true
                            });
                        if (response.body && response.body.success && response.body.model.msgcode === '0') {
                            me.changeLoadState(false);
                            me.queryInfo();
                            me.$message.success("下发成功", "提示",
                                { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        } else {
                            me.changeLoadState(false);
                            me.queryInfo();
                            me.$message.error("下发失败", "提示",
                                { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        }
                    } else if (perFormName === "DOOR_DEFENCE_STATUS") {    //门布防状态控制
                        let response = await me.$http.post(
                            RESTFUL.injective.Api.Command.Send,
                            {
                                commandCode: 'gm016',
                                body: [me.decToHex(me.deviceMac), val ? "1" : "0"]
                            },
                            {
                                emulateJSON: false,
                                emulateHTTP: true
                            });
                        if (response.body && response.body.success && response.body.model.msgcode === '0') {
                            me.changeLoadState(false);
                            me.queryInfo();
                            me.$message.success("下发成功", "提示",
                                { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            me.deviceControlDailog.Isshow = false;
                        } else {
                            me.changeLoadState(false);
                            me.queryInfo();
                            me.$message.error("下发失败", "提示",
                                { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        }

                    } else if (perFormName === 'LOCKTONGUE_STATUS') {    //锁舌状态控制，只能开，不能关
                        let status = Number(val);
                        if (status) {         //说明是要进行打开 的操作，可以调接口
                            let response = await me.$http.post(
                                RESTFUL.injective.Api.Command.Send,
                                {
                                    commandCode: 'gm017',
                                    body: [me.decToHex(me.deviceMac)]
                                },
                                {
                                    emulateJSON: false,
                                    emulateHTTP: true
                                });
                            if (response.body && response.body.success && response.body.model.msgcode === '0') {
                                me.changeLoadState(false);
                                me.queryInfo();
                                me.$message.success("下发成功", "提示",
                                    { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            } else {
                                me.changeLoadState(false);
                                me.queryInfo();
                                me.$message.error("下发失败", "提示",
                                    { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            }
                        }
                    }
                });
            },
            async querySignalLight() {
                let me = this;
                let res = await me.$http.post(RESTFUL.injective.Api.Box.querySignalList, { deviceId : me.id }, { emulateJSON : false, emulateHTTP : true });
                if(res.body.success) {
                    me.SignalLightData = res.body.model;
                }
            },
            async queryIntersectionInfo() {
                let me = this;
                let res = await me.$http.post(RESTFUL.injective.Api.Box.queryIntersectionInfo, { deviceId : me.id }, { emulateJSON : false, emulateHTTP : true });
                if(res.body.success) {
                    me.intersection.E = res.body.model.e;
                    me.intersection.W = res.body.model.w;
                    me.intersection.N = res.body.model.n;
                    me.intersection.S = res.body.model.s;
                }
            },
            alarmInfoDataTableCellStyle(row, column, rowIndex, columnIndex) {
                if (row.row.alarmLever === 1) {
                    return 'color:#F56C6C;';
                }
                if (row.row.alarmLever === 2) {
                    return 'color:#E6A23C;';
                }
            },
            refresh_info(tab) {
                let me = this;
                if(tab.name === 'info') {
                    me.queryInfo();
                }

                if(tab.name === 'signal_light') {
                    me.querySignalLight();
                }
            },
            //cs端网管服务需要bs端定时通信，cs端网管设计该需求...
            async cs_listen_func(id = 0) {
                let me = this;
                if(me.dialogData.deviceInfo && me.dialogData.deviceInfo.ONLINE_STATUS) {
                    await me.$http.post(RESTFUL.injective.Api.Command.Send, { commandCode: 'gm034', body : [ id || me.id, me.User.username] },  { emulateJSON : false, emulateHTTP : true });
                }
            },
            async cs_destroy_func() {
                let me =this;
                await me.$http.post(RESTFUL.injective.Api.Command.Send, { commandCode: 'gm035', body : [me.User.username] },  { emulateJSON : false, emulateHTTP : true });
            },
            ...mapActions({
                'changeLoadState' : 'Equipment/changeLoadState'
            })
        },
        mounted() {
            let me = this;
            let refresh_IntersectionInfo = () => {
                if(!me.debug_board) {
                    me.queryIntersectionInfo().then(() => {
                        intersection_timer = setTimeout(refresh_IntersectionInfo, 1000);
                    })
                }
            }
            let refresh_action = () => {
                me.queryInfo().then(() => {
                    action_timer = setTimeout(refresh_action, 30000);
                })
            }
            let broadcast_cs_listen = () => {
                me.cs_listen_func().then(() => {
                    cs_listen_timer = setTimeout(broadcast_cs_listen, me.getHeartInterval);
                })
            }

            let intersection_timer  = setTimeout(refresh_IntersectionInfo, 1000);
            let action_timer = setTimeout(refresh_action, 30000);
            let cs_listen_timer = setTimeout(broadcast_cs_listen, me.getHeartInterval);

            me.queryIntersectionInfo().then(() => {
                me.cs_listen_func();
            })
            me.$once("hook:beforeDestroy", () => {
                clearInterval(intersection_timer);
                clearInterval(action_timer);
                clearTimeout(cs_listen_timer);
                me.cs_destroy_func();
            })

            document.addEventListener("keydown",function() {
                if(event.keyCode == 36) {
                    me.debug_board = true;
                } else if(event.keyCode == 35) {
                    me.debug_board = false;
                }
            })
        },
        beforeRouteUpdate(to, from, next) {
            let me = this;
            if(to.params.id !== me.id) {
                me.queryInfo(to.params.id).then(() => {
                    me.cs_listen_func(to.params.id);
                })
            }
            next();
        }
    }
})()