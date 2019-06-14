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
                out : `${url}/gm/sys/logout`,
                userList : `${url}/gm/user/list`,
                roleList : `${url}/gm/user/role/list`,
                createUser : `${url}/gm/user/create`,
                updateUser : `${url}/gm/user/update`,
                updatePassword : `${url}/gm/user/update`,
                resetPassword : `${url}/gm/user/reset/password`,
                deleteUser : `${url}/gm/user/delete`,
            },
            Area : {
                AreaInfo : `${url}/gm/area/info`,
                CreateArea : `${url}/gm/area/create`,
                Update : `${url}/gm/area/update`,
                Delete : `${url}/gm/area/delete`,
                Drag : `${url}/gm/area/drag`,
            },
            Console : {
                GetGridDate : `${url}/gm/sys/user/console`,
                dy : `${url}/gm/sys/user/console`
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


