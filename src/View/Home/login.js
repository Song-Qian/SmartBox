/**
 * Developer    :   SongQian
 * Time         :   2019/03/11
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   登陆系统业务逻辑代码
 */
import keys from '~/Scripts/Util/Keys-SHA-ES6'
import RESTFUL from '~/Scripts/Util/RestfulApi'
import {mapActions} from 'vuex'

export default (function () {
    return {
        data() {
            let me = this;
            let checkUserName = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9_@\u4e00-\u9fa5]{1,16}$/g.test(value)) {
                    callback(new Error('登录用户名只能1-16个中文、字母、数字、_和@组成'));
                } else {
                    callback();
                }
            }

            let checkPassword = (rule, value, callback) => {
                let sha_1 = new keys();
                let password = sha_1.SHA(value);
                if (!/^[a-zA-Z0-9_@]{1,16}$/g.test(value) && password !== '7c4a8d09ca3762af61e59520943dc26494f8941b') {
                    // callback(new Error('登录密码只能1-16个字母、数字、_和@组成'));
                    callback(new Error('登录密码：123456'));
                } else {
                    callback();
                }
            }
            return {
                record: true,
                autoLogin: true,
                user: {
                    username: '',
                    password: '',
                    verify: ''
                },
                userRule: {
                    username: [
                        {validator: checkUserName, trigger: 'blur'}
                    ],
                    password: [
                        {validator: checkPassword, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(rule) {
                let me = this;
                me.$refs[rule].validate((valid) => {
                    if (valid) {
                        let sha_1 = new keys();
                        let password = sha_1.SHA(me.user.password);
                        me.login({
                            id: 1,
                            name: 'administrator',
                            username: me.user.username,
                            password: password,
                            token: sha_1.getHex(),
                            role: me.user.username === 'admin' ? 3 : 2,
                            mobile: 1388888888
                        });
                        let path = me.$route.query['redirect'] || '/home/sys';
                        me.$router.push({path});
                        // me.$http.post(
                        //     RESTFUL.injective.Api.User.Login, 
                        //     JSON.stringify({ loginname : me.user.username, password }), 
                        //     { emulateJSON : true, emulateHTTP: false }
                        // ).then(res => {
                        //     if(res.body.rel === 200) {
                        //         let u = res.body.data;
                        //         me.login({ id : u.id, name : u.name, username : u.loginname, password : u.password, token : u.token });
                        //         let path = me.$route.query['redirect'] || '/main/disktop';
                        //         me.$router.push({ path });
                        //         return;
                        //     }
                        //     me.$message.error(res.body.message);
                        // });
                    }
                });
            },
            reSet() {
                let me = this;
                me.user.username = "";
                me.user.password = "";
            },
            ...mapActions({
                login: 'User/login'
            })
        },
        mounted() {
        }
    }
}())