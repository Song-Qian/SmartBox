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
                    key : '', //后端是明文存储密码，前端尽可能的保证敏感信息，添加密钥，尽可能加大破解可能性！但登陆ajax处是破解bug。
                    role: {
                        id : '',
                        roleName : ''
                    },
                    password: '',
                    token: '',
                    record :  false
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
                getKey(state, getters, rootState, rootGetters) {
                    return state.key;
                },
                getPassword(state, getters, rootState, rootGetters) {
                    return state.password;
                },
                getMobile(state, getters, rootState, rootGetters) {
                    return state.mobile;
                },
                getRole(state, getters, rootState, rootGetters) {
                    return state.role;
                },
                getUser(state, getters, rootState, rootGetters) {
                    return state;
                },
                getUserId(state, getters, rootState, rootGetters) {
                    return state.id;
                },
                hasRecordSignIn(state, getters, rootState, rootGetters) {
                    return state.record;
                }
            },
            mutations: {
                setUser(state, user) {
                    state.id = user.id;
                    state.name = user.name;
                    state.username = user.username;
                    state.mobile = user.mobile;
                    state.password = user.password;
                    state.token = user.token;
                    state.role = user.role;
                    state.key = user.key;
                    state.record = user.record || false;
                    localStorage.setItem('id', user.id);
                    localStorage.setItem('name', user.name);
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('mobile', user.mobile);
                    localStorage.setItem('role', JSON.stringify(user.role));
                    localStorage.setItem('password', user.password);
                    localStorage.setItem('token', user.token);
                    localStorage.setItem('key', user.key);
                    localStorage.setItem('record', user.record);
                },
                delUser(state) {
                    state.id = '';
                    state.name = '';
                    state.username = '';
                    state.password = '';
                    state.token = '';
                    state.key = '';
                    state.record = false;
                    state.role = {
                        id : '',
                        roleName : ''
                    }
                    localStorage.setItem('id', '');
                    localStorage.setItem('name', '');
                    localStorage.setItem('username', '');
                    localStorage.setItem('password', '');
                    localStorage.setItem('token', '');
                    localStorage.setItem('mobile', '');
                    localStorage.setItem('key', '');
                    localStorage.setItem('record', false);
                    localStorage.setItem('role', null);
                },

            },
            actions: {
                login({dispatch, commit, getters, rootGetters, rootState}, user) {
                    commit("setUser", user);
                },
                out({dispatch, commit, getters, rootGetters, rootState}) {
                    commit('delUser');
                },
                hasLogin({dispatch, commit, getters, rootGetters, rootState}) {
                    let user = {
                        id: localStorage.getItem("id"),
                        name: localStorage.getItem("name"),
                        username: localStorage.getItem("username"),
                        password: localStorage.getItem("password"),
                        token: localStorage.getItem("token"),
                        mobile: localStorage.getItem("mobile"),
                        key : localStorage.getItem("key"),
                        record : localStorage.getItem("record") === "true",
                        role : JSON.parse(localStorage.getItem("role"))
                    };
                    commit("setUser", user);
                    return user.token;
                }
            }
        }
    }
}