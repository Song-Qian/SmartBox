/**
 *  Developer   : SongQian
 *  Time        : 2017/10/10
 *  Email       : onlylove1172559463@vip.qq.com
 *  Description : 此处存放项目所有Restful Api 访问地址
 */
class RestfulAddress{

    constructor(url, v){
        this.$baseUrl = url;
        this.$version = v;
    }
    
    get Api(){
        let me = this;
        const url = this.$baseUrl;
        const address = {
            User : {
                // Login : `${url}/HRS-ht/v1/login`,
                Login : `${url}/gm/sys/login`,
                Auth : `${url}/gm/sys/au`,
                out : `${url}/gm/sys/logout`,
                userList : `${url}/gm/user/list`,
                roleList : `${url}/gm/user/role/list`,
                createUser : `${url}/gm/user/create`,
                updateUser : `${url}/gm/user/update`,
                updatePassword : `${url}/gm/user/update/password`,
                resetPassword : `${url}/gm/user/reset/password`,
                deleteUser : `${url}/gm/user/delete`,
            },
            Area : {
                Area : `${url}/gm/area/tree`,
                AreaInfo : `${url}/gm/area/info`,
                AreaInfoWithOutDevice : `${url}/gm/area/info/with-no-device`,
                CreateArea : `${url}/gm/area/create`,
                Update : `${url}/gm/area/update`,
                Delete : `${url}/gm/area/delete`,
                Drag : `${url}/gm/area/drag`
            },
            Device : {
                List : `${url}/gm/device/list`,
                ModifyDeviceArea : `${url}/gm/device/area`,
                PageQuery : `${url}/gm/device/page`,
                Export : `${url}/gm/device/export`,
                Import : `${url}/gm/device/import`,
                ImportPoint : `${url}/gm/device/import/point`,
                IndexOnlineRate : `${url}/gm/device/online/index`,
                IndexTrafficRate : `${url}/gm/device/traffic/rate`,
                ModelExport : `${url}/gm/device/export/model`,
                ModelPointExport : `${url}/gm/device/export/point/model`,
                getDeviceById : `${url}/gm/device/getDeviceById`,
                getAllDevice : `${url}/gm/device/getAllDevice`
            },
            DeviceType : {
                QueryAll : `${url}/gm/device/type/query-all`,
            },
            Sys : {
                QueryAll : `${url}/gm/sys/param/query`,
                NonGlobalParams: `${url}/gm/sys/param/query/normal`,
                Update : `${url}/gm/sys/param/update`,
                LogList : `${url}/gm/sys/logs`,
                queryWarnAll : `${url}/gm/warn/query/all`
            },
            Console : {
                GetGridDate : `${url}/gm/sys/user/console`,
                dy : `${url}/gm/sys/user/console`
            },
            AlarmInfo : {
                getGridDate : `${url}/gm/alarmInfo/getAlarmInfoGridData`,
                batchProcessing : `${url}/gm/alarmInfo/batchProcessing`,
                getGridDateLastHour : `${url}/gm/alarmInfo/queryLastAnHour`,
                getUserInfo : `${url}/gm/alarmInfo/getSelectUserInfo`,
                insertOpInfo : `${url}/gm/alarmInfo/insertOpInfo`,
                getAlarmInfo : `${url}/gm/alarmInfo/getAlarmInfo`,
                getDealInfoDate : `${url}/gm/alarmInfo/getDealInfoDate`,
                getAlarmStatictisByType : `${url}/gm/alarmInfo/queryAlarmStatictisByType`,
                queryTwoLevelArea : `${url}/gm/alarmInfo/queryTwoLevelArea`,
                alarmCountStaticByArea : `${url}/gm/alarmInfo/alarmCountStaticByArea`,
                indexAreaErrorStatics : `${url}/gm/alarmInfo/indexAreaErrorStatics`,
                exportAlarmInfo : `${url}/gm/alarmInfo/exportAlarmInfo`,
                getAlarmItemList : `${url}/gm/alarmInfo/getAlarmItemList`,
                exportCharts : `${url}/gm/alarmInfo/exportCharts`,
                getAlarmIdListFromNotDeal : `${url}/gm/alarmInfo/getAlarmIdListFromNotDeal`,
                getAlarmInfoInMap : `${url}/gm/alarmInfo/abnormal-in-map`,
                getIconByParam : `${url}/gm/alarmInfo/getIconByParam`

            },
            Box : {
                queryDeviceInfo : `${url}/gm/IntelligenceDevice/queryDeviceInfo`,
                getDefaultDevice : `${url}/gm/IntelligenceDevice/getDefaultDevice`,
                getNetStatusData : `${url}/gm/IntelligenceDevice/getNetStatusData`,
                querySignalList : `${url}/gm/crossroad/light/list`,
                queryTrafficList : `${url}/gm/crossroad/list`,
                lightConfig : `${url}/gm/crossroad/light/config`,
                lightOption : `${url}/gm/crossroad/query/option`,
                queryIntersectionInfo : `${url}/gm/crossroad/info`
            },
            Command : {
                query : `${url}/gm/command/query`,
                Send : `${url}/gm/command/send`
            }
        }
        return (function(){
            Object.assign(me, address);
            return me;
        })()
    }
}

export default {
    injective : new RestfulAddress(`http://${window.location.host}/api`, "0.0.1")
}


