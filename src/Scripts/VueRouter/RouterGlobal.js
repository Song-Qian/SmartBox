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

export default class  RouterGlobal{

    constructor({router = [], routerConfig = RouterConfig, store = null}){
        Vue.use(VueRouter);
        Vue.use(VueResource);
        this.Router = router;
        this.RouterConfig = routerConfig;
        this.$router = null;
        this.$store = store;
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
        let routers = this.RouterConfig.getRouter();
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

    listenersRouter(to, from, next){
        if(to.meta.requiredAuth){
            this.$store.dispatch('User/hasLogin').then(token => {
                if(!token)
                    next({name : 'login', query: { redirect: to.fullPath }});
                else
                    next();
            }).catch(err => {
                next({name : 'home', query: { redirect: to.fullPath }});
            });
        }else{
            next();
        }
    }

    registerSafetyAjax(){
        Vue.http.interceptors.push((request, next) => {
            // this.$store.dispatch('getUserToken').then(token => {
            //     request.headers.set("Status-Tool-Auth_Token",token);
            //     next((response) => {
            //         if(response.body.rel == "2001"){
            //                 $("#modal-login").modal({backdrop:"static"})
            //         }else{
            //              return response;
            //          }
            //     })
            // }).catch(err => {
            //     next((response) => {
            //         response.body = { success : "fail", message : "store中发生未知脚本错误，本次请求放弃有效数据。", err };
            //         response.status = 201;
            //         return false;
            //     });
            // });
            next()
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