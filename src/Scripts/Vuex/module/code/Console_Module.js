export default {
    Console() {
        return {
            namespaced : true,
            state(){
                return {
                    value : ''
                }
            },
            getters : {
                getValue(state, getters, rootState, rootGetters) {
                    return state.value;
                }
            },
            mutations : {
                setValue(state, val) {
                    if(val) {
                        state.value = val;
                    }
                },
                clearValue(state) {
                    state.value = "";
                }
            },
            actions : {
                changeValue({dispatch, commit, getters, rootGetters, rootState}, value) {
                    if(!value) {
                        commit("clearValue");
                    } else {
                        commit("setValue", value);
                    }
                }
            }
        }
    }
}