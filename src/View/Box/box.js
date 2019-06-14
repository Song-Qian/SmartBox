/**
 * Developer    :   SongQian
 * Time         :   2019-06-04
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   智能机箱页面代码
 */

//  import { 
//     Scene, 
//     PerspectiveCamera, 
//     WebGLRenderer, 
//     PlaneGeometry,
//     MeshBasicMaterial,
//     Mesh,
//     Group
// } from 'three'

export default (function(){
    return {
        name : 'Box',
        data() {
            return {
                videos : {
                    1 : {
                        trigger : false,
                        video : []
                    },
                    2 : {
                        trigger : false,
                        video : []
                    },
                    3 : {
                        trigger : false,
                        video : []
                    },
                    4 : {
                        trigger : false,
                        video : []
                    },
                    5 : {
                        trigger : false,
                        video : []
                    },
                    6 : {
                        trigger : false,
                        video : []
                    },
                    7 : {
                        trigger : false,
                        video : []
                    },
                    8 : {
                        trigger : false,
                        video : []
                    }
                },
                treeProps : {
                    label : 'name',
                    children : 'children',
                    isLeaf : 'lefa'
                },
                treeNodeItem : null,
                deviceType : 'WTOE-VN',
                hasOpenTreeMenuContext : false,
                hasExpandDevice : false,
                boxState : {
                    boxDoor : true,
                    boxDefense : false,
                    boxSwitch : true,
                    boxTilt : false
                },
                deviceInfoDailog : {
                    Isshow : false,
                    automatic : {
                        overValue : '',
                        underValue : '',
                        leakValue : '',
                        controlValue : ''
                    },
                    deviceTilt : {
                        frontValue : '',
                        afterValue : '',
                        leftValue : '',
                        rightValue : '',
                        upValue : '',
                        downValue : ''
                    }
                },
                tabName : 'first',
                portFlowDialog : {
                    Isshow : false,
                    status : '打开',
                    intervalTime : '',
                    packetRate : '',
                    delayedTime : ''
                },
                deviceControlDailog : {
                    Isshow : false,
                    fanControl : {
                        nowTemperature : '44.93',
                        controlModel : '',
                        control : '打开'
                    },
                    heaterControl : {
                        nowTemperature : '41.56',
                        controlModel : '温度控制',
                        heaterValue : ''
                    }
                }
            }
        },
        computed : {
            getTreeData() {
                return [
                    { name : '一城区道路', children : [
                    { name :  '阳春大街', lefa : false, data : Math.floor(Math.random() * 100) },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  },
                    { name :  '王府大道', lefa : false, data : Math.floor(Math.random() * 100)  }
                    ] }
                ]
            }
        },
        methods : {
            renderTreeNode(h, { node, data, store }) {
                if(node.level === 1) {
                    return h("span", `${node.label}`);
                }
                return h("span", `${node.label} (${data.data})`);
            },
            initDeviceBox() {
                let me = this;
                let scene = new Scene();
                let ratio = me.$refs.device_container.clientWidth / me.$refs.device_container.clientHeight;
                let camera = new PerspectiveCamera( 75, ratio, 0.1, 100 );
                let renderer = new WebGLRenderer({ alpha : true, antialias : true });
                renderer.setSize(me.$refs.device_container.clientWidth - 20, me.$refs.device_container.clientHeight - 20);
                me.$refs.device_container.appendChild( renderer.domElement );
                let box_roof_tile_1 = new PlaneGeometry(80, 20);
                let material = new MeshBasicMaterial({ color: 0xffff00, side });
                let cube = new Mesh( geometry, material );
                let box_Group = new Group();
                scene.add( cube );
                camera.position.z = 100;
                // renderer.render( scene, camera );
                let animate = function () {
                    requestAnimationFrame( animate );
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                    renderer.render( scene, camera );
                };
                animate();
            }
        },
        mounted() {
            // this.initDeviceBox();
        }
    }
})()