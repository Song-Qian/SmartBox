/**
 * Developer    :   SongQian
 * Time         :   2019-06-04
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   智能机箱页面代码
 */
import _ from 'lodash'
import RESTFUL from '~/Scripts/Util/RestfulApi'
import { mapGetters } from 'vuex'

export default (function () {

    return {
        name: 'Equipment',
        data() {
            return {
                hasFold: false,
                deviceName: '',
                treeData: [],
                exceptionDeviceList : []
            }
        },
        watch: {
            deviceName : {
                handler(newVal, oldVal) {
                    let me = this;
                    // 懒加载树数据，统计设备总数不能使用前端过滤功能，只能后台过滤数据，前端响应式统计设备数据。
                    // me.$refs.tree.filter(newVal);
                    me.treeData = [];
                    me.loadTreeNode(me.$refs.tree.store.root, (data) => {
                        me.$refs.tree.store.root.doCreateChildren(data);
                        me.$refs.tree.store._initDefaultCheckedNodes();
                        me.queryAllPrimaryDevice();
                    })
                },
                immediate : false,
                deep : false
            }
        },
        computed: {
            ...mapGetters({
                'loaded' : 'Equipment/getLoadState'
            })
        },
        methods: {
            loadTreeNode(node, resolve) {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Area.AreaInfo,
                    JSON.stringify({ parentId: node.data.id || '', type: node.data.type || '', devId : node.data.devId || '', areaCode : node.data.no || null,  deviceType : '', deviceName : me.deviceName }),
                    {emulateJSON: true, emulateHTTP: false}
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
                                disabled : ['1', '2', '3', '4', '5'].indexOf(it.type) > -1 || ['WTOS-VN-TME200', 'WTOS-VN', 'WTOS-VN-PE'].indexOf(node.data.type) > -1 && it.type === 'WTOS-VE'
                            })
                        ).filter(it => [ 'area', 'WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'].indexOf(it.type) > -1)
                        resolve(data);
                        node.loaded = false;
                        node.loading = false;
                        me.$refs.tree && me.$refs.tree.filter(me.deviceName);
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            //点击树节点
            clickNode(data, node, vnode) {
                let me = this;
                if (data.type != "area") { //说明点击的是设备
                    if (["1", "2", "3", "4", "5"].indexOf(data.type) > -1) {  //说明点击的是外设，则需要获取父节点的id（也就是智能箱的id），展示父节点的数据
                        me.$router.push({ name: 'case', params : { id : node.parent.data.devId } })
                    } else if (data.type === 'WTOS-VN') {
                        me.$router.push({ name: 'case', params : { id : data.id } })
                    } else if (data.type === 'WTOS-VN-PE') {
                        me.$router.push({ name: 'pe', params: { id: data.id } })
                    } else if(data.type === "6") {
                        let id = node.parent.data.devId;
                        me.$router.push({ name: 'traffic', params: { id } })
                    } else if (data.type === 'WTOS-VN-TME200') {
                        me.$router.push({ name: 'traffic', params: { id : data.id } })
                    } else {     //说明点击的是VE设备
                        me.$message.info("请点击智能机箱设备或外接设备", "提示",
                        { customClass: "smart-box smart-box-message", confirmButtonClass: "el-button--success", cancelButtonClass: 'el-button--warning' });
                    }
                }
            },
            async queryAlarmIdListFromNotDeal() {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.AlarmInfo.getAlarmIdListFromNotDeal,
                    {},
                    { emulateJSON : false, emulateHTTP : true }
                );
                me.exceptionDeviceList = [];
                if(res.status === 200 && res.data.success) {
                    let result = res.data.model;
                    me.exceptionDeviceList = result.map(it => it.DEV_ID && it.DEV_ID.toString());
                }
            },
            handlerCalcTreeNodeTotal(guid) {
                let me = this;
                if(!guid) 
                    return " (0/0) ";
                if( guid ) {
                    let node = me.$refs.tree.getNode(guid);
                    let total = node.data.total;
                    // let deviceList = ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'].filter(it => it === me.deviceType || !me.deviceType);
                    let deviceList = ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'];
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
                    node.data.total = total;
                    return ` (${online}/${total}) `;
                }
                return " (0) ";
            }
        },
        mounted() {
            let me = this;
            me.queryAlarmIdListFromNotDeal();
        }
    }
})()