/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 页面路径配置写在此处即可
 */
import Keys from '~/Scripts/Util/Keys-SHA-ES6'
import RESTFUL from '~/Scripts/Util/RestfulApi'

export default class RouterConfig {

    static getRouter(store) {
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
                graph : r =>{ require.ensure([], () => { r(require("~/View/Home/SignIn.vue")) }, "home/signle") }
            }
        },
        {
            name : "auth",
            path : "/auth/:username/:password",
            beforeEnter : (to, from, next) => {
                let username = to.params.username;
                let password = to.params.password;
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = (res) => {
                    if( xhr.readyState === 4 && xhr.status === 200) {
                        let data = JSON.parse(xhr.response);
                        if(data.success) {
                            let keys = new Keys();
                            let hashKey = keys.getKeySHA();
                            store.dispatch("User/login", {
                                id: 1,
                                name: username,
                                username: username,
                                password: keys.parse({ str :password, key : hashKey }),
                                token: data.model && data.model.token || "",
                                key : hashKey,
                                record : false,
                                role: {
                                    id : data.model && data.model.roleNo || "",
                                    roleName : data.model && data.model.roleName || ""
                                },
                                mobile: data.model && data.model.mobile || ""
                            });
                            let element = document.documentElement;
                            if (element.requestFullscreen) {
                                element.requestFullscreen();
                            } else if (element.webkitRequestFullScreen) {
                                element.webkitRequestFullScreen();
                            } else if (element.mozRequestFullScreen) {
                                element.mozRequestFullScreen();
                            } else if (element.msRequestFullscreen) {
                                element.msRequestFullscreen();
                            }
                            next({ name : "sys" })
                        } else {
                            next({ name : "login" })
                        }
                    }
                }
                xhr.open("POST", RESTFUL.injective.Api.User.Auth);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onerror = () => next({ name: "login" });
                xhr.send("{ \"u\": \""+ username +"\", \"up\": \""+ password +"\" }", false);
            }
        },
        {
            name : 'home',
            path : '/home',
            components : {
                graph : r =>{ require.ensure([], () => { r(require("~/View/Home/Home.vue")) }, "home/home") }
            },
            children : [
                {
                    name : 'sys',
                    path : 'sys',
                    components : [{
                        graph : r => { require.ensure([], () => { r(require("~/View/Sys/Index.vue")) }, "sys/index") }
                    }],
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'trafficConfig',
                    path : 'trafficConfig',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Sys/TrafficConfig.vue")) }, "sys/trafficConfig") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'lightConfig',
                    path : 'lightConfig',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Sys/LightConfig.vue")) }, "sys/lightConfig") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'warnConfig',
                    path : 'warnConfig',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Sys/WarnConfig.vue")) }, "sys/warnConfig") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'users',
                    path : 'users',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Sys/Users.vue")) }, "sys/users") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'log',
                    path : 'log',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Sys/Log.vue")) }, "sys/log") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'deviceTable',
                    path : 'deviceTable/:deviceTypeParam?',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Map/DeviceTable.vue")) }, "map/deviceTable") }
                    },
                    meta : {
                        requiredAuth : true
                    },
                    props : {
                        default : true
                    }

                },
                {
                    name : 'message',
                    path : 'message/:id?',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Waring/Index.vue")) }, 'waring/index') }
                    },
                    meta : {
                        requiredAuth : true
                    },
                    props : {
                        default : true
                    }
                },
                // {
                //     name : 'proxy_page',
                //     path : 'box/porxy',
                //     components : {
                //         graph : r => { require.ensure([], () => { r(require("~/View/Box/ProxyPage.vue")) }, 'box/proxy')}
                //     },
                //     meta : {
                //         requiredAuth : true
                //     }
                // },
                {
                    name : 'box',
                    path : 'box',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Box/Index.vue")) }, 'box/index') }
                    },
                    children : [
                        {
                            name : 'case',
                            path : 'case/:id?',
                            components : {
                                graph : r => { require.ensure([], () => { r(require("~/View/Box/Box.vue")) }, 'box/case') }
                            },
                            meta : {
                                requiredAuth : true
                            },
                            props : {
                                default : true
                            }
                        },
                        {
                            name : 'pe',
                            path : 'pe/:id?',
                            components : {
                                graph : r => { require.ensure([], () => { r(require("~/View/Box/pe.vue")) }, 'box/pe') }
                            },
                            meta : {
                                requiredAuth : true
                            },
                            props : {
                                default : true
                            }
                        },
                        {
                            name : 'traffic',
                            path : 'traffic/:id?',
                            components : {
                                graph : r => { require.ensure([], () => { r(require("~/View/Box/Traffic.vue")) }, "box/traffic")}
                            },
                            meta : {
                                requiredAuth : true
                            },
                            props : {
                                default : true
                            }
                        }
                    ]
                },
                {
                    name : 'map',
                    path : 'map',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Map/Index.vue")) }, "map/index") }
                    },
                    meta : {
                        requiredAuth : true
                    }
                },
                {
                    name : 'messageDetail',
                    path : 'messageDetail/:id',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Waring/WaringDetail.vue")) }, "waring/waringDetail") }
                    },
                    meta : {
                        requiredAuth : true
                    },
                    props : {
                        default : true
                    }
                },
                {
                    name : 'waringView',
                    path : 'waringView',
                    components : {
                        graph : r => { require.ensure([], () => { r(require("~/View/Waring/WaringStatistics.vue")) }, "waring/waringStatistics") }
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
