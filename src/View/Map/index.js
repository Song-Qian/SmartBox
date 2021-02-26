/**
 * Developer    :   SongQian
 * Time         :   2019-05-28
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   地图业务UI
 */

import _ from 'lodash'
import moment from 'moment'
import {Map, View, Overlay} from 'ol'
import {defaults as defaultControls} from 'ol/control';
import { getCenter, containsCoordinate } from 'ol/Extent';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import { TileImage } from 'ol/source'
import TileGrid from 'ol/tilegrid/TileGrid'
import {Cluster, Vector as VectorSource } from 'ol/source'
import {Style, Icon, Text, Fill } from 'ol/style'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import {altKeyOnly } from 'ol/events/condition'
import {DragRotateAndZoom, Draw, MouseWheelZoom} from 'ol/interaction'
import {transform, transformExtent, get as getProjection } from 'ol/proj'
import { CapabilityFactory, DEV_TEMP, DEV_POWER_STATUS } from '~/Scripts/Util/CapabilitySet'
import RESTFUL from '~/Scripts/Util/RestfulApi'
import { mapGetters, mapActions } from 'vuex'

import {
    ButtonGroupComponent,
    ListActionButton,
    CustomActionButton
} from '~/Scripts/Util/ol.map.controls'

export default (function () {
    let map = null;
    let draw = null;

    let notifys = [];

    const interactionDrawFeature = function (callback, vm, interaction = 'draw', type = 'Point', features = []) {
        let layers, drawLayer, source;
        if (map && interaction === 'draw') {
            layers = map.getLayers();
            drawLayer = null;
            layers.forEach((layer) => {
                if (layer.values_.id === 'draw-vector-layer') {
                    drawLayer = layer;
                }
            });
            source = drawLayer.getSource();
            source.clear();
            draw = new Draw({source, type, stopClick: true});
            let listen = (e) => {
                map.removeInteraction(draw);
                source.un("addfeature", listen);
                if (typeof callback === 'function') {
                    callback.apply(null, [e]);
                    callback = null;
                }
                draw = null;
                listen = null;
            };
            source.on("addfeature", listen);
            map.addInteraction(draw);
        } else if (map && interaction === 'modify') {
            layers = map.getLayers();
            drawLayer = null;
            layers.forEach((layer) => {
                if (layer.values_.id === 'draw-vector-layer') {
                    drawLayer = layer;
                }
            });
            source = drawLayer.getSource();
            source.clear();
            let featuresCopy = _.cloneDeep(features);
            source.addFeatures(features);
            source.refresh();
            //该交互被否定，使用地图点击事件处理Modify工作。
            // draw = new Modify({ source, condition : mouseOnly });
            // map.addInteraction(draw);
            map.un("click", vm.handlerMapFeatureActive);
            //该交互被确认，但是只支持修改一个Feature对象，不支持修改批量Feature，目前需要没有批量Feature修改要求
            //以后如果有批量修改Feature要求，此处是bug，谨慎修改。建议使用ol.interaction.modify。
            let modify = (evt) => {
                vm.$confirm("确认是否修改当前坐标点?", '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: "el-button--success", 
                    cancelButtonClass: 'el-button--warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let feature = features[0];
                    let point = new Point(evt.coordinate);
                    feature.setGeometry(point);
                    source.refresh();
                    if (typeof callback === 'function') {
                        evt.features = features;
                        callback.apply(null, [evt, 'ok']);
                        callback = null;
                    }
                    map.un("click", modify);
                    map.on("click", vm.handlerMapFeatureActive);
                    modify = null;
                }).catch(() => {
                    source.clear();
                    source.addFeatures(featuresCopy);
                    source.refresh();
                    if (typeof callback === 'function') {
                        callback.apply(null, [evt, 'cancle']);
                        callback = null;
                    }
                })
            }
            map.on("click", modify);
        }
    }

    const mapRender = function(vm) {
        let controls = defaultControls({zoom: false}).extend([
            new ButtonGroupComponent({
                buttons: [
                    new ListActionButton({
                        text: "地图", target: vm.$refs.map, icon : 'el-icon-map-location', disabled : true
                    }),
                    new ListActionButton({
                        text: "列表", target: vm.$refs.map, type : 'primary', icon : 'fa fa-list-ul', click: () => {
                            vm.$router.push({ name: 'deviceTable'});
                        }
                    }),
                    new CustomActionButton({
                        text : '隐藏告警', target: vm.$refs.map, type : 'default', icon : 'el-icon-chat-square', click: (e, customButton) => {
                            vm.disabled_alarm = !vm.disabled_alarm;
                            customButton.element.innerText = vm.disabled_alarm ? '隐藏告警' : '显示告警';
                            let icon = document.createElement("i");
                            icon.className = vm.disabled_alarm ? 'el-icon-chat-square' : 'el-icon-chat-dot-square';
                            customButton.element.insertBefore(icon, customButton.element.childNodes[0]);
                        }
                    })
                ]
            })
        ]);

        map = new Map({
            controls,
            loadTilesWhileAnimating : true,
            loadTilesWhileInteracting : true,
            view: new View({
                center: transform(vm.getMapCenter, "EPSG:4326", "EPSG:3857"),
                // extent : getProjection("EPSG:3857").getExtent(),
                extent : vm.getMapExtent && transformExtent(vm.getMapExtent, "EPSG:4326", "EPSG:3857") || [-Infinity, -Infinity, Infinity, Infinity],
                maxZoom: vm.getMapMaxZoom,
                minZoom: vm.getMapMinZoom,
                zoom: vm.getMapZoom,
                projection: "EPSG:3857",
                rotation: 0
            }),
            layers: [
                new TileLayer({
                    id: 'smart-box',
                    // source: new XYZ({
                    //     url: vm.getMapUrl,
                    //     wrapX: false,
                    //     tileSize: [256, 256],
                    //     projection: "EPSG:3857"
                    // })
                    source : new TileImage({
                        projection: "EPSG:3857",
                        tileGrid: new TileGrid({
                            origin: [0, 0],
                            resolutions: (new Array(19).fill(' ').map((it, i) => Math.pow(2, 18 - i)))
                        }),
                        tileUrlFunction: function(coord, pixelRatio, proj) {
                            let z = coord[0];
                            let x = coord[1];
                            let y = coord[2];
                            if (x < 0) {
                                x = -x;
                            }

                            if(y < 0) {
                                y = -y;
                            }
                            return vm.getMapUrl.replace(/(\{z\})/g, z).replace(/(\{x\})/g, x).replace(/(\{y\})/g, y);
                        }
                    })
                }),
                new VectorLayer({
                    id: 'device-vector-layer',
                    style: (feature) => {
                        if (feature.get("style")) {
                            return feature.get("style");
                        }
                        var size = feature.get('features').length;
                        if (size === 1) {
                            let data = feature.get("features")[0].get("data");
                            let suffix = vm.exceptionDeviceList.some(it => it == data.id) || !data.isOnline ? '-red' : '';
                            let iconSrc = require(`~/assets/Images/device-vn${suffix}.png`);
                            if (data.type === 'WTOS-VE') {
                                iconSrc = require(`~/assets/Images/device-ve${suffix}.png`);
                            } else if(data.type === 'WTOS-VN-TME200') {
                                iconSrc = require(`~/assets/Images/device-semaphore${suffix}.png`);
                            } else if (data.type === 'WTOS-VN-PE') {
                                iconSrc = require(`~/assets/Images/device-pe${suffix}.png`);
                            }
                            return feature.get("features")[0].get("style") || new Style({
                                image: new Icon({
                                    anchor: [0.5, 0.5],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'fraction',
                                    scale: 0.5,
                                    src: iconSrc,
                                    size: [58, 58],
                                    imgSize: [58, 58]
                                })
                            });
                        }

                        if(size < 10) {
                            return  new Style({
                                image: new Icon({
                                    anchor: [0.5, 0.5],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'fraction',
                                    src: require('~/assets/Images/m0.png'),
                                    size: [53, 53],
                                    imgSize: [53, 53]
                                }),
                                text: new Text({
                                    text: size.toString(),
                                    textAlign: "center",
                                    placement: "point",
                                    fill: new Fill({
                                        color: '#fff'
                                    })
                                })
                            })
                        }

                        if(size < 20) {
                            return new Style({
                                image: new Icon({
                                    anchor: [0.5, 0.5],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'fraction',
                                    src: require('~/assets/Images/m2.png'),
                                    size: [66, 66],
                                    imgSize: [66, 66]
                                }),
                                text: new Text({
                                    text: size.toString(),
                                    textAlign: "center",
                                    placement: "point",
                                    fill: new Fill({
                                        color: '#fff'
                                    })
                                })
                            })
                        }

                        if(size < 50) {
                            return new Style({
                                image: new Icon({
                                    anchor: [0.5, 0.5],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'fraction',
                                    src: require('~/assets/Images/m3.png'),
                                    size: [78, 78],
                                    imgSize: [78, 78]
                                }),
                                text: new Text({
                                    text: size.toString(),
                                    textAlign: "center",
                                    placement: "point",
                                    fill: new Fill({
                                        color: '#fff'
                                    })
                                })
                            })
                        }

                        return new Style({
                            image: new Icon({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: require('~/assets/Images/m4.png'),
                                size: [90, 90],
                                imgSize: [90, 90]
                            }),
                            text: new Text({
                                text: size.toString(),
                                textAlign: "center",
                                placement: "point",
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        })
                    },
                    source: new Cluster({
                        distance: 70,
                        source: new VectorSource({
                            wrapX: false,
                            features: []
                        })
                    })
                }),
                new VectorLayer({
                    id: 'draw-vector-layer',
                    style : (feature) => {
                        if(feature.getGeometry() instanceof Point) {
                            return new Style({
                                image : new Icon({
                                    anchor: [16, 0],
                                    anchorOrigin : 'bottom-left',
                                    anchorXUnits: 'pixels',
                                    anchorYUnits: 'pixels',
                                    src: require('~/assets/Images/location.png'),
                                    size: [32, 32],
                                    imgSize: [32, 32]
                                })
                            })
                        }
                        return null;
                    },
                    source: new VectorSource({
                        wrapX: false
                    })
                })
            ],
            target: vm.$refs.map
        });
        let interations = map.getInteractions();
        interations.forEach((item) => {
            if(item instanceof MouseWheelZoom) {
                item.condition_ = (evt) => {
                    if(evt.type === "wheel" && evt.originalEvent.target.tagName === "CANVAS") {
                        evt.preventDefault();
                        return true;
                    }
                    return false;
                }
            }
        })
        map.addInteraction(new DragRotateAndZoom({condition: altKeyOnly}));
        map.on('pointermove', function (evt) {
            vm.hasMoveFeature = false;
            if(map.hasFeatureAtPixel(evt.pixel)) {
                vm.hasMoveFeature = true;
            }
        });
        map.on("singleclick", vm.handlerMapFeatureActive);

        let viewChange = (evt) => { 
            vm.hasDialogShow = false;
            let view = evt.target;
            let zoom = view.getZoom();
            if(zoom % 1 === 0) {
                //初始化所有必须条件参数
                let center = view.getCenter();
                let minZoom = vm.getMapMinZoom;
                let maxZoom = vm.getMapMaxZoom;
                let diffZoom = zoom - minZoom;
                evt.newValue = view.getResolutionForZoom(zoom);
                let [X, Y] = transform(vm.getMapCenter, "EPSG:4326", "EPSG:3857");
                // let [minX, minY, maxX, maxY] = transformExtent(me.getMapExtent, "EPSG:4326", "EPSG:3857");
                let [minX, minY, maxX, maxY] = [X, Y, X, Y];
                let [v_minX, v_minY, v_maxX, v_maxY] = vm.getViewExtent && transformExtent(vm.getViewExtent, "EPSG:4326", "EPSG:3857") || [ -Infinity, -Infinity, Infinity, Infinity];
                let sideW = diffZoom ? _.sum(new Array(diffZoom).fill(v_maxX - v_minX).map((it, n) => {
                    for(let i = 0; i <= n; i++, it /= 2)
                        continue;
                    return it;
                })) : maxX - minX;

                let sideH = diffZoom ? _.sum(new Array(diffZoom).fill(v_maxY - v_minY).map((it, n) => {
                    for(let i = 0; i <= n; i++, it /= 2)
                        continue;
                    return it;
                })) : maxY - minY;

                let [offsetMinX, offsetMinY, offsetMaxX, offsetMaxY] = [X - sideW / 2, Y - sideH / 2, X + sideW / 2, Y + sideH / 2];
                if(evt.newValue > evt.oldValue && !containsCoordinate([offsetMinX, offsetMinY, offsetMaxX, offsetMaxY], center)) {
                    //中心偏移
                    if(Math.abs(center[0] - offsetMinX) > Math.abs(center[0] - offsetMaxX) && center[0] > offsetMaxX) {
                        center[0] = offsetMaxX;
                    } else if (Math.abs(center[0] - offsetMinX) < Math.abs(center[0] - offsetMaxX) && center[0] < offsetMinX) {
                        center[0] = offsetMinX;
                    }

                    if(Math.abs(center[1] - offsetMinY) > Math.abs(center[1] - offsetMaxY) && center[1] > offsetMaxY) {
                        center[1] = offsetMaxY;
                    } else if (Math.abs(center[1] - offsetMinY) < Math.abs(center[1] - offsetMaxY) && center[1] < offsetMinY) {
                        center[1] = offsetMinY;
                    }
                }
                
                if(zoom === vm.getMapMinZoom) {
                    center = transform(vm.getMapCenter, "EPSG:4326", "EPSG:3857");
                }
                view.un("change:resolution", viewChange);

                let newView = new View({
                    center,
                    extent : [X - sideW / 2, Y - sideH / 2, X + sideW / 2, Y + sideH / 2],
                    maxZoom,
                    minZoom,
                    zoom,
                    projection: "EPSG:3857",
                    rotation: 0
                });
                newView.on("change:resolution", viewChange);
                map.setView(newView);
                // newView.calculateExtent(map.getSize());

                // let layers = map.getLayers();
                // let drawLayer = null;
                // layers.forEach((layer) => {
                //     if (layer.values_.id === 'draw-vector-layer') {
                //         drawLayer = layer;
                //     }
                // });
                // let source = drawLayer.getSource();
                // let feature = source.getFeatureById("linear-00000001");
                // if(feature) {
                //     source.removeFeature(feature);
                // }
                // feature = new Feature();
                // feature.setId("linear-00000001");
                // let polygon = new Polygon([[[X - sideW / 2, Y - sideH / 2], [X + sideW / 2, Y - sideH / 2], [X + sideW / 2, Y + sideH / 2], [X - sideW / 2, Y + sideH / 2]]], "XY");
                // feature.setGeometry(polygon);
                // feature.setStyle(new Style({
                //     fill : new Fill({
                //         color : 'rgba(255, 0, 0, .5)'
                //     }),
                //     stroke : new Stroke({
                //         color : 'red',
                //         width : 5
                //     })
                // }));
                // source.addFeature(feature);
                // source.refresh();
            }
        };
        map.getView().on("change:resolution", viewChange);
    }

    const notify_position_move = function(x, y) {
        let me = this;
        if(x && y) {
            me.handlerMapMoveTo([x, y] , void 0, 18)
            return;
        }
        me.$message.error("设备没有录入经纬度坐标，无法定位。");
    }

    const notify_handler_action = function(it) {
        let me = this;
        me.alarmDialogModel.display = true;
        me.alarmDialogModel.lastId = it.lastId;
        me.$refs.alarmFrom.clearValidate();
    }

    return {
        name: 'Map',
        data() {
            let me = this;
            return {
                deviceName : '',
                search_device_id : '',
                disabled_alarm : true,
                search_device_loading : false,
                hasOpenTreeMenuContext: false,
                hasOpenMapMenuContext : false,
                treeNodeItem: null,
                treeProps: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                deviceList : [],
                treeData : [],
                userList : [],
                checkNodeKeys : [],
                exceptionDeviceList : [],
                hasFold: false,
                hasAreaDialogShow: false,
                hasDisabledAreaSubmit : false,
                hasDeviceDialogShow: false,
                hasDisabledDeviceSumbit : false,
                hasMoveFeature : false,
                hasAllowTreeMenuShow: true,
                devicedTypeList: [],
                interactionStateList: [
                    {label: '否', value: 0 },
                    {label: '是', value: 1 }
                ],
                dialogData: {},
                areaRules: {
                    areaParentName: [
                        {required: true, message: '所属区域名称不能为空！', trigger: 'blur'}
                    ],
                    areaName: [
                        { required: true, message: '区域名称不能为空！', trigger: 'blur' },
                        { min: 1, max: 10, message: '区域名称最大只能输入10个字符！', trigger: 'blur' }
                    ],
                    areaCoordinates: [
                        {type: 'array', required: true, message: "区域坐标点不能为空！", trigger: 'change'}
                    ]
                },
                alarmRules: {
                    dealMan: [
                        {required: true, message: '请选择处理人', trigger: 'change'},
                    ],
                    radio: [
                        {required: true, message: '请选择一个处理状态', trigger: 'change'}
                    ]
                },
                alarmDialogModel : {
                    display : false,
                    lastId : '',
                    dealMan : '',
                    radio : 0,
                    remark : ''
                },
                areaDialogModel: {
                    id: '',
                    guid : '',
                    areaParentName: '',
                    areaName: '',
                    areaCoordinates: [],
                    areaType: '',
                    state: ''
                },
                deviceModel: {
                    guid : '',
                    id: '',
                    name: '',
                    type: '',
                    parentName: '',
                    parentType: '',
                    parentId: '',
                    deviceIP: '',
                    coordinates: [],
                    otherDeviceName: '',
                    companyName: '',
                    listenState: '',
                    port: '',
                    energyNo: '',
                    otherDeviceIP: '',
                    mac : '',
                    interactionState: '',
                    checkedSpacing: 0,
                    reStartTotal: 0,
                    listenTotal : 0,
                    percent : 0,
                    state: '',
                    power : '',
                    openPlanCheck : '',
                    closePlanCheck : '',
                    isOnline : false
                },
                mapContentMenuOffset : {
                    x : 0,
                    y : 0
                },
                wrong: false,
                hasDialogShow: false
            }
        },
        computed: {
            getDeviceDialogSize() {
                let me = this;
                if (['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(me.deviceModel.type) === -1) {
                    return {width: 820, height: 520};
                }
                return { width: 520, height: 420 };
            },
            getDeviceInfoForVN() {
                let me = this;
                let result = []
                let list = me.dialogData.result.filter(it => it !== null && it.perform_type && [2, 3].indexOf(it.data_type) > -1 );
                for(let el of list) {
                    if(Object.prototype.toString.call(el.perform_value) === '[object String]' && [2, 3].indexOf(el.data_type) > -1) {
                        let item = { id : el.id, perform_name : el.perform_name, perform_type : el.perform_type, data_type : el.data_type, perform_value : el.perform_value, perform_description : el.perform_description };
                        item.valueOf = el.valueOf();
                        item.state = true;
                        item.index = -1;
                        result.push(item);
                    } else if(el.perform_value instanceof Array && [2, 3].indexOf(el.data_type) > -1) {
                        for(let childrenEl of el.valueOf()) {
                            let thunderCount = 1;
                            let item = { id : el.id, perform_name : el.perform_name, perform_type : el.perform_type, data_type : el.data_type, perform_value : el.perform_value, perform_description : el.perform_description };
                            if(childrenEl[0] === 'THUN_STATUS') {
                                item.perform_description = `防雷器${thunderCount}`;
                                thunderCount++;
                            } else if(childrenEl[0] === 'THUN_COUNT') {
                                item.perform_description = '雷击次数';
                            }
                            item.index = childrenEl[0];
                            item.valueOf = childrenEl[1];
                            item.state = childrenEl[2];
                            result.push(item);
                        }
                    }
                }
                return result;
            },
            getDeviceTemperature() {
                let me = this;
                if(me.dialogData.result && me.dialogData.result.length) {
                    let capabilitys = me.dialogData.result.filter(it => it instanceof DEV_TEMP);
                    if(capabilitys[0]) {
                        capabilitys[0].index = 0;
                        capabilitys[0].valueOf = capabilitys[0].valueOf();
                        capabilitys[0].state = true;
                        return capabilitys[0];
                    }
                }
                return null;
            },
            getDevicePowerStatus() {
                let me = this;
                if(me.dialogData.result && me.dialogData.result.length) {
                    let capabilitys = me.dialogData.result.filter(it => it instanceof DEV_POWER_STATUS);
                    if(capabilitys[0]) {
                        capabilitys[0].index = 0;
                        capabilitys[0].valueOf = capabilitys[0].valueOf();
                        capabilitys[0].state = false;
                        return capabilitys[0];
                    }
                }
                return null;
            },
            getDeviceStatus() {
                let me = this;
                if(me.dialogData.result && me.dialogData.result.length) {
                    let capabilitys = me.dialogData.result.filter(it => ['PORT_LINK_STATUS', 'PORT_LINK_SPEED', 'PORT_LINK_TYPE', 'PORT_FLUX'].indexOf(it.perform_name) > -1);
                    let result = {};
                    for(let [n, item] of capabilitys.entries() ) {
                        result.headers = { ...result.headers, [item.perform_name] : item.perform_description };
                        let valueOf = item.valueOf();
                        result.data = { ...result.data, [item.perform_name] : valueOf }
                    }
                    result.total = result.data && _.size(result.data['PORT_LINK_STATUS']) || 0;
                    return result;
                }
                return null;
            },
            hasOutDevice() {
                let me = this;
                return ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(me.deviceModel.type) === -1;
            },
            ...mapGetters({
                userName : 'User/getUsername',
                role : 'User/getRole',
                getMapZoom : 'Sys/getMapZoom',
                getMapMinZoom : 'Sys/getMapMinZoom',
                getMapMaxZoom : 'Sys/getMapMaxZoom',
                getMapExtent : 'Sys/getMapExtent',
                getViewExtent : 'Sys/getViewExtent',
                getMapCenter : 'Sys/getMapCenter',
                getMapUrl : 'Sys/getMapUrl'
            })
        },
        watch : {
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
                        me.$refs.tree && me.$refs.tree.filter(me.deviceName);
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            async initMap() {
                let me = this;
                let res = await me.$http.get(
                    RESTFUL.injective.Api.Sys.QueryAll,
                    { emulateJSON: false, emulateHTTP: false}
                ).catch(() => {
                    return { status : "error", body : { success : false } }
                });
                
                if(res.body.success) {
                    let { SYSTEM_VERSION, SYSTEM_NAME, GATEWAY_WAY, MAP_CENTER, MIN_ZOOM, MAX_ZOOM, ZOOM, MAP_EXTENT, VIEW_EXTENT, CHECKED_SHOW} = res.body.model;
                    await me.SaveConfigParams({ GATEWAY_WAY, SYSTEM_NAME, SYSTEM_VERSION, MAP_CENTER, MIN_ZOOM, MAX_ZOOM, ZOOM, MAP_EXTENT, VIEW_EXTENT, CHECKED_SHOW });
                }
                mapRender(me);
            },
            refreshMapView() {
                let me = this; 
                if(map) {
                    let view = map.getView();
                    view.animate({ zoom: me.getMapZoom });
                }
            },
            async queryAllPrimaryDevice() {
                let me = this;
                let res = await me.$http.get(RESTFUL.injective.Api.Device.getAllDevice, {}, { emulateJSON : false, emulateHTTP : true} );
                await me.queryAlarmIdListFromNotDeal();
                if(res.status === 200 && res.body.success) {
                    let result = res.body.model.filter(it => it.x && it.y);
                    if(map && _.size(result)) {
                        let layers = map.getLayers();
                        let deviceLayer = null;
                        layers.forEach((layer) => {
                            if (layer.values_.id === 'device-vector-layer') {
                                deviceLayer = layer;
                            }
                        });
                        let source = deviceLayer.getSource().getSource();
                        me.checkNodeKeys = [];
                        source.clear();
                        let mapFeatures = result.map(item => {
                            let { areaId, guid, devIp, devMac, devName, devSeries, devVersion, id, isOnline, x, y} = item;
                            let iconFeature = new Feature();
                            let suffix = me.exceptionDeviceList.some(it => it == id) || !isOnline ? '-red' : '';
                            let iconSrc = require(`~/assets/Images/device-vn${suffix}.png`);
                            if (devSeries === 'WTOS-VE') {
                                iconSrc = require(`~/assets/Images/device-ve${suffix}.png`);
                            } else if(devSeries === 'WTOS-VN-TME200') {
                                iconSrc = require(`~/assets/Images/device-semaphore${suffix}.png`);
                            } else if (devSeries === 'WTOS-VN-PE') {
                                iconSrc = require(`~/assets/Images/device-pe${suffix}.png`);
                            }
                            iconFeature.set('style', new Style({
                                    image: new Icon({
                                        anchor: [0.5, 0.5],
                                        anchorXUnits: 'fraction',
                                        anchorYUnits: 'fraction',
                                        scale: 0.5,
                                        src: iconSrc,
                                        size: [58, 58],
                                        imgSize: [58, 58]
                                    })
                                })
                            );
                            iconFeature.setId(guid);
                            iconFeature.set('type', devSeries);
                            iconFeature.set('coordinates', [x, y]);
                            iconFeature.setGeometry(new Point(transform([Number(x), Number(y)], "EPSG:4326", "EPSG:3857")));
                            iconFeature.set('data', { guid, id, name : devName, type : devSeries, deviceIP : devIp, coordinates : [x, y], mac : devMac, isOnline, otherDeviceName: '', companyName: '', listenState: '', port : '', energyNo: '', otherDeviceIP : '', interactionState : '', power : '', openPlanCheck : '', closePlanCheck : '' });
                            return iconFeature;
                        });
                        source.addFeatures(mapFeatures);
                        let areaCheckbox = new Set(res.body.model.map(it => it.areaId));
                        let deviceCheckbox = new Set(res.body.model.map(it => it.guid));
                        me.checkNodeKeys = [...areaCheckbox, ...deviceCheckbox];
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
            async loadDeviceType() {
                let me = this;
                let res = await me.$http.get(RESTFUL.injective.Api.DeviceType.QueryAll, null, { emulateJSON: false, emulateHTTP: false });
                me.devicedTypeList = [];
                if(res.status === 200 && res.body.success) {
                    me.devicedTypeList = res.body.model.map(it => ({ label :it.typeName, value : it.typeCode }));
                }
            },
            async handlerRemoteMethod(query) {
                const me = this;
                const result = await me.$http.post(
                    RESTFUL.injective.Api.Device.PageQuery, { 
                        "pageIndex":1, 
                        "pageSize":9999999, 
                        "model": { 
                            "deviceType":"",
                            "deviceName": query,
                            "isOnline":"",
                            "areaCode":null,
                            "deviceId":null 
                        } 
                    } ,
                    { emulateHTTP: true, emulateJSON: false  }
                );
                me.deviceList = [];
                if(result.status === 200 && result.ok) {
                    me.deviceList = result.body.model;
                }
            },
            async handlerDevQueryPosition() {
                let me = this;
                if(me.search_device_id) {
                    let result = me.deviceList.filter(it => it.id === me.search_device_id);
                    if(result && result.length && result[0].x && result[0].y) {
                        me.handlerMapMoveTo([result[0].x, result[0].y] , void 0, 18);
                        return;
                    }
                    me.$message.error("设备没有录入经纬度坐标，无法定位。");
                }
            },
            handlerFilterNode(value, data, node) {
                return value === '' || data.type === 'area' || data.hasFilter || data.name.indexof(value) > -1;
            },
            handlerTreeAllowDrop(draggingNode, dropNode, type) {
                if(['1', '2', '3', '4', '5'].indexOf(draggingNode.data.type) > -1) {
                    return false;
                }

                if (type === "inner") {
                    if (['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(draggingNode.data.type) > -1 && dropNode.data.type === "area") {
                        return true;
                    }

                    if (draggingNode.data.type === "area" && dropNode.data.type === "area") {
                        return true;
                    }
                }
                if (type === "prev" || type === "next") {
                    if (['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(draggingNode.data.type) > -1 && ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(dropNode.data.type) > -1) {
                        return false;
                    }

                    if (draggingNode.data.type === "area" && dropNode.data.type === "area") {
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
                        me.$message.success("已保存");
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            handlerTreeNodeDbClick(node) {
                let me = this;
                me.hasDialogShow = false;
                let checkExtent = (coordinate) => {
                    if(!coordinate) {
                        me.$message.error("非法定位!");
                        return false;
                    }

                    if(isNaN(coordinate[0]) || isNaN(coordinate[1]) || !coordinate[0] || !coordinate[1]) {
                        me.$message.error("非法定位!");
                        return false;
                    }

                    let [minX, minY, maxX, maxY] = getProjection("EPSG:4326").getExtent();
                    let x = Number(coordinate[0]);
                    let y = Number(coordinate[1]);
                    if( minX > x || maxX < x || minY > y || maxY < y) {
                        me.$message.error("定位不在区域内!");
                        return false;
                    }
                    return true;
                }

                if (map && checkExtent(node.data.coordinates) && (node.data.type === 'area' || ['WTOS-VN-TME200', 'WTOS-VN', 'WTOS-VN-PE'].indexOf(node.data.type) > -1 || node.data.type === 'WTOS-VE' && node.parent.data.type === 'area')) {
                    let position = node.data.coordinates;
                    let zoom = map.getView().getZoom();
                    if (zoom <= 15) {
                        zoom = 15;
                    }
                    
                    if(['WTOS-VN-TME200', 'WTOS-VN', 'WTOS-VN-PE'].indexOf(node.data.type) > -1 || node.data.type === 'WTOS-VE' && node.parent.data.type === 'area') {
                        me.$refs.tree.setChecked(node.data.guid, true);
                        return me.handlerMapMoveTo(position, (coordinates) => {
                            me.dialogData = node.data;
                            me.$set(me.dialogData, "result", []);
                            me.$http.post(
                                RESTFUL.injective.Api.Box.queryDeviceInfo,
                                { deviceId : me.dialogData.id },
                                { emulateJSON : true, emulateHTTP : false }
                            ).then(res => {
                                if(res.status === 200 || res.body.success) {
                                    let list = res.body.model.queryDevPerformMap || [];
                                    let hasException = res.body.model.queryAlarmInfoMap && res.body.model.queryAlarmInfoMap.some(it => it.isDeal < 3) || false;
                                    if(!hasException && me.exceptionDeviceList.indexOf(me.dialogData.id.toString()) > -1) {
                                        let n = me.exceptionDeviceList.indexOf(me.dialogData.id.toString());
                                        me.exceptionDeviceList.splice(n, 1);
                                    } else if(hasException && me.exceptionDeviceList.indexOf(me.dialogData.id.toString()) === -1) {
                                        me.exceptionDeviceList.append(me.dialogData.id);
                                    }
                                    me.dialogData.result = list.map(it => {
                                        let capability = { 
                                            id : it.ID, 
                                            perform_name : it.PERFORM_NAME, 
                                            perform_type : it.PERFORM_TYPE, 
                                            data_type : it.DATA_TYPE, 
                                            perform_value : it.PERFORM_VALUE, 
                                            perform_description  : it.PERFORM_DESCRIPTION
                                        }
                                        return CapabilityFactory.getInstance().createCapability(it.PERFORM_NAME, capability);
                                    });
                                    let overlay = new Overlay({
                                        element: me.$refs.device_dialog.$el,
                                        offset: [0, -35],
                                        positioning: 'center-center',
                                        stopEvent: false
                                    });
                                    overlay.setPosition(coordinates);
                                    me.hasDialogShow = true;
                                    map.addOverlay(overlay);
                                }
                            })
                        }, zoom);
                    }
                    me.handlerMapMoveTo(position, void 0, zoom);
                }
            },
            handlerTreeCheckChange(data, isCheck, childrenNode) {
                let me = this;
                if (map) {
                    let layers = map.getLayers();
                    let deviceLayer = null;
                    layers.forEach((layer) => {
                        if (layer.values_.id === 'device-vector-layer') {
                            deviceLayer = layer;
                        }
                    });
                    let source = deviceLayer.getSource().getSource();
                    if (data.type === "area") {
                        let childrenNode = me.$refs.tree.getNode(data.guid).childNodes;
                        if (isCheck && childrenNode.length) {
                            for (let i = 0; i < childrenNode.length; i++) {
                                if (['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(childrenNode[i].data.type) > -1) {
                                    me.$refs.tree.setChecked(childrenNode[i].data.guid, true);
                                }
                            }
                            (!me.checkNodeKeys.includes(data.guid)) && me.checkNodeKeys.push(data.guid);
                            source.refresh();
                            map.render();
                        } else if (!isCheck && childrenNode.length) {
                            for (let i = 0; i < childrenNode.length; i++) {
                                me.$refs.tree.setChecked(childrenNode[i].data.guid, false);
                            }
                            let n = me.checkNodeKeys.indexOf(data.guid);
                            me.checkNodeKeys.splice(n, 1);
                        }
                    }

                    if (['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(data.type) > -1) {
                        if (!isCheck) {
                            let feature = source.getFeatureById(data.guid);
                            if (feature)
                                source.removeFeature(feature);
                            
                            let n = me.checkNodeKeys.indexOf(data.guid);
                            me.checkNodeKeys.splice(n, 1);
                        }

                        if (isCheck) {
                            let iconFeature = new Feature(new Point(transform([Number(data.coordinates[0]), Number(data.coordinates[1])], "EPSG:4326", "EPSG:3857")));
                            let suffix = me.exceptionDeviceList.some(it => it == data.id) || !data.isOnline ? '-red' : '';
                            let iconSrc = require(`~/assets/Images/device-vn${suffix}.png`);
                            if (data.type === 'WTOS-VE') {
                                iconSrc = require(`~/assets/Images/device-ve${suffix}.png`);
                            } else if(data.type === 'WTOS-VN-TME200') {
                                iconSrc = require(`~/assets/Images/device-semaphore${suffix}.png`);
                            } else if (data.type === 'WTOS-VN-PE') {
                                iconSrc = require(`~/assets/Images/device-pe${suffix}.png`);
                            }
                            iconFeature.set('style', new Style({
                                    image: new Icon({
                                        anchor: [0.5, 0.5],
                                        anchorXUnits: 'fraction',
                                        anchorYUnits: 'fraction',
                                        scale: 0.5,
                                        src: iconSrc,
                                        size: [58, 58],
                                        imgSize: [58, 58]
                                    })
                                })
                            );
                            iconFeature.setId(data.guid);
                            iconFeature.set('type', data.type);
                            iconFeature.set('coordinates', data.coordinates);
                            iconFeature.set('data', data);
                            source.addFeature(iconFeature);
                            (!me.checkNodeKeys.includes(data.guid)) && me.checkNodeKeys.push(data.guid);
                        }
                    }
                }
            },
            async handlerMapFeatureClick(evt, feature) {
                let me = this;
                if (map.hasFeatureAtPixel(evt.pixel)) {
                    me.hasDialogShow = false;
                    let features = feature.get("features");
                    if (features.length === 1 && ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(features[0].get("type")) > -1) {
                        let zoom = map.getView().getZoom();
                        if (zoom <= 15) {
                            zoom = 15;
                        }
                        me.dialogData = features[0].get('data');
                        me.$set(me.dialogData, "result", []);
                        let res = await me.$http.post(
                            RESTFUL.injective.Api.Box.queryDeviceInfo,
                            { deviceId : me.dialogData.id },
                            { emulateJSON : true, emulateHTTP : false }
                        );
                        me.handlerMapMoveTo(features[0].getGeometry().getCoordinates(), () => {
                            if(res.status === 200 || res.body.success) {
                                let result = res.body.model.queryDevPerformMap || [];
                                me.dialogData.result = result.map(it => {
                                    let capability = { 
                                        id : it.ID, 
                                        perform_name : it.PERFORM_NAME, 
                                        perform_type : it.PERFORM_TYPE, 
                                        data_type : it.DATA_TYPE, 
                                        perform_value : it.PERFORM_VALUE, 
                                        perform_description  : it.PERFORM_DESCRIPTION
                                    }
                                    return CapabilityFactory.getInstance().createCapability(it.PERFORM_NAME, capability);
                                });
                                // for(let el of list) {
                                //     if(Object.prototype.toString.call(el.perform_value) === '[object String]' && [2, 3].indexOf(el.data_type) > -1) {
                                //         let item = { id : el.id, perform_name : el.perform_name, perform_type : el.perform_type, data_type : el.data_type, perform_value : el.perform_value, perform_description : el.perform_description };
                                //         item.valueOf = el.valueOf();
                                //         item.state = true;
                                //         item.index = -1;
                                //         me.dialogData.result.push(item);
                                //     } else if(el.perform_value instanceof Array && [2, 3].indexOf(el.data_type) > -1) {
                                //         let thunderCount = 1;
                                //         for(let childrenEl of el.valueOf()) {
                                //             let item = { id : el.id, perform_name : el.perform_name, perform_type : el.perform_type, data_type : el.data_type, perform_value : el.perform_value, perform_description : el.perform_description };
                                //             if(childrenEl[0] === 'THUN_STATUS') {
                                //                 item.perform_description = `防雷器${thunderCount}`;
                                //                 thunderCount++;
                                //             } else if(childrenEl[0] === 'THUN_COUNT') {
                                //                 item.perform_description = '雷击次数';
                                //             }
                                //             item.index = childrenEl[0];
                                //             item.valueOf = childrenEl[1];
                                //             item.state = childrenEl[2];
                                //             me.dialogData.result.push(item);
                                //         }
                                //     }
                                // }
                                let overlay = new Overlay({
                                    element: me.$refs.device_dialog.$el,
                                    offset: [0, -35],
                                    positioning: 'center-center',
                                    stopEvent: false
                                });
                                overlay.setPosition(features[0].getGeometry().getCoordinates());
                                me.hasDialogShow = true;
                                map.addOverlay(overlay);
                            }
                        }, zoom, false);
                        
                    }
                }
            },
            handlerMapFeatureActive(evt) {
                let me = this;
                // me.hasDialogShow = false;
                if (map.hasFeatureAtPixel(evt.pixel)) {
                    let features = map.getFeaturesAtPixel(evt.pixel);
                    let iconStyle = null;
                    if (features[0].get('features').length === 1) {
                        let data = features[0].get('features')[0].get("data");
                        let suffix = me.exceptionDeviceList.some(it => it == data.id) || !data.isOnline ? '-red' : '';
                        let iconSrc = require(`~/assets/Images/device-vn${suffix}.png`);
                        if (data.type === 'WTOS-VE') {
                            iconSrc = require(`~/assets/Images/device-ve${suffix}.png`);
                        } else if(data.type === 'WTOS-VN-TME200') {
                            iconSrc = require(`~/assets/Images/device-semaphore${suffix}.png`);
                        } else if (data.type === 'WTOS-VN-PE') {
                            iconSrc = require(`~/assets/Images/device-pe${suffix}.png`);
                        }
                        iconStyle = new Style({
                            image: new Icon({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: iconSrc,
                                scale: 0.5,
                                size: [58, 58],
                                imgSize: [58, 58]
                            })
                        })
                        features[0].get('features')[0].set('style', iconStyle);
                        me.handlerMapFeatureClick(evt, features[0]);
                        return void 0;
                    }

                    var size = features[0].get('features').length;

                    if(features[0].get("features").length < 10) {
                        iconStyle = new Style({
                            image: new Icon({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: require('~/assets/Images/m0.png'),
                                size: [53, 53],
                                imgSize: [53, 53]
                            }),
                            text: new Text({
                                text: size.toString(),
                                textAlign: "center",
                                placement: "point",
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        })
                        features[0].set("style", iconStyle);
                        return void 0;
                    }

                    if(features[0].get("features").length < 20) {
                        iconStyle = new Style({
                            image: new Icon({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: require('~/assets/Images/m2.png'),
                                size: [66, 66],
                                imgSize: [66, 66]
                            }),
                            text: new Text({
                                text: size.toString(),
                                textAlign: "center",
                                placement: "point",
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        })
                        features[0].set("style", iconStyle);
                        return void 0;
                    }

                    if(features[0].get("features").length < 50) {
                        iconStyle = new Style({
                            image: new Icon({
                                anchor: [0.5, 0.5],
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'fraction',
                                src: require('~/assets/Images/m3.png'),
                                size: [78, 78],
                                imgSize: [78, 78]
                            }),
                            text: new Text({
                                text: size.toString(),
                                textAlign: "center",
                                placement: "point",
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        })
                        features[0].set("style", iconStyle);
                        return void 0;
                    }

                    iconStyle = new Style({
                        image: new Icon({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: require('~/assets/Images/m4.png'),
                            size: [90, 90],
                            imgSize: [90, 90]
                        }),
                        text: new Text({
                            text: size.toString(),
                            textAlign: "center",
                            placement: "point",
                            fill: new Fill({
                                color: '#fff'
                            })
                        })
                    })
                    features[0].set("style", iconStyle);
                }
            },
            handlerOverlayClosed() {
                let me = this;
                if (map) {
                    let layers = map.getLayers();
                    let drawLayer = null;
                    layers.forEach((layer) => {
                        if (layer.values_.id === 'device-vector-layer') {
                            drawLayer = layer;
                        }
                    });
                    let source = drawLayer.getSource().getSource();
                    let feature = source.getFeatureById(me.dialogData.guid);
                    let data = feature.get("data");
                    let suffix = me.exceptionDeviceList.some(it => it == data.id) || !data.isOnline ? '-red' : '';
                    let iconSrc = require(`~/assets/Images/device-vn${suffix}.png`);
                    if (data.type === 'WTOS-VE') {
                        iconSrc = require(`~/assets/Images/device-ve${suffix}.png`);
                    } else if(data.type === 'WTOS-VN-TME200') {
                        iconSrc = require(`~/assets/Images/device-semaphore${suffix}.png`);
                    } else if (data.type === 'WTOS-VN-PE') {
                        iconSrc = require(`~/assets/Images/device-pe${suffix}.png`);
                    }
                    feature.set("style", new Style({
                        image: new Icon({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            scale: 0.5,
                            src: iconSrc,
                            size: [58, 58],
                            imgSize: [58, 58]
                        })
                    }));
                    me.dialogData = {};
                }
            },
            handlerMapMoveTo(location, done, zoom = false, hasTransform = true) {
                if (map) {
                    let view = map.getView();
                    let currentZoom = view.getZoom();
                    let parts = 2;
                    let called = false;
                    // let callback = (complete) => {
                    //     --parts;
                    //     if (called)
                    //         return;
                    //     if (parts === 0 || !complete) {
                    //         called = true;
                    //         done(complete, location)
                    //         done = null;
                    //     }
                    // }
                    let transformLocation = hasTransform ? transform([Number(location[0]), Number(location[1])], "EPSG:4326", "EPSG:3857") : [Number(location[0]), Number(location[1])];
                    // view.animate({center: transformLocation, zoom : (currentZoom - 1), duration: 1000}, (complete) => {
                    //     if (zoom && complete) {
                    //         view.animate({ zoom, duration: 1000}, function () {
                    //             if(typeof done === 'function') {
                    //                 done(transformLocation);
                    //                 done = null;
                    //             }
                    //         })
                    //     }
                    // });
                    view.animate({ zoom : 18, center: transformLocation, duration: 1000}, function () {
                        if(typeof done === 'function') {
                            done(transformLocation);
                            done = null;
                        }
                    })
                    // view.animate({zoom : (currentZoom - 1), duration: 1000}, callback);
                }
            },
            handlerTreeMenuContext(e, data, node, vnode) {
                let me = this;
                me.hasDialogShow = false;
                if (me.hasAllowTreeMenuShow) {
                    me.$refs.map_tree_popover.handleBlur();
                    setTimeout(() => {
                        me.$refs.map_tree_popover.referenceElm = null;
                        me.treeNodeItem = {
                            data,
                            vnode
                        };
                        me.hasOpenTreeMenuContext = true;
                    }, 300);
                }
            },
            handlerOpenAreaEdit(data) {
                let me = this;
                if (data) {
                    me.hasAreaDialogShow = true;
                    me.hasAllowTreeMenuShow = false;
                    me.areaDialogModel.areaParentName = data.name;
                    me.areaDialogModel.areaName = '';
                    me.areaDialogModel.state = 'add';
                    me.areaDialogModel.id = data.id;
                    me.areaDialogModel.guid = data.guid;
                    me.areaType = data.type;
                    me.hasOpenTreeMenuContext = false;
                }
            },
            async handlerSaveTreeNode() {
                let me = this;
                if (me.$refs.tree && me.areaDialogModel.state === 'add') {
                    let valid =  await me.$refs.areaForm.validate().catch(() => {});
                    if(valid) {
                        let areaName = me.areaDialogModel.areaName;
                        let areaCoordinates = me.areaDialogModel.areaCoordinates;
                        let areaId = me.areaDialogModel.id;
                        let guid = me.areaDialogModel.guid;
                        me.hasDisabledAreaSubmit = true;
                        let res = await me.$http.post(RESTFUL.injective.Api.Command.query, { methodName : 'insertCheck', body : [areaName] }, { emulateJSON : false, emulateHTTP : true });
                        let renames = res.body.model;
                        if(res.status === 200 && res.body.success && renames.length > 0) {
                            me.hasDisabledAreaSubmit = false;
                            return me.$message.error("新增区域名称不能重名!")
                        }
                        res = await me.$http.post(
                            RESTFUL.injective.Api.Area.CreateArea,
                            JSON.stringify({
                                parentId: areaId,
                                areaName: areaName,
                                areaCoordinates: areaCoordinates
                            }),
                            {emulateJSON: true, emulateHTTP: false}
                        );
                        if (res.status === 200 && res.body.success) {
                            me.hasAreaDialogShow = false;
                            me.hasAllowTreeMenuShow = true;
                            me.$refs.tree.append({ ...res.body.model, guid : res.body.model.id, leaf : false, onlineNum: 0, total : 0 }, guid);
                            me.handlerCancelAreaEdit();
                            return
                        }
                        me.$message.error("新增区域失败!");
                    }
                } else if (me.$refs.tree && me.areaDialogModel.state === 'modify') {
                    let valid =  await me.$refs.areaForm.validate().catch(() => {});
                    if(valid) {
                        me.hasDisabledAreaSubmit = true;
                        let res = await me.$http.post(RESTFUL.injective.Api.Command.query, { methodName : 'insertCheck', body : [me.areaDialogModel.areaName] }, { emulateJSON : false, emulateHTTP : true });
                        let renames = res.body.model;
                        if(res.status === 200 && res.body.success && renames.some(it => it.id !== me.areaDialogModel.id)) {
                            me.hasDisabledAreaSubmit = false;
                            return me.$message.error("修改区域名称不能重名!")
                        }
                        let node = me.$refs.tree.getNode(me.treeNodeItem.data.guid);
                        res = await me.$http.post(
                            RESTFUL.injective.Api.Area.Update,
                            JSON.stringify({
                                areaId: node.data.id,
                                areaName: me.areaDialogModel.areaName,
                                areaCoordinates: node.data.coordinates,
                            }),
                            {emulateJSON: true, emulateHTTP: false}
                        );
                        if (res.status === 200 && res.body.success) {
                            node.data.name = me.areaDialogModel.areaName;
                            node.data.coordinates = me.areaDialogModel.areaCoordinates;
                            me.handlerCancelAreaEdit();
                            return
                        }
                        me.$message.error("修改区域失败");
                    }
                }
            },
            handlerCancelAreaEdit() {
                let me = this;
                me.hasAreaDialogShow = false;
                me.hasAllowTreeMenuShow = true;
                me.hasDisabledAreaSubmit = false;
                me.areaDialogModel.guid = '';
                me.areaDialogModel.id = '';
                me.areaDialogModel.areaParentName = '';
                me.areaDialogModel.areaName = '';
                me.areaType = '';
                me.areaDialogModel.areaCoordinates = [];
                me.treeNodeItem = null;
                if (map) {
                    let layers = map.getLayers();
                    let drawLayer = null;
                    layers.forEach((layer) => {
                        if (layer.values_.id === 'draw-vector-layer') {
                            drawLayer = layer;
                        }
                    });
                    let source = drawLayer.getSource();
                    source.clear();
                }
            },
            handlerDrawArea() {
                let me = this;
                if (map && me.areaDialogModel.state === 'add') {
                    interactionDrawFeature(
                        (e) => {
                            let coordinates = e.feature.getGeometry().getCoordinates();
                            me.areaDialogModel.areaCoordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                            me.hasAreaDialogShow = true;
                        },
                        me,
                        'draw',
                        'Point',
                        null
                    );
                    me.hasAreaDialogShow = false;
                } else if (map && me.areaDialogModel.state === 'modify') {
                    let feature = new Feature();
                    let coordinates = transform([ Number(me.areaDialogModel.areaCoordinates[0]), Number(me.areaDialogModel.areaCoordinates[1])], "EPSG:4326", "EPSG:3857");
                    feature.setGeometry(new Point(coordinates));
                    interactionDrawFeature(
                        (e, state) => {
                            if (state === 'ok') {
                                let coordinates = e.features[0].getGeometry().getCoordinates();
                                me.areaDialogModel.areaCoordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                                me.hasAreaDialogShow = true;
                            } else if (state === 'cancle') {
                                me.hasAreaDialogShow = true;
                            }
                        },
                        me,
                        'modify',
                        'Point',
                        [feature]
                    );
                    me.hasAreaDialogShow = false;
                }
            },
            handlerModifyArea(data, vnode) {
                let me = this;
                if (vnode.node.level > 0) {
                    me.hasAreaDialogShow = true;
                    me.hasAllowTreeMenuShow = false;
                    me.areaDialogModel.guid = data.guid;
                    me.areaDialogModel.id = data.id;
                    me.areaDialogModel.areaParentName = vnode.$parent.node && vnode.$parent.node.data.name || 'N/A';
                    me.areaDialogModel.areaName = data.name;
                    me.areaDialogModel.areaCoordinates = data.coordinates;
                    me.areaDialogModel.state = 'modify';
                }
                me.hasOpenTreeMenuContext = false;
            },
            async handlerDropArea(data, vnode) {
                let me = this;
                me.hasOpenTreeMenuContext = false;
                if(data.total > 0) {
                    me.$message.error("该区域有设备，不能删除！");
                    return
                }
                if (me.$refs.tree && vnode.node.level > 1) {
                    let res = await me.$http.post(
                        RESTFUL.injective.Api.Area.Delete,
                        JSON.stringify({ areaId: data.id }),
                        {emulateJSON: true, emulateHTTP: false}
                    );
                    if (res.status === 200 && res.body.success) {
                        me.$refs.tree.remove(data.guid);
                        return
                    }
                    me.$message.error(res.body.errorMessage);
                }
            },
            handlerOpenDeviceEdit(data, vnode) {
                let me = this;
                me.hasDeviceDialogShow = true;
                me.hasAllowTreeMenuShow = false;
                me.hasOpenTreeMenuContext = false;
                me.deviceModel.parentName = data.name;
                me.deviceModel.parentId = data.id;
                me.deviceModel.flash = data.flash || false;
                me.deviceModel.type = data.type === 'area' ? 'WTOS-VN' : data.type === 'WTOS-VN-TME200' ? '6' : '1';
                me.deviceModel.parentType = data.type;
                me.deviceModel.state = 'add';
                me.deviceModel.name = '';
                me.deviceModel.id = '';
                me.deviceModel.guid = data.guid;
                me.deviceModel.deviceIP = ['WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(data.type) > -1 ? data.deviceIP : '';
                me.deviceModel.coordinates = [];
                me.deviceModel.otherDeviceName = '';
                me.deviceModel.companyName = '';
                me.deviceModel.listenState = '';
                me.deviceModel.port = '';
                me.deviceModel.energyNo = '';
                me.deviceModel.otherDeviceIP = '';
                me.deviceModel.mac = '';
                me.deviceModel.percent = 0;
                me.deviceModel.listenTotal = 0;
                me.deviceModel.interactionState = '';
                me.deviceModel.checkedSpacing = '';
                me.deviceModel.reStartTotal = '';
                me.deviceModel.power = '';
                me.deviceModel.openPlanCheck = data.type === 'area' ? '' : '21:00:00';
                me.deviceModel.closePlanCheck = data.type === 'area' ? '' : '04:00:00';
            },
            async handlerModifyDevice(data, vnode) {
                let me = this;
                if(vnode.node.level > 1 && ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'].indexOf(data.type) > -1) {
                    let methodName = ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(data.type) > -1 ? 'queryDeviceById' : 'queryOutDeviceById';
                    // @@Bug 查询外设后台接口报错
                    let res = await me.$http.post( RESTFUL.injective.Api.Command.query, { methodName, body : [data.id] }, { emulateJSON : false, emulateHTTP : true } );
                    if(res.status === 200 && res.body.success) {
                        me.hasDeviceDialogShow = true;
                        me.hasAllowTreeMenuShow = false;
                        me.deviceModel.state = 'modify';
                        me.deviceModel.isOnline = false;
                        let model = res.body.model;
                        if(['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(data.type) > -1) {
                            me.deviceModel.guid = data.guid;
                            me.deviceModel.id = data.id;
                            me.deviceModel.flash = model.flash || false;
                            me.deviceModel.name = model.devName;
                            me.deviceModel.type = model.devSeries;
                            me.deviceModel.parentType = '';
                            me.deviceModel.parentName = model.areaName;
                            me.deviceModel.companyName = '';
                            me.deviceModel.parentId = model.areaId;
                            me.deviceModel.deviceIP = model.devIp || ''; 
                            me.deviceModel.coordinates = model.x && model.y && [Number(model.x), Number(model.y)] || [];
                            me.deviceModel.isOnline = model.isOnline;
                        } else if(['1', '2', '3', '4', '5', '6'].indexOf(data.type) > -1){
                            me.deviceModel.guid = data.guid;
                            me.deviceModel.id = data.id;
                            me.deviceModel.flash = data.flash;
                            me.deviceModel.name = model.outdevName;
                            me.deviceModel.type = model.outdevType + "";
                            me.deviceModel.parentType = vnode.$parent.node.data.type;
                            me.deviceModel.parentName = model.devName;
                            me.deviceModel.parentId = model.devId;
                            me.deviceModel.deviceIP = model.devIp;
                            me.deviceModel.outdevId = model.outdevId;
                            me.deviceModel.coordinates = data.coordinates || []; 
                            me.deviceModel.otherDeviceName = model.outdevName;
                            me.deviceModel.companyName = model.outdevCorp; 
                            me.deviceModel.listenState = Number(model.detectStatus);
                            me.deviceModel.port = model.port;
                            me.deviceModel.energyNo = model.outdevPowerId;
                            me.deviceModel.otherDeviceIP = model.outdevIp; 
                            //@Bug 外设MAC地址没有输出。
                            me.deviceModel.mac = model.mac;
                            me.deviceModel.interactionState = Number(model.isAutoCtrl); 
                            me.deviceModel.checkedSpacing = model.timeInterval;
                            me.deviceModel.reStartTotal = model.rebootCount;
                            me.deviceModel.power = Number(model.wt);
                            me.deviceModel.percent = Number(model.wtPercent);
                            me.deviceModel.openPlanCheck = model.timeSchStart;
                            me.deviceModel.closePlanCheck = model.timeSchEnd;
                            me.deviceModel.isOnline = model.isOnline;
                        }
                    }
                }
                me.hasOpenTreeMenuContext = false;
            },
            async handlerSaveDevice() {
                let me = this;
                let checked = await me.$refs.deviceForm.validate().catch(() => {
                    return false;
                });
                try
                {
                    if(checked && me.$refs.tree) {
                        let { 
                            guid,
                            id, 
                            name, 
                            type, 
                            parentName, 
                            flash,
                            parentId, 
                            deviceIP,
                            outdevId,
                            coordinates, 
                            otherDeviceName, 
                            companyName, 
                            listenState, 
                            port, 
                            energyNo, 
                            otherDeviceIP, 
                            interactionState, 
                            checkedSpacing, 
                            reStartTotal, 
                            state, 
                            power,  
                            openPlanCheck,  
                            closePlanCheck,
                            listenTotal,
                            percent,
                            mac,
                            isOnline
                        }  = me.deviceModel;
                        let commandCode, body;
                        if(state === "add") {
                            let checkDeviceIP = deviceIP;

                            if(type === '6' && me.treeNodeItem.vnode.node.childNodes && me.treeNodeItem.vnode.node.childNodes.length) {
                                return me.$message.error("只能添加一个信号机外设。");
                            }

                            if(['1', '2', '3', '4', '5', '6'].indexOf(type) > -1) {
                                checkDeviceIP = otherDeviceIP;
                            }
                            let res = await me.$http.post(RESTFUL.injective.Api.Command.query, { methodName : 'insertDeviceCheck', body : [checkDeviceIP] }, { emulateJSON : false, emulateHTTP : true });
                            if(res.status === 200 && !res.body.success && ['3', '4', '5', '6'].indexOf(type) > -1) {
                                return me.$message.error("设备IP冲突，请重新分配IP。");
                            }
                            //DEV_ID,OUTDEV_IP,OUTDEV_MAC,OUTDEV_NAME,OUTDEV_TYPE,OUTDEV_CORP,OUTDEV_PORT,OUTDEV_ID,OUTDEV_POWER_ID,DETECT_STATUS,ADMIN_STATUS,MODE,THRESHOLD,WT_PERCENT,WT,IFD_WT,TIME_SCH_START,TIME_SCH_END,IS_AUTO_CTRL,DETECT_RES,TIME_INTERVAL,REBOOT_COUNT,LOCAL_IP,LOCAL_MASK,DELAY,LOST_RATE,CREATE_DATE,UPDATE_DATE,CREATE_USER,UPDATE_USER
                            //{外键 关联设备信息表主键,外设IP,外设MAC,外设名称,外设类型,外设厂商,外设端口,外设ID,外设电源ID,外设监测使能状态,外设电源开关,模式,阈值,补光灯占空比,功率,红外灯功率,检测计划开启时间,检测计划结束时间,联动使能状态,外设监测结果,检测间隔时间,重启次数,本地配置IP,本地配置掩码,延迟,丢包率,创建时间,修改时间,创建人,修改人}
                            commandCode = ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(type) !== -1 ? 'gm001' : 'gm002';
                            body = 
                                ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(type) !== -1 ? 
                                    [name, deviceIP, type, coordinates[0], coordinates[1], parentId] : 
                                        [parentId, otherDeviceIP, mac, otherDeviceName, type, companyName, port, 1, energyNo, listenState, 1, 1, 0, percent, power, 0, openPlanCheck, closePlanCheck, interactionState, null, checkedSpacing, reStartTotal, '','', 0, 0, moment().format("YYYY-MM-DD HH:mm:ss"), moment().format("YYYY-MM-DD HH:mm:ss"), me.userName, me.userName];
                        }

                        if(state === "modify") {
                            let res = await this.$http.get(RESTFUL.injective.Api.Device.getDeviceById, { params : { id, type } }, { emulateJSON : false, emulateHTTP : true });
                            if(res.status === 200 && res.body.success) {
                                let deviceModel = res.body.model;
                                let node = me.$refs.tree.getNode(guid);
                                node.isOnline = deviceModel.isOnline;
                                // if(['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200'].indexOf(type) > -1 && !deviceModel.isOnline) {
                                //     let node = me.$refs.tree.getNode(guid);
                                //     node.isOnline = deviceModel.isOnline;
                                //     return me.$message.error("设备不在线，不能修改！");
                                // }

                                if(['1', '2', '3', '4', '5'].indexOf(type) > -1 && !deviceModel.isOnline) {
                                    let node = me.$refs.tree.getNode(guid);
                                    node.isOnline = deviceModel.isOnline;
                                    return me.$message.error("外设关联的主设备不在线，不能修改。")
                                }
                                commandCode = ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(type) !== -1 ? 'gm003' : 'gm004';
                                body = 
                                    ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(type) !== -1 ?
                                        [id, name, deviceIP, coordinates[0], coordinates[1], parentId] :
                                            [id, outdevId, parentId, otherDeviceIP, mac, otherDeviceName, companyName, type, port, energyNo, listenState, 1, 1, 0, percent, power, 0, openPlanCheck, closePlanCheck, interactionState, 0, checkedSpacing, reStartTotal, '','', 0, 0, moment().format("YYYY-MM-DD HH:mm:ss"), moment().format("YYYY-MM-DD HH:mm:ss")];
                            } else {
                                return me.$message.error("同步设备状态失败，请稍后重试。")
                            }
                        }
                        
                        me.hasDisabledDeviceSumbit = true;
                        let res = await me.$http.post(
                            RESTFUL.injective.Api.Command.Send,
                            { commandCode, body },
                            { emulateJSON : false, emulateHTTP : true }
                        );
                        
                        if(res.status === 200 && res.body.success) {
                            if(state === "add" && res.body.model.data && res.body.model.data.DB_ID) {
                                let id = res.body.model.data && res.body.model.data.DB_ID;
                                let newDeviceGUID = res.body.model.data && res.body.model.data.GUID;
                                let data = { guid : newDeviceGUID, id, name, type, deviceIP, coordinates, otherDeviceName, companyName, listenState, port, energyNo, otherDeviceIP, interactionState, checkedSpacing, reStartTotal, state, percent, power, openPlanCheck, closePlanCheck, mac : '', isOnline : 0, leaf: false };
                                if(['1', '2', '3', '4', '5', '6'].indexOf(type) > -1) {
                                    data = { guid : newDeviceGUID, id, name : otherDeviceName, type, deviceIP : otherDeviceIP, coordinates, otherDeviceName, companyName, listenState, port, energyNo, otherDeviceIP, interactionState, checkedSpacing, reStartTotal, state, percent, power, openPlanCheck, closePlanCheck, mac : '', isOnline : 0, leaf: true, disabled : true };
                                }
                                me.$refs.tree.append(data, guid);
                                me.$nextTick(() => {
                                    me.$refs.tree.filter(me.deviceName);
                                });
                            } else if(state === "modify") {
                                let node = me.$refs.tree.getNode(guid);
                                node.data = { guid, id, name, type, deviceIP, coordinates, otherDeviceName, companyName, listenState, port, energyNo, otherDeviceIP, interactionState, checkedSpacing, reStartTotal, state, percent, power, openPlanCheck, closePlanCheck, mac, isOnline };
                                if(['1', '2', '3', '4', '5', '6'].indexOf(type) > -1) {
                                    node.data = { guid, id, name : otherDeviceName, type, deviceIP, coordinates, otherDeviceName, companyName, listenState, port, energyNo, otherDeviceIP, interactionState, checkedSpacing, reStartTotal, state, percent, power, openPlanCheck, closePlanCheck, mac, isOnline, leaf: true, disabled : true };
                                }
                                me.handlerModifyDeviceFeature(guid, coordinates, node.data);
                                me.$nextTick(() => {
                                    me.$refs.tree.filter(me.deviceName);
                                });
                            } else {
                                me.$message.error("服务器异常！");
                            }
                        } else if(res.status === 200 && !res.body.success && state === "add" ) {
                            me.$message.error("新增设备失败！");
                        } else if(res.status === 200 && !res.body.success && state === "modify") {
                            me.$message.error("修改设备失败！");
                        }
                        me.handlerCancelDevice();
                    }

                } catch(e) {
                    me.$message.error("添加设备失败！");
                    me.handlerCancelDevice();
                }
            },
            handlerModifyDeviceFeature(guid, newCoordinate, data) {
                let me = this;
                if(guid && map) {
                    let layers = map.getLayers();
                    let featureLayers = null;
                    layers.forEach((layer) => {
                        if(layer.values_.id === 'device-vector-layer') {
                            featureLayers = layer;
                        }
                    });
                    let source = featureLayers.getSource().getSource();
                    let feature = source.getFeatureById(guid);
                    if(!feature) {
                        feature = new Feature();
                        let suffix = me.exceptionDeviceList.some(it => it == data.id) || !data.isOnline ? '-red' : '';
                        let iconSrc = require(`~/assets/Images/device-vn${suffix}.png`);
                        if (data.type === 'WTOS-VE') {
                            iconSrc = require(`~/assets/Images/device-ve${suffix}.png`);
                        } else if(data.type === 'WTOS-VN-TME200') {
                            iconSrc = require(`~/assets/Images/device-semaphore${suffix}.png`);
                        } else if (data.type === 'WTOS-VN-PE') {
                            iconSrc = require(`~/assets/Images/device-pe${suffix}.png`);
                        }
                        feature.set('style', new Style({
                                image: new Icon({
                                    anchor: [0.5, 0.5],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'fraction',
                                    scale: 0.5,
                                    src: iconSrc,
                                    size: [58, 58],
                                    imgSize: [58, 58]
                                })
                            })
                        );
                        feature.setId(data.guid);
                        feature.set('type', data.type);
                        feature.set('coordinates', newCoordinate);
                        feature.set('data', data);
                    }
                    let x = Number(newCoordinate[0]);
                    let y = Number(newCoordinate[1]);
                    feature.setGeometry(new Point(transform([x, y], "EPSG:4326", "EPSG:3857")));
                    source.refresh();
                }
            },
            handlerCancelDevice() {
                let me = this;
                me.hasAllowTreeMenuShow = true;
                me.deviceModel.guid = '';
                me.deviceModel.id = '';
                me.deviceModel.parentId = '';
                me.hasDeviceDialogShow = false;
                me.hasDisabledDeviceSumbit = false;
                me.treeNodeItem = null;
                me.$refs.deviceForm.resetFields();
                me.$refs.deviceForm.clearValidate();
                if (map) {
                    let layers = map.getLayers();
                    let drawLayer = null;
                    layers.forEach((layer) => {
                        if (layer.values_.id === 'draw-vector-layer') {
                            drawLayer = layer;
                        }
                    });
                    let source = drawLayer.getSource();
                    source.clear();
                }
            },
            handlerDrawDevice(data) {
                let me = this;
                if (map && me.deviceModel.state === 'add') {
                    interactionDrawFeature(
                        (e) => {
                            let coordinates = e.feature.getGeometry().getCoordinates();
                            me.deviceModel.coordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                            me.hasDeviceDialogShow = true;
                        },
                        me,
                        'draw',
                        'Point',
                        null
                    );
                    me.hasDeviceDialogShow = false;
                } else if (map && me.deviceModel.state === 'modify') {
                    let feature = new Feature();
                    let coordinates = transform([Number(me.deviceModel.coordinates[0]), Number(me.deviceModel.coordinates[1])], "EPSG:4326", "EPSG:3857");
                    feature.setGeometry(new Point(coordinates));
                    interactionDrawFeature(
                        (e, state) => {
                            if (state === 'ok') {
                                let coordinates = e.features[0].getGeometry().getCoordinates();
                                me.deviceModel.coordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                                me.hasDeviceDialogShow = true;
                            } else if (state === 'cancle') {
                                me.hasDeviceDialogShow = true;
                            }
                        },
                        me,
                        'modify',
                        'Point',
                        [feature]
                    );
                    me.hasDeviceDialogShow = false;
                }
            },
            async handlerDropDevice(data, vnode) {
                let me = this;
                me.hasOpenTreeMenuContext = false;
                let res = await this.$http.get(RESTFUL.injective.Api.Device.getDeviceById, { params : { id : data.id, type : data.type } }, { emulateJSON : false, emulateHTTP : true });
                if(res.status === 200 && res.body.success) {
                    let deviceModel = res.body.model;
                    if(['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(data.type) > -1 && deviceModel.isOnline) {
                        data.isOnline = deviceModel.isOnline;
                        return me.$message.error("主设备在线，不能删除。");
                    }

                    if(['1', '2', '3', '4', '5', '6'].indexOf(data.type) > -1 && !deviceModel.isOnline) {
                        vnode.$parent.node.data.isOnline = deviceModel.isOnline;
                        return me.$message.error("外设关联的主设备不在线，不能删除。")
                    }
                    if (me.$refs.tree && map) {
                        let confirm = await this.$confirm('此操作将永久删除选中的设备,是否继续?', '提示', {
                            customClass: "smart-box smart-box-message",
                            confirmButtonClass: 'el-button--success',
                            cancelButtonClass: 'el-button--warning',
                            type: 'warning'
                        }).catch(() => {});
                        if(confirm) {
                            let commandCode = ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(data.type) > -1 ? 'gm005' : 'gm006';
                            let result = await me.$http.post(
                                RESTFUL.injective.Api.Command.Send,
                                JSON.stringify({ commandCode, body: [data.id] }),
                                { emulateJSON: true, emulateHTTP: false }
                            );
                            if (result.status === 200 && result.body.success) {
                                let layers = map.getLayers();
                                let deviceLayer = null;
                                layers.forEach((layer) => {
                                    if (layer.values_.id === 'device-vector-layer') {
                                        deviceLayer = layer;
                                    }
                                });
                                let source = deviceLayer.getSource().getSource();
                                let feature = source.getFeatureById(data.guid);
                                feature && source.removeFeature(feature);
                                me.$refs.tree.remove(data.guid);
                                let total = vnode.$parent.node.data.total - 1;
                                vnode.$parent.node.data.total = total < 0 ? 0 : total;
                                me.$nextTick(() => {
                                    me.$refs.tree.filter(me.deviceName);
                                });
                                return me.$message({ type: 'success', message: '设备删除成功！' });
                            }
                            me.$message.error("删除设备失败！");
                        }
                    }
                } else {
                    me.$message.error("同步设备状态失败。")
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
            },
            handlerHasRequiredFormItem(rules) {
                let me = this;
                let deviceRules = {
                    name:[ { required: true, message: '设备名称不能为空！', trigger: 'blur' },
                        { min: 1, max: 16, message: '设备名称只能输入16个字符！', trigger: 'blur'}
                    ],
                    type: { required: true, message: '设备类型不能为空！', trigger: 'blur'},
                    deviceIP: [
                        { required: true, message: '设备IP不能为空！', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value) ? callback(new Error('设备IP格式不正确！')) : callback(),
                            trigger: 'blur'
                        }
                    ],
                    coordinates:  { required: true, message: '设备坐标不能为空！', trigger: 'change'},
                    otherDeviceName: [
                        { required : true, message : '外接设备名称不能为空！', trigger : 'blur' },
                        { min: 1, max: 8, message: '外接设备名称只能输入8个字符！', trigger: 'blur'}
                    ],
                    companyName:  { min: 0, max: 8, message: '厂家名称只能输入8个字符！', trigger: 'blur'},
                    port: [
                        { validator : (rule, value, callback) => { /^\d{0,2}$/.test(value) ? callback() : callback(new Error('端口值必须是非负数整数！'))  }, trigger: 'blur'}
                    ],
                    energyNo: {  validator : (rule, value, callback) => { /^[1-9]{0,1}$/.test(value) ? callback() : callback(new Error('电源通道必须在1~9之间！'))  }, trigger: 'blur' },
                    otherDeviceIP: { validator: (rule, value, callback) => me.hasOutDevice && !/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value) ? callback(new Error('外接设备IP格式不正确！')) : callback(), trigger: 'blur' },
                    interactionState: [ ],
                    percent : { type : 'number', min : 0, max : 100, message : '占空比必须在0~8之间！', trigger : 'blur' },
                    // listenTotal : { type : 'number', min : 0, max : 20, message : '监测次数必须在0-20之间！', trigger : 'blur' },
                    power : { validator : (rule, value, callback) => { /^([1-9]?)\d{0,6}$/.test(value) ? callback() : callback(new Error('功率请输入数值！'))  }, trigger : 'blur' },
                    openPlanCheck : [],
                    closePlanCheck : [],
                };

                if(['name', 'deviceIP', 'type', 'coordinates'].indexOf(rules) > -1 && ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(me.deviceModel.type) > -1) {
                    return deviceRules[rules];
                }
                
                if(['1', '2', '3', '4', '5', '6'].indexOf(me.deviceModel.type) > -1 && me.deviceModel.parentType === 'WTOS-VN-PE' && rules === 'energyNo' ) {
                    return [
                        { required: true, message: '电源通道不能为空！', trigger: 'blur' },
                        { validator : (rule, value, callback) => { /^[1-4]{1}$/.test(value) ? callback() : callback(new Error('电源通道必须在1~4之间！'))  }, trigger: 'blur' }
                    ];
                }

                if(me.deviceModel.type === '6' && 'otherDeviceIP' === rules) {
                    return [{ required: true, message: '外设IP不能为空！', trigger: 'blur' }, ...deviceRules[rules]];
                }

                if(me.deviceModel.type === '6' && ['type', 'deviceIP', 'otherDeviceName', 'companyName'].indexOf(rules) > -1) {
                    return deviceRules[rules];
                }

                if(me.deviceModel.type === '5' && ['companyName', 'otherDeviceName', 'interactionState'].indexOf(rules) > -1) {
                    return deviceRules[rules];
                }

                if(['5'].indexOf(me.deviceModel.type) > -1 && 'energyNo' === rules && me.deviceModel.interactionState) {
                    return [ { required: true, message: '电源通道不能为空！', trigger: 'blur' }, ...deviceRules[rules]];
                }

                if(['3', '5'].indexOf(me.deviceModel.type) > -1 && 'otherDeviceIP' === rules) {
                    return [ { required: true, message: '外设IP不能为空！', trigger: 'blur' }, deviceRules[rules]];
                }

                if(['3', '5'].indexOf(me.deviceModel.type) > -1 && 'port' === rules) {
                    return [ { required: true, message: '端口不能为空！', trigger: 'blur' }, ...deviceRules[rules]];
                }
                
                if(me.deviceModel.type === '3' && 'interactionState' === rules && me.deviceModel.energyNo) {
                    return [{ required: true, message: '联动状态不能为空！', trigger: 'blur' }, ...deviceRules[rules]]
                }

                if(me.deviceModel.type === '3' && ['companyName', 'otherDeviceName', 'energyNo', 'interactionState', 'power'].indexOf(rules) > -1 ) {
                    return deviceRules[rules];
                }

                if(me.deviceModel.type === '1' && ['companyName', 'otherDeviceName', 'power', 'percent'].indexOf(rules) > -1 ) {
                    return deviceRules[rules];
                }

                if(me.deviceModel.type === '1' && ['openPlanCheck', 'closePlanCheck'].indexOf(rules) > -1) {
                    return { required: true, message: '计划时间不能为空！', trigger: 'blur' }
                }

                if(['1', '2'].indexOf(me.deviceModel.type) > -1 && 'energyNo' === rules) {
                    return [ { required: true, message: '电源通道不能为空！', trigger: 'blur' }, ...deviceRules[rules]];
                }

                if(me.deviceModel.type === '2' && ['companyName', 'otherDeviceName'].indexOf(rules) > -1) {
                    return deviceRules[rules];
                }

                return null;
            },
            handlerDeviceTypeChange() {
                let me = this;
                me.$refs.deviceForm.clearValidate();

                if(['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(me.deviceModel.type)  > -1) {
                    me.deviceModel.otherDeviceName = '';
                    me.deviceModel.companyName = '';
                    me.deviceModel.listenState = '';
                    me.deviceModel.port = '';
                    me.deviceModel.energyNo = '';
                    me.deviceModel.otherDeviceIP = '';
                    me.deviceModel.mac = '';
                    me.deviceModel.percent = 0;
                    me.deviceModel.listenTotal = 0;
                    me.deviceModel.interactionState = '';
                    me.deviceModel.checkedSpacing = '';
                    me.deviceModel.reStartTotal = '';
                    me.deviceModel.power = '';
                    me.deviceModel.openPlanCheck = '';
                    me.deviceModel.closePlanCheck = '';
                }

                if(me.deviceModel.type === '1') {
                    me.deviceModel.otherDeviceIP = '';
                    me.deviceModel.port = '';
                    me.deviceModel.interactionState = '';
                }

                if(me.deviceModel.type === '2') {
                    me.deviceModel.otherDeviceIP = '';
                    me.deviceModel.port = '';
                    me.deviceModel.interactionState = '';
                    me.deviceModel.power = '';
                    me.deviceModel.percent = 0;
                    me.deviceModel.openPlanCheck = '';
                    me.deviceModel.closePlanCheck = '';
                }

                if(me.deviceModel.type === '3') {
                    me.deviceModel.listenState = '';
                    me.deviceModel.percent = 0;
                    me.deviceModel.openPlanCheck = '';
                    me.deviceModel.closePlanCheck = '';
                    me.deviceModel.openPlanCheck = '21:00:00';
                    me.deviceModel.closePlanCheck = '04:00:00';
                }

                if(me.deviceModel.type === '5') {
                    me.deviceModel.percent = 0;
                    me.deviceModel.power = '';
                    me.deviceModel.openPlanCheck = '';
                    me.deviceModel.closePlanCheck = '';
                }
            },
            handlerMapContextMenu(evt) {
                let me = this;
                if(map && me.role.id == "admin") {
                    me.hasOpenMapMenuContext = true;
                    me.mapContentMenuOffset.x = evt.clientX;
                    me.mapContentMenuOffset.y = evt.clientY;
                }
            },
            async handlerDeepAlarmInfoInMap(timer) {
                let me = this;
                let res = await me.$http.post(
                    RESTFUL.injective.Api.AlarmInfo.getAlarmInfoInMap, 
                    { startTime : timer, lastId : '' }, 
                    { emulateJSON : false, emulateHTTP : true }
                );
                if(res.status === 200 && res.ok) {
                    return res.body.model;
                }
                return [];
            },
            handlerOpenMapParamsConfirm() {
                let me = this;
                if(map && me.role.id == "admin") {
                    me.$confirm('确认是否修改当前地图视野参数', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            customClass :　"smart-box smart-box-message",
                            confirmButtonClass: 'el-button--success',
                            cancelButtonClass: 'el-button--warning'
                        }
                    ).then(
                        () => {
                            let extent = map.getView().calculateExtent(map.getSize());
                            let [minX, minY, maxX, maxY] = getProjection("EPSG:3857").getExtent();
                            let [X, Y] = getCenter(extent);
                            let minZoom = me.getMapMinZoom;
                            let maxZoom = me.getMapMaxZoom;
                            let zoom = map.getView().getZoom();
                            let sideW = maxX - minX;
                            let sideH = maxY - minY;
                            for(let i = 0; i < zoom; i++) {
                                sideW /= 2;
                                sideH /= 2;
                            }
                            me.UpdateMapViewParms({ 
                                MAP_CENTER : transform([X, Y], "EPSG:3857", "EPSG:4326"),
                                MAP_EXTENT : transformExtent([X - sideW, Y - sideH, X + sideW, Y + sideH], "EPSG:3857", "EPSG:4326"),
                                VIEW_EXTENT : transformExtent(extent, "EPSG:3857", "EPSG:4326")
                            });
                            me.visibleSysParamsDialog(true);
                            // let [ minx, miny, maxx, maxy] = [X - sideW, Y - sideH, X + sideW, Y + sideH];
                            // let layers = map.getLayers();
                            // let drawLayer = null;
                            // layers.forEach((layer) => {
                            //     if (layer.values_.id === 'draw-vector-layer') {
                            //         drawLayer = layer;
                            //     }
                            // });
                            // let source = drawLayer.getSource();
                            // let feature = source.getFeatureById("linear-00000001");
                            // if(feature) {
                            //     source.removeFeature(feature);
                            // }
                            // feature = new Feature();
                            // feature.setId("linear-00000001");
                            // let polygon = new Polygon([[[minx, miny], [maxx, miny], [maxx, maxy], [minx, maxy]]], "XY");
                            // feature.setGeometry(polygon);
                            // feature.setStyle(new Style({
                            //     fill : new Fill({
                            //         color : 'rgba(255, 0, 0, .5)'
                            //     }),
                            //     stroke : new Stroke({
                            //         color : 'red',
                            //         width : 5
                            //     })
                            // }));
                            // source.addFeature(feature);
                            // source.refresh();
                            // for(let i = minZoom; i <= maxZoom; i++) {
                            //     sideW /= 2;
                            //     sideH /= 2;
                            //     console.log(`current zoom center range : 第${i}级  range ${transformExtent([X - sideW, Y - sideH, X + sideW, Y + sideH], "EPSG:3857", "EPSG:4326")}`);
                            // }
                        }
                    );
                }
            },
            //获取操作中下拉框的用户信息
            async getUserInfo() {
                let me = this;
                let res = await me.$http.post(RESTFUL.injective.Api.AlarmInfo.getUserInfo, {}, {
                    emulateJSON: false,
                    emulateHTTP: true
                });
                if (res.status === 200 && res.body.success) {
                    let data = res.body.model;
                    me.userList = data;
                }
            },
            //将操作信息（处理人，处理状态，备注）插入数据库
            insertDealInfo() {
                this.$refs.alarmFrom.validate((valid) => {
                    if (valid) {
                        let me = this;
                        me.$http.post(RESTFUL.injective.Api.AlarmInfo.insertOpInfo, {
                            opAlarmId: me.alarmDialogModel.lastId,
                            opUid: me.alarmDialogModel.dealMan,
                            isDeal: me.alarmDialogModel.radio,
                            opInfo: me.alarmDialogModel.remark
                        }, {
                            emulateJSON: false,
                            emulateHTTP: true
                        }).then(res => {
                            if(res.status === 200) {
                                me.alarmDialogModel.display = false;
                                notifys = notifys.filter(it => it.lastId !== me.alarmDialogModel.lastId);
                                me.$refs.alarmFrom.resetFields();
                            }
                        })
                    }
                });
            },
            handlerAlarmDialogClose() {
                let me = this;
                me.alarmDialogModel.remark = '';
                me.alarmDialogModel.display = false;
                me.$refs.alarmFrom.resetFields();
            },
            ...mapActions({
                "SaveConfigParams" : "Sys/SaveConfigParams",
                "UpdateMapViewParms" : "Sys/UpdateMapViewParms",
                "visibleSysParamsDialog" : 'Home/triggerSysParamsDialog'
            })
        },
        beforeCreate() {
            map = null;
        },
        mounted() {
            let me = this;
            let _now = new Date().getTime();
            window.mapView = { notify_position_move : notify_position_move.bind(me), notify_handler_action : notify_handler_action.bind(me) };
            me.initMap();
            me.loadDeviceType();
            me.queryAllPrimaryDevice();
            me.getUserInfo();
            let disabledMouseRight = (evt) => {
                return evt.resultValue = false;
            }
            let handlerDocumentClick = (evt) => {
                me.hasOpenMapMenuContext = false;
                me.$refs.search_dev_query.blur();
            }
            document.oncontextmenu = disabledMouseRight;
            document.onclick = handlerDocumentClick;

            let notifys_timer, notify_timer;
                notifys_timer = setInterval(async () => {
                if(me.disabled_alarm) {
                    let result = await me.handlerDeepAlarmInfoInMap(_now);
                    let notify_each = function(n) {
                        if(n >= this.length) {
                            return;
                        }

                        let it = this[n];
                        if( notifys.some(n => n.lastId === it.lastId) ) {
                            return ;
                        }
                        notifys.push(it);
                        var abnormal = [
                            "<div style='height: 80px; width: 100%;'>",
                                "<div style='background: #F2F6FC; width: 80px; height: 100%; display: inline-table; vertical-align: top;'>",
                                    "<div style='display: table-cell; vertical-align: middle; text-align: center; color: #909399; font-size: 12px;'><i class='el-icon-s-claim' style='font-size: 24px; color: #409EFF; cursor:pointer;' onclick='mapView.notify_handler_action("+ JSON.stringify(it) +")'></i><br />处理</div>",
                                    "<div style='display: table-cell; vertical-align: middle; text-align: center; color: #909399; font-size: 12px;'><i class='el-icon-map-location' style='font-size: 24px; color: #409EFF; cursor:pointer;' onclick='mapView.notify_position_move("+ it.x +", "+ it.y +")'></i><br />定位</div>",
                                "</div>",
                                "<div style='width: 320px; height: 100%; display: inline-table; vertical-align: top;'>",
                                    "<div style='display: table-row; width: 100%; vertical-align: middle;'>",
                                        "<div style='text-indent: 5px; font-weight: bold; color: #909399; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 320px; line-height: 40px;'>",
                                            `<span style='width: 60px; border-radius: 4px; padding: 3px 5px; box-sizing: border-box; font-size: 12px; color: #fff; background: ${['#F56C6C','#E6A23C', '#E6A23C'][it.alarmLever] || '#E6A23C'}'><i class='fa fa-exclamation-triangle fa-lg' style='color: #fff;'></i>&nbsp;&nbsp; ${['高','中', '低'][it.alarmLever] || '低'}</span> ${it.devName}`,
                                        "</div>",
                                    "</div>",
                                    "<div style='display: table-row; width: 100%; vertical-align: middle;'>",
                                        "<div style='display: flex; flex-flow: row nowrap;'>",
                                            "<div style='flex: 1 1 auto; text-indent: 5px;'>告警类型：</div>",
                                            `<div style='flex: 1 1 auto;'>${it.alarmName}</div>`,
                                            "<div style='flex: 1 1 auto; text-indent: 5px;'>告警时间：</div>",
                                            `<div style='flex: 1 1 auto;'>${ moment(it.alarmTime * 1000).format("HH:mm:ss") }</div>`,
                                        "</div>",
                                    "</div>",
                                "</div>",
                            "</div>"
                        ];
                        me.$notify({
                            title : '',
                            duration: 10000,
                            dangerouslyUseHTMLString : true,
                            message: abnormal.join(''),
                            position: 'bottom-right',
                            customClass : 'smart-box smart-box-notify'
                        })
                        let audio = document.createElement("audio");
                        audio.setAttribute("autoplay", "autoplay");
                        let source = document.createElement("source");
                        source.setAttribute("src", require("~/assets/data/alarm.mp3"));
                        audio.appendChild(source);
                        me.$refs.alarmPlay.appendChild(audio);
                        setTimeout(() => me.$refs.alarmPlay.removeChild(audio), 4000);
                        notify_timer = setTimeout(notify_each.bind(this, ++n), 1000);
                    }
                    result.length && notify_each.apply(result, [0]);
                }
            }, 5000);
            me.$once("hook:beforeDestroy", () => { 
                clearTimeout(notify_timer);
                clearInterval(notifys_timer);
                map = null;
                draw = null;
                document.oncontextmenu = null;
                document.onclick = null;
            });
        }
    }
})()