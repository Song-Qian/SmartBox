import RESTFUL from '~/Scripts/Util/RestfulApi'

export default (function () {
    return {
        name: 'WarnConfig',
        data() {
            return {
                rows: [],
                hasConfigDialogShow: false,
            }
        },
        methods: {
            /**
             * 页面数据查询
             */
            async queryWarnList() {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Sys.queryWarnAll,
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
                me.hasDialogShow = false;
            },
            showConfigDialog() {
                let me = this;
                let selections = this.$refs.configTable.selection;
                if (!selections || selections.length < 1) {
                   return me.$message.error("请选择需要修改数据!!!")
                }
                this.hasConfigDialogShow = true;
            },
            updateWarnGrade(row) {
                let me = this;
                let data = "["+row.alarmId+":"+row.alarmLevel+"]"
                me.$confirm('此操作将修改信号的检测开关状态，是否继续?', '提示', {
                    customClass :　"smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        JSON.stringify({commandCode: "gm033", body:[data]}),
                        {emulateJSON: true, emulateHTTP: false}
                    ).then(res => {
                        if(res.body.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                        }else {
                            me.$message.error("修改失败!! "+res.body.errorMessage);
                        }
                        me.queryWarnList();
                    });
                }).catch(() => {
                    me.queryWarnList();
                    me.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            cellStyle(row, column, rowIndex, columnIndex) {
                if (row.row.alarmLevel === 1) {
                    return 'color:#F56C6C;';
                }
                if (row.row.alarmLevel  === 2) {
                    return 'color:#E6A23C;';
                }
            },
        },
        computed: {},
        mounted() {
            let me = this;
            me.queryWarnList();
        }
    }
})()
