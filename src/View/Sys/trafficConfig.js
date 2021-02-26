import RESTFUL from '~/Scripts/Util/RestfulApi'

export default (function () {
    return {
        name: 'TrafficConfig',
        data() {
            return {
                treeData: [],
                exceptionDeviceList: [],
                hasFold: false,

                rows: [],
                trafficForm: {
                    detectionCycle: 0,
                    timeOut: 0,
                    detectTimes: 0,
                    recoveryTime: 0,
                },
                turn0: '',
                turn1: '',
                turn2: '',
                turn3: '',
                turn4: '',
                turn5: '',
                turn6: '',
                turn7: '',
                turn8: '',
                turn9: '',
                all0: '',
                all1: '',
                all2: '',
                all3: '',
                all4: '',
                all5: '',
                all6: '',
                all7: '',
                all8: '',
                all9: '',
                modeConfig: '2',
                capConfigMap: new Map(),
                hasConfigDialogShow: false,
                hasModeDialogShow: false,
                hasCheckDialogShow: false,
            }
        },
        methods: {
            /**
             * 页面数据查询
             */
            async queryTraffic() {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Box.queryTrafficList,
                    {},
                    {emulateJSON: true, emulateHTTP: false}
                )
                if (res.body.success) {
                    me.rows = res.body.model;
                    return;
                }
                me.$message.error(res.body.errorMessage);
            },
            handlerOverlayClosed() {
                let me = this;
                me.hasConfigDialogShow = false;
                me.hasCheckDialogShow = false;
                me.hasModeDialogShow = false;
                me.hasDialogShow = false;
                me.modeConfig = '2';
                me.trafficForm.detectionCycle = 0;
                me.trafficForm.timeOut = 0;
                me.trafficForm.detectTimes = 0;
                me.trafficForm.recoveryTime = 0;
                me.turn0='';
                me.turn1='';
                me.turn2='';
                me.turn3='';
                me.turn4='';
                me.turn5='';
                me.turn6='';
                me.turn7='';
                me.turn8='';
                me.turn9='';

                me.all0= '';
                me.all1= '';
                me.all2= '';
                me.all3= '';
                me.all4= '';
                me.all5= '';
                me.all6= '';
                me.all7= '';
                me.all8= '';
                me.all9= '';
            },
            showConfigDialog() {
                let me = this;
                let selections = this.$refs.configTable.selection;
                if (!selections || selections.length < 1) {
                    return me.$message.error("请选择需要修改数据!!!")
                }
                console.info(selections)
                me.trafficForm = {
                    detectionCycle: selections[0].detectionCycle,
                    timeOut: selections[0].timeOut,
                    detectTimes: selections[0].detectTimes,
                    recoveryTime: selections[0].recoveryTime,
                },
                    this.hasConfigDialogShow = true;
            },
            showModeDialog() {
                let me = this;
                let selections = this.$refs.configTable.selection;
                if (!selections || selections.length < 1) {
                    return me.$message.error("请选择需要修改数据!!!")
                }
                if (selections[0].lightConfigMode == 1) {
                    me.modeConfig = '2';
                } else {
                    me.modeConfig = '1';
                }
                this.hasModeDialogShow = true;
            },
            showCheckDialog() {
                let me = this;
                let selections = this.$refs.configTable.selection;
                if (!selections || selections.length < 1) {
                    return me.$message.error("请选择需要修改数据!!!")
                }
                let turn = selections[0].turnSignalIgnore;
                if (turn) {
                    turn = turn.replace('{', '')
                    turn = turn.replace('}', '')
                    let turns = turn.split("@");
                    let result = [['',''],['',''],['',''],['',''],['','']];
                    for (let i = 0; i < turns.length; i++) {
                        result[i] = turns[i].split("-");
                    }
                    me.turn0 = result[0][0]||'';
                    me.turn1 = result[0][1]||'';
                    me.turn2 = result[1][0]||'';
                    me.turn3 = result[1][1]||'';
                    me.turn4 = result[2][0]||'';
                    me.turn5 = result[2][1]||'';
                    me.turn6 = result[3][0]||'';
                    me.turn7 = result[3][1]||'';
                    me.turn8 = result[4][0]||'';
                    me.turn9 = result[4][1]||'';
                }
                let all = selections[0].signalIgnore;
                if (all) {
                    all = all.replace('{', '')
                    all = all.replace('}', '')
                    let allTime = all.split("@");
                    let result = [['',''],['',''],['',''],['',''],['','']];
                    for (let i = 0; i < allTime.length; i++) {
                        result[i] = allTime[i].split("-");
                    }
                    me.all0 = result[0][0]||'';
                    me.all1 = result[0][1]||'';
                    me.all2 = result[1][0]||'';
                    me.all3 = result[1][1]||'';
                    me.all4 = result[2][0]||'';
                    me.all5 = result[2][1]||'';
                    me.all6 = result[3][0]||'';
                    me.all7 = result[3][1]||'';
                    me.all8 = result[4][0]||'';
                    me.all9 = result[4][1]||'';
                }
                me.hasCheckDialogShow = true;
            },
            setTrafficOptions() {
                let me = this;
                let selections = me.$refs.configTable.selection;

                me.$confirm('此操作将修改信号灯参数，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    selections.map(d => {
                        if (d.online === 1) {
                            me.updateTraffic(d.deviceId);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            setTrafficMode() {
                let me = this;
                let selections = me.$refs.configTable.selection;

                me.$confirm('此操作将修改信号灯的时长运行模式状态，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    selections.map(d => {
                        if (d.online === 1) {
                            me.updateMode(d.deviceId);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            async updateMode(deviceId) {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    JSON.stringify({commandCode: "gm036", body: [deviceId, me.modeConfig - 1]}),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        me.queryTraffic(me.selectDeviceId);
                        me.handlerOverlayClosed();
                        me.hasModeDialogShow = false;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            async updateTraffic(deviceId) {
                let me = this;
                let data = "[1:" + me.trafficForm.detectionCycle + "]@[2:" + me.trafficForm.timeOut + "]@[3:"
                    + me.trafficForm.detectTimes + "]@[4:" + me.trafficForm.recoveryTime + "]";
                me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    JSON.stringify({commandCode: "gm029", body: [deviceId, data]}),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        me.queryTraffic(me.selectDeviceId);
                        me.hasConfigDialogShow = false;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            handleSelectionChange(row) {
                let me = this;
                row.map(r => {
                    if (r.online === 0) {
                        me.$refs.configTable.toggleRowSelection(r, false);
                        me.$message.error("无法设置离线设备!!!")
                    }
                })
            },
            handleSelectionAll() {
                let me = this;
                me.$refs.configTable.data.map(r => {
                    if (r.online === 0) {
                        me.$refs.configTable.toggleRowSelection(r, false);
                        me.$message.error("无法设置离线设备!!!")
                    }
                })
            },
            setAllTrafficLight() {
                let me = this;
                let selections = me.$refs.configTable.selection;
                me.$confirm('此操作将修改所有信号灯屏蔽检测时段，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    selections.map(d => {
                        if (d.online === 1) {
                            me.updateAllTrafficLight(d.deviceId);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            async updateTurnLight(deviceId) {
                let me = this;
                let data = '';
                if (me.turn0 && me.turn1) {
                    if (me.turn0>me.turn1){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += me.turn0 + '-' + me.turn1;
                }
                if (me.turn2 && me.turn3) {
                    if (me.turn2>me.turn3){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.turn2 + '-' + me.turn3;
                }
                if (me.turn4 && me.turn5) {
                    if (me.turn4>me.turn5){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.turn4 + '-' + me.turn5;
                }
                if (me.turn6 && me.turn7) {
                    if (me.turn6>me.turn7){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.turn6 + '-' + me.turn7;
                }
                if (me.turn8 && me.turn9) {
                    if (me.turn8>me.turn9){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.turn8 + '-' + me.turn9;
                }
                if (data.indexOf("@") === 0){
                    data = data.substring(1,data.length);
                }
                if(data.length<1){
                    data = "empty";
                }
                me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    JSON.stringify({commandCode: "gm043", body: [deviceId, data]}),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        me.queryTraffic(me.selectDeviceId);
                        me.handlerOverlayClosed();
                        me.hasCheckDialogShow = false;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            setAllTurnLight() {
                let me = this;
                let selections = me.$refs.configTable.selection;
                me.$confirm('此操作将修改左右转信号灯屏蔽检测时段，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    selections.map(d => {
                        if (d.online === 1) {
                            me.updateTurnLight(d.deviceId);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            async updateAllTrafficLight(deviceId) {
                let me = this;
                let data = '';
                if (me.all0 && me.all1) {
                    if (me.all0>me.all1){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += me.all0 + '-' + me.all1;
                }
                if (me.all2 && me.all3) {
                    if (me.all2>me.all3){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.all2 + '-' + me.all3;
                }
                if (me.all4 && me.all5) {
                    if (me.all4>me.all5){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.all4 + '-' + me.all5;
                }
                if (me.all6 && me.all7) {
                    if (me.all6>me.all7){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.all6 + '-' + me.all7;
                }
                if (me.all8 && me.all9) {
                    if (me.all8>me.all9){
                        return me.$message.error("开始时间必须小于结束时间!!!")
                    }
                    data += '@' + me.all8 + '-' + me.all9;
                }
                if (data.indexOf("@") === 0){
                    data = data.substring(1,data.length);
                }
                if(data.length<1){
                    data = "empty";
                }
                me.$http.post(
                    RESTFUL.injective.Api.Command.Send,
                    JSON.stringify({commandCode: "gm042", body: [deviceId, data]}),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        me.queryTraffic(me.selectDeviceId);
                        me.handlerOverlayClosed();
                        me.hasCheckDialogShow = false;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            }
        },
        computed: {},
        mounted() {
            let me = this;
            me.queryTraffic();
        }
    }
})()
