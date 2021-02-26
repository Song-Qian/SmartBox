/**
 *  Developer   : SongQian
 *  Time        : 2019/07/26
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 智能机箱组件交互状态
 */
export default {
    Equipment() {
        return {
            namespaced: true,
            state() {
                return {
                    loaded : false
                }
            },
            getters: {
                getLoadState(state, getters, rootState, rootGetters) {
                    return state.loaded;
                }
            },
            mutations: {
                setLoaded(state, loaded) {
                    state.loaded = loaded;
                }
            },
            actions: {
                changeLoadState({ dispatch, commit, getters, rootGetters, rootState }, loaded) {
                    commit('setLoaded', loaded);
                }
            }
        }
    }
}