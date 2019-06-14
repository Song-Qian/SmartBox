/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 所有的全局状态属性存储器
 */
import Vue from 'vue';
import Vuex from 'vuex';
import stateGlobal from './core/state';
import gettersGlobal from './core/getters';
import mutationsGlobal from './core/mutations';
import actionsGlobal from './core/actions';
import modulesGlobal from './core/modules';

export default class Store {

    constructor() {
        Vue.use(Vuex);
        let global = {};
        let modules = new modulesGlobal();
        //在生产环境开启vuex Store严格模式，控制开发人员的代码质量。
        //global = { ...stateGlobal, ...gettersGlobal, ...mutationsGlobal, ...actionsGlobal, ...modules.getModules(), strict : process.env.NODE_ENV !== "production" }
        Object.assign(global, stateGlobal, gettersGlobal, mutationsGlobal, actionsGlobal, modules.getModules(), { strict : process.env.NODE_ENV !== "production" });
        this.store = new Vuex.Store(global);
    }

    startHot(){
        
    }

}