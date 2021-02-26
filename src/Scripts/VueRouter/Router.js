/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 动态路由生成打包器
 */
import "babel-polyfill";

export default class  Router{

    constructor({name = "", path = "/", redirect = undefined, alias = undefined, props = null, beforeEnter = void 0, components = [], children = [], meta = {}}){
        this.$name = name;
        this.$path = path;
        this.$redirect = redirect;
        this.$alias = alias;
        this.$props = props;
        this.$beforeEnter = beforeEnter;
        this.components = this.$components = components;
        this.children = this.$children = children;
        this.meta = this.$meta = meta;
    }

    set name(val){
        if(typeof val !== "string"){
            throw new Error("参数name类型不是预定义String类型！");
        }
        this.$name = val;
    }
    get name(){
        return this.$name;
    }

    set path(val){
        if(typeof val !== "string"){
            throw new Error("参数path类型不是预定义String类型！");
        }
        this.$path = val;
    }
    get path(){
        return this.$path;
    }

    set redirect(val){
        if(typeof val !== "string"){
            throw new Error("参数redirect类型不是预定义String类型！");
        }
        this.$redirect = val;
    }

    get redirect(){
        return this.$redirect;
    }

    set alias(val){
        if(typeof val !== "string"){
            throw new Error("参数redirect类型不是预定义String类型！");
        }
        this.$alias = val;
    }

    get alias(){
        return this.$alias;
    }

    set props(val) {
        if(typeof val !== "boolean" && typeof val !== "object" && typeof val !== "function") {
            throw new Error("参数props 类型不是预定义合法类型!")
        }
        this.$props = val;
    }

    get props() {
        return this.$props;
    }

    get meta(){
        return this.$meta;
    }

    set meta(val){
        if(typeof val !== "object"){
            throw  new Error("参数meta类型不是预定义Object类型！");
        }
        this.$meta = val;
    }

    set components(val){
        if((!(val instanceof Array)) && typeof val !== "object"){
            throw new Error("参数componets类型不是预定义require.ensure Array类型！");
        }
        this.$components = val instanceof Array ? [...val] : [val];
    }

    get components(){
        let me = this;
        let dynamicComponent = me.$components.length ? [] : undefined;
        me.$components && me.$components.forEach(it => {
            dynamicComponent[it.view_name || "default"] = it.graph;
        })
        return dynamicComponent;
    }

    set children(val){
        if(!(val instanceof Array)){
            throw new Error("参数componet类型不是预定义Router Array类型！");
        }
        this.$children = val;
    }

    get children(){
        return this.$children.length ? this.$children : undefined;
    }

    set beforeEnter(fn) {
        if(!(typeof fn === "function")) {
            throw new Error("参数beforeEnter不是预定义Function类型！");
        }
        this.$beforeEnter = fn;
    }

    get beforeEnter() {
        return this.$beforeEnter || void 0;
    }

    *[Symbol.iterator](){
        for(let child of this.$children)
            yield child;
    }

    hasChildrenRouter(){
        return this.children.length > 0;
    }

}
