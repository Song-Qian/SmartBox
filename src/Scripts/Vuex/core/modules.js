/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 全局模块化状态器，自动加载各开发人员的模块状态。禁止对此类进行非框架性需求修改。
 */
import * as namespaces from '../module/module_namespace';
import * as  packages from '../module/module_imports';

export default class  modules{

    constructor() {
        this.modules = {};
        this.namespances = namespaces;
        this.packages = packages;
        this.init();
    }

    init(){
        for(let namespace in this.namespances){
            this.modules[this.namespances[namespace]] = this.modules[this.namespances[namespace]] || {};
            Object.assign(this.modules[this.namespances[namespace]], this.packages[namespace][this.namespances[namespace]]());
        }
    }

    getModules(){
        return { modules :  this.modules };
    }

}