/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 项目环境入口
 */

//基础环境文件包导入
import Vue from 'vue'
import VueGlobal from '~/Scripts/VueRouter/RouterGlobal'
import VueStore from '~/Scripts/Vuex/Store'
import ElementUI from 'element-ui'
import SmartBoxUI from '~/Scripts/Share/SmartBoxPlugins'

//项目依赖css文件包导入
import '~/Css/animate.css'
import '~/Css/font-awesome.css'
import '~/assets/skin/desktop-default.scss'
import 'element-ui/lib/theme-chalk/index.css'
import 'ol/ol.css'
//入口文件
import App from '~/App';

class Main{
    constructor(){
        let me = this;
        Vue.config.debug = true;
        Vue.config.errorHandler = me.errorHandler;
        Vue.use(ElementUI);
        Vue.use(SmartBoxUI);
        let store = new VueStore().store;
        let router = new VueGlobal({ store });
        let main_vm = new Vue({
            el : '#app',
            store,
            router : router.start(),
            computed : {
                DynamicComponetView(){
                    return App;
                }
            },
            render(h){
                return h(this.DynamicComponetView);
            }
        });
    }

    errorHandler(e) {
        console.clear();
        console.group("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.warn("系统全局捕获异常，请及时处理。")
        console.error(e);
        console.groupEnd("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }
}

new Main();