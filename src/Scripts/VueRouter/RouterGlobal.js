/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 全局路由动态加载入口
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Router from './Router'
import RouterConfig from './RouterConfig'

export default class RouterGlobal {

    constructor({ router = [], routerConfig = RouterConfig, store = null }){
        Vue.use(VueRouter);
        Vue.use(VueResource);
        this.Router = router;
        this.RouterConfig = routerConfig;
        this.$router = null;
        this.$store = store;
        this.$requsets = [];
    }

    addRouter(router) {
        if (router && router instanceof Router && this.$router) {
            this.Router = [...this.Router, router];
            this.$router.addRoutes(router);
        }
    }

    renderRouter(){
        if(!this.RouterConfig || !this.RouterConfig instanceof RouterConfig)
            throw new Error("动态渲染路由时，发现routerConfig不是预定义的RouterConfig类型");
        let routers = this.RouterConfig.getRouter(this.$store);
        let renderRouter = it => {
            let router = it.children && it.children.length ? it.children.map(renderRouter) : [it];
            if([...router].length === 1 && !([...router][0] instanceof Router)){
                return new Router([...router][0]);
            }
            it.children = [...router];
            return new Router(it);
        }
        return [...routers.map(renderRouter)];
    }

    async listenersRouter(to, from, next){
        if(to.meta.requiredAuth) {
            try {
                let token = await this.$store.dispatch('User/hasLogin');
                if(!token)
                    next({name : 'login', query: { redirect: to.fullPath }});
                else
                    next();
            } catch(e) {
                console.error(e);
                next({name : 'home', query: { redirect: to.fullPath }});
            }
        } else {
            next();
        }
    }

    annulmentAjax(request) {
        let i = this.$requsets.indexOf(request);
        let o = this.$requsets.splice(i, 1)[0];
        if(o && this.$router.history.current.fullPath != o.headers.get("target") && o.abort) {
            o.abort();
        }
    }

    registerSafetyAjax(){
        Vue.http.interceptors.push((request, next) => {
            let token = this.$store.getters['User/getToken'];
            if(token) {
                request.headers.set("SmartBox-Auth-Token",token);
                request.headers.set("target", this.$router.history.current.fullPath);
                request.before = this.annulmentAjax.bind(this);
                this.$requsets.push(request);
                next((response) => {
                    if(response.body && ["GM100000", "GM400003"].indexOf(response.body.errorCode) > -1) {
                        this.$router.push({ name : 'login' })
                        return false;
                    }
                })
            } else {
                this.$router.push({ name : 'login' })
            }
        })
    }

    start(){
        let routes = this.renderRouter();
        this.Router = routes;
        this.$router = new VueRouter({ mode: 'history', routes });
        this.$router.beforeEach((to, form, next) => {
            this.listenersRouter.apply(this, [to, form, next]);
        });
        this.registerSafetyAjax();
        return this.$router;
    }

    stop(){

    }
}