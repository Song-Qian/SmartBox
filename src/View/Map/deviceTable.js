import RESTFUL from '~/Scripts/Util/RestfulApi'
import XLSX from 'xlsx'
import {mapGetters} from 'vuex'
import _ from 'lodash'
import moment from 'moment'

export default (function () {
    return {
        name: 'DeviceTable',
        props: {
            deviceTypeParam: {
                default: '',
                type: String
            }
        },
        data() {
            let me = this;
            return {
                rows: [],
                importRows: [],
                exceptionDeviceList: [],
                pagination: {
                    total: 0,
                    size: 10,
                    currentPage: 1
                },
                mapPosition: {
                    x: '',
                    y: ''
                },
                mapVisible: false,
                hasFold: false,
                showMoreDeviceImputOption: false,
                importPointResult: '导入完成！',
                errorImportPointData: '',
                showDownloadMessage: false,
                outDeviceInfo: '',
                mainDeviceTypeMap: new Map(),
                deviceTypeMap: new Map(),
                outDeviceTypeMap: new Map(),
                deviceFlagMap: new Map(),
                importDeviceIpMap: new Map(),
                importDeviceIpIdMap: new Map(),
                singRowAllowUpdate: true,
                selectTreeNode: '',
                deviceIpMap: '',
                deviceType: '',
                selectRow: '',
                hasDisabledAreaSubmit: false,
                formImportSubmit: false,
                treeData: [],
                search: {
                    onlineStatus: '',
                    deviceType: '',
                    areaNo: '',
                    deviceName: ''
                },
                treeProps: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                deviceTitle: '添加设备信息',
                tableTreeProps: { hasChildren: 'hasChildren', children: 'children'},
                treeNodeItem: null,
                hasOpenTreeMenuContext: false,
                wrong: false,
                pointWrong: false,
                pointResultWrong: false,
                hasDialogShow: false,
                hasImportDialogShow: false,
                hasImportPointDialogShow: false,
                hasImportPointResultDialogShow: false,
                hasDeviceDialogShow: false,
                hasOutDeviceDialogShow: false,
                hasUpdateImportDialogShow: false,
                allowUpdateImportTable: true,
                ifShowSaveButton: false,
                uploadUrl: RESTFUL.injective.Api.Device.Import,
                uploadPointUrl: RESTFUL.injective.Api.Device.ImportPoint,
                deviceModel: {
                    id: '',
                    deviceId: '',
                    name: '',
                    type: 'WTOS-VN',
                    areaName: '未确定区域',
                    areaId: '0',
                    deviceIP: '',
                    coordinates: [],
                    otherDeviceName: '',
                    companyName: '',
                    port: '',
                    energyNo: '',
                    otherDeviceIP: '',
                    listenState: 1,
                    interactionState: 0,
                    checkedSpacing: 2,
                    reStartTotal: 5,
                    checkTimes: '',
                    state: '',
                    power: '',
                    redPower: '',
                    openPlanCheck: '',
                    closePlanCheck: '',
                    mainDeviceType: '',
                    percent: '',
                    isOnline: '',
                    unionStatus: '',
                    lon: '',
                    lat: '',
                },
                listenStateList: [
                    {label: '是', value: 1},
                    {label: '否', value: 0},
                ],
                interactionStateList: [
                    {label: '开', value: 1},
                    {label: '关', value: 0},
                ],
                deviceRules: {
                    name: [ { required: true, message: '设备名称不能为空！', trigger: 'blur' },
                        { min: 1, max: 16, message: '设备名称只能输入16个字符！', trigger: 'blur'}
                    ],
                    checkTimes: [
                        {type: 'number', message: '检测次数不能为空！', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '设备类型不能为空！', trigger: 'blur'}
                    ],
                    deviceIP: [
                        {required: true, message: '设备IP不能为空！', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) =>
                                !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                                    .test(value) ? callback(new Error('外接设备IP格式不正确！')) : callback(),
                            trigger: 'blur'
                        }
                    ],
                },
                outDeviceRules: {
                    type: [
                        {required: true, message: '设备类型不能为空！', trigger: 'blur'}
                    ],
                    otherDeviceName: [
                        {required: true, message: '外接设备名称不能为空！', trigger: 'blur'},
                        {min: 1, max: 8, message: '外接设备名称只能输入8个字符！', trigger: 'blur'}
                    ],
                    companyName: [
                        {min: 0, max: 8, message: '厂家名称只能输入8个字符！', trigger: 'blur'}
                    ],
                    port: [
                        {
                            validator: (rule, value, callback) => {
                                if (['1', '2', '6'].indexOf(me.deviceModel.type) > -1) {
                                    return callback();
                                }
                                if (!value && value !== 0) {
                                    return callback(new Error('网口不能为空！'))
                                }
                                let result = !/^([1-9]||10)$/.test(value)
                                if (result) {
                                    return callback(new Error('网口必须为1~10之间的数值！'))
                                } else {
                                    return callback();
                                }
                            },
                            trigger: 'blur'
                        },
                    ],
                    percent: [
                        {
                            validator: (rule, value, callback) => {
                                let result = !/^([1-9]\d?|100)$/.test(value)
                                if (value && result) {
                                    return callback(new Error('端口必须为1~100之间的数值！'))
                                } else {
                                    return callback();
                                }
                            },
                            trigger: 'blur'
                        },
                    ],
                    power: [
                        {
                            validator: (rule, value, callback) => {

                                let result = !/^\d{1,4}$/.test(value)
                                if (value && (result || value < 1 || value > 2400)) {
                                    return callback(new Error('功率必须为1~2400之间的数值！'))
                                } else {
                                    return callback();
                                }
                            },
                            trigger: 'blur'
                        },
                    ],
                    energyNo: [
                        {
                            validator: (rule, value, callback) => {
                                if (['3', '5', '6'].indexOf(me.deviceModel.type) > -1 && !value) {
                                    return callback();
                                }
                                if (!value && value !== 0 && !(['3', '5', '6'].indexOf(me.deviceModel.type) > -1)) {
                                    return callback(new Error('电源编号不能为空！'))
                                }
                               if (this.selectTreeNode && this.selectTreeNode.type === 'WTOS-VN-PE'){
                                   let result = !/^([1-4])$/.test(value);
                                   if (result) {
                                       return callback(new Error('电源编号必须在1~4之间！'))
                                   } else {
                                       return callback();
                                   }
                               }else {
                                   let result = !/^([1-8])$/.test(value)
                                   if (result) {
                                       return callback(new Error('电源编号必须在1~8之间！'))
                                   } else {
                                       return callback();
                                   }
                               }
                            },
                            trigger: 'blur'
                        },
                    ],
                    otherDeviceIP: [
                        {
                            validator: (rule, value, callback) => {
                                if (['1', '2'].indexOf(me.deviceModel.type) > -1) {
                                    return callback();
                                }
                                let result = !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value)
                                if (result) {
                                    return callback(new Error('外接设备IP格式不正确！'))
                                } else {
                                    return callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                },
                //区域划分界面驱动字段   添加人： 宋骞
                areaTreeData: [],
                deviceTableData: [],
                multipleTableData: [],
                areaSelected: '',
                hasDivisionDialogShow : false,
                searchDeviceName : ''
            }
        },
        watch: {
            deviceType : {
                handler(newVal, oldVal) {
                    let me = this;
                    me.treeData = [];
                    me.loadTreeNode(me.$refs.tree.store.root, (data) => {
                        me.$refs.tree.store.root.doCreateChildren(data);
                        me.$refs.tree.store._initDefaultCheckedNodes();
                    })
                },
                immediate : false,
                deep : false
            }
        },
        methods: {
            ///Add   :   SongQian
            ///Time  :   2019-08-29
            ///查询异常设备
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
            handlerFilterNode(value, data, node) {
                if (value){
                    return value === '' || data.type === 'area' || data.hasFilter || data.type === value;
                }else {
                    return value === '' || data.type === 'area' || data.hasFilter ;
                }
            },
            /**
             * 页面数据查询
             */
            async queryTable() {
                let me = this;
                let size = me.pagination.size;
                let currentPage = me.pagination.currentPage;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Device.PageQuery,
                    JSON.stringify({
                        pageIndex: currentPage,
                        pageSize: size,
                        model: {
                            deviceType: me.search.deviceType ,
                            deviceName: me.search.deviceName,
                            isOnline: me.search.onlineStatus ,
                            areaCode: me.selectTreeNode.no || null,
                            deviceId: me.selectTreeNode.devId || null,
                        }
                    }),
                    {emulateJSON: true, emulateHTTP: false}
                )
                if (res.body.success) {
                    me.rows = res.body.model;
                    me.pagination.total = res.body.totalCount;
                    return;
                }
                me.$message.error(res.body.errorMessage);
            },
            handlerCalcTreeNodeTotal(guid) {
                let me = this;
                if(!guid)
                    return " (0/0) ";
                if( guid ) {
                    let node = me.$refs.tree.getNode(guid);
                    let total = node.data.total;
                    let deviceList = ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'].filter(it => it === me.deviceType || !me.deviceType);
                    if(node.childNodes.length >= 2) {
                        let calcSize = (cur, next) => {
                            let total = typeof cur === "number" ? cur : (deviceList.indexOf(cur.data.type) > -1 && 1 || cur.data.total || 0);
                            return total + (deviceList.indexOf(next.data.type) > -1 && 1 || next.data.total || 0);
                        }
                        let children = _.cloneDeep(node.childNodes);
                        total = children.reduce(calcSize);
                    }
                    let online=node.data.onlineNum;
                    if(node.childNodes.length === 1) {
                        total = deviceList.indexOf(node.childNodes[0].data.type) > -1 && 1 || node.childNodes[0].data.total || 0;
                        node.data.total = total;
                        return ` (${online+'/'+total})`;
                    }
                    return ` (${online}/${total}) `;
                }
                return " (0) ";
            },
            /**
             * 查询条件重置
             * @param formName
             */
            resetForm(formName) {
                let me = this;
                me.search = {
                    onlineStatus: '',
                    deviceType: '',
                    deviceName: ''
                }
                me.selectTreeNode = '';
                me.pagination.currentPage = 1;
                me.pagination.pageSize = 10;
                me.queryTable();
                me.loadTreeNodeByCheckBox();
            },
            /*分页切换*/
            handleSizeChange(size) {
                let me = this;
                me.pagination.size = size;
                me.pagination.currentPage = 1;
                me.queryTable();
            },
            handleCurrentChange(page) {
                let me = this;
                me.pagination.currentPage = page;
                me.queryTable();
            },
            /*查询设备类型*/
            async loadDeviceType() {
                let me = this;
                let res = await me.$http.get(
                    RESTFUL.injective.Api.DeviceType.QueryAll,
                    {emulateJSON: false, emulateHTTP: false}
                );
                if (res.body.success) {
                    me.deviceType = res.body.model;
                    res.body.model.map(deviceType => {
                        me.deviceTypeMap.set(deviceType.typeCode, deviceType.typeName);
                        if (deviceType.typeFlag !== 3) {
                            me.mainDeviceTypeMap.set(deviceType.typeCode, deviceType.typeName);
                        } else {
                            me.outDeviceTypeMap.set(deviceType.typeCode, deviceType.typeName);
                        }
                        me.deviceFlagMap.set(deviceType.typeCode, deviceType.typeFlag);

                    });
                }
            },
            loadTreeNodeByCheckBox() {
                let me = this;
                console.info(me.search.deviceType)
                me.$http.post(
                    RESTFUL.injective.Api.Area.AreaInfo,
                    JSON.stringify({
                        deviceType: me.search.deviceType || '',
                        type: '',
                    }),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        me.treeData = res.body.model;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            //区域划分设备列表 添加人： 宋骞
            async handlerDeviceList() {
                let me = this;
                let result = await me.$http.post(
                    RESTFUL.injective.Api.Device.List,
                    { deviceName: me.searchDeviceName },
                    { emulateJSON: false, emulateHTTP: true}
                );
                if(result.body.success) {
                    me.deviceTableData = result.body.model;
                }
            },
            //区域划分修改确认事件 添加人： 宋骞
            async modifyDeviceToArea() {
                //ModifyDeviceArea
                let me = this;
                if(!me.areaSelected) {
                    return me.$message.error("未选中所属区域!");
                }

                if(!me.multipleTableData.length) {
                    return me.$message.error("未勾选需要移动的设备!");
                }

                let deviceIds = me.multipleTableData.map(it => it.id);
                let areaId = me.areaSelected;

                let result =  await me.$http.post(
                    RESTFUL.injective.Api.Device.ModifyDeviceArea,
                    { deviceIds, areaId },
                    { emulateJSON: false, emulateHTTP : true}
                );

                if(result.body.success) {
                    me.cancleModifyDeviceToArea();
                    me.treeData = [];
                    me.loadTreeNode(me.$refs.tree.store.root, (data) => {
                        me.$refs.tree.store.root.doCreateChildren(data);
                        me.$refs.tree.store._initDefaultCheckedNodes();
                    })
                }
            },
            //取消修改设备划分到区域节点
            cancleModifyDeviceToArea() {
                let me = this;
                me.hasDivisionDialogShow = false;
                me.areaSelected = "";
                me.searchDeviceName = "";
                me.multipleTableData = [];
                me.$refs.divisionTree.setCurrentKey(null);
                me.$refs.divisionTable.clearSelection();
            },
            //区域划分设备列表选中事件 添加人： 宋骞
            handleSelectionChange(val)  {
                let me = this;
                me.multipleTableData = val;
            },
            //区域划分树节点点击事件处理方式 添加人：宋骞
            handlerTreeNodeClick(node) {
                let me = this;
                me.areaSelected = node.id;
            },
            //区域划分树节点加载方法  添加人： 宋骞
            loadAreaNode(node, resolve) {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Area.Area,
                    { parentId : node.data.id || '' },
                    { emulateJSON: false, emulateHTTP: false }
                ).then(res => {
                    if(res.body.success) {
                        /**
                         *   "model": null,
                         *   "operate": null,
                         *   "no": "050101",
                         *   "id": "e60eda0dab4643b7b0dfe886da6e9b7a",
                         *   "name": "测试区域1-1",
                         *   "type": "area",
                         *   "deviceType": null,
                         *   "leaf": false,
                         *   "devId": null,
                         *   "total": 0,
                         *   "onlineNum": 0,
                         *   "flash": 0,
                         *   "coordinates": [
                         *       113.71948242187497,
                         *       36.64858894203172
                         *   ],
                         *   "devIp": null,
                         *   "isOnline": 0,
                         *   "mac": "",
                         *   "guid": null
                         */
                        let data = res.body.model.map(it => ({ ...it, guid : it.guid || it.id })).filter(it => ['area'].indexOf(it.type) > -1);
                        resolve(data);
                        node.loaded = false;
                        node.loading = false;
                        return;
                    }
                })
            },
            loadTreeNode(node, resolve) {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Area.AreaInfo,
                    JSON.stringify({
                        parentId: node.data.id || '',
                        type: node.data.type || '',
                        devId: node.data.devId || '',
                        deviceType: me.search.deviceType || '',
                        areaCode: node.data.no || null
                    }),
                    { emulateJSON: true, emulateHTTP: false }
                ).then(res => {
                    if (res.body.success) {
                        let data = res.body.model.map(it => ({
                                ...it,
                                guid : it.guid || it.id,
                                id : it.id,
                                name : it.name,
                                type : it.type,
                                total : it.total,
                                deviceIP : it.devIp,
                                coordinates : it.coordinates,
                                mac : it.mac,
                                flash : it.flash || false,
                                isOnline : it.isOnline,
                                onlineNum: it.onlineNum,
                                companyName : it.companyName || '',
                                otherDeviceName : '',
                                listenState : '',
                                port : '',
                                energyNo : '',
                                otherDeviceIP : '',
                                interactionState : '',
                                checkedSpacing : '',
                                reStartTotal : '',
                                percent : 0,
                                power : '',
                                openPlanCheck : '',
                                closePlanCheck : '',
                                total : it.type === 'area' ? it.total : ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(it.type) > -1 ? 1 : 0,
                                hasFilter : me.deviceName && true || false,
                                disabled : ['1', '2', '3', '4', '5'].indexOf(it.type) > -1 || ['WTOS-VN-TME200', 'WTOS-VN-PE', 'WTOS-VN'].indexOf(node.data.type) > -1 && it.type === 'WTOS-VE'
                            })
                        ).filter(it => [ 'area', 'WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'].indexOf(it.type) > -1)
                        resolve(data);
                        node.loaded = false;
                        node.loading = false;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            handlerTreeCheckChange(data, isCheck, childrenNode) {
                let me = this;
                if (isCheck) {
                    me.search.areaNo = data.no;
                } else {
                    me.search.areaNo = '';
                }
            },
            handlerTreeMenuContext() {
            },
            handlerTreeAllowDrop(draggingNode, dropNode, type) {
                let me = this;
                if ([1, 2, 3, 4].indexOf(draggingNode.data.type) > -1) {
                    //外设不允许拖拽
                    return false;
                }
                if (dropNode.data.type !== "area") {
                    //设备下面不能被拖放节点
                    return false;
                }
                if (type === "inner") {
                    if (me.mainDeviceTypeMap.has(draggingNode.data.type) > -1 && dropNode.data.type === "area") {
                        return true;
                    }

                    if (draggingNode.data.type === "area" && dropNode.data.type === "area") {
                        return true;
                    }
                }
                if (type === "prev" || type === "next") {
                    if (me.mainDeviceTypeMap.has(draggingNode.data.type) && me.mainDeviceTypeMap.has(dropNode.data.type)) {
                        return true;
                    }

                    if (draggingNode.data.type === "area") {
                        return true;
                    }
                    if (me.mainDeviceTypeMap.has(draggingNode.data.type) && me.mainDeviceTypeMap.has(dropNode.data.type)) {
                        return true;
                    }
                }
                return false;
            },
            handleDropEnd(draggingNode, dropNode, dropType, ev) {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Area.Drag,
                    JSON.stringify({
                        draggingAreaId: draggingNode.data.id,
                        dragAreaId: dropNode.data.id,
                        dragType: dropType,
                        type: draggingNode.data.type,
                        deviceType: draggingNode.data.deviceType,
                        dragAreaType: draggingNode.data.type,
                        dragAreaCode: dropNode.data.no,
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
            expandTreeNodes(data, node, tree) {
                let me = this;
                node.loaded = false;
                node.loading = false;
                node.loadData();
            },
            handlerTreeNodeDbClick(node) {
                let me = this;
                me.selectTreeNode = node.data;
                let size = me.pagination.size;
                let currentPage = me.pagination.currentPage;
                let no = null;
                let deviceId = null;
                if (node.data.type !== 'area' && !me.mainDeviceTypeMap.has(node.data.deviceType)) {
                    return;
                }
                if (node.data.type === 'area') {
                    no = node.data.no;
                } else {
                    deviceId = node.data.id;
                }
                me.queryTable();
            },
            /*新增修改删除相关*/
            handlerOverlayClosed() {
                let me = this;
                me.hasDialogShow = false;
                me.hasOutDeviceDialogShow = false;
                me.hasImportDialogShow = false;
                me.hasImportPointDialogShow = false;
                me.hasImportPointResultDialogShow = false;
                me.hasUpdateImportDialogShow = false;
            },
            handlerCancelDevice() {
                let me = this;
                me.hasOutDeviceDialogShow = false;
                me.$refs.outDeviceForm.resetFields();
                me.$refs.outDeviceForm.clearValidate();
                me.hasDisabledAreaSubmit = false;
                me.$refs.deviceForm.resetFields();
                me.$refs.deviceForm.clearValidate();
                me.deviceModel.id = '';
                me.deviceModel.deviceId = '';
                me.deviceModel.areaId = '';
                me.hasDeviceDialogShow = false;
                me.treeNodeItem = null;
                me.deviceModel.coordinates = '';
                me.deviceModel.state = '';
                me.mapPosition = [];

            },
            getTableRow(row, index) {
                let me = this;
                if (me.selectRow && me.selectRow.deviceType === row.deviceType && me.selectRow.id === row.id) {
                    me.selectRow = null;
                } else {
                    me.selectRow = row;
                }
            },
            importDevice() {
                let me = this;
                me.hasImportDialogShow = true;
            },
            importDevicePoint() {
                let me = this;
                me.hasImportPointDialogShow = true;
            },
            closePointResult(){
              let me  = this;
                me.hasImportPointResultDialogShow = false;
                me.showDownloadMessage = false
                me.hasUpdateImportDialogShow = false;
            },
            async resolvePointDate(value) {
                let me = this;
                if (value.success) {
                    var resultData = value.model.model;
                    var message = "成功导入"+resultData.successNum+"条数据, 导入失败"+resultData.errorNum
                        +"条数据。 "
                    message += "点击下载失败数据按钮 查看导入失败的数据！！";
                    me.errorImportPointData = resultData.errorInfo;
                    me.importPointResult = message;
                    if (resultData.errorNum>0){
                        me.showDownloadMessage = true;
                    }
                  me.hasImportPointResultDialogShow = true;
                } else {
                    me.$message.error(value.errorMessage);
                }
                me.hasImportPointDialogShow = false;
            },
            errorDevicePointModelExport(){
                let me = this;
                let exportData = me.errorImportPointData;
                let data = [];
                if (exportData) {
                    data = exportData.map(it => ([it.deviceIp, it.lat, it.lon,it.errorMessage]));
                }
                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.aoa_to_sheet([['设备Ip', '经度', '纬度','失败原因'], ...data]);
                XLSX.utils.book_append_sheet(wb, ws, '经纬度导入失败数据');
                XLSX.writeFile(wb, `经纬度导入失败数据` + new Date().getTime() + `.xlsx`);
                me.hasUpdateImportDialogShow = false;
            },
            async resolveDate(value) {
                let me = this;
                if (value.success) {
                    await me.getAllExistIpAndDeviceId();
                    value.model.map(device => {
                        me.checkRow(device);
                        if (device.children) {
                            device.children.map(c => {
                                c.parentDeviceType = device.deviceType;
                                me.checkRow(c);
                            })
                        }
                    });
                    me.importRows = value.model;
                    me.importRows.map(d=>{
                        if ('WTOS-VN-TME200' === d.deviceType) {
                            if (d.children && d.children.length>1){
                                d.rowAllowSubmit = false;
                                d.errorMessage = "一个智能管理前端只能添加一个信号机";
                                d.children.map(row=>{
                                    row.rowAllowSubmit = false;
                                    row.errorMessage = "一个智能管理前端只能添加一个信号机";
                                })
                            }
                        }else {
                            if (d.children && d.children.length>=1){
                                d.children.map(row=>{
                                    if (row.deviceType === '6'){
                                        row.rowAllowSubmit = false;
                                        row.errorMessage = "非智能管理前端不能添加信号机";
                                    }
                                })
                            }
                        }
                    });
                    me.hasImportDialogShow = false;
                    me.hasUpdateImportDialogShow = true;
                } else {
                    me.$message.error(value.errorMessage);
                }
            },
            downloadModel() {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Command.query,
                    JSON.stringify({
                        methodName: "queryDeviceForExport",
                        body: [me.search.areaNo, me.search.deviceName, me.search.deviceType, me.search.onlineStatus]
                    }),
                    {emulateJSON: true, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        let exportData = res.body.model;
                        let data = [];
                        if (exportData) {
                            data = exportData.map(it => ([it.areaName, it.deviceName, me.deviceTypeMap.get(it.deviceType) ?
                                me.deviceTypeMap.get(it.deviceType) : it.deviceType, it.ip, it.isOnline == 1 ? "在线" : "离线"]));
                        }
                        let wb = XLSX.utils.book_new();
                        let ws = XLSX.utils.aoa_to_sheet([['区域名称', '设备名称', '设备类型', '设备ip', '在线状态',], ...data]);
                        XLSX.utils.book_append_sheet(wb, ws, '设备列表导出');
                        XLSX.writeFile(wb, `设备列表数据导出` + new Date().getTime() + `.xlsx`);
                    } else {
                        me.$message.error("未查询到设备信息: " + res.body.errorMessage);
                    }
                })
            },
            handlerDevictTypeChange(val) {
                let me = this;
                let areaName = me.deviceModel.areaName;
                let areaId = me.deviceModel.areaId;
                me.deviceModel.type = val;
                me.deviceModel.areaName = areaName;
                me.deviceModel.areaId = areaId;
            },
            async openDeviceEdit() {
                let me = this;
                let node = me.selectTreeNode;
                if (!node || (node.type !== 'area' && me.deviceFlagMap.get(node.type) !== 1)) {
                    return me.$message.error("新增机箱请选择设备所在的区域，新增外接设备请选择所在机箱！！！")

                }
                if (!me.deviceTypeMap.has(node.type) && node.type !== 'area') {
                    return me.$message.error("未知设备类型！！！")
                }
                if (node.type !== 'area') {
                    me.deviceModel.deviceId = node.devId;
                    let res = await me.queryDeviceById(node.devId);
                    if (res.model && res.model.outDeviceCount >= 20) {
                        return me.$message.error("设备下最多只能新增下20个外设！！！")
                    }

                    if (node.type === 'WTOS-VN-TME200' && res.model && res.model.outDeviceCount >= 1) {
                        return me.$message.error("设备下最多只能新增下一个信号机！！！")
                    }
                }
                me.deviceModel.areaName = node.name;

                me.deviceModel.type = node.type === 'area' ? 'WTOS-VN' : '3';
                me.deviceModel.mainDeviceType = node.type;
                if (me.deviceModel.mainDeviceType === 'WTOS-VN-TME200') {
                    me.deviceModel.type = '6';
                }
                me.deviceTitle = node.type === 'area' ? '新增主设备' : '新增外接设备';
                me.deviceModel.areaId = node.id;
                me.deviceModel.state = 'add';
                me.deviceModel.id = '';
                me.deviceModel.deviceIP = node.devIp;
                me.deviceModel.coordinates = [];
                me.deviceModel.otherDeviceName = '';
                me.deviceModel.companyName = '';

                me.deviceModel.listenState = 1;
                me.deviceModel.interactionState = 0;
                me.deviceModel.port = '';
                me.deviceModel.energyNo = '';
                me.deviceModel.otherDeviceIP = '';
                me.deviceModel.checkedSpacing = 2;
                me.deviceModel.reStartTotal = 3;
                if (node.type === 'area') {
                    me.hasDeviceDialogShow = true;
                } else {
                    me.deviceModel.name = node.name;
                    me.hasOutDeviceDialogShow = true;
                }
                me.hasAllowTreeMenuShow = false;
                me.hasOpenTreeMenuContext = false;
            },
            async modifyDevice() {
                let me = this;

                if (!me.selectRow) {
                    me.$message.error("请选择需要修改的设备!!!")
                    return;
                }
                let deviceId;
                let type;
                if (me.selectRow) {
                    deviceId = me.selectRow.id;
                    me.deviceModel.type = me.selectRow.deviceType;
                    if (me.deviceFlagMap.has(me.deviceModel.type)) {
                        type = me.selectRow.type;
                    }
                }
                me.deviceModel.state = 'modify';
                if (!me.mainDeviceTypeMap.has(me.deviceModel.type)) {
                    //查询外设信息
                    me.deviceTitle = '修改外设信息';
                    let res = await me.queryOutDeviceById(deviceId);
                    if (!res.success || !res.model) {
                        me.$message.error("查询外设信息失败!!!")
                        return;
                    }

                    let outDevice = res.model;
                    if (outDevice.isImport !== 1) {
                        return me.$message.error("外设信息未同步到主设备，无法修改!!!")
                    }

                    me.deviceModel.outDeviceInfo = res.model;
                    me.deviceModel.outdevId = outDevice.outdevId;
                    me.deviceModel.outdevDbId = deviceId;
                    me.deviceModel.deviceId = outDevice.devId;
                    me.deviceModel.name = outDevice.devName;
                    me.deviceModel.deviceIP = outDevice.devIp;
                    me.deviceModel.otherDeviceName = outDevice.outdevName;
                    me.deviceModel.companyName = outDevice.outdevCorp;
                    me.deviceModel.listenState = outDevice.detectStatus;
                    me.deviceModel.port = outDevice.port;
                    me.deviceModel.energyNo = outDevice.outdevPowerId;
                    me.deviceModel.otherDeviceIP = outDevice.outdevIp;
                    me.deviceModel.interactionState = outDevice.isAutoCtrl;
                    me.deviceModel.checkedSpacing = outDevice.timeInterval;
                    me.deviceModel.reStartTotal = outDevice.rebootCount;
                    me.deviceModel.power = outDevice.wt;
                    me.deviceModel.redPower = outDevice.ifdWt;
                    me.deviceModel.openPlanCheck = outDevice.timeSchStart;
                    me.deviceModel.closePlanCheck = outDevice.timeSchEnd;
                    me.deviceModel.percent = outDevice.wtPercent;
                    me.deviceModel.isOnline = outDevice.isOnline;
                    me.hasOutDeviceDialogShow = true;
                } else {
                    me.deviceTitle = '修改主设备信息';
                    let res = await me.queryDeviceById(deviceId);
                    if (!res.success || !res.model) {
                        me.$message.error("查询设备信息失败")
                        return;
                    }
                    let device = res.model;

                    me.deviceModel.deviceId = deviceId;
                    me.deviceModel.name = device.devName;
                    me.deviceModel.areaName = device.areaName;
                    me.deviceModel.areaId = device.areaId;
                    me.deviceModel.type = device.devSeries;
                    me.deviceModel.deviceIP = device.devIp;
                    me.deviceModel.isOnline = device.isOnline;
                    me.mapPosition.x = device.x;
                    me.mapPosition.y = device.y;
                    me.hasDeviceDialogShow = true;
                }
            },
            async handlerDropDevice() {
                let me = this;
                let commandCode;
                let id;
                if (me.selectRow) {
                    id = me.selectRow.id;
                } else {
                    return me.$message.error("请选择需要删除的设备!!!")
                }
                let res;
                me.$confirm('此操作将永久删除选中的设备,是否继续?', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(async () => {
                    if (!me.mainDeviceTypeMap.has(me.selectRow.deviceType)) {
                        res = await me.queryOutDeviceById(id);
                        commandCode = "gm006";
                    } else {
                        //查询设备信息
                        res = await me.queryDeviceById(id);
                        commandCode = "gm005";
                    }
                    if (res.success) {
                        let device = res.model;
                        if (me.mainDeviceTypeMap.has(me.selectRow.deviceType)) {
                            if (device.isOnline === 1) {
                                return me.$message.error("主设备在线无法删除！！！")
                            }
                        } else {
                            if (device.isOnline !== 1) {
                                return me.$message.error("主设备不在线无法删除！！！")
                            }
                        }
                        res = await me.sendCommand(commandCode, [id]);
                        if (res.success) {
                            me.$message({type: 'success', message: '设备已删除!'});
                            me.$refs.tree.remove(id);
                            me.queryTable();
                            return;
                        }
                        me.$message.error(res.errorMessage);
                    } else {
                        me.$message.error("未查询到设备信息: " + res.errorMessage);
                    }
                })
            },
            handlerSaveDevice() {
                let me = this;
                let model = me.deviceModel;
                let body;
                let commandCode;
                me.$refs.deviceForm.validate(async (checked) => {
                    if (checked) {
                        me.hasDisabledAreaSubmit = true;
                        await me.getAllExistIp();
                        if (me.deviceModel.state === 'add') {
                            if (me.deviceIpMap.has(model.deviceIP)) {
                                me.hasDisabledAreaSubmit = false;
                                return me.$message.error("IP已存在");
                            }
                            body = [model.name, model.deviceIP, model.type, me.mapPosition.x, me.mapPosition.y, model.areaId];
                            let res = await me.sendCommand("gm001", body);
                            if (res.success) {
                                let data = {
                                    id: res.model.data.DB_ID,
                                    type: model.type,
                                    name: model.name,
                                    deviceType: model.type,
                                    deviceIP: model.deviceIP,
                                    coordinates: me.mapPosition,
                                    leaf: true
                                };
                                me.$refs.tree.append(data, model.areaId);
                            } else {
                                me.hasDisabledAreaSubmit = false;
                                return me.$message.error(res.errorMessage)
                            }
                        } else if (me.deviceModel.state === 'modify') {
                            body = [model.deviceId, model.name, model.deviceIP, me.mapPosition.x, me.mapPosition.y, model.areaId];
                            commandCode = "gm003";
                            let res = await me.sendCommand(commandCode, body);
                            if (!res.success) {
                                me.hasDisabledAreaSubmit = false;
                                return me.$message.error(res.errorMessage)
                            } else {
                                let node = me.$refs.tree.getNode(me.selectRow.id);
                                if (node){
                                    node.data.name = model.otherDeviceName;
                                }
                            }
                        }
                        await me.queryTable();
                        me.handlerCancelDevice();
                        return me.$message.success("操作成功！！！");
                    }
                });
            },
            handlerSaveOutDevice() {
                let me = this;
                let model = me.deviceModel;
                let body;
                let commandCode;
                me.$refs.outDeviceForm.validate(async (checked) => {
                    if (checked) {
                        me.hasDisabledAreaSubmit = true;
                        await me.getAllExistIp();
                        if (me.deviceModel.state === 'add') {

                            if (model.otherDeviceIP && me.deviceIpMap.has(model.otherDeviceIP)) {
                                me.hasDisabledAreaSubmit = false;
                                return me.$message.error("外设IP已存在");
                            }
                            let now = me.getDate();
                            let userName = me.userName;
                            body = [model.deviceId, model.otherDeviceIP, "", model.otherDeviceName, model.type, model.companyName, model.port, '', model.energyNo,
                                model.listenState, 1, 0, 0, model.percent, model.power, model.redPower, model.openPlanCheck, model.closePlanCheck,
                                model.interactionState, 1, model.checkedSpacing, model.reStartTotal, "", "", 0, 0, now, now, userName, userName];
                            let res = await me.sendCommand("gm002", body);
                            if (res.success) {
                                let data = {
                                    id: res.model.data.DB_ID,
                                    type: model.type,
                                    deviceType: model.type,
                                    name: model.otherDeviceName,
                                    deviceIP: model.deviceIP,
                                    coordinates: me.mapPosition,
                                    leaf: true
                                };
                                me.$refs.tree.append(data, model.areaId);
                            } else {
                                me.hasDisabledAreaSubmit = false;
                                return me.$message.error(res.errorMessage)
                            }
                        } else if (me.deviceModel.state === 'modify') {
                            let now = me.getDate();
                            let userName = me.userName;
                            body = [me.selectRow.id, model.outdevId, model.deviceId, model.otherDeviceIP, "", model.otherDeviceName,
                                model.companyName, model.type, model.port, model.energyNo, model.listenState, 1, 1, 0,
                                model.percent, model.power, model.redPower, model.openPlanCheck, model.closePlanCheck,
                                model.interactionState, 1, model.checkedSpacing, model.reStartTotal, "", "", "", "",
                                now, userName];
                            commandCode = "gm004";
                            let res = await me.sendCommand(commandCode, body);
                            if (!res.success) {
                                me.hasDisabledAreaSubmit = false;
                                return me.$message.error(res.errorMessage)
                            } else {
                                let node = me.$refs.tree.getNode(me.selectRow.id);
                                if (node && node.data) {
                                    node.data.name = model.otherDeviceName;
                                }
                            }
                        }
                        await me.queryTable();
                        me.handlerCancelDevice();
                        return me.$message.success("操作成功！！！");
                    }
                });
            },
            openUpdateColumn(row) {
                let me = this;
                //1非上传过程中 2只允许单条修改 3上传成功的不能再次修改
                if (me.allowUpdateImportTable && me.singRowAllowUpdate && !row.hasUpload) {
                    me.ifShowSaveButton = true;
                    me.singRowAllowUpdate = false;
                    row.showInput = true;
                }
            },
            async saveUpdateImportRowData(row) {
                let me = this;
                let allow = me.checkRow(row);

                if (!allow) {
                    me.$message.error("仍存在异常=>" + row.errorMessage)
                } else {
                    me.importRows.map(d=>{
                        me.checkRow(d);
                        if (d.children) {
                            d.children.map(row=>{
                                row.parentDeviceType = d.deviceType;
                                me.checkRow(row);
                            })
                        }
                    })
                    row.showInput = false;
                    me.ifShowSaveButton = false;
                    me.singRowAllowUpdate = true;
                    await me.processImportData();
                    //交通灯管理前端只能添加一个信号机
                    me.importRows.map(d=>{
                        if ('WTOS-VN-TME200' === d.deviceType) {
                            if (d.children.length>1){
                                d.rowAllowSubmit = false;
                                d.errorMessage = "一个智能管理前端只能添加一个信号机";
                                d.children.map(row=>{
                                    row.rowAllowSubmit = false;
                                    row.errorMessage = "一个智能管理前端只能添加一个信号机";
                                })
                            }
                        }else {
                            if (d.children.length>=1){
                                d.children.map(row=>{
                                    if (row.deviceType === '6'){
                                        row.rowAllowSubmit = false;
                                        row.errorMessage = "非智能管理前端不能能添加一个信号机";
                                    }
                                })
                            }
                        }
                    });

                }
            },
            async processImportData() {
                let me = this;
                let mainDeviceMapInfo = new Map();
                let errorRows = [];
                me.importRows.map(d => {
                    if (!d.rowAllowSubmit) {
                        errorRows.push(d);
                        return;
                    }
                    if (me.mainDeviceTypeMap.has(d.deviceType)) {
                        let mainDevice = _.cloneDeep(d);
                        mainDevice.children = [];
                        if (!mainDeviceMapInfo.get(d.boxIP)) {
                            mainDeviceMapInfo.set(d.boxIP + "", mainDevice);
                        } else {
                            errorRows.push(d);
                        }
                        if (d.children) {
                            d.children.map(c => {
                                    if (!c.rowAllowSubmit) {
                                        errorRows.push(c);
                                    }
                                }
                            )
                        }
                    }
                });
                let importRowsForUpdate = _.cloneDeep(me.importRows);
                for (let d of  importRowsForUpdate) {
                    if (!d.rowAllowSubmit) {
                        continue;
                    }
                    if (!me.mainDeviceTypeMap.has(d.deviceType)) {
                        let mainDevice = mainDeviceMapInfo.get(d.boxIP + "");
                        if (mainDevice) {
                            mainDevice.children.push(d)
                        } else {
                            let res = await me.queryDeviceIdByIp(d.boxIP);
                            if (res.success) {
                                let mainDevice = {};
                                mainDevice.boxIP = res.model.devIp;
                                mainDevice.deviceType = res.model.devSeries;
                                mainDevice.outDeviceName = res.model.devName;
                                mainDevice.id = res.model.id;
                                mainDevice.hasUpload = true;
                                mainDevice.rowAllowSubmit = true;
                                mainDevice.children = [d];
                                mainDeviceMapInfo.set(mainDevice.boxIP + "", mainDevice);
                            }
                        }
                    } else {
                        if (d.children) {
                            let childrens = _.cloneDeep(d.children);
                            d.children = [];
                            for (let childrenDevice of  childrens) {
                                if (!childrenDevice.rowAllowSubmit) {
                                    continue;
                                }
                                let mainDevice = mainDeviceMapInfo.get(childrenDevice.boxIP + "");
                                if (mainDevice) {
                                    mainDevice.children.push(childrenDevice)
                                    mainDeviceMapInfo.set(childrenDevice.boxIP + "", mainDevice);
                                } else {
                                    let res = await me.queryDeviceIdByIp(childrenDevice.boxIP + "");
                                    if (res.success && res.model && 1 === me.deviceFlagMap.get(res.model.devSeries)) {
                                        mainDevice = {};
                                        mainDevice.boxIP = res.model.devIp;
                                        mainDevice.deviceType = res.model.devSeries;
                                        mainDevice.outDeviceName = res.model.devName;
                                        mainDevice.id = res.model.id;
                                        mainDevice.hasUpload = true;
                                        mainDevice.rowAllowSubmit = true;
                                        mainDevice.children = [childrenDevice];
                                        mainDeviceMapInfo.set(mainDevice.boxIP + "", mainDevice);
                                    }
                                }

                            }
                        }
                    }
                }
                let rows = [];
                for (let [key, item] of mainDeviceMapInfo) {
                    rows.push(item);
                }
                me.importRows = [...rows, ...errorRows];
            },
            checkImportTableRule(tableData) {
                //导入提交前校验
                let me = this;
                let allow = true;
                tableData.forEach(row => {
                        if (!row.rowAllowSubmit) {
                            if (allow) {
                                allow = false;
                            }
                        }
                        if (row.children && row.children.length > 0) {
                            allow = me.checkImportTableRule(row.children);
                        }
                    }
                );
                return allow;
            },
            checkRow(row) {
                if (row.hasUpload) {
                    row.rowAllowSubmit = true;
                    return;
                }

                let me = this;
                if (me.mainDeviceTypeMap.get(row.deviceType)) {//是否主设备
                    if (me.importDeviceIpMap.get(row.boxIP) && !me.importDeviceIpIdMap.get(row.boxIP) === row.id) {
                        row.errorMessage = "导入表格中存在IP相同的设备";
                        row.rowAllowSubmit = false;
                        return false;
                    }
                    let deviceType = me.deviceIpMap.get(row.boxIP);//根据IP判断是否已经存在数据库中
                    if (deviceType) {
                        if (deviceType === row.deviceType) {//跟已存在的设备类型是否一致
                            row.isUpdate = true;
                        } else {
                            row.rowAllowSubmit = false;
                            row.errorMessage = "存在IP相同的其他类型设备";
                            return false;
                        }
                    } else {
                        row.isUpdate = false;
                    }
                    if (!row.outDeviceName){
                        row.rowAllowSubmit = false;
                        row.errorMessage = "设备名称不能为空";
                        return false;
                    }
                    if (row.outDeviceName.length>16){
                        row.rowAllowSubmit = false;
                        row.errorMessage = "设备名称不能超过16个字符";
                        return false;
                    }

                } else {//外设
                    if (me.importDeviceIpMap.get(row.outDeviceIp) && !me.importDeviceIpIdMap.get(row.outDeviceIp) === row.id) {
                        row.errorMessage = "导入表格中存在IP相同的外设";
                        row.rowAllowSubmit = false;
                        return false;
                    }
                    let deviceType = me.deviceIpMap.get(row.boxIP);
                    let deviceTypeByImport = me.importDeviceIpMap.get(row.boxIP);
                    if (!(deviceType && 1 === me.deviceFlagMap.get(deviceType))
                        && !(deviceTypeByImport && 1 === me.deviceFlagMap.get(deviceTypeByImport))) {
                        debugger
                        row.rowAllowSubmit = false;
                        row.errorMessage = "设备箱不存在";
                        return false
                    }
                    if (!me.deviceIpMap.has(row.outDeviceIp)) {
                        row.isUpdate = false;
                    }
                    if (!row.outDeviceName){
                        row.rowAllowSubmit = false;
                        row.errorMessage = "外设名称不能为空";
                        return false;
                    }
                    if (row.outDeviceName.length>8){
                        row.rowAllowSubmit = false;
                        row.errorMessage = "外设名称不能超过8个字符";
                        return false;
                    }
                }
                if (row.factory && row.factory.length>10){
                    row.rowAllowSubmit = false;
                    row.errorMessage = "厂商名称不能超过10个字符";
                    return false;
                }
                if (!row.boxIP
                    || !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(row.boxIP)) {
                    row.rowAllowSubmit = false;
                    return false
                }
                if (row.deviceType === "1" || row.deviceType === "3") {
                    if (!row.power) {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "功率不能为空";
                        return false
                    }
                    if (!/^(\d{1,8})$/.test(row.power)) {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "功率只能是1到8的数字";
                        return false
                    }
                }
                if (row.deviceType === "3" || row.deviceType === "4") {
                    let deviceTypeInDb = me.deviceIpMap.get(row.outDeviceIp);
                    if (deviceTypeInDb) {
                        if (deviceTypeInDb === row.deviceType) {
                            row.isUpdate = true;
                        } else {
                            row.rowAllowSubmit = false;
                            row.errorMessage = "外接设备IP重复";
                            return false
                        }
                    }
                    if (!row.outDeviceIp
                        || !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(row.outDeviceIp)) {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "外接设备ip格式异常";
                        return false
                    }
                }
                if (row.deviceType === "3" || row.deviceType === "4") {
                    if (!row.port) {
                        row.errorMessage = "网口不能为空";
                        row.rowAllowSubmit = false;
                        return false
                    }
                    if ( !/^([1-9]||10)$/.test(row.port)) {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "网口只能是1到10的数字";
                        return false
                    }
                }
                if (row.deviceType === "1" || row.deviceType === "2") {
                    if (row.parentDeviceType && row.parentDeviceType === 'WTOS-VN-PE'){
                        if (!/^([1-4])$/.test(row.energyNo)) {
                            row.rowAllowSubmit = false;
                            row.errorMessage = "电源端口只能是1到4的数字";
                            return false
                        }
                    }else if (!/^([1-8])$/.test(row.energyNo)) {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "电源端口只能是1到8的数字";
                        return false
                    }
                }
                if (row.deviceType === "4") {//终端服务器
                    if (!row.localIp
                        || !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(row.localIp)) {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "本地ip格式异常";
                        return false
                    }
                    if (!row.localMask
                        || !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(row.localMask)) {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "本地掩码格式异常";
                        return false
                    }
                }
                if (row.outDeviceIp) {
                    me.importDeviceIpMap.set(row.outDeviceIp, row.deviceType);
                    me.importDeviceIpIdMap.set(row.outDeviceIp, row.id);
                } else if (me.mainDeviceTypeMap.has(row.deviceType)){
                    me.importDeviceIpMap.set(row.boxIP, row.deviceType);
                    me.importDeviceIpIdMap.set(row.boxIP, row.id);
                }
                row.rowAllowSubmit = true;
                row.errorMessage = "";
                return true;
            },
            uploadImportDevice() {
                let me = this;
                let importTableRow = me.importRows;
                //上传校验
                let allow = me.checkImportTableRule(importTableRow);
                if (!allow) {
                    me.$message.error("表单中仍有未处理完成的异常，请核对所有数据正确后上传!!!")
                } else {
                    //关闭双击修改
                    me.allowUpdateImportTable = false;
                    //有异常时不允许上传
                    me.formImportSubmit = true;
                    me.uploadProcess();
                }
            },
            async uploadProcess() {
                let me = this;
                for (let row of me.importRows) {
                    me.formImportSubmit = true;
                    if (!row.hasUpload) {
                        //导入数据单条提交
                        await me.upload(row);
                    }
                    if (row.children) {
                        //子节点上传
                        for (let child of row.children) {
                            if (!child.hasUpload) {
                                await me.upload(child);
                            }
                        }
                    }
                }
                //上传校验
                let allow = me.checkImportTableRule(me.importRows);
                if (allow) {
                    me.$message.success("导入成功！！！")
                    me.cancleImportDevice();
                } else {
                    me.formImportSubmit = false;
                    me.allowUpdateImportTable = true;
                    me.$message.error("存在上传失败的数据，请修改后继续上传！！！")
                }
            },
            async upload(row) {
                let me = this;
                let deviceType = row.deviceType;
                let body;
                let commandCode;
                let now = me.getDate();
                if (row.isUpdate) {
                    if (me.mainDeviceTypeMap.has(row.deviceType)) {
                        if (row.lat && row.lon) {
                            body = [row.dbId, row.outDeviceName, row.boxIP, row.lat, row.lon, row.areaId];
                        }else {
                            body = [row.dbId, row.outDeviceName,  me.getMapCenter[0], me.getMapCenter[1], row.lon, row.areaId];
                        }
                        commandCode = "gm003";
                    } else {
                        let now = me.getDate();
                        let userName = me.userName;
                        body = [row.dbId, row.outDevId, row.deviceId, row.outDeviceIp, "", row.outDeviceName,
                            row.factory, row.deviceType, row.port, row.energyNo, row.checkedSpacing, 1, 1, 0,
                            row.percent, row.power, row.redPower, row.openPlanCheck, row.closePlanCheck,
                            row.unionStatus, 1, row.checkedSpacing, row.reStartTotal, row.localIp, row.localMask, 0, row.packerLoss,
                            now, userName];
                        commandCode = "gm004";
                    }
                    let res = await me.sendCommand(commandCode, body);
                    if (res.success) {
                        row.rowAllowSubmit = true;
                        row.errorMessage = "修改成功！";
                        row.hasUpload = true;
                    } else {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "修改失败！" + res.errorMessage;
                    }
                    return row.rowAllowSubmit;

                } else {
                    let devId;
                    if (me.mainDeviceTypeMap.has(deviceType)) {
                        if (row.lat && row.lon) {
                            body = [row.outDeviceName, row.boxIP, deviceType, row.lat, row.lon, 0];
                        } else {
                            body = [row.outDeviceName, row.boxIP, deviceType, me.getMapCenter[0], me.getMapCenter[1], 0];
                        }
                        commandCode = "gm001";
                    } else {
                        let res = await me.queryDeviceIdByIp(row.boxIP);
                        if (!res.success || !res.model || !res.model.id) {
                            row.rowAllowSubmit = false;
                            row.errorMessage = "未查询到主设备";
                            return false;
                        }
                        devId = res.model.id;
                        body = [devId, row.outDeviceIp, "", row.outDeviceName, deviceType, row.factory, row.port, '', row.energyNo,
                            row.listenState, 1, 0, "", row.percent, row.power, row.redPower, row.openPlanCheck, row.closePlanCheck,
                            row.unionStatus, 1, row.checkedSpacing, row.reStartTotal, "", "", 0, 0, now, now, me.userName, me.userName];
                        commandCode = "gm002";
                    }
                    let res = await me.sendCommand(commandCode, body);
                    if (res.success) {
                        row.errorMessage = "新增成功！";
                        row.rowAllowSubmit = true;
                        row.hasUpload = true;
                        let data;
                        if (me.mainDeviceTypeMap.has(deviceType)) {
                            data = {
                                id: res.model.data.DB_ID,
                                type: row.deviceType,
                                deviceType: row.deviceType,
                                name: row.outDeviceName,
                                deviceIP: row.boxIP,
                                coordinates: [0, 0],
                                leaf: true
                            };
                            me.$refs.tree.append(data, '0');
                            me.deviceIpMap.set(row.boxIP, res.model.data.DB_ID);
                        } else {
                            data = {
                                id: res.model.data.DB_ID,
                                type: row.deviceType,
                                deviceType: row.deviceType,
                                name: row.outDeviceName,
                                deviceIP: row.outDeviceIp,
                                leaf: false
                            }
                            me.$refs.tree.append(data, devId);
                        }
                    } else {
                        row.rowAllowSubmit = false;
                        row.errorMessage = "新增失败！" + res.errorMessage;
                    }
                    return row.rowAllowSubmit;
                }
            },
            cancleImportDevice() {
                //取消上传
                let me = this;
                me.formImportSubmit = false;
                me.allowUpdateImportTable = true;
                me.hasUpdateImportDialogShow = false;
                me.hasUpload = false;
                me.importDeviceIpMap = new Map();
                me.importDeviceIpIdMap = new Map();
                me.deviceIpMap = new Map();
                me.ifShowSaveButton = false;
                me.singRowAllowUpdate = true;
            },
            cellStyle(row, column, rowIndex, columnIndex) {
                if (!row.row.rowAllowSubmit) {
                    return 'color:#F56C6C;'
                }
                if (row.row.isUpdate) {
                    return 'color:#E6A23C;'
                }
                if (row.row.hasUpload) {
                    return;
                }
                return 'color:#67C23A;'
            },
            //命令发送
            async sendCommand(commandCode, body) {
                let me = this;
                let res = '';
                try {
                    res = await me.$http.post(
                        RESTFUL.injective.Api.Command.Send,
                        JSON.stringify({commandCode: commandCode, body: body}),
                        {emulateJSON: true, emulateHTTP: false}
                    );
                } catch (err) {
                    console.error(err)
                }
                if (res.body) {
                    return res.body
                } else {
                    return res;
                }
            },
            getDate() {
                return moment().format("YYYY-MM-DD HH:mm:ss");
            },
            async deviceModelExport() {
                let me = this;
                let res = await me.$http.get(RESTFUL.injective.Api.Device.ModelExport, {
                    emulateJSON: true,
                    emulateHTTP: true,
                    responseType: 'blob'
                });
                res.blob().then(blob => {
                    let aElement = document.createElement("a");
                    if ("download" in aElement) {
                        let url = URL.createObjectURL(blob);
                        aElement.setAttribute("style", "display:none");
                        aElement.setAttribute("href", url);
                        aElement.setAttribute("download", "设备信息导入模板.xls");
                        me.$refs.container.appendChild(aElement);
                        aElement.click();
                        me.$refs.container.removeChild(aElement);
                    } else {
                        navigator.msSaveBlob(blob, "设备信息导入模板.xls");
                    }
                })
            },
            async devicePointModelExport() {
                let me = this;
                let res = await me.$http.get(RESTFUL.injective.Api.Device.ModelPointExport, {
                    emulateJSON: true,
                    emulateHTTP: true,
                    responseType: 'blob'
                });
                res.blob().then(blob => {
                    let aElement = document.createElement("a");
                    if ("download" in aElement) {
                        let url = URL.createObjectURL(blob);
                        aElement.setAttribute("style", "display:none");
                        aElement.setAttribute("href", url);
                        aElement.setAttribute("download", "设备经纬度导入模板.xls");
                        me.$refs.container.appendChild(aElement);
                        aElement.click();
                        me.$refs.container.removeChild(aElement);
                    } else {
                        navigator.msSaveBlob(blob, "设备经纬度导入模板.xls");
                    }
                })
            },
            async queryDeviceIdByIp(ip) {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Command.query,
                    JSON.stringify({methodName: "queryDeviceIdByIp", body: [ip]}),
                    {emulateJSON: true, emulateHTTP: false}
                );
                return res.body;
            },
            async queryOutDeviceById(id) {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Command.query,
                    JSON.stringify({methodName: "queryOutDeviceById", body: [id]}),
                    {emulateJSON: true, emulateHTTP: false});
                return res.body;
            },
            async queryDeviceById(id) {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Command.query,
                    JSON.stringify({methodName: "queryDeviceById", body: [id]}),
                    {emulateJSON: true, emulateHTTP: false});
                return res.body;

            },
            async getAllExistIpAndDeviceId() {
                let me = this;
                let body = [];
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Command.query,
                    JSON.stringify({methodName: "queryDeviceIpMap", body: body}),
                    {emulateJSON: true, emulateHTTP: false}
                );
                if (res.body.success) {
                    me.deviceIpMap = new Map();
                    res.body.model.map(device => {
                        me.deviceIpMap.set(device.ip, device.deviceType);
                    });
                    return;
                } else {
                    me.$message.error("获取ip失败", res.body.errorMessage)
                }
            },
            async getAllExistIp() {
                let me = this;
                let body = [];
                let res = await me.$http.post(
                    RESTFUL.injective.Api.Command.query,
                    JSON.stringify({methodName: "queryDeviceIpMap", body: body}),
                    {emulateJSON: true, emulateHTTP: false}
                );
                if (res.body.success) {
                    me.deviceIpMap = new Map();
                    res.body.model.map(device => {
                        me.deviceIpMap.set(device.ip, device.deviceType);
                    });
                    return;
                } else {
                    me.$message.error("获取ip失败", res.body.errorMessage)
                }
            },
            changeListenState() {
                let me = this;
                if (me.deviceModel.listenState === 0) {
                    me.deviceModel.checkedSpacing = ''
                    me.deviceModel.checkTimes = ''

                }
            },
            outDeviceTypeChange() {
                let me = this;
                me.$refs.outDeviceForm.clearValidate();
                if (me.deviceModel.type === '1') {
                    me.deviceModel.openPlanCheck = '21:00'
                    me.deviceModel.closePlanCheck = '04:00'
                } else {
                    me.deviceModel.openPlanCheck = ''
                    me.deviceModel.closePlanCheck = ''
                    me.deviceModel.percent = ''
                }
                if (me.deviceModel.type === 5) {
                    me.deviceModel.interactionState = 1;
                } else {
                    me.deviceModel.interactionState = 0;
                }
            },
            nothing() {
            }
        },
        computed: {
            getDeviceDialogSize() {
                let me = this;
                if (me.showMoreDeviceImputOption) {
                    return {width: 900, height: 600};
                }
                return {width: 900, height: 520};

            },
            getLabelWidth() {
                let me = this;
                if (me.selectTreeNode.type !== 'area') {
                    return '140px';
                }
                return '120px';
            },
            hasAddMainDevice() {
                let me = this;
                if (me.selectRow && me.deviceModel.state === 'modify') {
                    return me.selectRow.type == 1;
                }
                if (me.selectTreeNode) {
                    return me.selectTreeNode.type === 'area'
                }

            },
            hasOutDevice() {
                let me = this;
                return me.outDeviceTypeMap.has(me.deviceModel.deviceType);
            },
            ...mapGetters({
                'userName': 'User/getUsername',
                'getMapCenter': 'Sys/getMapCenter'
            }),
        },
        mounted() {
            let me = this;
            if (me.deviceTypeParam){
                me.search.deviceType = me.deviceTypeParam;
                me.search.onlineStatus = '0';
            }
            me.loadDeviceType();
            me.queryTable();
            me.handlerDeviceList();
            me.queryAlarmIdListFromNotDeal();
        }
    }
})()
