import { mapActions, mapGetters} from 'vuex'
import RESTFUL from '~/Scripts/Util/RestfulApi'
import Keys from '~/Scripts/Util/Keys-SHA-ES6'

/**
 * Developer    :   SongQian
 * Time         :   2019/05/23
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   首页模版加载页面
 */
export default (function () {
    return {
        name: 'Home',
        data() {
            let checkPassword = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入原密码'));
                }
                let sha_1 = new Keys();
                let userPassword = sha_1.stringify({str: this.passowrdKey, key: this.password}, true)
                let oldPassword = sha_1.SHA(value, true);
                if (!/^[a-zA-Z0-9_@]{6,10}$/g.test(value)) {
                    callback(new Error('密码只能6-10个字母、数字、_和@组成'));
                } else if (userPassword !== oldPassword) {
                    callback(new Error('原密码输入错误'));
                } else {
                    callback();
                }
            };
            let checkNewPassword = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入新密码'));
                }
                let sha_1 = new Keys();
                let userPassword = sha_1.stringify({str: this.passowrdKey, key: this.password}, true)
                let newPassword = sha_1.SHA(value, true);
                if (userPassword === newPassword) {
                    callback(new Error('新密码与原密码相同'));
                }
                if (!/^[a-zA-Z0-9_@]{6,10}$/g.test(value)) {
                    callback(new Error('密码只能6-10个字母、数字、_和@组成'));
                } else {
                    if (this.passWordInfo.confirmPassword !== '') {
                        this.$refs.passwordInfo.validateField('confirmPassword');
                    }
                    callback();
                }
            };
            let checkConfirmPassword = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请确认新密码'));
                }
                if (!/^[a-zA-Z0-9_@]{6,10}$/g.test(value)) {
                    callback(new Error('密码只能6-10个字母、数字、_和@组成'));
                } else if (value !== this.passWordInfo.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                username: '',
                mobile: '',
                role: 0,
                roleName: '',
                systemName: '',
                systemVersion: '',
                gmIp: '',
                logoList : [],
                systemForm: {
                    systemName: '',
                    gmIp: '',
                    mapCenter: '',
                    minZoon: '',
                    maxZoon: '',
                    zoon: '',
                    mapExtent: '',
                    ViewExtent: '',
                    sysVersion: '',
                    checkedShow:[1,2],
                    companyName:'',
                    logoName:'',
                    companyTel:'',
                },
                passWordInfo: {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                hasDialogShow: false,
                wrong: false,
                passwordRule: {
                    oldPassword: [
                        {validator: checkPassword, trigger: 'blur'}
                    ],
                    newPassword: [
                        {validator: checkNewPassword, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {validator: checkConfirmPassword, trigger: 'blur'}
                    ],
                },
            }
        },
        computed: {
            getLogoPicture() {
                let me = this;
                let item = me.logoList.filter(it => it.id === me.systemForm.logoName);
                return item.length && item[0] || {};
            },
            ...mapGetters({
                'getUsername': 'User/getUsername',
                'getMobile': 'User/getMobile',
                'userRole': 'User/getRole',
                'password': 'User/getPassword',
                'passowrdKey': 'User/getKey',
                'hasClearCurrentUser': 'User/hasRecordSignIn',
                'getMapExtent' : 'Sys/getMapExtent',
                'getViewExtent' : 'Sys/getViewExtent',
                'getMapCenter' : 'Sys/getMapCenter',
                'hasSystemDialogShow' : 'Home/getSysParamsDialogStatus'
            }),
        },
        methods: {
            submitUpdatePassword(passwordInfo) {
                let me = this;
                me.$refs[passwordInfo].validate((valid) => {
                    if (valid) {
                        let keys = new Keys();
                        let oldPassword = keys.SHA(me.passWordInfo.oldPassword, true);
                        let confirmPassword = keys.SHA(me.passWordInfo.confirmPassword, true);
                        let newPassword = keys.SHA(me.passWordInfo.newPassword, true);
                        me.$http.post(
                            RESTFUL.injective.Api.User.updatePassword,
                            JSON.stringify({
                                password: newPassword, account: me.getUsername,
                                confirmPassword: confirmPassword, oldPassword: oldPassword
                            }),
                            {emulateJSON: true, emulateHTTP: false}
                        ).then(res => {
                            console.info(res)
                            if (res.body.success) {
                                me.$message.success("密码修改成功,请重新登录!")
                                me.hasDialogShow = false;
                                me.out();
                                me.$router.push({name: 'login'})
                                return;
                            }
                            me.$message.error(res.body.errorMessage);
                        });
                    }
                });
            },
            loginOut() {
                let me = this;
                me.$confirm('退出系统？', '提示', {
                    customClass: "smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    if (me.hasClearCurrentUser) {
                        me.$http.post(
                            RESTFUL.injective.Api.User.out + '?account=' + me.getUsername,
                            {emulateJSON: false, emulateHTTP: false}
                        ).then(res => {
                            if (res.body.success) {
                                me.out();
                                me.$router.push({name: 'login'});
                                return;
                            }
                            me.$message.error(res.body.errorMessage);
                        });
                    }
                })

            },
            updatePassword() {
                let me = this;
                me.hasDialogShow = true;
            },
            handlerOverlayClosed() {
                let me = this;
                me.hasDialogShow = false;
            },
            querySystemParams() {
                let me = this;
                me.$http.get(
                    RESTFUL.injective.Api.Sys.QueryAll,
                    {emulateJSON: false, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        let { SYSTEM_VERSION, SYSTEM_NAME, GATEWAY_WAY, MAP_CENTER, MIN_ZOOM, MAX_ZOOM, ZOOM, MAP_EXTENT, VIEW_EXTENT, CHECKED_SHOW,COMPANY_NAME,LOGO_PICTURE_NAME,COMPANY_TEL} = res.body.model;
                        me.systemMap = { SYSTEM_VERSION, SYSTEM_NAME, GATEWAY_WAY, MAP_CENTER, MIN_ZOOM, MAX_ZOOM, ZOOM, MAP_EXTENT, VIEW_EXTENT };
                        me.systemVersion = SYSTEM_VERSION;
                        me.systemName = SYSTEM_NAME;
                        me.systemForm.companyName = COMPANY_NAME;
                        me.systemForm.logoName = LOGO_PICTURE_NAME || "dP0OAK5ezM9ITRqj17BEUHfyrGsNvCtF";
                        me.systemForm.companyTel = COMPANY_TEL ;
                        me.gmIp = GATEWAY_WAY;
                        me.systemForm.systemName = SYSTEM_NAME;
                        me.systemForm.mapCenter = MAP_CENTER;
                        me.systemForm.gmIp = GATEWAY_WAY;
                        me.systemForm.minZoon = MIN_ZOOM;
                        me.systemForm.maxZoon = MAX_ZOOM;
                        me.systemForm.zoon = ZOOM;
                        me.systemForm.mapExtent = MAP_EXTENT;
                        me.systemForm.ViewExtent = VIEW_EXTENT;
                        me.systemForm.sysVersion = SYSTEM_VERSION;
                        me.systemForm.checkedShow = CHECKED_SHOW || [1,2];
                        me.SaveConfigParams({ GATEWAY_WAY, SYSTEM_NAME, SYSTEM_VERSION, MAP_CENTER, MIN_ZOOM, MAX_ZOOM, ZOOM, MAP_EXTENT, VIEW_EXTENT, CHECKED_SHOW });
                        return;
                    }
                    me.$message.error(res.body.message);
                });
            },
            queryNonSystemParams() {
                let me = this;
                me.$http.get(
                    RESTFUL.injective.Api.Sys.NonGlobalParams,
                    {emulateJSON: false, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        let { HEARTBEAT_MONITOR_TIMES, HEART_INTERVAL } = res.body.model;
                        me.Save_Heartbeat_Params({ HEARTBEAT_MONITOR_TIMES, HEART_INTERVAL });
                        return;
                    }
                    me.$message.error(res.body.message);
                });
            },
            submitSystem() {
                let me = this;
                me.$http.post(
                    RESTFUL.injective.Api.Sys.Update,
                    JSON.stringify({
                        updateBody: {
                            SYSTEM_NAME: me.systemForm.systemName,
                            GATEWAY_WAY: me.systemForm.gmIp,
                            MIN_ZOOM: me.systemForm.minZoon,
                            MAX_ZOOM: me.systemForm.maxZoon,
                            ZOOM: me.systemForm.zoon,
                            CHECKED_SHOW: me.systemForm.checkedShow,
                            MAP_EXTENT: me.getMapExtent && me.getMapExtent.join(',') || '',
                            VIEW_EXTENT: me.getViewExtent && me.getViewExtent.join(',') || '',
                            MAP_CENTER: me.getMapCenter && me.getMapCenter.join(',') || '',
                            SYSTEM_VERSION: me.systemForm.sysVersion,
                            COMPANY_NAME:me.systemForm.companyName ,
                            LOGO_PICTURE_NAME: me.systemForm.logoName,
                            COMPANY_TEL: me.systemForm.companyTel
                        }
                    }),
                    {emulateJSON: false, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        let u = res.body.model;
                        me.systemName = me.systemForm.systemName;
                        me.systemVersion = me.systemForm.sysVersion;
                        me.systemForm.mapCenter = me.getMapCenter && me.getMapCenter.join(',') || '';
                        me.systemForm.mapExtent = me.getMapExtent && me.getMapExtent.join(',') || '';
                        me.systemForm.ViewExtent = me.getViewExtent && me.getViewExtent.join(',') || '';
                        me.visibleSysParamsDialog(false);
                        me.$refs.win_view.refreshMapView && me.$refs.win_view.refreshMapView();
                        me.$message.success("修改成功！！！");
                        //me.clear()
                        return;
                    }
                    me.$message.error(res.body.message);
                });

            },
            handlerCancelSysParamsDialog()  {
                let me = this;
                me.UpdateMapViewParms({
                    MAP_CENTER : me.systemForm.mapCenter && me.systemForm.mapCenter.split(',') || [],
                    MAP_EXTENT : me.systemForm.mapExtent && me.systemForm.mapExtent.split(',') || [],
                    VIEW_EXTENT : me.systemForm.ViewExtent && me.systemForm.ViewExtent.split(',') || []
                });
                me.visibleSysParamsDialog(false)
                me.querySystemParams();
            },
            hadnlerRenderIconList() {
                let me = this;
                me.$http.get(require("~/assets/data/logoConfig.json"), {}, { emulateJSON: true, emulateHTTP: false }).then((res) => {
                    me.logoList = res.body.LogoList;
                })
            },
            //进智能机箱页面时，默认加载一个VN设备，此方法查询此设备的ID
            async handlerDefaultDevice() {
                let me = this;
                let response = await me.$http.post(
                    RESTFUL.injective.Api.Box.getDefaultDevice, {}, { emulateJSON: false, emulateHTTP: true }
                );
                if (response.status !== 200) {
                    throw new Error('服务端异常!')
                }

                if (response.body.success) {
                    let model = response.body.model;
                    switch(model.DEV_SERIES) {
                        case "WTOS-VN-TME200" :
                            me.$router.push({ name: 'traffic', params: { id : model.id } });
                            break;
                        case "WTOS-VN-PE" :
                            me.$router.push({ name: 'pe', params: { id : model.id } });
                            break;
                        default :
                            me.$router.push({ name: 'case', params: { id : model.id } });
                    }
                    return;
                }
                me.$router.push({ name: 'case', params: { id : -1 } });
            },
            ...mapActions({
                out: 'User/out',
                SaveConfigParams : 'Sys/SaveConfigParams',
                Save_Heartbeat_Params : 'Sys/Save_Heartbeat_Params',
                UpdateMapViewParms : 'Sys/UpdateMapViewParms',
                visibleSysParamsDialog : 'Home/triggerSysParamsDialog'
            }),
        },
        mounted() {
            let me = this;
            me.hadnlerRenderIconList();
            me.querySystemParams();
            me.queryNonSystemParams();
        }
    }
})()