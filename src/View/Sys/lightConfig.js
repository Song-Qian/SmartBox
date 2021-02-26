import RESTFUL from '~/Scripts/Util/RestfulApi'
import _ from "lodash";

export default (function () {
    return {
        name: 'LightConfig',
        data() {
            return {
                treeData: [],
                exceptionDeviceList: [],
                hasFold: false,
                rows: [],
                showSelect: true,
                treeProps: {
                    label: 'name',
                    isLeaf: 'leaf'
                },
                capConfigMap: new Map(),
                hasConfigDialogShow: false,
                hasTimeDialogShow: false,
                configForm: {
                    switchConfig: -1,
                    capConfig: -1,
                    powerConfig: 0,
                    timeConfig: 0,
                },
                switchOptions: [
                    {label: '不做修改', value: -1},
                    {label: '开启', value: 1},
                    {label: '关闭', value: 0},
                ],
                selectDevice: '',
                capOptions: [
                    {label: '不做修改', value: -1},
                    {label: '无灯', value: 0},
                    {label: '有灯无倒计时器', value: 1},
                    {label: '有灯和全程倒计时器', value: 2},
                    {label: '有灯和半程倒计时器', value: 3},
                ],
            }
        },
        methods: {
            clickNode(data, node, vnode) {
                let me = this;
                if (data.deviceType === 'WTOS-VN-TME200') {
                    me.queryLight(data.devId)
                    me.selectDevice = data;
                    if (data.isOnline === 0) {
                        me.showSelect = false;
                    } else {
                        me.showSelect = true;
                    }

                }
            },
            /**
             * 页面数据查询
             */
            async queryLight(deviceId) {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Box.lightConfig,
                    JSON.stringify({
                        deviceId: deviceId || null,
                    }),
                    {emulateJSON: true, emulateHTTP: false}
                )
                if (res.body.success) {
                    me.rows = res.body.model;
                    return;
                }
                me.$message.error(res.body.errorMessage);
            },
            loadTreeNode(node, resolve) {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Area.AreaInfo,
                    JSON.stringify({
                        parentId: node.data.id || '',
                        type: node.data.type || '',
                        devId: node.data.devId || '',
                        deviceType: 'WTOS-VN-TME200',
                        areaCode: node.data.no || null
                    }),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        let data = res.body.model.map(it => ({
                                ...it,
                                id: it.id,
                                name: it.name,
                                type: it.type,
                                total: it.total,
                                deviceIP: it.devIp,
                                coordinates: it.coordinates,
                                deviceType: it.deviceType,
                                mac: it.mac,
                                isOnline: it.isOnline
                            })
                        );
                        resolve(data);
                        node.loaded = false;
                        node.loading = false;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            async queryAlarmIdListFromNotDeal() {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.AlarmInfo.getAlarmIdListFromNotDeal,
                    {},
                    {emulateJSON: false, emulateHTTP: true}
                );
                me.exceptionDeviceList = [];
                if (res.status === 200 && res.data.success) {
                    let result = res.data.model;
                    me.exceptionDeviceList = result.map(it => it.DEV_ID && it.DEV_ID.toString());
                }
            },
            handlerTreeCheckChange(data, isCheck, childrenNode) {
                let me = this;
                if (isCheck) {
                    me.search.areaNo = data.no;
                } else {
                    me.search.areaNo = '';
                }
            },
            handlerCalcTreeNodeTotal(guid) {
                let me = this;
                if (!guid)
                    return " (0) ";
                if (guid) {
                    let node = me.$refs.tree.getNode(guid);
                    let total = node.data.total;
                    let deviceList = ['WTOS-VN', 'WTOS-VE', '1', '2', '3', '4', '5'].filter(it => it === me.deviceType || !me.deviceType);

                    if (node.childNodes.length >= 2) {
                        let calcSize = (cur, next) => {
                            let total = typeof cur === "number" ? cur : (deviceList.indexOf(cur.data.type) > -1 && 1 || cur.data.total || 0);
                            return total + (deviceList.indexOf(next.data.type) > -1 && 1 || next.data.total || 0);
                        }
                        let children = _.cloneDeep(node.childNodes);
                        total = children.reduce(calcSize);
                    }

                    let online=node.data.onlineNum;
                    if(node.childNodes.length === 1) {
                        node.data.total = total;
                        return ` (${online+'/'+total})`;
                    }
                    node.data.total = total;
                    return ` (${online}/${total}) `;
                }
                return " (0) ";
            },

            handlerOverlayClosed() {
                let me = this;
                me.hasConfigDialogShow = false;
                me.hasDialogShow = false;
                me.configForm.capConfig = -1;
                me.configForm.powerConfig = 0;
                me.configForm.switchConfig = -1;
                me.$refs.configTable.clearSelection();
                me.queryLight(me.selectDevice.id);
            },
            /**
             * 灯亮时长设置界面关闭
             */
            handlerOverlayClosed2() {
                let me = this;
                me.hasTimeDialogShow = false;
                me.configForm.timeConfig = 0;
                me.$refs.configTable.clearSelection();
                me.queryLight(me.selectDevice.id);
            },
            handlerTreeMenuContext() {
            },
            showConfigDialog() {
                let me = this;
                let selections = this.$refs.configTable.selection;
                if (!selections || selections.length < 1) {
                    return me.$message.error("请选择需要修改数据!!!")
                }
                me.configForm = {
                    switchConfig: selections[0].switchConfig,
                    capConfig: selections[0].capConfig,
                    powerConfig: selections[0].powerConfig,
                    timeConfig: selections[0].timeConfig,
                },
                    me.hasConfigDialogShow = true;
            },
            //设置倒计时前置判断
            async showTimeDialog() {
                let me = this;
                let selections = me.$refs.configTable.selection;
                if (!selections || selections.length < 1) {
                    return me.$message.error("请选择需要修改数据!!!")
                }
                //查询设备当前的运行模式
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Box.lightOption,
                    JSON.stringify({
                        deviceId: me.selectDevice.id,
                        paramCode: "SIGNAL_USERLIGHTMODECONFIG",
                    }),
                    {emulateJSON: true, emulateHTTP: false}
                )
                if (res.body.success) {
                    if (res.body.model.lightConfigMode == "1") {
                        return me.$message.error("自动模式不支持修改运行时长，请先将信号机时长运行模式改为手动模式！！！")
                    } else {
                        me.configForm.timeConfig = selections[0].userLightConfig;
                        me.hasTimeDialogShow = true;
                    }
                }

            },
            /**
             * 设置灯开关
             * @returns {ElMessageComponent}
             */
            setLightSwitchs: function () {
                let me = this;
                let selections = me.$refs.configTable.selection;
                let selectionMaps = new Map();
                let switchOption = me.configForm.switchConfig;
                if (switchOption === -1) {
                    return me.$message.error("请先设置开启或关闭信号灯!!!")
                }
                selections.map(d => selectionMaps.set(d.no , switchOption));
                let data = "";
                me.rows.map(d => {
                    let config;
                    if (selectionMaps.has(d.no)) {
                        config = selectionMaps.get(d.no);
                    } else {
                        config = d.switchConfig;
                    }
                    data = data + "[" + d.no + ":" + config + "]@"
                });
                console.info(data)
                data = data.substring(0, data.length - 1);
                this.$confirm('此操作将修改信号的检测开关状态，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    let me = this;
                    me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        JSON.stringify({commandCode: "gm030", body: [me.selectDevice.id, data]}),
                        {emulateJSON: true, emulateHTTP: false}
                    ).then(res => {
                        if (res.body.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            me.queryLight(me.selectDevice.id);
                            me.hasConfigDialogShow = false;
                            return;
                        }
                        me.$message.error(res.body.errorMessage);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });

            },
            /**
             * 设置信号灯能力集
             * @returns {ElMessageComponent}
             */
            setLightCap() {
                let me = this;
                let selections = me.$refs.configTable.selection;
                let selectionMaps = new Map();
                let capOption = me.configForm.capConfig;
                if (capOption === -1) {
                    return me.$message.error("请先设置信号灯的能力集!!!")
                }
                selections.map(d => selectionMaps.set(d.no, capOption));
                let data = ""
                me.rows.map(d => {
                    let config;
                    if (selectionMaps.has(d.no)){
                        config =selectionMaps.get(d.no);
                    }else {
                        config = d.capConfig;
                    }
                    data = data + "[" + d.no + ":" + config + "]@"
                });
                data = data.substring(0, data.length - 1);
                this.$confirm('此操作将修改信号的能力集，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    let me = this;
                    me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        JSON.stringify({commandCode: "gm031", body: [me.selectDevice.id, data]}),
                        {emulateJSON: true, emulateHTTP: false},
                    ).then(res => {
                        if (res.body.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            me.queryLight(me.selectDevice.id);
                            me.hasConfigDialogShow = false;
                            return;
                        }
                        me.$message.error(res.body.errorMessage);
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });

            },
            /**
             * 设置运行时长
             */
            setLightTime() {
                let me = this;
                let selections = me.$refs.configTable.selection;
                let selectionMaps = new Map();
                let timeOption = me.configForm.timeConfig;
                if (!timeOption || timeOption < 0) {
                    return me.$message.error("请先设置信号灯的倒计时时长!!!")
                }
                selections.map(d => selectionMaps.set(d.no, timeOption));

                let data = ""
                me.rows.map(d => {
                    let config;
                    if (selectionMaps.has(d.no)){
                        config =selectionMaps.get(d.no);
                    }else {
                        config = d.userLightConfig || 0;
                    }
                    data = data + "[" + d.no + ":" + config + "]@"
                });
                data = data.substring(0, data.length - 1);
                this.$confirm('此操作将修改信号的倒计时时长，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    let me = this;
                    me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        JSON.stringify({commandCode: "gm037", body: [me.selectDevice.id, data]}),
                        {emulateJSON: true, emulateHTTP: false},
                    ).then(res => {
                        if (res.body.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            me.queryLight(me.selectDevice.id);
                            me.hasTimeDialogShow = false;
                            return;
                        }
                        me.$message.error(res.body.errorMessage);
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            /**
             * 检测阈值设置
             * @returns {ElMessageComponent}
             */
            setLightPower() {
                let me = this;
                let selections = me.$refs.configTable.selection;
                let selectionMaps = new Map();
                let powerOption = me.configForm.powerConfig;
                if (powerOption === -1) {
                    return me.$message.error("请先设置信号灯的检测阈值!!!")
                }
                selections.map(d => selectionMaps.set(d.no, powerOption));

                let data = ""
                me.rows.map(d => {
                    let config;
                    if (selectionMaps.has(d.no)){
                        config =selectionMaps.get(d.no);
                    }else {
                        config = d.powerConfig ;
                    }
                    data = data + "[" + d.no + ":" + config + "]@"
                });
                data = data.substring(0, data.length - 1);
                this.$confirm('此操作将修改信号的检测阈值，是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    let me = this;
                    me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        JSON.stringify({commandCode: "gm032", body: [me.selectDevice.id, data]}),
                        {emulateJSON: true, emulateHTTP: false},
                    ).then(res => {
                        if (res.body.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            me.queryLight(me.selectDevice.id);
                            me.hasConfigDialogShow = false;
                            return;
                        }
                        me.$message.error(res.body.errorMessage);
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });

            }

        },
        computed: {},
        mounted() {
            let me = this;
            me.queryAlarmIdListFromNotDeal();
        }
    }
})()
