import RESTFUL from '~/Scripts/Util/RestfulApi'
/**
 * Developer    :   SongQian
 * Time         :   2019-06-21
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   修改人：宋骞， 优化SessionStore使用状态， Vuex数据管理、获取等优化、优化非View上的必须状态禁止放入data()中，避免性能浪费。
 */
import moment from 'moment'
import keys from '~/Scripts/Util/Keys-SHA-ES6'
import {unbind} from "element-resize-event";
export default (function () {
    return {
        name: 'Log',
        data() {
            return {
                pagination: {
                    total: 0,
                    size: 10,
                    currentPage: 1,

                },
                rows: [],
                roleList:[],
                hasDialogShow: false,
                showConfirmButton: false,
                hasUpdateDialogShow: false,

            }
        },
        methods: {
            query() {
                let me = this;
                me.loading = true;
                let size = me.pagination.size;
                let currentPage = me.pagination.currentPage;
                me.loading = true;
                me.$http.post(
                    RESTFUL.injective.Api.Sys.LogList,
                    JSON.stringify({ pageIndex : currentPage, pageSize:size}),
                    { emulateJSON : true, emulateHTTP: false }
                ).then(res => {
                    if(res.body.success) {
                        me.pagination.total = res.body.totalCount;
                        me.rows =  res.body.model;
                        me.loading = false;
                        return;
                    }
                    me.$message.error(res.body.errorMessage);
                });
            },
            handleSizeChange(size) {
                let me = this;
                me.pagination.size = size;
                me.pagination.currentPage = 1;
                me.query();
            },
            handleCurrentChange(page) {
                let me = this;
                me.pagination.currentPage = page;
                me.query();
            },
            renderTime(time) {
                return moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
            },
            /**
             * @Description: 新增用户
             * @param
             * @return
             * @exception
             * @date        2019/6/11 16:59
             */
            createUser(userInfo) {
                let me = this;
                me.$refs[userInfo].validate((valid) => {
                    let sha_1 = new keys();
                    let password = sha_1.SHA('123456',true);
                    if (valid) {
                        me.showConfirmButton = true;
                        me.$http.post(
                            RESTFUL.injective.Api.User.createUser,
                            JSON.stringify({
                                account: me.userForm.account, roleId: me.userForm.role,
                                mobile: me.userForm.mobile, password: password, operator: me.username
                            }),
                            {emulateJSON: true, emulateHTTP: false}
                        ).then(res => {
                            if (res.body.success) {
                                me.$message.success("新增成功！");
                                me.query();
                                me.handlerOverlayClosed();
                            }
                            me.showConfirmButton = false;
                            me.$message.error(res.body.errorMessage);
                        });
                    }
                });
            },
        },

        mounted() {
            let me = this;
            me.query();
            let refreshTableTimer = setInterval(me.query, 1000 * 5);
            me.$once("hook:beforeDestroy", () => {
                clearInterval(refreshTableTimer);
            });
        }
    }
})()