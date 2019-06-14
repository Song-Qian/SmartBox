/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 页面路径配置写在此处即可
 */
export default class RouterConfig {

    static getRouter(){
        let routers = [{
            name : "SmartBox",
            path : "/",
            redirect : {
                name: "login"
            }
        },
        {
            name : 'login',
            path : '/login',
            components : {
                graph : r =>{ require.ensure([], () => { r(require("../../View/Home/Login.vue")) }, "home/login") }
            }
        },
        {
            name : 'home',
            path : '/home',
            components : {
                graph : r =>{ require.ensure([], () => { r(require("../../View/Home/Home.vue")) }, "home/home") }
            },
            children : [
                {
                    name : 'sys',
                    path : 'sys',
                    components : [{
                        graph : r => { require.ensure([], () => { r(require("../../View/Sys/Index.vue")) }, "sys/index") }
                    }],
                    meta : {
                        requiredAuth : true
                    }
                },
                {

                    name : 'box',
                    path : 'box',
                    components : [{
                        graph : r => { require.ensure([], () => { r(require("../../View/Box/Box.vue")) }, "box/box") }
                    }],
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'users',
                    path : 'users',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("../../View/Sys/Users.vue")) }, "sys/users") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'deviceTable',
                    path : 'deviceTable',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("../../View/Map/DeviceTable.vue")) }, "map/deviceTable") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'message',
                    path : 'message',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("../../View/Waring/Index.vue")) }, 'waring/index') }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'box',
                    path : 'box',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("../../View/Box/Box.vue")) }, 'box/index') }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'map',
                    path : 'map',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("../../View/Map/Index.vue")) }, "map/index") }
                    },
                    meta : {
                        requiredAuth : true
                    }

                },
                {
                    name : 'messageDetail',
                    path : 'messageDetail',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("../../View/Waring/WaringDetail.vue")) }, "waring/waringDetail") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                    // props : {
                    //     default : function(route){
                    //         let detail = route.params;
                    //         return detail;
                    //     }
                    // }
                },
                {
                    name : 'waringView',
                    path : 'waringView',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("../../View/Waring/WaringStatistics.vue")) }, "waring/waringStatistics") }
                    },
                    meta : {
                        requiredAuth : true
                    }

                }
            ]
        },
        {
            name : "unkown",
            path: "*",
            redirect: { name : "SmartBox" }
        }];
        return routers;
    }

}
