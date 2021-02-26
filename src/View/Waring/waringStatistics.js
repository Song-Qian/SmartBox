import echarts from 'echarts'
import _ from 'lodash'
import moment from 'moment'
import elementResizeEvent, {unbind} from 'element-resize-event'
import RESTFULAPI from '~/Scripts/Util/RestfulApi'

export default (function () {

    //区域分类的故障数据
    let areaEcharts_data = [
        ['洪山区', 784],
        ['武昌区', 975],
        ['江汉区', 603],
        ['东湖高薪区', 654],
        ['青山区', 545],
        ['东西湖区', 845],
        ['黄陂区', 451]
    ];
    //区域故障统计
    let area_echarts = {
        ec: null,
        options: {
            title: {
                text: '区域故障统计',
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                },
                left: '60'
            },
            legend: {
                show: false
            },
            tooltip: {
                show: true,
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                splitNumber: 8,
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
                    show: true,
                    interval: 0,
                    color: '#fff',
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
                    },
                    rotate: 45,
                    formatter: function (value, index) {
                        if (value.length > 8) {
                            return value.substring(0, 8) + "...";
                        }
                        return value;
                    }
                }
            },
            yAxis: {
                type: 'value',
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
                axisLabel: {
                    show: true
                }
            },
            grid : {
                bottom : '100px'
            },
            series: [
                {
                    type: 'bar',
                    name: '区域故障统计',
                    barWidth: 15,

                    itemStyle: {
                        normal: {
                            color: (params) => {
                                return ['#ff5c4d', '#645aff', '#35ece4', '#ffc438', '#ccf43d', '#f8508f', '#a447fe', '#35f1a8'][params.dataIndex % 8];
                            },
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: 'white',
                                    fontSize: 14
                                }
                            },
                            barBorderRadius: [7.5, 7.5, 0, 0]
                        },
                    },
                    data: areaEcharts_data
                }
            ]
        }
    }


    //各区故障统计图表样式配置
    let type_echarts = {
        ec: null,
        options: {
            title: {
                text: '故障类型统计',
                textStyle: {
                    color: '#FFF',
                    fontSize: '16'
                },
                left: '60'
            },
            color: ['#ff5c4d', '#645aff', '#35ece4', '#ffc438', '#ccf43d', '#f8508f', '#a447fe', '#35f1a8'],
            legend: {
                right: '13%',
                top: 'center',
                orient: 'vertical',
                textStyle: {
                    color: '#fff'
                },
                formatter: null
            },
            series: [{
                name: '各区故障统计（一周内）',
                type: 'pie',
                center: ['35%', '50%'],
                radius: ['55%', '70%'],
                roseType: 'radius',
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: []
            }]
        }
    }

    return {
        name: 'waringStatistics',
        data() {
            return {
                search: {
                    areaValue: [],
                    area: [],
                    waringTime: [moment().subtract(6, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
                }
            }
        },
        computed: {},
        watch: {
            'search.area': {
                handler(newVal, oldVal) {
                    // areaEcharts_data = [['测试',999]];
                    // console.info(111);
                    this.areaInit();
                },
                immediate: false
            }
        },
        methods: {
            init() {
                this.areaInit();
                this.typeInit();
            },
            clearSearch() {
                let me = this;
                me.search.waringTime = [moment().subtract(6, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")];
                me.search.areaValue = [];
                me.init();
            },
            //加载区域告警数量统计图（柱状图）
            async areaInit() {
                let me = this;
                //初始化图表数据
                area_echarts.ec = area_echarts.ec || echarts.init(me.$refs.area_ec);
                let copyData = _.clone(area_echarts.options);
                let tempData = [['无数据', 0]];
                // copyData.legend.formatter = (name) => {
                //     let total = _.sum(tempData.map(it => it.value));
                //     let el = tempData.filter(it => it.name === name)[0];
                //     return `0% ${name} ${el.value}`;
                // }
                let newOptions = Object.assign(copyData, {
                    title: {
                        subtext: me.search.waringTime.join('至'),
                        text: '区域故障统计',
                        textStyle: {
                            color: '#fff', 
                            fontSize: '16',
                            fontFamily: `'Gen Jyuu Gothic Normal', 'Gen Jyuu Gothic P Normal', 'Gen Jyuu Gothic LP Normal', '思源黑体 Normal', '方正黑体简体'`
                        },
                        left: '60'
                    }, series: [{...copyData.series[0], data: tempData}]
                });
                // area_echarts.options.series[0].data = tempData;
                area_echarts.ec.setOption(newOptions);

                //用迭代子区域的方式来查询出区域统计告警数
                // let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.alarmCountStaticByArea, {
                //     alarmStartTime: me.search.waringTime[0] || '',
                //     alarmEndTime: me.search.waringTime[1] && moment(me.search.waringTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') || '',
                //     areaId: me.search.areaValue
                // }, {
                //     emulateJSON: false,
                //     emulateHTTP: true
                // });

                //用java计算的方式来统计区域告警数
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.indexAreaErrorStatics,{
                    alarmStartTime: me.search.waringTime[0] || '',
                    alarmEndTime: me.search.waringTime[1] && moment(me.search.waringTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') || '', 
                    areaId: me.search.areaValue
                }, {
                    emulateJSON: false,
                    emulateHTTP: true
                });
                if (response.status === 200) {
                    let model = response.body.model;
                    tempData = model.map(it => [it.areaName, it.value]);
                    let newOptions = Object.assign(copyData, {
                        title: {
                            subtext: me.search.waringTime.join('至'),
                            text: '区域故障统计',
                            textStyle: {
                                color: '#fff', 
                                fontSize: '16',
                                fontFamily: `'Gen Jyuu Gothic Normal', 'Gen Jyuu Gothic P Normal', 'Gen Jyuu Gothic LP Normal', '思源黑体 Normal', '方正黑体简体'`
                            },
                            left: '60'
                        },
                        series: [{...copyData.series[0], data: tempData}]
                    });
                    area_echarts.ec.setOption(newOptions);
                }

            },

            //加载故障类型告警数量统计图（饼图）
            async typeInit() {
                let me = this;
                type_echarts.ec = type_echarts.ec || echarts.init(me.$refs.type_ec);
                let copyData = _.clone(type_echarts.options);
                let tempData = [{value: 0, name: '无数据'}];
                copyData.legend.formatter = (name) => {
                    let total = _.sum(tempData.map(it => it.value));
                    let el = tempData.filter(it => it.name === name)[0];
                    return `0% ${name} ${el.value}`;
                }
                copyData = Object.assign(copyData, {
                    title: {
                        subtext: me.search.waringTime.join('至'),
                        text: '故障类型统计',
                        textStyle: {
                            color: '#fff', 
                            fontSize: '16',
                            fontFamily: 'Gen Jyuu Gothic Normal'
                        },
                        left: '60'
                    }, series: [{...copyData.series[0], data: tempData}]
                });
                //初始化图表数据
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getAlarmStatictisByType, {
                    alarmStartTime: me.search.waringTime[0] || '',
                    alarmEndTime: me.search.waringTime[1] && moment(me.search.waringTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') || '' 
                }, {
                    emulateJSON: true,
                    emulateHTTP: false
                });
                if (response.status === 200 && response.body.model.length) {
                    
                    tempData = response.body.model;
                    copyData.legend.formatter = (name) => {
                        let total = _.sum(tempData.map(it => it.value));
                        let el = tempData.filter(it => it.name === name)[0];
                        return `${Math.round(el.value / total * 10000 )/100}% ${name} ${el.value}`;
                    };
                    copyData = Object.assign(copyData, {series: [{...copyData.series[0], data: tempData}]});
                }
                type_echarts.ec.setOption(copyData);

            },
            async getAreaSelect() {
                let me = this;
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.queryTwoLevelArea, {}, {
                    emulateJSON: false,
                    emulateHTTP: true
                });
                if (response.status === 200) {
                    me.search.area = response.body.model;
                }
            },
            //echarts图用excel导出
            async exportCharts(){
                let me = this;
                var img = new Image();
                img.src = area_echarts.ec.getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#909399'
                });
                let picinfo= img.src;//柱状图
                let circleinfo = type_echarts.ec.getDataURL({   //饼图
                    pixelRatio: 2,
                    backgroundColor: '#909399'
                });
                let res = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.exportCharts, {picinfo : picinfo,circleinfo : circleinfo}, {
                    emulateJSON: true,
                    emulateHTTP: false,
                    responseType : 'blob'
                });
                res.blob().then(blob => {
                    let aElement = document.createElement("a");
                    if("download" in aElement) {
                        let url = URL.createObjectURL(blob);
                        aElement.setAttribute("style", "display:none");
                        aElement.setAttribute("href", url);
                        aElement.setAttribute("download", `告警信息统计-${moment().unix()}.xls`);
                        me.$refs.container.appendChild(aElement);
                        aElement.click();
                        me.$refs.container.removeChild(aElement);
                    } else {
                        navigator.msSaveBlob(blob, `告警信息统计-${moment().unix()}.xls`);
                    }
                })

            },
            //echarts 响应式处理
            resizeCharts() {
                type_echarts && type_echarts.ec.resize();
                area_echarts && area_echarts.ec.resize();
            },
        },
        mounted() {
            let me = this;
            elementResizeEvent(me.$refs.container, me.resizeCharts);
            me.init();
            me.getAreaSelect();

            me.$once("hook:beforeDestroy",  () => {
                type_echarts && type_echarts.ec.dispose(), type_echarts.ec = null;
                area_echarts && area_echarts.ec.dispose(), area_echarts.ec = null;
                unbind(me.$refs.container);
            });
        }
    }
})()