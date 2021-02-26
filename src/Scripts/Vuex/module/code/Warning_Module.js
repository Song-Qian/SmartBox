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
                        alarmDes : '', 
                        alarmName : '', 
                        alarmTime : '', 
                        alarmType : '', 
                        dealTime : '', 
                        devId : '', 
                        devName : '', 
                        devTypeName : '', 
                        id : '', 
                        isDeal : '', 
                        netPort : '', 
                        outdevId : '', 
                        powerPort : '', 
                        userName : '' 
                    }
                }
            },
            getters: {
                getEntity(state, getters, rootState, rootGetters) {
                    // state.entity = { 
                    //     alarmDesc : sessionStorage.getItem('alarmDesc'),
                    //     alarmName : sessionStorage.getItem('alarmName'),
                    //     alarmTime : sessionStorage.getItem('alarmTime'),
                    //     alarmType : sessionStorage.getItem('alarmType'),
                    //     dealTime : sessionStorage.getItem('dealTime'),
                    //     devId : sessionStorage.getItem('devId'),
                    //     devName : sessionStorage.getItem('devName'),
                    //     devTypeName : sessionStorage.getItem('devTypeName'),
                    //     id : sessionStorage.getItem('id'),
                    //     isDeal : sessionStorage.getItem('isDeal'),
                    //     netPort : sessionStorage.getItem('netPort'),
                    //     outdevId : sessionStorage.getItem('outdevId'),
                    //     powerPort : sessionStorage.getItem('powerPort'),
                    //     userName : sessionStorage.getItem('userName')
                    // };
                    return state.entity;
                 }
            },
            mutations: {
                setDetail(state, { alarmDesc, alarmName, alarmTime, alarmType, dealTime, devId, devName, devTypeName, id, isDeal, netPort, outdevId, powerPort, userName }) {
                    
                        state.entity = { alarmDesc, alarmName, alarmTime, alarmType, dealTime, devId, devName, devTypeName, id, isDeal, netPort, outdevId, powerPort, userName };
                        sessionStorage.setItem('alarmDesc', alarmDesc);
                        sessionStorage.setItem('alarmName', alarmName);
                        sessionStorage.setItem('alarmTime', alarmTime);
                        sessionStorage.setItem('alarmType', alarmType);
                        sessionStorage.setItem('dealTime', dealTime);
                        sessionStorage.setItem('devId', devId);
                        sessionStorage.setItem('devName', devName);
                        sessionStorage.setItem('devTypeName', devTypeName);
                        sessionStorage.setItem('id', id);
                        sessionStorage.setItem('isDeal', isDeal);
                        sessionStorage.setItem('netPort', netPort);
                        sessionStorage.setItem('outdevId', outdevId);
                        sessionStorage.setItem('powerPort', powerPort);
                        sessionStorage.setItem('userName', userName);   
                }
            },
            actions: {
                save({dispatch, commit, getters, rootGetters, rootState}, warn) {
                    let entity = warn;
                    if(!warn) {
                        entity = { 
                            alarmDesc : sessionStorage.getItem('alarmDesc'),
                            alarmName : sessionStorage.getItem('alarmName'),
                            alarmTime : sessionStorage.getItem('alarmTime'),
                            alarmType : sessionStorage.getItem('alarmType'),
                            dealTime : sessionStorage.getItem('dealTime'),
                            devId : sessionStorage.getItem('devId'),
                            devName : sessionStorage.getItem('devName'),
                            devTypeName : sessionStorage.getItem('devTypeName'),
                            id : sessionStorage.getItem('id'),
                            isDeal : sessionStorage.getItem('isDeal'),
                            netPort : sessionStorage.getItem('netPort'),
                            outdevId : sessionStorage.getItem('outdevId'),
                            powerPort : sessionStorage.getItem('powerPort'),
                            userName : sessionStorage.getItem('userName')
                        };
                    }
                    commit("setDetail", entity);
                }
            }
        }
    }
}