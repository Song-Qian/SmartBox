/**
 * Developer    :   SongQian
 * Time         :   2019/03/11
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   登陆系统业务逻辑代码
 */
import Keys from '~/Scripts/Util/Keys-SHA-ES6'
import RESTFUL from '~/Scripts/Util/RestfulApi'
import { mapActions } from 'vuex'


export default (function () {
    return {
        name : 'Signin',
        data() {
            let checkUserName = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9_@\u4e00-\u9fa5]{1,16}$/g.test(value)) {
                    callback(new Error('登录用户名只能1-16个中文、字母、数字、_和@组成'));
                } else {
                    callback();
                }
            }

            let checkPassword = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9_@]{1,16}$/g.test(value)) {
                    callback(new Error('登录密码只能1-16个字母、数字、_和@组成'));
                } else {
                    callback();
                }
            }
            return {
                record: true,
                autoLogin: true,
                systemName: '',
                companyName: '',
                companyTel: '',
                systemVersion: '',
                user: {
                    username: '',
                    password: ''
                },
                userRule: {
                    username: [
                        { validator: checkUserName, trigger: 'blur' }
                    ],
                    password: [
                        { validator: checkPassword, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            async submitForm(rule) {
                let me = this;
                try{
                    let valid = await me.$refs[rule].validate().catch(() => {
                        me.$message.error("登陆用户名、密码有非法字符！");
                        return false;
                    });
                    if(valid) {
                        let keys = new Keys();
                        let hashKey = keys.getKeySHA();
                        let account = me.user.username;
                        let password =  keys.SHA(me.user.password , true);
                        let res = await me.$http.post(RESTFUL.injective.Api.User.Login, { account, password }, { emulateJSON : false, emulateHTTP : true });
                        if(res.body.success) {
                            me.login({
                                id: 1,
                                name: account,
                                username: account,
                                password: keys.parse({ str :password, key : hashKey }),
                                token: res.body.model.token,
                                key : hashKey,
                                record : me.record,
                                role: {
                                    id : res.body.model.roleNo,
                                    roleName : res.body.model.roleName
                                },
                                mobile: res.body.model.mobile
                            });
                            let path = me.$route.query['redirect'] || '/home/sys';
                            me.handleFullScreen();
                            me.$router.push({path});
                        } else {
                            me.$message.error("登陆用户名不存在，或者密码错误！");
                        }
                    }
                } catch(e) {
                    console.warn("登陆操作失败：", e);
                }
            },
            reSet() {
                let me = this;
                me.user.username = "";
                me.user.password = "";
            },
             handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            querySystemParams() {
                let me = this;
                me.$http.get(
                    RESTFUL.injective.Api.Sys.QueryAll,
                    {emulateJSON: false, emulateHTTP: false}
                ).then(res => {
                    if (res.body.success) {
                        let u = res.body.model;
                        me.systemMap = u;
                        me.systemVersion = u.SYSTEM_VERSION;
                        me.systemName = u.SYSTEM_NAME;
                        me.companyName = u.COMPANY_NAME;
                        me.companyTel = u.COMPANY_TEL;
                        return;
                    }
                    me.$message.error(res.body.message);
                });
            },
            ...mapActions({
                login: 'User/login'
            })
        },
        mounted() {
            let me = this;
             me.querySystemParams();
        }
    }
}())