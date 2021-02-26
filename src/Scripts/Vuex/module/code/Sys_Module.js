/**
 *  Developer   : SongQian
 *  Time        : 2019/07/26
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 系统配置参数。
 */
export default {
    Sys() {
        return {
            namespaced: true,
            state() {
                return {
                    CHECKED_SHOW: [],
                    GATEWAY_WAY : '',
                    SYSTEM_NAME : '',
                    SYSTEM_VERSION : '',
                    MAP_CENTER : [],
                    MIN_ZOOM : 0,
                    MAX_ZOOM : 0,
                    ZOOM : 0,
                    MAP_EXTENT : [],
                    VIEW_EXTENT : [],
                    HEART_INTERVAL: 1000 * 60 * 2,
                    HEARTBEAT_MONITOR_TIMES: 3
                }
            },
            getters: {
                getHeartInterval(state, getters, rootState, rootGetters) {
                    return state.HEART_INTERVAL || 1000 * 60 * 2;
                },
                getHeartbeat_monitor_timers(state, getters, rootState, rootGetters) {
                    return state.HEARTBEAT_MONITOR_TIMES || 3;
                },
                getMeterShow(state, getters, rootState, rootGetters) { 
                    if(!state.CHECKED_SHOW || !state.CHECKED_SHOW.length)
                        return [1];
                    return state.CHECKED_SHOW;
                },
                getMapZoom(state, getters, rootState, rootGetters) {
                    return state.ZOOM || 13;
                },
                getMapMinZoom(state, getters, rootState, rootGetters) {
                    return state.MIN_ZOOM || 5;
                },
                getMapMaxZoom(state, getters, rootState, rootGetters) {
                    return state.MAX_ZOOM || 17;
                },
                getMapExtent(state, getters, rootState, rootGetters) {
                    //113.9069366455078,30.380798291469446,114.71031188964844,30.76344781387465
                    if(!state.MAP_EXTENT || !state.MAP_EXTENT.length)
                        return null;
                    return state.MAP_EXTENT;
                },
                getViewExtent(state, getters, rootState, rootGetters) {
                    //113.77304077148438,30.3168768395022,114.84420776367188,30.827075722602558
                    if(!state.VIEW_EXTENT || !state.VIEW_EXTENT.length)
                        return null;
                    return state.VIEW_EXTENT;
                },
                getMapCenter(state, getters, rootState, rootGetters) {
                    //116.40361,39.914688
                    if(!state.MAP_CENTER || !state.MAP_CENTER.length)
                        return [114.30862426757812,30.57231176049008];
                    return state.MAP_CENTER;
                },
                getMapUrl() {
                    // "mapTile" : "https://api.mapbox.com/styles/v1/1172559463/cjx2nn6me0au51cn2x2wx25w8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiMTE3MjU1OTQ2MyIsImEiOiJjanJnNHUycnoxa2NuNGFwc2tlcWx2dTRvIn0.slmf56zGSbJt0OrDbIGsGA",
                    // "oldMapTile" : "https://api.mapbox.com/styles/v1/1172559463/cjw8vwd1d0jp21co9v71pa8t9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiMTE3MjU1OTQ2MyIsImEiOiJjanJnNHUycnoxa2NuNGFwc2tlcWx2dTRvIn0.slmf56zGSbJt0OrDbIGsGA",
                    // "baiduMapTile" : process.env.NODE_ENV === 'production' ? "/map/{z}/{x}/{y}.jpg" : "http://10.0.0.222:9001/{z}/{x}/{y}.jpg",
                    return process.env.NODE_ENV === 'production' ? "/map/{z}/{x}/{y}.png" : "http://10.0.0.222:9001/{z}/{x}/{y}.png";
                }
            },
            mutations: {
                setConfigParams(state, params) {
                    state.GATEWAY_WAY = params.GATEWAY_WAY
                    state.SYSTEM_NAME = params.SYSTEM_NAME
                    state.SYSTEM_VERSION = params.SYSTEM_VERSION
                    state.MAP_CENTER = params.MAP_CENTER
                    state.MIN_ZOOM = params.MIN_ZOOM
                    state.MAX_ZOOM = params.MAX_ZOOM
                    state.ZOOM = params.ZOOM
                    state.MAP_EXTENT = params.MAP_EXTENT
                    state.VIEW_EXTENT = params.VIEW_EXTENT
                    state.CHECKED_SHOW = params.CHECKED_SHOW
                },
                setHeartbeatParams(state, params) {
                    state.HEART_INTERVAL = params.HEART_INTERVAL;
                    state.HEARTBEAT_MONITOR_TIMES = params.HEARTBEAT_MONITOR_TIMES;
                },
                setMapViewRangePrams(state, params) {
                    state.MAP_CENTER = params.MAP_CENTER
                    state.MAP_EXTENT = params.MAP_EXTENT
                    state.VIEW_EXTENT = params.VIEW_EXTENT
                }
            },
            actions: {
                SaveConfigParams({dispatch, commit, getters, rootGetters, rootState}, params) {
                    let { GATEWAY_WAY, SYSTEM_NAME, SYSTEM_VERSION, MAP_CENTER, MIN_ZOOM, MAX_ZOOM, ZOOM, MAP_EXTENT, VIEW_EXTENT, CHECKED_SHOW } = params;
                    CHECKED_SHOW = CHECKED_SHOW;
                    MAP_CENTER = MAP_CENTER.split(/\,{1}/g);
                    MAP_EXTENT = MAP_EXTENT.split(/\,{1}/g);
                    VIEW_EXTENT = VIEW_EXTENT.split(/\,{1}/g);
                    MIN_ZOOM = /^(\d+)$/.test(MIN_ZOOM) ? Number(MIN_ZOOM) : 0;
                    MAX_ZOOM = /^(\d+)$/.test(MAX_ZOOM) ? Number(MAX_ZOOM) : 0;
                    ZOOM = /^(\d+)$/.test(ZOOM) ? Number(ZOOM) : 0;
                    MAP_CENTER = MAP_CENTER[0] && MAP_CENTER[1] && /^(\d+)(\.{1}\d+)?$/.test(MAP_CENTER[0]) && /^(\d+)(\.{1}\d+)?$/.test([1]) ? [ Number(MAP_CENTER[0]), Number(MAP_CENTER[1])] : [];
                    MAP_EXTENT = MAP_EXTENT[0] && MAP_EXTENT[1] && MAP_EXTENT[2] && MAP_EXTENT[3] && /^(\d+)(\.{1}\d+)?$/.test(MAP_EXTENT[0]) && /^(\d+)(\.{1}\d+)?$/.test(MAP_EXTENT[1]) && /^(\d+)(\.{1}\d+)?$/.test(MAP_EXTENT[2]) && /^(\d+)(\.{1}\d+)?$/.test(MAP_EXTENT[3]) ? [ Number(MAP_EXTENT[0]), Number(MAP_EXTENT[1]), Number(MAP_EXTENT[2]), Number(MAP_EXTENT[3]) ] : [];
                    VIEW_EXTENT = VIEW_EXTENT[0] && VIEW_EXTENT[1] && VIEW_EXTENT[2] && VIEW_EXTENT[3] && /^(\d+)(\.{1}\d+)?$/.test(VIEW_EXTENT[0]) && /^(\d+)(\.{1}\d+)?$/.test(VIEW_EXTENT[1]) && /^(\d+)(\.{1}\d+)?$/.test(VIEW_EXTENT[2]) && /^(\d+)(\.{1}\d+)?$/.test(VIEW_EXTENT[3]) ? [ Number(VIEW_EXTENT[0]), Number(VIEW_EXTENT[1]), Number(VIEW_EXTENT[2]), Number(VIEW_EXTENT[3]) ] : [];
                    commit('setConfigParams', { GATEWAY_WAY, SYSTEM_NAME, SYSTEM_VERSION, MAP_CENTER, MIN_ZOOM, MAX_ZOOM, ZOOM, MAP_EXTENT, VIEW_EXTENT, CHECKED_SHOW });
                },
                Save_Heartbeat_Params({ dispatch, commit, getters, rootGetters, rootState }, params) {
                    let { HEARTBEAT_MONITOR_TIMES, HEART_INTERVAL } = params;
                    HEARTBEAT_MONITOR_TIMES = HEARTBEAT_MONITOR_TIMES || 3;
                    HEART_INTERVAL = HEART_INTERVAL || 1000 * 60 * 2;
                    commit('setHeartbeatParams', { HEARTBEAT_MONITOR_TIMES, HEART_INTERVAL });
                },
                UpdateMapViewParms({ dispatch, commit, getters, rootGetters, rootState }, params) {
                    let { MAP_CENTER, MAP_EXTENT, VIEW_EXTENT } = params;
                    commit('setMapViewRangePrams', { MAP_CENTER, MAP_EXTENT, VIEW_EXTENT });
                }
            }
        }
    }
}