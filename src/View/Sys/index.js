/**
 * Developer    :   SongQian
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   系统总览页面
 * Time         :   2019/05/23
 */
import _ from 'lodash'
import moment from 'moment'
import elementResizeEvent, {unbind} from 'element-resize-event'
import echarts from 'echarts'
import RESTFULAPI from '~/Scripts/Util/RestfulApi'
import {mapGetters} from "vuex";

export default (function () {

    //分类故障统计图表样式配置
    let type_echarts = {
        ec: null,
        options: {
            title: null,
            legend: {
                show: false
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    axis :'y'
                },
                formatter: ' 告警类型：{b} <br>  告警总数：{c} ',

            },
            dataZoom: [
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    show: true,
                    width: 15,
                    backgroundColor: 'transparent',
                    fillerColor: 'transparent',
                    borderColor: '#fff',
                    dataBackground: {
                        lineStyle: 'transparent',
                    },
                    lineStyle: {
                        color: 'transparent'
                    },
                    areaStyle: {
                        color: 'transparent'
                    },
                    textStyle: {
                        color: '#fff'
                    },
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    width: 15,
                    backgroundColor: 'transparent',
                    lineStyle: {
                        color: 'transparent'
                    },
                    areaStyle: {
                        color: 'transparent'
                    },
                    textStyle: {
                        color: '#fff'
                    }
                },
                {
                    type: 'slider',
                    show: false,
                    xAxisIndex: 0,
                    filterMode: 'empty',
                }
            ],
            xAxis: {
                type: 'value',
                splitNumber: 6,
                minInterval: 1,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#fff',
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
                    }
                }
            },
            yAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
                    }
                },
                axisLabel: {
                    show: false
                },
                data: []
            },
            series: [
                {
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'insideLeft',
                        verticalAlign: 'middle',
                        align: 'left',
                        distance: 20,
                        formatter: '{b} ({c})',
                        color: '#fff',
                        fontSize :14,
                    },
                    itemStyle: {
                        barBorderRadius: [0, 7.5, 7.5, 0],
                        color: (params) => {
                            return ['#ff5c4d', '#645aff', '#35ece4', '#f8508f', '#a447fe', '#35f1a8'][params.dataIndex % 6];
                        }
                    },
                    data: []
                }
            ]
        }
    }

    let area_echarts = {
        ec: null,
        options: {
            title: null,
            color: ['#ff5c4d', '#645aff', '#35ece4', '#ffc438', '#ccf43d', '#f8508f', '#a447fe', '#35f1a8'],
            legend: {
                x: 'center',
                top: '50%',
                orient: 'vertical',
                itemGap: 20,
                textStyle: {
                    color: '#fff'
                },
                type: 'scroll',
                pageIconColor: '#FFF',
                pageIconInactiveColor: '#2f4554',
                pageButtonGap: 5,
                pageIconSize: 14,
                pageFormatter: '{current}/{total}',
                pageTextStyle: {
                    color: '#FFF'
                },
            },
            series: [{
                name: '各区故障统计（一周内）',
                type: 'pie',
                center: ['50%', '25%'],
                radius: ['55%', '70%'],
                roseType: 'radius',
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        fontSize :14,
                        formatter: "{b}: {c} ({d}%)"
                    },
                    emphasis: {
                        show: true
                    },

                },
                data: []
            }]
        }
    }

    //仪表盘的图表样式配置
    let meter_echarts = {
        ec: null,
        options: {
            title: null,
            color: ['#00fafe', '#00fafe', 'rgba(66,174,227,0.59)'],
            series: [
                {
                    type: 'pie',
                    center: ['12.5%', '50%'],
                    radius: ['75%', '85%'],
                    hoverAnimation: false,
                    data: []
                },
                {
                    type: 'pie',
                    center: ['37.5%', '50%'],
                    radius: ['75%', '85%'],
                    hoverAnimation: false,
                    data: []
                },
                {
                    type: 'pie',
                    center: ['62.5%', '50%'],
                    radius: ['75%', '85%'],
                    hoverAnimation: false,
                    data: []
                },
                {
                    type: 'pie',
                    center: ['87.5%', '50%'],
                    radius: ['75%', '85%'],
                    hoverAnimation: false,
                    data: []
                }
            ]
        }
    }

    return {
        name: 'Sys',
        data() {
            return {
                formData: [],
                picList:[],
                meter: {
                    camera: {
                        total: 0,
                        online: 0
                    },
                    traffic: {
                        total: 0,
                        online: 0
                    },
                    light: {
                        total: 0,
                        online: 0
                    },
                    box: {
                        total: 0,
                        online: 0
                    }
                },
                showSysMeterDesc : false,
                search: {
                    waringTime: [moment().subtract(6, 'days').format("YYYY-MM-DD"), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')]
                },
                changeStateDailog: {
                    ruleForm: {
                        dealMan: this.userName,
                        radio: '',
                        remark: ''
                    },
                    alarmId: '',
                    Isshow: false,
                    processor: []
                },
                form: {
                    name: '',
                    devieTypeTable: '',
                    type: '',
                    time: '',
                    dealMan: '',
                    state: '',
                    dealTime: ''
                },
                rules: {
                    dealMan: [
                        {required: true, message: '请选择处理人', trigger: 'change'},
                    ],
                    remark: [
                        {min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            ...mapGetters({
                'userName': 'User/getUsername',
                'getMeterShow': 'Sys/getMeterShow'
            }),
        },
        methods: {
            async init() {
                let me = this;
                me.queryEveryAlarmStatistics();
                me.queryAreaStatistics();
                let meter_result = await me.onlineRate();
                let traffic_result = await me.trafficRate();
                let copyData = null;
                meter_echarts.ec = meter_echarts.ec || echarts.init(me.$refs.meter_ec);
                if (meter_result) {
                    copyData = _.clone(meter_echarts.options);
                    me.meter.camera.total = meter_result[0];
                    me.meter.camera.online = meter_result[1];
                    me.meter.box.total = meter_result[2];
                    me.meter.box.online = meter_result[3];
                    me.meter.traffic.total = traffic_result[0];
                    me.meter.traffic.online = traffic_result[1];
                    me.meter.light.total = traffic_result[2];
                    me.meter.light.online = traffic_result[3];
                    let meter_label = {
                        show: true,
                        position: "center",
                        color: "#00fafe",
                        fontSize: 16,
                        fontWeight: "bold"
                    };
                    let index = 1;
                    me.getMeterShow.indexOf(1) === -1 && delete copyData.series[0] || (function() {
                        copyData.series[0].center[0] = `${100 / me.getMeterShow.length * index - (100 / me.getMeterShow.length / 2)}%`;
                        index += 1;
                        copyData.series[0].data = [
                        {
                            name: "",
                            value: (meter_result[1] || 0),
                            label: {
                                ...meter_label,
                                formatter: `{span|${me.meter.camera.online}}\n{point| }\n{pre|{d}%}`,
                                rich: {
                                    span: {
                                        color: '#00fafe',
                                        fontSize: 14
                                    },
                                    point: {
                                        backgroundColor: '#00fafe',
                                        padding: [4, 4, 4, 4],
                                        width: 4,
                                        height: 4,
                                        borderRadius: 8
                                    },
                                    pre: {
                                        color: '#00fafe',
                                        fontSize: 18,
                                        lineHeight: 25
                                    }
                                }
                            }
                        },
                        {
                            name: "",
                            value: 0,
                            label: {
                                position: 'inside',
                                backgroundColor: {
                                    image: require('../../assets/Images/meter-point.png')
                                },
                                borderRadius: 15,
                                padding: 15,
                                align: "center",
                                verticalAlign: "middle"
                            }
                        }, 
                        {
                            name: "",
                            value: (meter_result[1] || 0) ? (meter_result[0] || 0) - (meter_result[1] || 0) : 1,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                        ];
                    })();

                    me.getMeterShow.indexOf(2) === -1 && delete copyData.series[1] || (function() {
                        copyData.series[1].center[0] = `${100 / me.getMeterShow.length * index - (100 / me.getMeterShow.length / 2)}%`;
                        index += 1;
                        copyData.series[1].data = [
                        {
                            name: "",
                            value: (meter_result[3] || 0),
                            label: {
                                ...meter_label,
                                formatter: `{span|${me.meter.box.online}}\n{point| }\n{pre|{d}%}`,
                                rich: {
                                    span: {
                                        color: '#00fafe',
                                        fontSize: 14
                                    },
                                    point: {
                                        backgroundColor: '#00fafe',
                                        padding: [4, 4, 4, 4],
                                        width: 4,
                                        height: 4,
                                        borderRadius: 8
                                    },
                                    pre: {
                                        color: '#00fafe',
                                        fontSize: 18,
                                        lineHeight: 25
                                    }
                                }
                            }
                        },
                        {
                            name: "",
                            value: 0,
                            label: {
                                position: 'inside',
                                backgroundColor: {
                                    image: require('../../assets/Images/meter-point.png')
                                },
                                borderRadius: 15,
                                padding: 15,
                                align: "center",
                                verticalAlign: "middle"
                            }
                        }, 
                        {
                            name: "",
                            value: (meter_result[3] || 0) ? (meter_result[2] || 0) - (meter_result[3] || 0) : 1,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                        ]
                    })();

                    me.getMeterShow.indexOf(3) === -1 && delete copyData.series[2] || (function() {
                        copyData.series[2].center[0] = `${100 / me.getMeterShow.length * index - (100 / me.getMeterShow.length / 2)}%`;
                        index += 1;
                        copyData.series[2].data = [
                        {
                            name: "",
                            value: (traffic_result[1] || 0),
                            label: {
                                ...meter_label,
                                formatter: `{span|${me.meter.traffic.online}}\n{point| }\n{pre|{d}%}`,
                                rich: {
                                    span: {
                                        color: '#00fafe',
                                        fontSize: 14
                                    },
                                    point: {
                                        backgroundColor: '#00fafe',
                                        padding: [4, 4, 4, 4],
                                        width: 4,
                                        height: 4,
                                        borderRadius: 8
                                    },
                                    pre: {
                                        color: '#00fafe',
                                        fontSize: 18,
                                        lineHeight: 25
                                    }
                                }
                            }
                        },
                        {
                            name: "",
                            value: 0,
                            label: {
                                position: 'inside',
                                backgroundColor: {
                                    image: require('../../assets/Images/meter-point.png')
                                },
                                borderRadius: 15,
                                padding: 15,
                                align: "center",
                                verticalAlign: "middle"
                            }
                        }, 
                        {
                            name: "",
                            value: (traffic_result[1] || 0) ? (traffic_result[0] || 0) - (traffic_result[1] || 0) : 1,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                        ]
                    })();

                    me.getMeterShow.indexOf(4) === -1 && delete copyData.series[3] || (function() {
                        copyData.series[3].center[0] = `${100 / me.getMeterShow.length * index - (100 / me.getMeterShow.length / 2)}%`;
                        index += 1;
                        copyData.series[3].data = [
                        {
                            name: "",
                            value: (traffic_result[3] || 0),
                            label: {
                                ...meter_label,
                                formatter: `{span|${me.meter.light.online}}\n{point| }\n{pre|{d}%}`,
                                rich: {
                                    span: {
                                        color: '#00fafe',
                                        fontSize: 14
                                    },
                                    point: {
                                        backgroundColor: '#00fafe',
                                        padding: [4, 4, 4, 4],
                                        width: 4,
                                        height: 4,
                                        borderRadius: 8
                                    },
                                    pre: {
                                        color: '#00fafe',
                                        fontSize: 18,
                                        lineHeight: 25
                                    }
                                }
                            }
                        },
                        {
                            name: "",
                            value: 0,
                            label: {
                                position: 'inside',
                                backgroundColor: {
                                    image: require('../../assets/Images/meter-point.png')
                                },
                                borderRadius: 15,
                                padding: 15,
                                align: "center",
                                verticalAlign: "middle"
                            }
                        }, 
                        {
                            name: "",
                            value: (traffic_result[3] || 0) ? (traffic_result[2] || 0) - (traffic_result[3] || 0) : 1,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                        ]
                    })();

                    meter_echarts.ec.setOption(copyData);
                    meter_echarts.ec.on("click",function (params) {
                        me.jumpToDeviceTable(params.seriesIndex+1);
                    })
                }
            },
            resizeCharts() {
                type_echarts && type_echarts.ec.resize();
                area_echarts && area_echarts.ec.resize();
                meter_echarts && meter_echarts.ec.resize();
            },
            renderTime(time) {
                return moment.unix(time).format('HH:mm:ss')
            },
            closeDialog() {
                let me = this;
                me.changeStateDailog.remark = '';
            },
            changeState(val) {
                let me = this;
                me.form = val;
                me.changeStateDailog.ruleForm.radio = val.isDeal;
                me.changeStateDailog.ruleForm.remark = '';
                me.changeStateDailog.alarmId = val.id;
                me.changeStateDailog.ruleForm.dealMan = me.userName;
                me.getUserInfo();
            },
            async queryEveryAlarmStatistics() {
                let me = this;
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getAlarmStatictisByType, {
                    alarmStartTime: me.search.waringTime[0] || '',
                    alarmEndTime: me.search.waringTime[1] || ''
                }, {
                    emulateJSON: true,
                    emulateHTTP: false
                });
                type_echarts.ec = type_echarts.ec || echarts.init(me.$refs.type_ec);
                if (response.body.success) {
                    //初始化图表数据
                    let type_result = response.body.model || [];
                    let tempData = type_result || [['无数据', 0]];
                    let copyData = _.clone(type_echarts.options);
                    copyData = Object.assign(copyData, {
                        title: null,
                        series: [{...copyData.series[0], data: tempData}]
                    });
                    copyData.yAxis.data = tempData.map(data => {
                        return data.name || '';
                    })
                    type_echarts.ec.setOption(copyData);
                }else{
                    me.$message.error(response.body.errorMessage);
                }
            },
            async queryAreaStatistics() {
                let me = this;
                let response = await me.$http.post(
                    RESTFULAPI.injective.Api.AlarmInfo.indexAreaErrorStatics,
                    {
                        alarmStartTime: me.search.waringTime[0] || '',
                        alarmEndTime: me.search.waringTime[1] || '',
                        areaId: []
                    }, {
                        emulateJSON: false,
                        emulateHTTP: true
                    });
                area_echarts.ec = area_echarts.ec || echarts.init(me.$refs.area_ec);
                if (response.body.success) {
                    let area_result = (response.body.model || []).map(it => ({name: it.areaName, value: it.value}));
                    let tempData = area_result || [['无数据', 0]];
                    let copyData = _.clone(area_echarts.options);
                    copyData = Object.assign(copyData, {series: [{...copyData.series[0], data: tempData}]});
                    copyData.legend.formatter = (name) => {
                        let total = _.sum(tempData.map(it => it.value));
                        let el = tempData.filter(it => it.name === name)[0] || { value : 0 };
                        if (name && name.length > 10) {
                            name = name.substr(0, 10) + '...';
                        }
                        return `${Math.floor((total && (el.value / total) * 100) || 0)}% ${name} : ${el.value}`;
                    };
                    area_echarts.ec.setOption(copyData);
                    area_echarts.ec.on('finished', async function () {
                        let response = await me.getLastHourErrorInfo();
                        if (response) {
                            me.formData = response;
                        }
                    });
                } else {
                    me.$message.error(response.body.errorMessage);
                }
                return [];
            },
            async getDataTable() {
                let me = this;
                let response = await me.getLastHourErrorInfo();
                if (response) {
                    me.formData = response;
                }
                return;
            },
            async getLastHourErrorInfo() {
                let me = this;
                let response = await me.$http.get(RESTFULAPI.injective.Api.AlarmInfo.getGridDateLastHour, {}, {
                    emulateJSON: false,
                    emulateHTTP: false
                });
                if (response.body.success) {
                    return response.body.model
                }
                me.$message.error(response.errorMessage);
                return '';
            },
            async getUserInfo() {
                let me = this;
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getUserInfo, {}, {
                    emulateJSON: false,
                    emulateHTTP: false
                });

                if (response.body.success) {
                    let data = response.body.model;
                    me.changeStateDailog.processor = data;
                    me.changeStateDailog.Isshow = true;
                }
            },
            //忽略
            ignore(row) {
                let me = this;
                me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.insertOpInfo,
                    JSON.stringify({
                        opAlarmId: row.id,
                        opUid: this.userName,
                        isDeal: 3,
                        opInfo: ''
                    }),
                    {
                        emulateJSON: true,
                        emulateHTTP: false
                    }).then(result => {
                    if (result.body.success) {
                        row.isDeal = 3;
                        me.$message.success("处理成功");
                        return;
                    }
                    me.$message.error(result.body.errorMessage);
                })
            },
            //撤销
            undo(row) {
                let me = this;
                me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.insertOpInfo,
                    JSON.stringify({
                        opAlarmId: row.id,
                        opUid: this.userName,
                        isDeal: 1,
                        opInfo: ''
                    }),
                    {
                        emulateJSON: true,
                        emulateHTTP: false
                    }).then(result => {
                    if (result.body.success) {
                        row.isDeal = 3;
                        me.$message.success("处理成功");
                        return;
                    }
                    me.$message.error(result.body.errorMessage);
                })
            },
            //完成
            complete(row) {
                let me = this;
                me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.insertOpInfo,
                    JSON.stringify({
                        opAlarmId: row.id,
                        opUid: this.userName,
                        isDeal: 4,
                        opInfo: ''
                    }),
                    {
                        emulateJSON: true,
                        emulateHTTP: false
                    }).then(result => {
                    if (result.body.success) {
                        row.isDeal = 4;
                        me.$message.success("处理成功");
                        return;
                    }
                    me.closechangeStateDailog();
                    me.$message.error(result.body.errorMessage);
                })
            },
            //将操作信息（处理人，处理状态，备注）插入数据库
            insertDealInfo() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let me = this;
                        me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.insertOpInfo,
                            JSON.stringify({
                                opAlarmId: me.changeStateDailog.alarmId,
                                opUid: me.changeStateDailog.ruleForm.dealMan,
                                isDeal: 2,
                                opInfo: me.changeStateDailog.ruleForm.remark
                            }),
                            {
                                emulateJSON: true,
                                emulateHTTP: false
                            }).then(result => {
                            if (result.body.success) {
                                me.changeStateDailog.Isshow = false;
                                me.getDataTable();
                                me.closechangeStateDailog();
                                me.$message.success("处理成功");
                                return;
                            }
                            me.closechangeStateDailog();
                            me.$message.error(result.body.errorMessage);
                        })
                    } else {
                        return false;
                    }
                });
            },
            async onlineRate() {
                let me = this;
                let response = await me.$http.get(RESTFULAPI.injective.Api.Device.IndexOnlineRate, null, {
                    emulateJSON: false,
                    emulateHTTP: false
                });
                if (response.body.success) {
                    let data = response.body.model;
                    return [data.totalCamera, data.onlineCamera, data.totalBox, data.onlineBox];
                }
                me.$message.error(response.body.errorMessage);
                return [];
            },

            async trafficRate() {
                let me = this;
                let response = await me.$http.get(RESTFULAPI.injective.Api.Device.IndexTrafficRate, null, {
                    emulateJSON: false,
                    emulateHTTP: false
                });
                if (response.body.success) {
                    let data = response.body.model;
                    return [data.trafficTotal, data.trafficOnline, data.lightTotal, data.lightError];
                }
                me.$message.error(response.body.errorMessage);
                return [];
            },

            closechangeStateDailog() {
                let me = this;
                this.$refs.ruleForm.resetFields();
                me.changeStateDailog.ruleForm.radio = '';
                me.changeStateDailog.ruleForm.dealMan = me.userName;
                me.changeStateDailog.Isshow = false;
            },
            jump(row) {
                let me = this;
                if (row.devType === 'WTOS-VN') {
                    me.$router.push({name: 'box', params: {id: row.devId}});
                }
                if (row.devType === 'WTOS-VN-TME200') {
                    me.$router.push({name: 'traffic', params: {deviceId: row.devId}});
                }
            },
            jumpToDeviceTable(type) {
                let me = this;
                if (type === 2) {
                    console.info('deviceTypeParam WTOS-VN')
                    me.$router.push({name: 'deviceTable', params: {deviceTypeParam: 'WTOS-VN'}});
                }
                if (type === 1) {
                    console.info('deviceTypeParam 3')
                    me.$router.push({name: 'deviceTable', params: {deviceTypeParam: '3'}});
                }
            },
            cellStyle(row, column, rowIndex, columnIndex) {
                if (row.row.alarmLever === 1) {
                    return 'color:#F56C6C;';
                }
                if (row.row.alarmLever  === 2) {
                    return 'color:#E6A23C;';
                }
            },
        },
        mounted() {
            let me = this;
            elementResizeEvent(me.$refs.container, me.resizeCharts);
            me.init();
            console.info("me.$refs.ec {}",me.$refs.meter_ec)
            let refreshTableTimer = setInterval(me.getDataTable, 1000 * 5);
            let refreshEChartsTimer = setInterval(me.init, 1000 * 60 * 2);
            me.$once("hook:beforeDestroy", () => {
                clearInterval(refreshTableTimer);
                clearInterval(refreshEChartsTimer);
                type_echarts.ec && type_echarts.ec.dispose(), type_echarts.ec = null;
                area_echarts.ec && area_echarts.ec.dispose(), area_echarts.ec = null;
                meter_echarts.ec && meter_echarts.ec.dispose(), meter_echarts.ec = null;
                unbind(me.$refs.container);
            });
        },

    }
})()
