/**
 *  Developer   : SongQian
 *  Time        : 2019/06/04
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 警告
 */
export default {
    Warning() {
        return {
            namespaced: true,
            state() {
                return {
                    entity : { 
                        name : '',
                        devieTypeTable : '',
                        type : '', 
                        time : '',
                        dealMan : '', 
                        state : '',
                        dealTime : ''  
                    }
                }
            },
            getters: {
                getEntity(state, getters, rootState, rootGetters) {
                    if(state.entity.name && state.devieTypeTable && state.type && state.time && state.dealTime && state.dealMan) {
                        return state;
                    }
                    return  { 
                        name : sessionStorage.getItem('name'),
                        devieTypeTable : sessionStorage.getItem('devieTypeTable'),
                        type : sessionStorage.getItem('type'),
                        time : sessionStorage.getItem('time'),
                        state : sessionStorage.getItem('state'),
                        dealTime : sessionStorage.getItem('dealTime'),
                        dealMan : sessionStorage.getItem('dealMan')
                    }
                }
            },
            mutations: {
                setDetail(state, warn) {
                    if(warn) {
                        state.entity = warn;
                        sessionStorage.setItem('name', warn.name);
                        sessionStorage.setItem('devieTypeTable',  warn.devieTypeTable);
                        sessionStorage.setItem('type',  warn.type);
                        sessionStorage.setItem('time',  warn.time);
                        sessionStorage.setItem('state',  warn.state);
                        sessionStorage.setItem('dealTime',  warn.dealTime);
                        sessionStorage.setItem('dealMan',  warn.dealMan);
                    }
                }
            },
            actions: {
                save({dispatch, commit, getters, rootGetters, rootState}, warn) {
                    commit("setDetail", warn);
                }
            }
        }
    }
}