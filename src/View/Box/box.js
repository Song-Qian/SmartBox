/**
 * Developer    :   SongQian
 * Time         :   2019-06-04
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   智能机箱页面代码
 */
import _ from 'lodash'
import Key from '~/Scripts/Util/Keys-SHA-ES6'
import { mapGetters, mapActions } from 'vuex'
import RESTFUL from '~/Scripts/Util/RestfulApi'
import { CapabilityFactory } from '~/Scripts/Util/CapabilitySet'
import moment from 'moment'
export default (function () {

    return {
        name: 'Box',
        props: {
            id: {
                default: -1,
                type: String
            }
        },
        data() {
            return {
                devicedTypeList : [],
                boxOpen : false,
                hasExpandDevice: false,
                boxState: [],
                deviceInfoDailog: {
                    Isshow: false,
                    automatic: {
                        overValue: '',
                        underValue: '',
                        leakValue: '',
                        controlValue: ''
                    },
                    deviceTilt: {
                        frontValue: 0,
                        afterValue: 0,
                        leftValue: 0,
                        rightValue: 0,
                        upValue: 0,
                        downValue: 0
                    }
                },
                tabName: 'first',
                portFlowDialog: {
                    Isshow: false,
                    status: '1',
                    intervalTime: 0,
                    packetRate: 0,
                    delayedTime: 0
                },
                deviceControlDailog: {
                    tabName: 'first',
                    Isshow: false,
                    fanControl: {
                        nowTemperature: '44.93',
                        controlModel: '1',
                        control: '1',
                        temperValue: '',
                        fanPowerId : ''
                    },
                    heaterControl: {
                        nowTemperature: '41.56',
                        controlModel: '1',
                        heaterValue: '',
                        control: '1',
                        heaterPowerId : ''
                    }
                },
                deviceResetDialog: {
                    isshow: false,
                    password: ''
                },
                deviceInfoBox: {
                    deviceName: '',
                    deviceModel: '',
                    deviceIp: '',
                    deviceX: '',
                    deviceY: '',
                    areaName: '',
                    onlineStatus : false
                },
                alarmInfoBox: [],
                portData: [],
                devicePower: [],
                monitoringData: [],
                monitorLength: 0,   //电源口的多少
                outDevInfo: [],
                networkMax: 0,
                deviceMac: '',
                userRole : false,   //用户的角色，是操作员就为true，管理员就是false
                portFlowRules: {
                    intervalTime: [
                        { validator : (rule, value, callback) => /^\d+$/.test(value) ? callback() : callback(new Error("只能输入数字")), trigger: 'blur' },
                        { required: true, message: '必填', trigger: 'blur' }
                    ],
                    packetRate: [
                        { required: true, message: '必填', trigger: 'blur' },
                        { validator : (rule, value, callback) => /^\d+$/.test(value) ? callback() : callback(new Error("只能输入数字")), trigger: 'blur' },
                        { type : 'number', min: 0, max: 100, message: '只能输入0到100', trigger: 'blur' }
                    ],
                    delayedTime: [
                        {   required: true, message: '必填', trigger: 'blur' },
                        {   validator : (rule, value, callback) => /^\d+$/.test(value) ? callback() : callback(new Error("只能输入数字")), trigger: 'blur' }
                    ]
                },
            }
        },
        computed: {
            getMonitoringDataArr() {
                let me = this;
                let result = me.monitoringData.filter(it => it.perform_value instanceof Array);
                let tempArr = [];
                for(let capability of result) {
                    for(let valueOf of capability.valueOf()) {
                        let { id, perform_name, perform_type, data_type, perform_value, perform_description } = capability;
                        perform_value = valueOf[1];
                        if( perform_name === 'THUNDER_DEFENCE') {
                            perform_description = valueOf[0];
                            perform_value = valueOf[0].indexOf('防雷器') > -1 ? valueOf[1] : valueOf[3];
                            tempArr.push({ id, perform_name, perform_type, data_type, perform_value, perform_description });
							continue;
                        }
						tempArr.push({ id, perform_name, perform_type, data_type, perform_value : valueOf, perform_description });
                    }
                    
                }
                return tempArr;
            },
            getMonitoringData() {
                let me = this;
                return me.monitoringData.filter(it => !(it.perform_value instanceof Array));
            },
            ...mapGetters({
                'User' : 'User/getUser'
            })
        },
        watch: {
            '$route': {
                handler(newRoute, oldRoute) {
                    let me = this;
                    if (oldRoute && newRoute.params.id !== oldRoute.params.id || !oldRoute && newRoute.params.id) {
                        me.queryBoxInfo(newRoute.params.id);
                    }
                },
                immediate: true
            }
        },
        methods: {
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
            renderTime(time) {
                //moment.unix(item.alarmTime).format('YYYY-MM-DD HH:mm:ss')
               return moment.unix(time).format('HH:mm:ss')
            },
            getMessage(vol) {
                let me = this; 
                if(me.getTransDevStatus(vol[0])){  //如果该电源口下接着光传输设备，则不能点击
                    me.$message.info("该电源口连接了光传输设备，无法操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return void 0;
                }
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.$confirm('是否控制此电源？', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(async () => {
                    me.changeLoadState(true);
                    let deviceMac = me.deviceMac;
                    if (vol[3]) {
                        let powerStatus = '0';
                        let response = await me.$http.post(
                            RESTFUL.injective.Api.Command.Send,
                            {
                                commandCode: 'gm015',
                                body: [me.decToHex(deviceMac), vol[0], powerStatus, '0']
                            },
                            {
                                emulateJSON: false,
                                emulateHTTP: true
                            });
                        if (response.body.success && response.body.model.msgcode === '0') {
                            me.changeLoadState(false);
                            me.queryBoxInfo(me.id);
                            // let updateVol = [...vol];
                            // updateVol[3] = 0;
                            // me.$set(me.devicePower, vol[0] - 1, updateVol);
                            me.$message.success("关闭成功", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            return;
                        }
                        me.changeLoadState(false);
                        me.$message.error("关闭失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    } else {
                        let powerStatus = '1';
                        let response = await me.$http.post(
                            RESTFUL.injective.Api.Command.Send,
                            {
                                commandCode: 'gm015',
                                body: [me.decToHex(deviceMac), vol[0], powerStatus, '0']
                            },
                            {
                                emulateJSON: false,
                                emulateHTTP: true
                            });
                        if (response.body.success && response.body.model.msgcode === '0') {
                            me.changeLoadState(false);
                            me.queryBoxInfo(me.id);
                            // let updateVol = [...vol];
                            // updateVol[3] = 1;
                            // me.$set(me.devicePower, vol[0] - 1, updateVol);
                            me.$message.success("开启成功", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            return;
                        }
                        me.changeLoadState(false);
                        me.$message.error("开启失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                })
                
            },
            powerReset(powerId) {
                let me = this;
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }

                me.$confirm('是否重启此电源？', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(async () => {
                    let powerStatus = '2';
                    me.changeLoadState(true);
                    let deviceMac = me.deviceMac;
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: 'gm015',
                            body: [me.decToHex(deviceMac), powerId, powerStatus, '0']
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        me.queryBoxInfo(me.id);
                        me.$message.success("重启成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("重启失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                })
            },
            //设备类型下拉框
            async loadDeviceType() {
                let me = this;
                let res = await me.$http.get(RESTFUL.injective.Api.DeviceType.QueryAll, null, { emulateJSON: false, emulateHTTP: false });
                if(res.status === 200 && res.body.success) {
                    me.devicedTypeList = res.body.model.map(it => ({ label :it.typeName, value : it.typeCode }));
                }
            },
            //获取不同外设的样式图
            getOutDeviceClass(row, col) {
                let me = this;
                let el = me.outDevInfo.filter( it => it.OUTDEV_POWER_ID === col );
                for(let i in  el){
                    if(row == parseInt(i)+1){
                       return {'style' : ['', 'fill-light', 'flash-light', 'video', 'end-server', 'ray'][el[i].OUTDEV_TYPE], 'title' : el[i].OUTDEV_NAME};
                    }
                }
                return {'style' : '', 'title' : ''};
            },
            //获取对应的网络端口
            getPort(index,powerId){
                let me = this;
                let outDevInfo = _.clone(me.outDevInfo);
                outDevInfo = outDevInfo.filter(it => it.OUTDEV_POWER_ID == powerId);
                for(let i in  outDevInfo){
                    if(index == parseInt(i)+1){
                        return  outDevInfo[i].PORT;
                    }
                }
                return null;
            },
            closePortDialog() { 
                let me = this;
                me.portFlowDialog.Isshow = false;
                me.getNetStatusData();
            },

            //若某一个电源口连接一个“光传输设备”，则此电源按钮不能点击，置为灰色
            getTransDevStatus(powerId) {
                let me = this;
                let outDevInfo = _.clone(me.outDevInfo);
                let hasExist = outDevInfo.filter(it => it.OUTDEV_POWER_ID === powerId && it.OUTDEV_TYPE == 5);//判断外设中，是否有光传输连在此电源口上
                return hasExist.length > 0 ? true : false;
            },

            //智能机箱的各个box中的信息绑定
            async queryBoxInfo(deviceId) {
                let me = this;
                let response = await me.$http.post(
                    // RESTFUL.injective.Api.Box.queryDeviceInfo,
                    RESTFUL.injective.Api.Command.query,
                    {
                        // deviceId : deviceId
                        methodName: 'queryDeviceInfo',
                        body: [deviceId]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                    console.info(response);
                if (response.body.success) {
                    /***
                     * 智能机箱中的设备信息
                     * 
                     * 
                     */
                    if(!response.body.model.queryDeviceInfoMap){    //如果在刷新智能机箱页面时，而此时该设备ID所在的设备已经删除，则给提醒
                        console.info(response.body.model.queryDeviceInfoMap);
                        me.$message.error("暂无此设备", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                    }
                    me.deviceInfoBox.deviceName = response.body.model.queryDeviceInfoMap.DEV_NAME;
                    me.deviceInfoBox.deviceModel = response.body.model.queryDeviceInfoMap.DEV_MODEL;
                    me.deviceInfoBox.deviceIp = response.body.model.queryDeviceInfoMap.DEV_IP;
                    me.deviceInfoBox.deviceX = response.body.model.queryDeviceInfoMap.DEV_LONGITUDE;
                    me.deviceInfoBox.deviceY = response.body.model.queryDeviceInfoMap.DEV_LATITUDE; 
                    me.deviceMac = response.body.model.queryDeviceInfoMap.DEV_MAC;
                    me.deviceInfoBox.areaName = response.body.model.queryDeviceInfoMap.AREA_NAME;//将查询出的设备信息绑定到设备信息box中
                    me.deviceInfoBox.onlineStatus = response.body.model.queryDeviceInfoMap.ONLINE_STATUS;

                    let queryDevPerformMap = response.body.model.queryDevPerformMap;    //查询的所有性能级的数据
                    //自动重合闸数据显示
                    let voltHighThreshold = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("VOLT_HIGH_THRESHOLD") > -1);  //过压阈值
                    if (voltHighThreshold.length) {
                        voltHighThreshold = voltHighThreshold[0].PERFORM_VALUE;
                        me.deviceInfoDailog.automatic.overValue = voltHighThreshold;
                    }
                    let volLowThreshold = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("VOLT_LOW_THRESHOLD") > -1);   //欠压阈值
                    if (volLowThreshold.length) {
                        volLowThreshold = volLowThreshold[0].PERFORM_VALUE;
                        me.deviceInfoDailog.automatic.underValue = volLowThreshold;
                    }
                    let leakageThreshold = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("ELECTRICITY_LEAKAGE_THRESHOLD") > -1);//漏电阈值
                    if (leakageThreshold.length) {
                        leakageThreshold = leakageThreshold[0].PERFORM_VALUE;
                        me.deviceInfoDailog.automatic.leakValue = leakageThreshold;
                    }

                    //倾斜角度数据显示
                    let leftThreshold = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("LEAN_THRESHOLD") > -1);  //倾斜阈值     LEAN_ANGLE倾斜角度
                    if (leftThreshold.length) {
                        leftThreshold = leftThreshold[0].PERFORM_VALUE;
                        leftThreshold = JSON.parse(leftThreshold.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']'));//倾斜角度数据转化为数组数据
                        me.deviceInfoDailog.deviceTilt.frontValue = leftThreshold[0][1];//前
                        me.deviceInfoDailog.deviceTilt.afterValue = leftThreshold[1][1];//后
                        me.deviceInfoDailog.deviceTilt.leftValue = leftThreshold[2][1];//左
                        me.deviceInfoDailog.deviceTilt.rightValue = leftThreshold[3][1];//右
                        // me.deviceInfoDailog.deviceTilt.upValue = leftThreshold[4][1];//上
                        // me.deviceInfoDailog.deviceTilt.downValue = leftThreshold[5][1];//下
                    }


                    /***
                     * 智能机箱中的告警信息
                     * 
                     * 
                     */
                    me.alarmInfoBox = response.body.model.queryAlarmInfoMap;//将查询出的告警信息绑定到告警信息box中

                    /***
                     * 智能机箱中的端口流量
                     * 
                     * 
                     */

                    let portFlux = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("PORT_FLUX") > -1);  //端口流量值
                    me.portData = [];
                    let perFormValue = null;    //端口流量值
                    let portLinkStatus = null;  //端口link状态
                    let portAdminStatus = null; // 端口开关状态
                    // me.networkMax = 0;
                    if (portFlux.length) {
                        perFormValue = portFlux[0].PERFORM_VALUE;
                        perFormValue = perFormValue && JSON.parse(perFormValue.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']')) || null;//端口流量数据转化为数组数据
                        //me.networkMax = perFormValue.length;
                    }

                    let portLinkStatusList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("PORT_LINK_STATUS") > -1);  //端口link状态
                    if (portLinkStatusList.length) {
                        portLinkStatus = portLinkStatusList[0].PERFORM_VALUE;
                        portLinkStatus = portLinkStatus && JSON.parse(portLinkStatus.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']')) || null;//端口link状态数据转化为数组数据
                    }

                    let portAdminStatusList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("PORT_ADMIN_STATUS") > -1);  //端口开关状态
                    if (portAdminStatusList.length) {
                        portAdminStatus = portAdminStatusList[0].PERFORM_VALUE;
                        portAdminStatus = portAdminStatus && JSON.parse(portAdminStatus.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']')) || null;//端口开关状态数据转化为数组数据
                    }

                    //将端口流量、端口link和端口开关的数据整合成一个数组 ，perFormValue内部数据为[[端口号,流量值,link状态,开关状态].......]
                    if (portAdminStatus || portLinkStatus || perFormValue) {
                        let tempArr = [];
                        for (let i = 0, n = portAdminStatus.length; i < n; i++) {
                            let [index, a] = perFormValue && perFormValue.length && perFormValue[i] || [i + 1, 0];
                            let [, s] = portLinkStatus[i];
                            let [, t] = portAdminStatus[i];
                            tempArr.push([index, a, s, t]);
                        }
                        //再将数据两两组合一起
                        me.portData = _.chunk(tempArr, 2);
                    }

                    /***
                      * 智能机箱中的环境监测
                      * 
                      * 
                      */
                    let monitoringData = null;
                    monitoringData = queryDevPerformMap.filter(it => it.DATA_TYPE === 2).map(it => {
                        let capability = { 
                            id : it.ID, 
                            perform_name : it.PERFORM_NAME, 
                            perform_type : it.PERFORM_TYPE, 
                            data_type : it.DATA_TYPE, 
                            perform_value : it.PERFORM_VALUE, 
                            perform_description  : it.PERFORM_DESCRIPTION
                        }
                        return CapabilityFactory.getInstance().createCapability(it.PERFORM_NAME, capability);
                    }); //环境监测的数据
                    // let thunderList = monitoringData.filter(it => it.PERFORM_NAME == "THUNDER_DEFENCE");//查看是否有防雷信息，如果有，则需要拿出来再解析
                    // if(thunder.length){
                    //     monitoringData = monitoringData.filter(it => it.PERFORM_NAME != "THUNDER_DEFENCE"); //将防雷信息先剔除
                    //     let thunder = thunderList[0].PERFORM_VALUE;
                    //     thunder = JSON.parse(thunder.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']'));  //防雷信息从字符串解析成数组

                    // }
                    // me.monitoringData = _.chunk(monitoringData, 2);
                    me.monitoringData = monitoringData;

                    /***
                     * 
                     * 设备监控
                     */
                    let deviceControl = queryDevPerformMap.filter(it => it.DATA_TYPE === 3);    //设备监控
                    me.boxState = deviceControl.map(it => ({ ...it, index: it.PERFORM_VALUE === "1" })).sort((itA, itB) => itA.PERFORM_NAME < itB.PERFORM_NAME ? -1 : itA.PERFORM_NAME === itB.PERFORM_NAME ? 0 : 1);
                    let fanControlModelList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("FAN_MODE") > -1);
                    if(fanControlModelList.length>0){
                        let fanControlModel = fanControlModelList[0].PERFORM_VALUE;
                        if(fanControlModel == "1"){     //如果是温度控制，则在设备控制中不能显示风扇的开关按钮
                            me.boxState = me.boxState.filter(it => it.PERFORM_NAME != "FAN_CFG_STATUS");
                        }
                    }
                    

                    /***
                     * 智能机箱中的电源口，外设
                     * 
                     * 
                     */
                    let devicePowerVolList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("OUTPUT_POWER_VOL") > -1); //该设备所有电源口的电压
                    let devicePowerVol = null;  //电源电压
                    let deviceCurrent = null;   //电源电流
                    let devicePowerStatus = null;   //电源开关状态
                    let monitorLength = 0;  //电源口的多少
                    if (devicePowerVolList.length) {
                        devicePowerVol = devicePowerVolList[0].PERFORM_VALUE;
                        devicePowerVol = JSON.parse(devicePowerVol.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']'));//电源电压数据转化为数组数据
                        monitorLength = devicePowerVol.length;
                        me.monitorLength = monitorLength;
                    } else {
                        devicePowerVol = [];
                    }

                    let deviceCurrentList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("OUTPUT_POWER_CURRENT") > -1); //该设备所有电源口的电流
                    if (deviceCurrentList.length) {
                        deviceCurrent = deviceCurrentList[0].PERFORM_VALUE;
                        deviceCurrent = JSON.parse(deviceCurrent.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']'));//电源电流数据转化为数组数据
                    } else {
                        deviceCurrent = [];
                    }

                    let devicePowerStatusList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("OUT_POWER_STATUS") > -1); //该设备输出电源开关状态
                    if (devicePowerStatusList.length) {
                        devicePowerStatus = devicePowerStatusList[0].PERFORM_VALUE;
                        devicePowerStatus = devicePowerStatus && JSON.parse(devicePowerStatus.replace(/^(\s?\{)/g, '[').replace(/(\}\s?)$/g, ']')) || [];//电源开关状态字符串转化为数组数据
                    } else {
                        devicePowerStatus = [];
                    }

                    //将电源，电压，开关状态数据解构，然后组装成一个数组,例如:[[1,10V,10A,1],[2,240v,12A,0].....]
                    let [[index] = []] = devicePowerVol || [];
                    let [[, v1] = [], [, v2] = [], [, v3] = [], [, v4] = [], [, v5] = [], [, v6] = [], [, v7] = [], [, v8] = [], [, v9] = []] = devicePowerVol || [];
                    let [[, a1] = [], [, a2] = [], [, a3] = [], [, a4] = [], [, a5] = [], [, a6] = [], [, a7] = [], [, a8] = [], [, a9] = []] = deviceCurrent || [];
                    let [[, s1] = [], [, s2] = [], [, s3] = [], [, s4] = [], [, s5] = [], [, s6] = [], [, s7] = [], [, s8] = [], [, s9] = []] = devicePowerStatus || [];
                    let devicePower = [
                        [index + 0, v1, a1, s1, a1 !== undefined || v1 !== undefined || s1 !== undefined],
                        [index + 1, v2, a2, s2, a2 !== undefined || v2 !== undefined || s2 !== undefined],
                        [index + 2, v3, a3, s3, a3 !== undefined || v3 !== undefined || s3 !== undefined],
                        [index + 3, v4, a4, s4, a4 !== undefined || v4 !== undefined || s4 !== undefined],
                        [index + 4, v5, a5, s5, a5 !== undefined || v5 !== undefined || s5 !== undefined],
                        [index + 5, v6, a6, s6, a6 !== undefined || v6 !== undefined || s6 !== undefined],
                        [index + 6, v7, a7, s7, a7 !== undefined || v7 !== undefined || s7 !== undefined],
                        [index + 7, v8, a8, s8, a8 !== undefined || v8 !== undefined || s8 !== undefined],
                        [index + 8, v9, a9, s9, a9 !== undefined || v9 !== undefined || s9 !== undefined]
                    ];
                    me.devicePower = devicePower;

                    //该智能机箱的所有外设信息
                    let outDevInfo = response.body.model.queryOutDeviceInfoMap;
                    //outDevInfo = outDevInfo.filter(it => it.PORT != '0');   //将网口是0的闪光灯和补光灯剔除掉
                    me.outDevInfo = outDevInfo;
                    let result = [];
                    if(outDevInfo && outDevInfo.length >= 2) {
                        result = _.cloneDeep(outDevInfo).reduce((cur, next) => {
                            if(cur.map && cur.map.hasOwnProperty(next.OUTDEV_POWER_ID)) {
                                return { ...next, map : { ...cur.map, [next.OUTDEV_POWER_ID] : (cur.map[next.OUTDEV_POWER_ID] + 1) } }
                            }
    
                            if(!cur.map) {
                                let total = cur.OUTDEV_POWER_ID === next.OUTDEV_POWER_ID ? 2 : 1;
                                return { ...next, map : { [cur.OUTDEV_POWER_ID] : 1, [next.OUTDEV_POWER_ID] : total } }
                            }
                            return { ...cur };
                        });
                    } else if(outDevInfo && outDevInfo.length === 1) {
                        result = { ...outDevInfo[0], map : { [outDevInfo[0].OUTDEV_POWER_ID] : 1 } };
                    }
                    me.networkMax =result.map instanceof Array && 0 || _.max(_.values(result.map));
                    // me.networkMax = Math.max.apply(Math, [...outDevInfo.map(it => it.PORT || ''), 0]);

                    //设备箱控制中的风扇配置数据回显
                    let fanControlList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("DEV_TEMP") > -1
                        || it.PERFORM_NAME.indexOf("FAN_MODE") > -1
                        || it.PERFORM_NAME.indexOf("FAN_CFG_STATUS") > -1
                        || it.PERFORM_NAME.indexOf("FAN_TEMP_THRESHOLD") > -1
                        || it.PERFORM_NAME.indexOf("FAN_POWER_ID") > -1);
                    if (fanControlList) {
                        for (let item of fanControlList) {
                            if (item.PERFORM_NAME == "DEV_TEMP") {
                                me.deviceControlDailog.fanControl.nowTemperature = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "FAN_MODE") {
                                me.deviceControlDailog.fanControl.controlModel = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "FAN_CFG_STATUS") {
                                me.deviceControlDailog.fanControl.control = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "FAN_TEMP_THRESHOLD") {
                                me.deviceControlDailog.fanControl.temperValue = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "FAN_POWER_ID"){
                                me.deviceControlDailog.fanControl.fanPowerId = item.PERFORM_VALUE;
                            }
                        }
                    }

                    //设备箱控制中的加热器配置数据回显
                    let heaterControlList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("DEV_TEMP") > -1
                        || it.PERFORM_NAME.indexOf("HEATER_MODE") > -1
                        || it.PERFORM_NAME.indexOf("HEATER_WORK_STATUS") > -1
                        || it.PERFORM_NAME.indexOf("HEATER_TEMP_THRESHOLD") > -1
                        || it.PERFORM_NAME.indexOf("HEATER_POWER_ID") > -1);
                    if (heaterControlList) {
                        for (let item of heaterControlList) {
                            if (item.PERFORM_NAME == "DEV_TEMP") {
                                me.deviceControlDailog.heaterControl.nowTemperature = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "HEATER_MODE") {
                                me.deviceControlDailog.heaterControl.controlModel = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "HEATER_WORK_STATUS") {
                                me.deviceControlDailog.heaterControl.control = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "HEATER_TEMP_THRESHOLD") {
                                me.deviceControlDailog.heaterControl.heaterValue = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "HEATER_POWER_ID") {
                                me.deviceControlDailog.heaterControl.heaterPowerId = item.PERFORM_VALUE;
                            }
                        }
                    }


                }
            },

            //自动重合闸重启按钮点击
            async autoRecloseResetControl() {
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行重启操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);
                let deviceId = me.id;
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    {
                        // deviceId : deviceId
                        commandCode: 'gm008',
                        body: [deviceId]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                if (response.body.success && response.body.model.msgcode === '0') {
                    me.changeLoadState(false);
                    me.$message.success("重启成功", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                } else {
                    me.changeLoadState(false);
                    me.$message.error("重启失败", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                }
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
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);
                let deviceId = me.id;
                let slopeSetValue = `[1:${me.deviceInfoDailog.deviceTilt.frontValue}]@[2:${me.deviceInfoDailog.deviceTilt.afterValue}]@[3:${me.deviceInfoDailog.deviceTilt.leftValue}]@[4:${me.deviceInfoDailog.deviceTilt.rightValue}]@[5:${me.deviceInfoDailog.deviceTilt.upValue}]@[6:${me.deviceInfoDailog.deviceTilt.downValue}]`;
                        
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    {
                        commandCode: 'gm009',
                        body: [deviceId, slopeSetValue]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                if (response.body.success && response.body.model.msgcode === '0') {
                    me.changeLoadState(false);
                    me.$message.success("阈值设置成功", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    me.deviceInfoDailog.Isshow = false;
                } else {
                    me.changeLoadState(false);
                    me.$message.error("设置失败", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
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
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);
                let deviceId = me.id;
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    {
                        // deviceId : deviceId
                        commandCode: 'gm010',
                        body: [deviceId]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                if (response.body.success && response.body.model.msgcode === '0') {
                    me.changeLoadState(false);
                    me.$message.success("调校成功", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                } else {
                    me.changeLoadState(false);
                    me.$message.error("调校失败", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                }
            },

            //网络状态监测阈值配置
            async netWorkStatusSet() {
                let me = this;
                let valid = await this.$refs.ruleForm.validate().catch(() => {
                    return false;
                })
                if (valid){
                    let roleId = me.User.role.id;
                    if(roleId == 'op'){ //说明是操作员
                        me.$message.error("权限不足，无法进行配置操作", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            return;
                    }
                    if(!me.deviceInfoBox.onlineStatus){
                        me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                    }
                    me.changeLoadState(true);
                    let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    {
                        commandCode: 'gm021',
                        body: [me.decToHex(me.deviceMac),
                        me.portFlowDialog.status,
                        parseInt(me.portFlowDialog.intervalTime),
                        parseInt(me.portFlowDialog.packetRate),
                        parseInt(me.portFlowDialog.delayedTime)
                        ]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        me.queryBoxInfo(me.id);
                        me.$message.success("阈值设置成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        me.portFlowDialog.Isshow = false;
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("设置失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                }
                
            },
            //设备监控中的风扇控制或风扇阈值设置
            async fanCfgControlOrTemperAtureSet() {
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行配置操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);
                let model = me.deviceControlDailog.fanControl.controlModel;//模式
                if (model === '1') {      //温度控制，则是风扇阈值设置
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: 'gm022',
                            body: [me.decToHex(me.deviceMac), model, me.deviceControlDailog.fanControl.temperValue]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        me.queryBoxInfo(me.id);
                        me.$message.success("阈值设置成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        me.deviceControlDailog.Isshow = false;
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("设置失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                } else {      //手动控制，则是风扇控制
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: 'gm018',
                            body: [me.decToHex(me.deviceMac), me.deviceControlDailog.fanControl.control, model]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        me.queryBoxInfo(me.id);
                        me.$message.success("下发成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        me.deviceControlDailog.Isshow = false;
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("下发失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                }
            },

            //设备监控中加热器控制或加热器阈值设置
            async heaterTemperControOrSet() {
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行配置操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);
                let model = me.deviceControlDailog.heaterControl.controlModel;
                if (model === '1') {  //温度控制，则是加热器阈值设置
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: 'gm014',
                            body: [me.decToHex(me.deviceMac), parseInt(me.deviceControlDailog.heaterControl.heaterValue), model]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        me.queryBoxInfo(me.id);
                        me.$message.success("阈值设置成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("设置失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                } else {  //手动控制，则是加热器控制
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: 'gm013',
                            body: [me.decToHex(me.deviceMac), me.deviceControlDailog.heaterControl.control, model]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        me.queryBoxInfo(me.id);
                        me.$message.success("下发成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        me.deviceControlDailog.Isshow = false;
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("下发失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                }
            },

            //设备监控中设备重启
            async deviceRestartControl() {
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行控制操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.changeLoadState(true);
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    {
                        commandCode: 'gm019',
                        body: [me.decToHex(me.deviceMac)]
                    },
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                if (response.body.success && response.body.model.msgcode === '0') {
                    me.changeLoadState(false);
                    me.queryBoxInfo(me.id);
                    me.$message.success("下发成功", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                } else {
                    me.changeLoadState(false);
                    me.$message.error("下发失败", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                }
            },

            //智能机箱重置时验证当前角色是否有权限重置机箱
            checkRoleIsControlDevice(){
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行控制操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }
                me.deviceResetDialog.isshow = true;
            },

            //智能机箱重置
            async deviceResetControl() {
                // if(){
                //验证用户密码是否正确，然后重置机箱
                // }
                let me = this;
                let sha = new Key();
                let key = me.User.key;
                let newPas = sha.SHA(me.deviceResetDialog.password, true);
                let input = sha.stringify({ str : me.User.password, key }, true);
                if(newPas === input) {
                    me.changeLoadState(true);
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: 'gm020',
                            body: [me.decToHex(me.deviceMac)]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        me.$message.success("下发成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            me.deviceResetDialog.isshow = false;
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("下发失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                }else{
                    me.$message.error("密码验证失败，不能重置", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                }
            },

            //端口流量中网络端口的开关控制
            portSwitchControl(arr, rowIndex, colIndex) {
                let me = this;
                let roleId = me.User.role.id;
                if(roleId == 'op'){ //说明是操作员
                    me.$message.error("权限不足，无法进行控制操作", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        return;
                }
                if(!me.deviceInfoBox.onlineStatus){
                    me.$message.error("设备已离线，无法进行操作", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    return;
                }

                me.$confirm('是否控制此网络端口？', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(async () => {
                    me.changeLoadState(true);
                    let portStatus = null;
                    if (arr[3]) {     //说明点击前的状态是关闭状态，则需要开启
                        portStatus = '0';
                    } else {       //说明点击前的状态时开启状态，则需要关闭
                        portStatus = '1';
                    }
                    let response = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        {
                            commandCode: 'gm023',
                            body: [me.decToHex(me.deviceMac), arr[0], portStatus]
                        },
                        {
                            emulateJSON: false,
                            emulateHTTP: true
                        });
                    if (response.body.success && response.body.model.msgcode === '0') {
                        me.changeLoadState(false);
                        //me.queryBoxInfo(me.id);
                        let updateVol = [...arr];
                        if(arr[3]){
                            updateVol[3] = 0;
                            updateVol[2] = 0;
                        }else{
                            updateVol[3] = 1;
                            updateVol[2] = 1;
                        }
                        me.$set(me.portData[rowIndex], colIndex, updateVol);
                        me.$message.success("下发成功", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    } else {
                        me.changeLoadState(false);
                        me.$message.error("下发失败", "提示",
                            { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                    })
            },
            //设备监控中所有控制项的控制操作
            sortDeviceControl(val, perFormName) {
                let me = this;
                let roleId = me.User.role.id;
                // if(roleId == 'op'){ //说明是操作员
                //     me.$message.error("权限不足，无法进行控制操作", "提示",
                //         { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                //         me.queryBoxInfo(me.id);
                //         return;
                // }
                me.$confirm('是否控制此状态？', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(async () => {
                    me.changeLoadState(true);
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
                        if (response.body.success && response.body.model.msgcode === '0') {
                            me.changeLoadState(false);
                            me.queryBoxInfo(me.id);
                            me.$message.success("下发成功", "提示",
                                { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        } else {
                            me.changeLoadState(false);
                            me.queryBoxInfo(me.id);
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
                        if (response.body.success && response.body.model.msgcode === '0') {
                            me.changeLoadState(false);
                            me.queryBoxInfo(me.id);
                            me.$message.success("下发成功", "提示",
                                { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            me.deviceControlDailog.Isshow = false;
                        } else {
                            me.changeLoadState(false);
                            me.queryBoxInfo(me.id);
                            me.$message.error("下发失败", "提示",
                                { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                        }

                    }
                    else if (perFormName === 'LOCKTONGUE_STATUS') {    //锁舌状态控制，只能开，不能关
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
                            if (response.body.success && response.body.model.msgcode === '0') {
                                me.changeLoadState(false);
                                me.queryBoxInfo(me.id);
                                me.$message.success("下发成功", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            } else {
                                me.changeLoadState(false);
                                me.queryBoxInfo(me.id);
                                me.$message.error("下发失败", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                            }
                        }
                    }
                }).catch(() => {
                    me.queryBoxInfo(me.id);
                })
            },
            //网络状态监测配置数据显示
            async getNetStatusData(){
                let me = this;
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Box.getNetStatusData,
                    {},
                    {
                        emulateJSON: false,
                        emulateHTTP: true
                    });

                if(response.status === 200 && response.body.success){
                    let queryDevPerformMap = response.body.model;
                    let netStautsCheckList = queryDevPerformMap.filter(it => it.PERFORM_NAME.indexOf("NET_MONITOR_ENABLE") > -1
                        || it.PERFORM_NAME.indexOf("PING_INTERVAL") > -1
                        || it.PERFORM_NAME.indexOf("PACKET_LOSS_THRESHOLD") > -1
                        || it.PERFORM_NAME.indexOf("DELAY_TIME_THRESHOLD") > -1);//网络状态监测配置四条数据
                    if (netStautsCheckList) {
                        for (let item of netStautsCheckList) {
                            if (item.PERFORM_NAME == "NET_MONITOR_ENABLE") {
                                me.portFlowDialog.status = item.PERFORM_VALUE;
                            } else if (item.PERFORM_NAME == "PING_INTERVAL") {
                                me.portFlowDialog.intervalTime = parseInt(item.PERFORM_VALUE);
                            } else if (item.PERFORM_NAME == "PACKET_LOSS_THRESHOLD") {
                                me.portFlowDialog.packetRate = parseInt(item.PERFORM_VALUE);
                            } else if (item.PERFORM_NAME == "DELAY_TIME_THRESHOLD") {
                                me.portFlowDialog.delayedTime = parseInt(item.PERFORM_VALUE);
                            }
                        }
                    }
                }
            },
            //获取环境监测图表样式
            getIconStyle(performName, performValue){
                if(['FAN_MODE','FAN_TEMP_THRESHOLD','FAN_WORK_STATUS','FAN_SPEED'].indexOf(performName) > -1){  //风扇图标
                    return performValue == '0' ? ['box-fanIcon'] : ['box-fanIcon', 'active'];
                }else if(['DEV_TEMP','DEV_HUMIDITY'].indexOf(performName) > -1){      //温度图标
                    return performValue = ['box-tempValue'];
                }else if(['DEV_POWER_RATE','INPUT_VOLT','DEV_ENERGY'].indexOf(performName) > -1){     //电压图标
                    return performValue = ['box-volIcon'];
                }else if(['INPUT_CURRENT'].indexOf(performName) > -1){        //电流图标
                    return performValue = ['box-electricityIcon'];
                }else if(['HEATER_MODE','HEATER_WORK_STATUS'].indexOf(performName) > -1){   //加热器图标
                    return performValue == '0' ? ['box-heaterIcon'] : ['box-heaterIcon','active']; 
                }else if (['THUNDER_DEFENCE'].indexOf(performName) > -1){       //防雷信息的图标
                    return performValue = ['box-thunderIcon'];
                }else {         //其余所有的都用数值图标
                    return performValue = ['box-numValueIcon'];
                }
            },
            refreshAllData(){
                let me = this;
                me.queryBoxInfo(me.id);
                me.$message.success("刷新成功", "提示", { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
            },
            ...mapActions({
                'changeLoadState' : 'Equipment/changeLoadState'
            })
        },
        mounted(){
            let me = this;
            me.getNetStatusData();
            me.loadDeviceType();
            me.queryBoxInfo(me.id);
            let timer = setInterval(() => {
               //定时刷 
               me.queryBoxInfo(me.id);
            }, 30000);
            me.$once("hook:beforeDestroy", () => {
                clearInterval(timer);
            })
        }
    }
})()