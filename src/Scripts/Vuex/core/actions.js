/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 全局动作函数写入此处,大家共同维护，此处禁止放入非全局状态
 */
const Actions = {
    actions : {
        changeSys({ commit, dispatch, state, getters }, sys) {
            commit("trigger", sys);
        },
        changeNode({ commit, dispatch, state, getters}, node) {
            if(node) {
                commit("changeNode", node);
            } else {
                commit("clearNode");
            }
        }
        // getUser({ commit, dispatch, state, getters}){
        //     commit("getUser");
        //     return getters.getUserName
        // },
        // getUserToken({ commit, dispatch, state, getters}){
        //     commit('getUser');
        //     return getters.getUserToken;
        // },
        // setUser({commit, dispatch, state, getters}, user){
        //     commit('addUser', user);
        // },
        // delUser({commit, dispatch, state, getters}){
        //   commit('delUser');
        // }
    }
}

export default Actions;
