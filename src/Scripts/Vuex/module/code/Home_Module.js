/**
 *  Developer   : SongQian
 *  Time        : 2019/07/26
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 系统配置参数。
 */
export default {
    Home() {
        return {
            namespaced: true,
            state() {
                return {
                    hasSystemDialogShow : false
                }
            },
            getters: {
                getSysParamsDialogStatus(state, getters, rootState, rootGetters) {
                    return state.hasSystemDialogShow;
                }
            },
            mutations: {
                showSysParamsDialog(state) {
                    if(!state.hasSystemDialogShow)
                        state.hasSystemDialogShow = true;
                },
                hideSysParamsDialog(state) {
                    if(state.hasSystemDialogShow)
                        state.hasSystemDialogShow = false;
                }
            },
            actions: {
                triggerSysParamsDialog({ dispatch, commit, getters, rootGetters, rootState }, isShow) {

                    if(isShow) 
                        commit('showSysParamsDialog')
                    else
                        commit('hideSysParamsDialog')
                }
            }
        }
    }
}