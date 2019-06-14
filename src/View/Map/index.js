/**
 * Developer    :   SongQian
 * Time         :   2019-05-28
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   地图业务UI
 */

 import _ from 'lodash'
 import { Map, View, Overlay } from 'ol'
 import { boundingExtent, getCenter } from 'ol/extent'
 import { defaults as defaultControls } from 'ol/control';
 import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
 import { XYZ } from 'ol/source'
 import { Cluster, Vector as VectorSource } from 'ol/source'
 import { Style, Icon, Text, Fill } from 'ol/style'
 import Feature from 'ol/Feature'
 import { Point, Polygon } from 'ol/geom'
 import { altKeyOnly } from 'ol/events/condition'
 import { DragRotateAndZoom, Draw, Modify, Snap } from 'ol/interaction'
 import { transform, transformExtent } from 'ol/proj'
 import UUID from '~/Scripts/Util/uuid'
 import { ButtonGroupComponent, ImportActionButton, ExportActionButton, ListActionButton } from '~/Scripts/Util/ol.map.controls'

 export default(function() {
    let map = null;
    let draw = null;

    const interactionDrawFeature = function(callback, interaction = 'draw', type = 'Point', features = []) {
        let layers, drawLayer, source;
        if(map && interaction === 'draw') {
            layers = map.getLayers();
            drawLayer = null;
            layers.forEach((layer) => {
                if(layer.values_.id === 'draw-vector-layer') {
                    drawLayer = layer;
                }
            });
            source = drawLayer.getSource();
            source.clear();
            draw = new Draw({ source, type, stopClick : true });
            source.on("addfeature", (e) => {
                map.removeInteraction(draw);
                draw = null;
                source.un("addfeature");
                if(typeof callback === 'function') {
                    callback.apply(null, [e]);
                }
            });
            map.addInteraction(draw);
        } else if(map && interaction === 'modify') {
            layers = map.getLayers();
            drawLayer = null;
            layers.forEach((layer) => {
                if(layer.values_.id === 'draw-vector-layer') {
                    drawLayer = layer;
                }
            });
            source = drawLayer.getSource();
            source.clear();
            let featuresCopy = _.cloneDeep(features);
            source.addFeatures(features);
            source.refresh();
            draw = new Modify({ source });
            map.addInteraction(draw);
            let handlerMapModifyKeyEvent = function(){
                let e = event;
                if(e.keyCode === 13) {
                    e.stopPropagation();
                    map.removeInteraction(draw);
                    draw = null;
                    document.removeEventListener("keyup", handlerMapModifyKeyEvent);
                    if(typeof callback === 'function') {
                        e.features = draw.features_;
                        callback.apply(null, [e, 'ok']);
                    }
                } else if (e.keyCode === 27) {
                    e.stopPropagation();
                    map.removeInteraction(draw);
                    draw = null;
                    source.clear();
                    source.addFeatures(featuresCopy);
                    source.refresh();
                    document.removeEventListener("keyup", handlerMapModifyKeyEvent);
                    if(typeof callback === 'function') {
                        callback.apply(null, [e, 'cancle']);
                    }
                }
            };
            document.addEventListener("keyup", handlerMapModifyKeyEvent, false);
        }
    }

    return {
        name : 'Map',
        data() {
            let me = this;
            return {
                deviceType : '',
                hasOpenTreeMenuContext : false,
                treeNodeItem : null,
                treeProps : {
                    label : 'name',
                    children : 'children',
                    isLeaf : 'leaf'
                },
                treeData : [],
                hasAreaDialogShow : false,
                hasDeviceDialogShow : false,
                hasAllowTreeMenuShow : true,
                deviceTitle : '添加设备信息',
                devicedTypeList : [
                    { label : '智能机箱', value : 'WTOE-VN' },
                    { label : '光传输设备', value : 'WTOE-VE' },
                    { label : '摄像机', value : '3' },
                    { label : '补光灯', value : '1' },
                    { label : '闪光灯', value : '2' },
                    { label : '终端服务器', value : '4' }
                ],
                listenStateList : [
                    { label : '状态1', value : '1' },
                    { label : '状态2', value : '2' },
                    { label : '状态3', value : '3' },
                    { label : '状态4', value : '4' },
                    { label : '状态5', value : '5' }
                ],
                interactionStateList : [
                    { label : '状态1', value : '1' },
                    { label : '状态2', value : '2' },
                    { label : '状态3', value : '3' },
                    { label : '状态4', value : '4' },
                    { label : '状态5', value : '5' }
                ],
                dialogData : {},
                areaRules : {
                    areaNo : [
                        { required : true, message : '区域编号不能为空！', trigger : 'blur' }
                    ],
                    areaParentName : [
                        { required : true, message : '所属区域名称不能为空！', trigger: 'blur' }
                    ],
                    areaName : [
                        { required : true, message : '区域名称不能为空!', trigger : 'blur' },
                        { min: 1, max: 10, message : '区域名称最大只能输入10个字符！', trigger : 'blur' }
                    ],
                    areaCoordinates : [
                        { type: 'array', required : true, message : "区域坐标点不能为空！", trigger : 'change' }
                    ]
                },
                areaDialogModel : {
                    areaNo : '',
                    areaParentName : '',
                    areaName : '',
                    areaCoordinates : [],
                    areaType : '',
                    state : ''
                },
                deviceModel : {
                    id : '',
                    name : '',
                    type : '',
                    areaName : '',
                    areaId : '',
                    deviceIP : '',
                    coordinates : [],
                    otherDeviceName : '',
                    companyName : '',
                    listenState : '',
                    port : '',
                    energyNo : '',
                    otherDeviceIP : '',
                    interactionState : '',
                    checkedSpacing : 0,
                    reStartTotal : 0,
                    state : ''
                },
                deviceRules : {
                    name : [
                        { required : true, message : '设备名称不能为空！', trigger : 'blur' }
                    ],
                    type : [
                        { required : true, message : '设备类型不能为空！', trigger : 'blur' }
                    ],
                    areaName : [
                        { required : () => !me.hasDeviceVE, message : '区域名称不能为空！', trigger : 'blur' },
                        { min : 1, max : 10, message : '设备名称只能用10个字符组成！', trigger : 'blur' }
                    ],
                    deviceIP : [
                        { required : true, message : '设备IP不能为空！', trigger : 'blur' },
                        { validator : (rule, value, callback) => !/^([1-9]{1,3}\.){3}[1-9]$/.test(value) ? callback(new Error('设备IP格式不正确！')) : callback(), trigger : 'blur' }
                    ],
                    coordinates : [
                        { type : 'array', required : true, message : '设备坐标不能为空！', trigger : 'change' }
                    ],
                    otherDeviceName : [
                        { required : () => me.hasDeviceVE, message : '外接设备名称不能为空！', trigger : 'blur' },
                        { min :1, max : 10, message : '外接设备名称只能输入10个字符！', trigger : 'blur' }
                    ],
                    companyName : [
                        { min : 0, max : 10, message : '厂家名称只能输入10个字符！', trigger : 'blur' }
                    ],
                    listenState : [
                        { required : () => me.hasDeviceVE, message : '监测状态不能为空！', trigger : 'blur' }
                    ],
                    port : [
                        { required : () => me.hasDeviceVE, message : '端口不能为空！', trigger : 'blur' },
                        { type : 'number', message : '端口必须为数值！', trigger : 'blur' },
                        { type : 'number', min : 0, max : 65535, message : '端口值必须在0~65535之间！', trigger : 'blur' }
                    ],
                    energyNo : [
                        { required : () => me.hasDeviceVE, message : '电源编号不能为空！', trigger : 'blur' }
                    ],
                    otherDeviceIP : [
                        { required : () => me.hasDeviceVE, message : '外接设备IP不能为空！', trigger : 'blur' },
                        { validator : (rule, value, callback) => me.hasDeviceVE && !/^([1-9]{1,3}\.){3}[1-9]$/.test(value) ? callback(new Error('外接设备IP格式不正确！')) : callback(), trigger : 'blur' }
                    ],
                    interactionState : [
                        { required : () => me.hasDeviceVE, message : '联动状态不能为空！', trigger : 'blur' }
                    ],
                    checkedSpacing : [
                        { required : () => me.hasDeviceVE, message : '检测间隔时间不能为空！', trigger : 'blur' }
                    ],
                    reStartTotal : [
                        { required : () => me.hasDeviceVE, message : '重启次数不能为空！', trigger : 'blur' },
                        { type : 'number', message : '重启次数必须为数值！', trigger : 'blur' }
                    ]
                },
                dragRotateAndZoom : new DragRotateAndZoom({ condition : altKeyOnly }),
                wrong:false,
                hasDialogShow : false
            }
        },
        computed : {
            getDeviceDialogSize() {
                let me = this;
                if(me.deviceModel.type === 'WTOE-VE') {
                    return { width : 820, height : 520 };
                }
                return { width : 520, height : 420};
            },
            hasDeviceVE() {
                return this.deviceModel.type === 'WTOE-VE';
            }
        },
        methods : {
            loadTreeNode(node, resolve) {
                if(node.level === 5) {
                    return resolve([]);
                }
                setTimeout(() => {
                    if(node.data.total === 0) {
                        const data = [
                            { 
                                id : UUID(), 
                                name :  '阳春大街', 
                                leaf : false, 
                                type : 'area', 
                                total : Math.floor(Math.random() * 100), 
                                coordinates : [12721567.491558455, 3574195.4426148417]
                            }
                        ];
                        return resolve(data);
                    }
                    const data = [
                        { 
                            id : UUID(), 
                            name :  '阳春大街', 
                            leaf : false, 
                            type : 'area', 
                            total : Math.floor(Math.random() * 100), 
                            coordinates : [12721567.491558455, 3574195.4426148417]
                        },
                        // ...new Array(node.data.total).fill("").map((it, n) => {
                        //     let x = (Math.random() * (13956789.868646901 - 9187119.303651903)) + 9187119.303651903;
                        //     let y = (Math.random() * (2781084.837127852 - 5706482.783658118)) + 5706482.783658118;
                        //     return {
                        //         id : UUID(),
                        //         name : `设备-${n}`,
                        //         leaf : true,
                        //         type : ['WTOE-VN', 'WTOE-VE'][Math.floor(Math.random() * 2)],
                        //         post : Math.floor(Math.random() * 100) + "M/S",
                        //         coordinates : transform([x,y], "EPSG:3857", "EPSG:4326")
                        //     }
                        // })
                    ];
                    resolve(data);
                }, 500);
            },
            handlerTreeAllowDrop(draggingNode, dropNode, type) {
                if(type === "inner") {
                    if(['WTOE-VN', 'WTOE-VE'].indexOf(draggingNode.data.type) > -1 && dropNode.data.type === "area") {
                        return true;
                    }

                    if(draggingNode.data.type === "area" &&dropNode.data.type === "area") {
                        return true;
                    }
                }
                if(type === "prev" || type === "next") {
                    if(['WTOE-VN', 'WTOE-VE'].indexOf(draggingNode.data.type) > -1 && ['WTOE-VN', 'WTOE-VE'].indexOf(dropNode.data.type) > -1) {
                        return true;
                    }

                    if(draggingNode.data.type === "area") {
                        return true;
                    }

                    if(['WTOE-VN', 'WTOE-VE'].indexOf(draggingNode.data.type) > -1 && ['WTOE-VN', 'WTOE-VE'].indexOf(dropNode.data.type) > -1) {
                        return true;
                    }
                }
                return false;
            },
            handlerTreeNodeDbClick(node) {
                let me = this;
                if(map){
                    let position = data.coordinates;
                    me.handlerMapMoveTo(position, void 0, 13);
                }
            },
            handlerTreeCheckChange(data, isCheck, childrenNode) {
                let me = this;
                if(map) {
                    let layers = map.getLayers();
                    let deviceLayer = null;
                    layers.forEach((layer) => {
                        if(layer.values_.id === 'device-vector-layer') {
                            deviceLayer = layer;
                        }
                    });
                    let source = deviceLayer.getSource().getSource();
                    if(data.type === "area") {
                        source.clear();
                        let childrenNode = me.$refs.tree.getNode(data.id).childNodes;
                        if(isCheck && childrenNode.length ) {
                            for(let i = 0; i < childrenNode.length; i++) {
                                if(['WTOE-VN', 'WTOE-VE'].indexOf(childrenNode[i].data.type) > -1 ) {
                                    me.$refs.tree.setChecked(childrenNode[i].data.id, true);
                                }
                            }
                            source.refresh();
                            map.render();
                        } else if(!isCheck && childrenNode.length) {
                            for(let i = 0; i < childrenNode.length; i++) {
                                me.$refs.tree.setChecked(childrenNode[i].data.id, false);
                            }
                        }
                    }
                    
                    if(['WTOE-VN', 'WTOE-VE'].indexOf(data.type) > -1) {
                        if(!isCheck) {
                            let feature = source.getFeatureById(data.id);
                            if(feature)
                                source.removeFeature(feature);
                        }

                        if(isCheck) {
                            let iconFeature = new Feature(new Point(transform(data.coordinates, "EPSG:4326", "EPSG:3857")));
                            let iconSrc = require('~/assets/Images/device.png');
                            if(data.type === 'WTOE-VE') {
                                iconSrc = require('~/assets/Images/device-1.png');
                            }
                            iconFeature.set('style', new Style({
                                    image : new Icon({
                                        anchor : [0.5, 0.5],
                                        anchorXUnits : 'pixels',
                                        anchorYUnits : 'pixels',
                                        scale : 0.5,
                                        src : iconSrc,
                                        size : [70, 70],
                                        imgSize : [70, 70]
                                    })
                                })
                            );
                            iconFeature.setId(data.id);
                            iconFeature.set('type', data.type);
                            iconFeature.set('coordinates', data.coordinates);
                            iconFeature.set('data', data);
                            source.addFeature(iconFeature);
                        }
                    }
                }
            },
            handlerMapFeatureClick(evt, feature) {
                let me = this;
                if(map.hasFeatureAtPixel(evt.pixel)) {
                    me.hasDialogShow = false;
                    let features = feature.get("features");
                    if(features.length === 1 && ['WTOE-VN', 'WTOE-VE'].indexOf(features[0].get("type")) > -1) {
                        me.handlerMapMoveTo(features[0].getGeometry().getCoordinates(), () => {
                            let overlay = new Overlay({
                                element : me.$refs.device_dialog.$el,
                                offset : [15, -25],
                                positioning: 'center-center',
                                stopEvent: false
                            });
                            overlay.setPosition(features[0].getGeometry().getCoordinates());
                            me.hasDialogShow = true;
                            me.dialogData = features[0].get('data');
                            map.addOverlay(overlay);
                        }, 13, false);
                    }
                }
            },
            handlerMapFeatureActive(evt) {
                let me = this;
                if(map.hasFeatureAtPixel(evt.pixel)) {
                    let features = map.getFeaturesAtPixel(evt.pixel);
                    let iconStyle = null;
                    if(features[0].get("features").length > 1) {
                        var size = features[0].get('features').length;
                        iconStyle = new Style({
                            image: new Icon({
                                anchor : [0.5, 0.5],
                                anchorXUnits : 'pixels',
                                anchorYUnits : 'pixels',
                                src : require('~/assets/Images/circle-red.png'),
                                size : [70, 70],
                                imgSize : [70, 70]
                            }),
                            text: new Text({
                                text: size.toString(),
                                textAlign : "center",
                                placement : "point",
                                offsetX : 35,
                                offsetY : 35,
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        })
                        features[0].set("style", iconStyle);
                    }
    
                    if(features[0].get('features').length === 1) {
                        let iconSrc = require('~/assets/Images/device-red.png');
                        if(features[0].get('features')[0].get('type') === 'WTOE-VE') {
                            iconSrc = require('~/assets/Images/device-1-red.png');
                        }
                        iconStyle = new Style({
                            image : new Icon({
                                anchor : [0.5, 0.5],
                                anchorXUnits : 'pixels',
                                anchorYUnits : 'pixels',
                                src : iconSrc,
                                scale : 0.5,
                                size : [70, 70],
                                imgSize : [70, 70]
                            })
                        })
                        features[0].get('features')[0].set('style', iconStyle);
                    }
                    me.handlerMapFeatureClick(evt, features[0]);
                }
            },
            handlerOverlayClosed() {
                let me = this;
                if(map) {
                    let layers = map.getLayers();
                    let drawLayer = null;
                    layers.forEach((layer) => {
                        if(layer.values_.id === 'device-vector-layer') {
                            drawLayer = layer;
                        }
                    });
                    let source = drawLayer.getSource().getSource();
                    let feature = source.getFeatureById(me.dialogData.id);
                    let iconSrc = require('~/assets/Images/device.png');
                    if(feature.get('type') === 'WTOE-VE') {
                        iconSrc = require('~/assets/Images/device-1.png');
                    }
                    feature.set("style", new Style({
                        image : new Icon({
                            anchor : [0.5, 0.5],
                            anchorXUnits : 'pixels',
                            anchorYUnits : 'pixels',
                            scale : 0.5,
                            src : iconSrc,
                            size : [70, 70],
                            imgSize : [70, 70]
                        })
                    }));
                    me.dialogData = {};
                }
            },
            handlerMapMoveTo(location, done, zoom = false, hasTransform = true) {
                let duration = 2000;
                if(map) {
                    let view = map.getView();
                    let currentZoom = view.getZoom();
                    let parts = 2;
                    let called = false;
                    let callback = (complete) => {
                        --parts;
                        if(called) 
                            return;
                        if(parts === 0 || !complete) {
                            called = true;
                            done(complete)
                        }
                    }
                    let transformLocation = hasTransform ? transform(location, "EPSG:4326", "EPSG:3857") : location;
                    view.animate({ center : transformLocation, duration : 2000 }, (complete) => {
                        if(zoom && complete) {
                            view.animate({ zoom, duration : 1000 }, done || function() {})
                        }
                    });
                    view.animate({ zoom : currentZoom - 1, duration : 2000 / 2 }, callback);
                }
            },
            handlerTreeMenuContext(e, data, node, vnode) {
                let me = this;
                if(me.hasAllowTreeMenuShow) {
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
                if(data) {
                    me.hasAreaDialogShow = true;
                    me.hasAllowTreeMenuShow = false;
                    me.areaDialogModel.areaNo = UUID();
                    me.areaDialogModel.areaParentName = data.name;
                    me.areaDialogModel.areaName = '';
                    me.areaDialogModel.state = 'add';
                    me.areaType = data.type;
                    me.hasOpenTreeMenuContext = false;
                }
            },
            handlerSaveTreeNode() {
                let me = this;
                me.$refs.areaForm.validate((hasChecked) => {
                    if(hasChecked) {
                        let id = me.areaDialogModel.areaNo;
                        let areaName = me.areaDialogModel.areaName;
                        let areaCoordinates = me.areaDialogModel.areaCoordinates;
                        if(me.$refs.tree && me.areaDialogModel.state === 'add') {
                            me.hasAreaDialogShow = false;
                            let data = {
                                id, 
                                name : areaName,
                                leaf : false,
                                type : 'area',
                                total : Math.floor(Math.random() * 100),
                                coordinates : areaCoordinates
                            };
                            me.$refs.tree.append(data, { id : me.treeNodeItem.data.id });
                            me.handlerCancelAreaEdit();
                        } else if(me.$refs.tree && me.areaDialogModel.state === 'modify') {
                            let node = me.$refs.tree.getNode(me.treeNodeItem.data.id);
                            node.data.name = me.areaDialogModel.areaName;
                            node.data.coordinates = me.areaDialogModel.areaCoordinates;
                            me.handlerCancelAreaEdit();
                        }
                    }
                });
            },
            handlerCancelAreaEdit() {
                let me = this;
                me.hasAreaDialogShow = false;
                me.hasAllowTreeMenuShow = true;
                me.areaDialogModel.areaNo = '';
                me.areaDialogModel.areaParentName = '';
                me.areaDialogModel.areaName = '';
                me.areaType = '';
                me.areaDialogModel.areaCoordinates = [];
                me.treeNodeItem = null;
                if(map) {
                    let layers = map.getLayers();
                    let drawLayer = null;
                    layers.forEach((layer) => {
                        if(layer.values_.id === 'draw-vector-layer') {
                            drawLayer = layer;
                        }
                    });
                    let source = drawLayer.getSource();
                    source.clear();
                }
            },
            handlerDrawArea() {
                let me = this;
                if(map && me.areaDialogModel.state === 'add') {
                    interactionDrawFeature(
                        (e) => {
                            let coordinates = e.feature.getGeometry().getCoordinates();
                            me.areaDialogModel.areaCoordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                            me.hasAreaDialogShow = true;
                        },
                        'draw',
                        'Point',
                        null
                    );
                    me.hasAreaDialogShow = false;
                } else if(map && me.areaDialogModel.state === 'modify') {
                    let feature = new Feature();
                    let coordinates = transform(me.areaDialogModel.areaCoordinates, "EPSG:4326", "EPSG:3857");
                    feature.setGeometry(new Point(coordinates));
                    interactionDrawFeature(
                        (e, state) => {
                            if(state === 'ok') {
                                let coordinates = e.features.item(0).getGeometry().getCoordinates();
                                me.areaDialogModel.areaCoordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                                me.hasAreaDialogShow = true;
                            } else if(state === 'cancle') {
                                me.hasAreaDialogShow = true;
                            }
                        },
                        'modify',
                        'Point',
                        [feature]
                    );
                    me.hasAreaDialogShow = false;
                }
            },
            handlerModifyArea(data, vnode) {
                let me = this;
                if(vnode.node.level > 1) {
                    me.hasAreaDialogShow = true;
                    me.hasAllowTreeMenuShow = false;
                    me.areaDialogModel.areaNo = data.id;
                    me.areaDialogModel.areaParentName = vnode.$parent && vnode.$parent.node.data.name;
                    me.areaDialogModel.areaName = data.name;
                    me.areaDialogModel.areaCoordinates = data.coordinates;
                    me.areaDialogModel.state = 'modify';
                }
                me.hasOpenTreeMenuContext = false;
            },
            handlerDropArea(data) {
                let me = this;
                if(me.$refs.tree) {
                    me.$refs.tree.remove(data.id);
                }
                me.hasOpenTreeMenuContext = false;
            },
            handlerOpenDeviceEdit(data) {
                let me = this;
                me.hasDeviceDialogShow = true;
                me.hasAllowTreeMenuShow = false;
                me.hasOpenTreeMenuContext = false;
                me.deviceModel.areaName = data.name;
                me.deviceModel.areaId = data.id;
                me.deviceModel.state = 'add';
                me.deviceModel.name = '';
                me.deviceModel.id = UUID();
                me.deviceModel.deviceIP = '';
                me.deviceModel.coordinates = [];
                me.deviceModel.otherDeviceName = '';
                me.deviceModel.companyName = '';
                me.deviceModel.listenState = '';
                me.deviceModel.port = '';
                me.deviceModel.energyNo = '';
                me.deviceModel.otherDeviceIP = '';
                me.deviceModel.interactionState = '';
                me.deviceModel.checkedSpacing = '';
                me.deviceModel.reStartTotal = '';
            },
            handlerModifyDevice(data, vnode) {
                let me = this;
                if(vnode.node.level > 1) {
                    me.hasDeviceDialogShow = true;
                    me.hasAllowTreeMenuShow = false;
                    me.deviceModel = data;
                    me.deviceModel.state = 'modify';
                }
                me.hasOpenTreeMenuContext = false;
            },
            handlerSaveDevice() {
                let me = this;
                me.$refs.deviceForm.validate((checked) => {
                    if(checked) {
                        if(me.$refs.tree && me.deviceModel.state === 'add') {
                            me.hasDeviceDialogShow = false;
                            let data = { ...me.deviceModel, leaf : true };
                            me.$refs.tree.append(data, { id : me.treeNodeItem.data.id });
                            me.handlerCancelDevice();
                        } else if(me.$refs.tree && me.deviceModel.state === 'modify') {
                            let node = me.$refs.tree.getNode(me.treeNodeItem.data.id);
                            node.data = { ...me.deviceModel, leaf : true };
                            me.handlerCancelDevice();
                        }
                    }
                })
            },
            handlerCancelDevice() {
                let me = this;
                me.hasAllowTreeMenuShow = true;
                me.deviceModel.id = '';
                me.deviceModel.areaId = '';
                me.hasDeviceDialogShow = false;
                me.treeNodeItem = null;
                me.$refs.deviceForm.resetFields();
                me.$refs.deviceForm.clearValidate();
                if(map) {
                    let layers = map.getLayers();
                    let drawLayer = null;
                    layers.forEach((layer) => {
                        if(layer.values_.id === 'draw-vector-layer') {
                            drawLayer = layer;
                        }
                    });
                    let source = drawLayer.getSource();
                    source.clear();
                }
            },
            handlerDrawDevice(data) {
                let me = this;
                if(map &&  me.deviceModel.state === 'add') {
                    interactionDrawFeature(
                        (e) => {
                            let coordinates = e.feature.getGeometry().getCoordinates();
                            me.deviceModel.coordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                            me.hasDeviceDialogShow = true;
                        },
                        'draw',
                        'Point',
                        null
                    );
                    me.hasDeviceDialogShow = false;
                } else if( map && me.deviceModel.state === 'modify') {
                    let feature = new Feature();
                    let coordinates = transform(me.deviceModel.coordinates, "EPSG:4326", "EPSG:3857");
                    feature.setGeometry(new Point(coordinates));
                    interactionDrawFeature(
                        (e, state) => {
                            if(state === 'ok') {
                                let coordinates = e.features.item(0).getGeometry().getCoordinates();
                                me.deviceModel.coordinates = transform(coordinates, "EPSG:3857", "EPSG:4326");
                                me.hasDeviceDialogShow = true;
                            } else if(state === 'cancle') {
                                me.hasDeviceDialogShow = true;
                            }
                        },
                        'modify',
                        'Point',
                        [feature]
                    );
                    me.hasDeviceDialogShow = false;
                }
            },
            handlerDevictTypeChange(val) {
                let me = this;
                let areaName = me.deviceModel.areaName;
                let areaId = me.deviceModel.areaId;
                me.$refs.deviceForm.resetFields();
                me.deviceModel.type = val;
                me.deviceModel.areaName = areaName;
                me.deviceModel.areaId = areaId;
            },
            handlerDropDevice(data) {
                let me = this;
                if(me.$refs.tree) {
                    me.$refs.tree.remove(data.id);
                }
                me.hasOpenTreeMenuContext = false;
            }
        },
        mounted() {
            let me = this;
            let controls = defaultControls({ zoom : false }).extend([
                new ButtonGroupComponent({
                    buttons : [
                        new ImportActionButton({ text : "导入", target : this.$refs.map, click : () => {
                            me.$prompt("测试消息框", "提示", { customClass : 'smart-box smart-box-message', confirmButtonClass : 'el-button--success', cancelButtonClass : 'el-button--warning' });
                        } }),
                        new ExportActionButton({ text : "导出", target : this.$refs.map }),
                        new ListActionButton({ text : "列表", target : this.$refs.map, click : () => {
                                me.$router.push({ name : 'deviceTable'});
                            }
                        })
                    ]
                })
            ]);
            map = new Map({
                controls,
                view : new View({
                    center : [12720076.969506893, 3577654.2181447456],
                    maxZoom : 19,
                    minZoom : 5,
                    zoom: 7,
                    projection : "EPSG:3857",
                    rotation : 0
                }),
                layers : [
                    new TileLayer({
                        id : 'smart-box',
                        source : new XYZ({
                            // url : "http://192.168.3.127:9000/maptile/{z}/{y}/{x}.png",
                            url : "https://api.mapbox.com/styles/v1/1172559463/cjw8vwd1d0jp21co9v71pa8t9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiMTE3MjU1OTQ2MyIsImEiOiJjanJnNHUycnoxa2NuNGFwc2tlcWx2dTRvIn0.slmf56zGSbJt0OrDbIGsGA",
                            wrapX : false,
                            extent : transform([ 53.744941229725,  4.734322698282, 73.604077560999, 135.127515060983 ], "EPSG:4326", "EPSG:3857"),
                            tileSize : [256, 256],
                            projection : "EPSG:3857"
                        })
                    }),
                    new VectorLayer({ 
                        id : 'device-vector-layer', 
                        style : (feature) => {
                            if(feature.get("style")) {
                                return feature.get("style");
                            }
                            var size = feature.get('features').length;
                            if(size === 1) {
                                return feature.get("features")[0].get("style") || new Style({
                                    image : new Icon({
                                        anchor : [0.5, 0.5],
                                        anchorXUnits : 'pixels',
                                        anchorYUnits : 'pixels',
                                        scale : 0.5,
                                        src : require('~/assets/Images/device.png'),
                                        size : [70, 70],
                                        imgSize : [70, 70]
                                    })
                                });
                            }
                            return new Style({
                                image: new Icon({
                                    anchor : [0.5, 0.5],
                                    anchorXUnits : 'pixels',
                                    anchorYUnits : 'pixels',
                                    src : require('~/assets/Images/circle.png'),
                                    size : [70, 70],
                                    imgSize : [70, 70]
                                }),
                                text: new Text({
                                    text: size.toString(),
                                    textAlign : "center",
                                    placement : "point",
                                    offsetX : 35,
                                    offsetY : 35,
                                    fill: new Fill({
                                        color: '#fff'
                                    })
                                })
                            });
                        },
                        source : new Cluster({
                            distance : 70,
                            source : new VectorSource({
                                wrapX : false,
                                features : []
                            })
                        })
                    }),
                    new VectorLayer({
                        id : 'draw-vector-layer',
                        source : new VectorSource({
                            wrapX : false
                        })
                    })
                ],
                target : this.$refs.map
            });
            map.addInteraction(me.dragRotateAndZoom);
            map.on('pointermove', function(evt) {
                map.getTargetElement().style.cursor =
                    map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
            });
            map.on("click", me.handlerMapFeatureActive)
        },
        beforeDestory() {
            map = null;
        }
    }
 })()