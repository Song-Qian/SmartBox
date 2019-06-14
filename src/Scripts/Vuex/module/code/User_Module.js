/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 示例 User状态模块
 */
export default {
    User() {
        return {
            namespaced: true,
            state() {
                return {
                    id: '',
                    name: '',
                    username: '',
                    mobile: 0,
                    role: 0,
                    roleName: '',
                    password: '',
                    token: ''
                }
            },
            getters: {
                getToken(state, getters, rootState, rootGetters) {
                    return state.token;
                },
                getName(state, getters, rootState, rootGetters) {
                    return state.name;
                },
                getUsername(state, getters, rootState, rootGetters) {
                    return state.username;
                },
                getMobile(state, getters, rootState, rootGetters) {
                    return state.mobile;
                },
                getRoleName(state, getters, rootState, rootGetters) {
                    return state.roleName;
                },
                getPassword(state, getters, rootState, rootGetters) {
                    return state.password;
                },
                getUserId(state, getters, rootState, rootGetters) {
                    return state.id;
                }
            },
            mutations: {
                setUser(state, user) {
                    console.log("*************捕获User/setUser事件*************");
                    state.id = user.id;
                    state.name = user.name;
                    state.username = user.username;
                    state.mobile = user.mobile;
                    state.password = user.password;
                    state.role = user.role;
                    if (user.role == 3) {
                        state.roleName = '超级管理员'
                    } else if (user.role == 2) {
                        state.roleName = '管理员'
                    } else if(user.role == 1) {
                        state.roleName = '操作员'
                    }
                    console.info(state.password)
                    state.token = user.token;
                    sessionStorage.setItem('id', user.id);
                    sessionStorage.setItem('name', user.name);
                    sessionStorage.setItem('username', user.username);
                    sessionStorage.setItem('mobile', user.mobile);
                    sessionStorage.setItem('role', user.role);
                    sessionStorage.setItem('roleName', user.roleName);
                    sessionStorage.setItem('password', user.password);
                    sessionStorage.setItem('token', user.token);
                },
                delUser(state) {
                    console.log("*************捕获User/退出事件*************");
                    state.id = '';
                    state.name = '';
                    state.username = '';
                    state.password = '';
                    state.token = '';
                    sessionStorage.setItem('id', '');
                    sessionStorage.setItem('name', '');
                    sessionStorage.setItem('username', '');
                    sessionStorage.setItem('password', '');
                    sessionStorage.setItem('token', '');
                    sessionStorage.setItem('mobile', '');
                    sessionStorage.setItem('role', '');
                    sessionStorage.setItem('roleName', '');
                },

            },
            actions: {
                login({dispatch, commit, getters, rootGetters, rootState}, user) {
                    console.log("子模块状态树中提交登陆动作：", user);
                    console.log("***************开始设置用户信息***************");
                    commit("setUser", user);
                    console.log("***********捕获User/setUser事件结束***********");
                },
                getUserToken({dispatch, commit, getters, rootGetters, rootState}) {
                    return getters.getToken;
                },
                out({dispatch, commit, getters, rootGetters, rootState}) {
                    commit('delUser');
                },
                getId({dispatch, commit, getters, rootGetters, rootState}) {
                    return getters.getUserId;
                },
                hasLogin({dispatch, commit, getters, rootGetters, rootState}) {
                    let user = {
                        id: sessionStorage.getItem("id"),
                        name: sessionStorage.getItem("name"),
                        username: sessionStorage.getItem("username"),
                        password: sessionStorage.getItem("password"),
                        token: sessionStorage.getItem("token"),
                        mobile: sessionStorage.getItem("mobile"),
                        role: sessionStorage.getItem("role"),
                    };
                    commit("setUser", user);
                    return user.token;
                }
            }
        }
    }
}