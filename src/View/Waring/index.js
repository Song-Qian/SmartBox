/**
 * Developer    :   SongQian
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   告警管理逻辑页面窗口
 */
import moment from 'moment'
import _ from 'lodash'
import {mapGetters} from 'vuex'
import RESTFULAPI from '~/Scripts/Util/RestfulApi'
import XLSX from 'xlsx'


export default (function () {
    return {
        name: 'Waring',
        props: {
            id: {
                default: "",
                type: String
            }
        },
        data() {
            return {
                search: {
                    deviceName: '',
                    deviceType: '',
                    errorTime: [],
                    errorProject: '',
                    username: '',
                    resolveStatus: '',
                    resolveTime: []
                },
                alaramItemList: [],
                picList:[],
                tableList: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 10
                },
                batchChangeStateDailog:{
                    ruleForm: {
                        dealMan: '',
                        radio: '',
                        remark: ''
                    },
                    alarmId: '',
                    Isshow: false,
                    closeDialog: false,
                    processor: []
                },
                changeStateDailog: {
                    ruleForm: {
                        dealMan: '',
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
                    radio: [
                        {required: true, message: '请选择一个处理状态', trigger: 'change'}
                    ],
                    // remark: [
                    //   {required: true, message: '请填写处理备注', trigger: 'blur' },
                    //   { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
                    // ]
                },
                devicedTypeList: []
            }
        },
        computed: {
            ...mapGetters({
                'User': 'User/getUser'
            })
        },
        methods: {
            //获取查询条件中异常项目的数据（告警表中有多少就显示多少，不需要全部显示出来）
            async getAlarmItemList() {
                let me = this;
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getAlarmItemList, {}, {
                    emulateJSON: false,
                    emulateHTTP: true
                });
                if (response.body.success) {
                    // & && | ||
                    me.alaramItemList = response.body.model || [];
                }
            },
            //时间戳转换为时间
            DateTimeFormate(number) {
                if (number) {
                    return moment.unix(number).format('YYYY-MM-DD HH:mm:ss');
                }
                return '';
            },
            //设备类型下拉框
            async loadDeviceType() {
                let me = this;
                let res = await me.$http.get(RESTFULAPI.injective.Api.DeviceType.QueryAll, null, {
                    emulateJSON: false,
                    emulateHTTP: false
                });
                if (res.status === 200 && res.body.success) {
                    me.devicedTypeList = res.body.model.map(it => ({label: it.typeName, value: it.typeCode}));
                }
            },
            handleSizeChange(val) {   //切换每页条数时，触发的方法
                let me = this;
                me.pagination.pageSize = val;
                me.getAlarmInfoGridDate();
            },
            handleCurrentChange(val) {      //点击下一页或某一页时，出发啊的方法
                let me = this;
                me.getAlarmInfoGridDate();
            },
            handleQueryDetail(entity) {
                let me = this;
                // me.save(entity);
                me.$router.push({name: 'messageDetail', params: {id: entity.id}})
            },
            changeState(val) {
                let me = this;
                me.changeStateDailog.Isshow = true;
                let userName = me.User.username;
                me.changeStateDailog.ruleForm.dealMan = userName;
                me.form = val;
                me.changeStateDailog.ruleForm.radio = val.isDeal;
                me.changeStateDailog.ruleForm.remark = '';
                me.changeStateDailog.alarmId = val.id;
                me.getUserInfo();
            },
            batchChangeState() {
                let me = this;
                me.batchChangeStateDailog.Isshow = true;
                let userName = me.User.username;
                me.batchChangeStateDailog.ruleForm.dealMan = userName;
                me.batchChangeStateDailog.ruleForm.radio = 4;
                me.getUserInfo();
            },
            searchDate() {
                let me = this;
                me.pagination.page = 1;
                me.getAlarmInfoGridDate();
            },
            clearSearch() {
                let me = this;
                me.search.deviceName = '';
                me.id = '';
                me.search.deviceType = '';
                me.search.errorTime = '';
                me.search.errorProject = '';
                me.search.username = '';
                me.search.resolveStatus = '';
                me.search.resolveTime = ''
                me.pagination.page = 1;
                me.getAlarmInfoGridDate();
            },
            closeDialog() {
                let me = this;
                me.changeStateDailog.remark = '';
            },
            //获取告警信息列表
            async getAlarmInfoGridDate() {
                let me = this;
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getGridDate, {
                    deviceName: me.search.deviceName,
                    deviceType: me.search.deviceType,
                    errorStartTime: me.search.errorTime && me.search.errorTime[0] || '',
                    errorEndTime: me.search.errorTime && moment(me.search.errorTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') || '',
                    errorProject: me.search.errorProject,
                    username: me.search.username,
                    deviceId: me.id,
                    resolveStatus: me.search.resolveStatus,
                    resolveStartTime: me.search.resolveTime && me.search.resolveTime[0] || '',
                    resolveEndTime: me.search.resolveTime && moment(me.search.resolveTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') || '',
                    page: me.pagination.page,
                    pageSize: me.pagination.pageSize
                }, {
                    emulateJSON: false,
                    emulateHTTP: true
                });
                if (response.status === 200) {
                    let dataGrid = response.body.model;
                    me.tableList = dataGrid;
                    me.pagination.total = response.body.totalCount;
                }
            },

            //告警列表中点击智能机箱设备则跳转到智能机箱页面，若非智能机箱，则给提示，并不跳转
            clickDevName(devId, devTypeCode) {
                let me = this;
                if ("WTOS-VN" == devTypeCode) {
                    me.$router.push({name: 'box', params: {id: devId}});
                } else if ("WTOS-VN-TME200" == devTypeCode) {
                    me.$router.push({name: 'traffic', params: {deviceId: devId}});
                } else {
                    me.$message.info("请点击智能机箱设备", "提示",
                        {
                            customClass: "smart-box smart-box-message",
                            confirmButtonClass: "el-button--success",
                            cancelButtonClass: 'el-button--warning'
                        });
                    return;
                }
            },
            //获取操作中下拉框的用户信息
            async getUserInfo() {
                let me = this;
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.getUserInfo, {}, {
                    emulateJSON: false,
                    emulateHTTP: true
                });

                if (response.status === 200 && response.body.success) {
                    let data = response.body.model;
                    me.changeStateDailog.processor = data;
                    me.batchChangeStateDailog.processor = data;
                }
            },

            //将操作信息（处理人，处理状态，备注）插入数据库
            insertDealInfo() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let me = this;
                        let response = me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.insertOpInfo, {
                            opAlarmId: me.changeStateDailog.alarmId,
                            opUid: me.changeStateDailog.ruleForm.dealMan,
                            isDeal: me.changeStateDailog.ruleForm.radio,
                            opInfo: me.changeStateDailog.ruleForm.remark
                        }, {
                            emulateJSON: false,
                            emulateHTTP: true
                        }).then(result => {
                            me.changeStateDailog.Isshow = false;
                            me.getAlarmInfoGridDate();
                        })
                    } else {
                        return false;
                    }
                });
            },
            closechangeStateDailog() {
                let me = this;
                this.$refs.ruleForm.resetFields();
                me.changeStateDailog.Isshow = false;
            },
            batchClosechangeStateDailog() {
                let me = this;
                me.batchChangeStateDailog.Isshow = false;
            },
            cellStyle(row, column, rowIndex, columnIndex) {
                if (row.row.alarmLever === 1) {
                    return 'color:#F56C6C;';
                }
                if (row.row.alarmLever === 2) {
                    return 'color:#E6A23C;';
                }
            },
            //告警列表导出
            async exportAlarmInfo() {
                let me = this;
                let response = await me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.exportAlarmInfo, {
                    deviceName: me.search.deviceName,
                    deviceId: me.id,
                    deviceType: me.search.deviceType,
                    errorStartTime: me.search.errorTime[0] || '',
                    errorEndTime: me.search.errorTime[1] || '',
                    errorProject: me.search.errorProject,
                    username: me.search.username,
                    resolveStatus: me.search.resolveStatus,
                    resolveStartTime: me.search.resolveTime[0] || '',
                    resolveEndTime: me.search.resolveTime[1] || '',
                }, {
                    emulateJSON: false,
                    emulateHTTP: true
                });
                if (response.body.success) {
                    let wb = XLSX.utils.book_new();
                    let data = response.body.model.map(it => ([it.devName, it.devTypeName, it.alarmName,it.alarmDesc, me.DateTimeFormate(it.alarmTime), it.userName, ['', '未处理', '已派单', '已忽略', '已完成'][it.isDeal], it.dealTime]));
                    let ws = XLSX.utils.aoa_to_sheet([['设备名称', '设备类型', '异常项目','告警描述', '异常时间', '处理人', '处理状态', '处理时间'], ...data]);
                    XLSX.utils.book_append_sheet(wb, ws, '告警信息导出');
                    XLSX.writeFile(wb, `告警信息导出-${moment().unix()}.xlsx`);
                } else {
                    me.$message.error("服务端错误，导出失败", "提示",
                        {
                            customClass: "smart-box smart-box-message",
                            confirmButtonClass: "el-button--success",
                            cancelButtonClass: 'el-button--warning'
                        });
                }

            },
            async batchProcessing() {
                let me = this;
                me.$confirm('此操作会将所有符合查询条件的告警信息 共'+me.pagination.total+'条,全部修改为已完成，是否继续?', '提示', {
                    customClass :　"smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    me.$http.post(RESTFULAPI.injective.Api.AlarmInfo.batchProcessing, {
                        deviceName: me.search.deviceName,
                        deviceType: me.search.deviceType,
                        errorStartTime: me.search.errorTime && me.search.errorTime[0] || '',
                        errorEndTime: me.search.errorTime && moment(me.search.errorTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') || '',
                        errorProject: me.search.errorProject,
                        username: me.search.username,
                        processor: me.batchChangeStateDailog.ruleForm.dealMan,
                        dealStatus: me.batchChangeStateDailog.ruleForm.radio,
                        deviceId: me.id,
                        resolveStatus: me.search.resolveStatus,
                        resolveStartTime: me.search.resolveTime && me.search.resolveTime[0] || '',
                        resolveEndTime: me.search.resolveTime && moment(me.search.resolveTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') || '',
                        page: me.pagination.page,
                        pageSize: me.pagination.pageSize
                    }, {
                        emulateJSON: false,
                        emulateHTTP: true
                    }).then(res => {
                        if (res.status === 200) {
                            me.getAlarmInfoGridDate();
                            this.$message({
                                type: 'success',
                                message: '修改成功,本次共修改'+res.body.model+'条数据'
                            });
                            me.batchChangeStateDailog.Isshow = false;
                        }else{
                            this.$message({
                                type: 'error',
                                message: '处理失败'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
            // ...mapActions({
            //     'save' : 'Warning/save'
            // })
        },
        mounted() {
            let me = this;
            me.getAlarmInfoGridDate();
            me.getAlarmItemList();
            me.loadDeviceType();
        }


    }
})()