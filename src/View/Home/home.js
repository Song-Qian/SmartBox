import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'


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
            return {
                username: '',
                mobile: '',
                role: 0,
                roleName: '',
                systemName: '智能监控站运维管理软件',
                gmIp: '192.168.1.16',
                passWordInfo: {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                hasDialogShow: false,
                hasSystemDialogShow: false,
                systemConfigButton: false,
                wrong: false,
            }
        },
        methods: {
            commimForm() {
                let me = this;
                let oldPassword = me.getPassword+ "";
                if (oldPassword !== me.passWordInfo.oldPassword) {
                    me.$message.error("原密码输入错误")
                } else {
                    if (me.passWordInfo.newPassword !== me.passWordInfo.confirmPassword) {
                        me.$message.error("两次输入密码不一致")
                    } else {
                        me.hasDialogShow = false;
                        me.$message.success("密码修改成功")
                    }
                }
            },
            loginOut(){
                let me = this;
                me.out();
                me.$router.push({name: 'login'})
            },
            updatePassword() {
                let me = this;
                me.hasDialogShow = true;
            },
            handlerOverlayClosed() {
                let me = this;
                me.hasDialogShow = false;

            },
            ...mapActions({
                out: 'User/out',
                getPassword: 'User/getPassword',
            }),
        },
        computed: {
            ...mapGetters({
                'getUsername': 'User/getUsername',
                'getMobile': 'User/getMobile',
                'getRoleName': 'User/getRoleName',
            }),
        },
        mounted() {
            let me = this;
            me.systemConfigButton = me.getUsername === "admin";
        }
    }
})()