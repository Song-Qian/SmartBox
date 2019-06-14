
import _ from "lodash";
import RESTFUL from '~/Scripts/Util/RestfulApi'

export default (function () {
    return {
        data() {
            return {
                rows: [],
                importRows: [],
                pagination: {
                    total: 0,
                    size: 10,
                    currentPage: 1,

                },
                deviceTypeMap: new Map(),
                search: {
                    onlineStatus: '',
                    deviceType: '',
                    deviceName: ''
                },
                treeProps: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'lefa'
                },
                treeNodeItem: null,
                hasOpenTreeMenuContext: false,
                wrong:false,
                hasDialogShow : false,
                hasImportDialogShow : false,
                hasOutDeviceDialogShow : false,
                hasUpdateImportDialogShow : false,
                ifShowSaveButton : false,
                deviceForm :{
                    deviceName:'',
                    outDeviceName:'',
                    deviceType: '',
                    lat:'',
                    lon:'',
                    areaId:'',
                    areaName:'',
                    factory:'',
                    factoryId:'',
                    boxIP:'',
                    checkStatus:'',
                    port:'',
                    powerNum:'',
                    outDeviceIP:'',
                    UnionStatus:'',
                    intervalTime:'',
                    restartTimes:'',

                }
            }
        },
        methods: {
            /*分页切换*/
            handleSizeChange(size) {
                let me = this;
                me.pagination.size = size;
                me.pagination.currentPage = 1;
                me.query();
            },
            handleCurrentChange(page) {
                let me = this;
                me.pagination.currentPage = page;
                me.query();
            },
            /*新增修改删除*/
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete() {
                let me = this;
                let selectRows = me.$refs.device_table.selection;
                this.$alert("此操作将永久删除选中的设备,是否继续?","提示", { customClass :　"smart-box smart-box-message", confirmButtonClass : "el-button--success", cancelButtonClass : 'el-button--warning' })
                me.rows.splice(selectRows[0].id-1,1);
                // this.$confirm('此操作将永久删除选中的设备,是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                //     me.rows.splice(selectRows[0].id-1,1);
                //     this.$message({
                //         type: 'success',
                //         message: '删除成功!'
                //     });
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '已取消删除'
                //     });
                // });
            },
            jump() {
                return this.$router.push({name: 'map'});
            },
            /*查询*/
            loadDeviceType() {
                let me = this;
                me.$http.get(
                    RESTFUL.injective.Api.DeviceType.QueryAll,
                    {emulateJSON:false,emulateHTTP:false}
                ).then(res=>{
                    if (res.body.success){

                    }
                })

                me.$http.post(
                    RESTFUL.injective.Api.Area.Drag,
                    JSON.stringify({
                        dragingAreaId: draggingNode.data.id,
                        dragAreaId: dropNode.data.id,
                        dragType: dropType,
                        type: draggingNode.data.type,
                        deviceType: draggingNode.data.deviceType,
                        dragAreaType: draggingNode.data.type
                    }),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        me.$message.success("拖动修改成功");
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            /**
             * 页面数据查询
             */
            query() {
                let me = this;
                me.loading = true;
                let size = me.pagination.size;
                let currentPage = me.pagination.currentPage;
                let dataRecieve = me.$refs.tree.getCheckedNodes();
                console.info(dataRecieve)
                let rows = [];
                for (let i = 1; i <= size; i++) {
                    rows.push({
                        id:i,
                        deviceName: '光谷大道智能机箱' + currentPage + i,
                        deviceType: (i % 6) + 1,
                        boxIP: '192.168.1.1',
                        onlineStatus: (i % 2)
                    })
                }
                me.pagination.total = 200;
                me.rows = rows;
                me.loading = false;
            },
            /**
             * 页面条件查询
             */
            queryByParams() {
                let me = this;
                let size = me.pagination.size;
                let currentPage = me.pagination.currentPage;
                let rows = [];
                for (let i = 1; i <= size; i++) {
                    rows.push({
                        deviceName: '光谷大道智能机箱' + currentPage + i,
                        deviceType: (i % 6) + 1,
                        boxIP: '192.168.1.1',
                        onlineStatus: (i % 2)
                    })
                }
                let deviceName = me.search.deviceName;
                let deviceType = me.search.deviceType;
                let onlineStatus = me.search.onlineStatus;
                me.rows = rows.filter(r => {
                    return !deviceName || r.deviceName.toLocaleLowerCase().includes(deviceName.toLocaleLowerCase());
                }).filter(r => {
                    return !deviceType || r.deviceType == deviceType;
                }).filter(r => {
                    return !onlineStatus || r.onlineStatus == onlineStatus;
                });
            },
            /**
             * 查询条件重置
             * @param formName
             */
            resetForm(formName) {
              this.search = {
                    onlineStatus: '',
                    deviceType: '',
                    deviceName: ''
                }
                this.query();
            },
            /*树相关方法*/
            renderTreeNode(h, {node, data, store}) {
                if (node.level === 1) {
                    return h("span", `${node.label}`);
                }
                return h("span", `${node.label} (${data.data})`);
            },
            handlerTreeMenuContext(e, data, node, vnode) {
                let me = this;
                me.$refs.map_tree_popover.handleBlur();
                _.delay(() => {
                    me.$refs.map_tree_popover.referenceElm = null;
                    me.treeNodeItem = vnode.$children[1].$el;
                    me.hasOpenTreeMenuContext = true;
                }, 300);
            },
            /*新增修改删除相关*/
            handlerOverlayClosed(){
                let me = this;
                me.hasDialogShow = false;
                me.hasOutDeviceDialogShow = false;
                me.hasImportDialogShow = false;
                me.hasUpdateImportDialogShow = false;
                me.deviceForm = {
                    deviceName:'',
                    outDeviceName:'',
                    deviceType: '',
                    lat:'',
                    lon:'',
                    areaId:'',
                    areaName:'',
                    factory:'',
                    factoryId:'',
                    boxIP:'',
                    checkStatus:'',
                    port:'',
                    powerNum:'',
                    outDeviceIP:'',
                    UnionStatus:'',
                    intervalTime:'',
                    restartTimes:'',

                }
            },
            addDevice(){
                let me = this;
                me.hasDialogShow = true;
            },
            choseDeviceType(){
                let me = this;
                let deviceType = me.deviceForm.deviceType;
                if (deviceType == 5){
                    me.hasDialogShow = true;
                    me.hasOutDeviceDialogShow = false;
                }else if (deviceType == 1|| deviceType == 2 || deviceType ==3 || deviceType ==4 || deviceType == 6) {
                    me.hasDialogShow = false;
                    me.hasOutDeviceDialogShow = true;
                }
            },
            updateDevice(){
                let me = this;
                let selectRows = me.$refs.device_table.selection;
                if (selectRows.length >0){
                    me.deviceForm = selectRows[0]
                }
                me.hasOutDeviceDialogShow = true;
            },
            submitForm(){
                let me = this;
                me.hasOutDeviceDialogShow = false;
                me.deviceForm = {
                    deviceName:'',
                        outDeviceName:'',
                        deviceType: '5',
                        lat:'',
                        lon:'',
                        areaId:'',
                        areaName:'',
                        factory:'',
                        factoryId:'',
                        boxIP:'',
                        checkStatus:'',
                        port:'',
                        powerNum:'',
                        outDeviceIP:'',
                        UnionStatus:'',
                        intervalTime:'',
                        restartTimes:'',

                }
            },
            importDevice(){
                let me = this;
                me.hasImportDialogShow = true;
            },
            downloadModel(){
                console.info("下载模板数据")
            },
            openUpdataTable() {
                let me = this;
                console.info(1)
                me.hasImportDialogShow = false;
                me.hasUpdateImportDialogShow = true;
                me.loading = true;
                let importRows = [];
                for (let i = 1; i <= 10; i++) {
                    importRows.push({
                        deviceName: '光谷大道智能机箱' +  i,
                        deviceType: (i % 6) + 1+'',
                        boxIP: '192.168.1.1',
                        onlineStatus: (i % 2),
                        showInput :false,
                        factory: '光电',
                        checkStatus : '开启',
                        checkTimes : 22,
                    })
                }
                me.importRows = importRows;
                me.loading = false;
            },
            openUpdateColimn(row){
                let me = this;
                me.ifShowSaveButton = true;
                row.showInput = true;
            },
            saveUpdateImportData(row){
                let me = this;
                me.ifShowSaveButton = false;
                row.showInput = false;
            }
        },
        computed: {
        },
        mounted() {
            let me = this;
            me.query();
            me.loadDeviceType()
        }
    }
})()
