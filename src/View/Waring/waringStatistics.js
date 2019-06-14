import echarts from 'echarts'
import _ from 'lodash'
import moment from 'moment'
export default (function(){

    //区域分类的故障数据
    let areaEcharts_data = [
        ['洪山区',784],
        ['武昌区',975],
        ['江汉区',603],
        ['东湖高薪区',654],
        ['青山区',545],
        ['东西湖区',845],
        ['黄陂区',451]
    ];
     //区域故障统计
     let area_echarts = {
        ec: null,
        options: {
            title: {
                text : '区域故障统计',
                textStyle : {
                    color : '#FFF',
                    fontSize : '16'
                },
                left : '60'
            },
            legend: {
                show: false
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
                    show : true,
                    interval : 0,
                    color: '#fff',
                    lineStyle: {
                        color: '#05A2F4',
                        opacity: 0.4
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
            series: [
                {
                    type: 'bar',
                    name: '分类故障统计（一周内）',
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
    let type_data = [
        {name: '摄像机故障', value: 234},
        {name: '市电停电', value: 435},
        {name: '空开跳闸', value: 543},
        {name: '光传输设备故障', value: 123},
        {name: '光纤故障', value: 654},
        {name: '网线故障', value: 543},
        {name: '闪光灯故障', value: 888},
        {name: '补灯光故障', value: 332}
    ];
    let type_echarts = {
        ec: null,
        options: {
            title: {
                text : '故障类型统计',
                textStyle : {
                    color : '#FFF',
                    fontSize : '16'
                },
                left : '60'
            },
            color: ['#ff5c4d', '#645aff', '#35ece4', '#ffc438', '#ccf43d', '#f8508f', '#a447fe', '#35f1a8'],
            legend: {
                right : '20%',
                top: 'center',
                orient: 'vertical',
                textStyle: {
                    color: '#fff'
                },
                formatter: (name) => {
                    let total = _.sum(type_data.map(it => it.value));
                    let el = type_data.filter(it => it.name === name)[0];
                    return `${Math.floor((el.value / total) * 100)}% ${name} ${el.value}`;
                }
            },
            series: [{
                name: '各区故障统计（一周内）',
                type: 'pie',
                center: ['40%', '50%'],
                radius: ['40%', '70%'],
                roseType: 'radius',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: type_data
            }]
        }
    }

    return {
        name : 'waringStatistics',
        data() {
            return {
                search : {
                    area : [],
                    waringTime : []
                }
            }
        },
        computed : {
           
            
        },
        watch : {
            'search.area' : {
                handler(newVal, oldVal) {
                    // areaEcharts_data = [['测试',999]];
                    // console.info(111);
                    this.areaInit();
                },
                immediate : false
            }
        },
        methods : {
            init() {
                this.areaInit();
                this.typeInit();
            },
            clearSearch(){
                let me = this;
                me.search.waringTime = [];
                me.search.area = [];
                me.init();
            },
            areaInit() {
                let me = this;
                //初始化图表数据
                
                area_echarts.ec = area_echarts.ec || echarts.init(me.$refs.area_ec);
                let tempData = areaEcharts_data.filter((it) => {
                    return me.search.area.length ? me.search.area.indexOf(it[0]) > -1 : true;
                });
                let copyData = _.clone(area_echarts.options);
                let newOptions = Object.assign(copyData,{   title:{ subtext:me.search.waringTime.join('至'),text : '区域故障统计',textStyle : {color : '#FFF',fontSize : '16'}, left : '60' },series : [ { ...copyData.series[0],  data : tempData }] });
                // area_echarts.options.series[0].data = tempData;
                area_echarts.ec.setOption(newOptions);
            },
            typeInit() {
                let me = this;
                //初始化图表数据
                type_echarts.ec = type_echarts.ec || echarts.init(me.$refs.type_ec);
                let tempData = type_data;
                let copyData = _.clone(type_echarts.options);
                let newOptions = Object.assign(copyData,{   title:{ subtext:me.search.waringTime.join('至'),text : '故障类型统计',textStyle : {color : '#FFF',fontSize : '16'}, left : '60' },series : [ { ...copyData.series[0],  data : tempData }] });
                type_echarts.ec.setOption(newOptions);
            }

        },
        mounted() {
            let me = this;
            me.areaInit();
            me.typeInit();
        },
        beforeDestroy() {
            area_echarts.ec = null;
            type_echarts.ec = null;
        }
    }
})()