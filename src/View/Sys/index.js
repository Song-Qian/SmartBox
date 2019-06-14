/**
 * Developer    :   SongQian
 * Time         :   2019/05/23
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   系统总览页面
 */
import echarts from 'echarts'
import _ from 'lodash'
import moment from 'moment'
import elementResizeEvent, { unbind } from 'element-resize-event'

export default (function () {

    //分类故障统计图表样式配置
    let type_echarts = {
        ec: null,
        options: {
            title: null,
            legend: {
                show: false
            },
            xAxis: {
                type: 'value',
                splitNumber: 6,
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
                    show: true,
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
                    }
                },
                axisLabel: {
                    show: false
                }
            },
            series: [
                {
                    type: 'bar',
                    name: '分类故障统计（一周内）',
                    barWidth: 15,
                    label: {
                        show: true,
                        position: 'insideBottomLeft',
                        offset: [0, 30],
                        formatter: '{b} ({c})',
                        color: '#fff'
                    },
                    itemStyle: {
                        barBorderRadius: [0, 7.5, 7.5, 0],
                        color: (params) => {
                            return ['#ff5c4d', '#645aff', '#35ece4', '#ffc438', '#ccf43d', '#f8508f', '#a447fe', '#35f1a8'][params.dataIndex % 8];
                        }
                    },
                    data: [
                        {name: '摄像机故障', value: 782},
                        {name: '市电停电', value: 975},
                        {name: '空开跳闸', value: 603},
                        {name: '光传输设备故障', value: 654},
                        {name: '光纤故障', value: 545},
                        {name: '网线故障', value: 845},
                        {name: '闪光灯故障', value: 451},
                        {name: '补灯光故障', value: 946}
                    ]
                }
            ]
        }
    }

    //各区故障统计图表样式配置
    let area_data = [
        {name: '洪山区', value: 234},
        {name: '武昌区', value: 435},
        {name: '江汉区', value: 543},
        {name: '东湖高薪区', value: 123},
        {name: '青山区', value: 654},
        {name: '东西湖区', value: 543},
        {name: '黄陂区', value: 888}
    ];
    let area_echarts = {
        ec: null,
        options: {
            title: null,
            color: ['#ff5c4d', '#645aff', '#35ece4', '#ffc438', '#ccf43d', '#f8508f', '#a447fe', '#35f1a8'],
            legend: {
                x: 'center',
                top: '50%',
                orient: 'vertical',
                itemGap : 30,
                textStyle: {
                    color: '#fff'
                },
                formatter: (name) => {
                    let total = _.sum(area_data.map(it => it.value));
                    let el = area_data.filter(it => it.name === name)[0];
                    return `${Math.floor((el.value / total) * 100)}% ${name} ${el.value}`;
                }
            },
            series: [{
                name: '各区故障统计（一周内）',
                type: 'pie',
                center: ['50%', '25%'],
                radius: ['55%', '70%'],
                roseType: 'radius',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: area_data
            }]
        }
    }

    //仪表盘的图表样式配置
    let meter_echarts = {
        ec: null,
        options: {
            title: null,
            color: ['#00fafe', '#00fafe', 'rgba(0, 250, 254, .1)'],
            series: []
        }
    }

    return {
        name: 'Sys',
        data() {
            return {
                meter: {
                    camera: {
                        total: 189,
                        online: 189
                    },
                    box: {
                        total: 200,
                        online: 150
                    }
                },
                changeStateDailog : {
                    Isshow : false,
                    radio : '未处理',
                    remark : '',
                    processor:'admin'
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
        computed: {
            getDataTable() {
                return [
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '未处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '未处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '已处理'},
                    {name: 'xxx路口', type: '设备停电', time: moment().format('YYYY-MM-DD hh:mm:ss'), state: '未处理'}
                ]
            }
        },
        methods: {
            init() {
                let me = this;
                //初始化图表数据
                type_echarts.ec = type_echarts.ec || echarts.init(me.$refs.type_ec);
                type_echarts.ec.setOption(_.clone(type_echarts.options));

                area_echarts.ec = area_echarts.ec || echarts.init(me.$refs.area_ec);
                area_echarts.ec.setOption(_.clone(area_echarts.options));

                meter_echarts.ec = meter_echarts.ec || echarts.init(me.$refs.meter_ec);
                let options = _.clone(meter_echarts.options);

                let meter_label = {
                    show: true,
                    position: "center",
                    color: "#00fafe",
                    fontSize: 16,
                    fontWeight: "bold"
                };

                options.series = [{
                    type: 'pie',
                    center: ['25%', '50%'],
                    radius: ['75%', '85%'],
                    hoverAnimation: false,
                    data: [
                        {
                            name: "",
                            value: me.meter.camera.online,
                            label: {
                                ...meter_label,
                                formatter: `{span|${me.meter.camera.online}}\n\n{point| }\n\n{pre|{d}%}`,
                                rich: {
                                    span: {
                                        color: '#00fafe',
                                        fontSize: 16
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
                                        fontSize: 24
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
                        }, {
                            name: "",
                            value: me.meter.camera.total - me.meter.camera.online,
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    ],
                    value: me.meter.camera.online
                },
                    {
                        type: 'pie',
                        center: ['75%', '50%'],
                        radius: ['75%', '85%'],
                        hoverAnimation: false,
                        data: [
                            {
                                name: "",
                                value: me.meter.box.online,
                                label: {
                                    ...meter_label,
                                    formatter: `{span|${me.meter.camera.online}}\n\n{point| }\n\n{pre|{d}%}`,
                                    rich: {
                                        span: {
                                            color: '#00fafe',
                                            fontSize: 16
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
                                            fontSize: 24
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
                            }, {
                                name: "",
                                value: me.meter.box.total - me.meter.box.online,
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        ],
                        value: me.meter.box.online
                    }];

                meter_echarts.ec.setOption(options)
            },
            resizeCharts() {
                type_echarts && type_echarts.ec.resize();
                area_echarts && area_echarts.ec.resize();
                meter_echarts && meter_echarts.ec.resize();
            },
            closeDialog() {
                let me = this;
                me.changeStateDailog.remark = '';
            },
            changeState(){
                let me = this;
                me.changeStateDailog.Isshow = true;
                me.changeStateDailog.remark = '';
            },
        }, 
        mounted() {
            let me = this;
            elementResizeEvent(me.$refs.container, me.resizeCharts);
            me.init();
        },
        beforeDestroy() {
            let me = this;
            type_echarts && type_echarts.ec.dispose(), type_echarts.ec = null;
            area_echarts && area_echarts.ec.dispose(), area_echarts.ec = null;
            meter_echarts && meter_echarts.ec.dispose(), meter_echarts.ec = null;
            unbind(me.$refs.container);
        }
    }
})()
