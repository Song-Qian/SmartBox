import RESTFUL from '~/Scripts/Util/RestfulApi'
/**
 * Developer    :   SongQian
 * Time         :   2019-06-21
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   修改人：宋骞， 优化SessionStore使用状态， Vuex数据管理、获取等优化、优化非View上的必须状态禁止放入data()中，避免性能浪费。
 */
import { mapGetters } from 'vuex'
import keys from '~/Scripts/Util/Keys-SHA-ES6'
export default (function () {
    return {
        name: 'Users',
        data() {
            let checkUserName = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9\u4e00-\u9fa5]{1,16}$/g.test(value)) {
                    callback(new Error('用户名只能是1-16个中文、字母、数字组成'));
                } else {
                    callback();
                }
            }

            let checkMobile = (rule, value, callback) => {
                if (value || value === 0){
                    if (!/^[0-9]{11}$/g.test(value)) {
                        callback(new Error('手机号只能是11数字'));
                    }else {
                        callback();
                    }
                }else {
                    callback();
                }
            }
            let checkRole = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择用户角色'));
                }else {
                    callback();
                }
            }
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
                userForm: {
                    id: '',
                    account: '',
                    password: '',
                    mobile: '',
                    role: ''
                },
                userRule: {
                    account: [
                        {validator: checkUserName, trigger: 'blur'}
                    ],
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                    role: [
                        {validator: checkRole, trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            ...mapGetters({
                'username' : 'User/getUsername',
                'userRole' : 'User/getRole'
            })
        },
        methods: {
            query() {
                let me = this;
                me.loading = true;
                let size = me.pagination.size;
                let currentPage = me.pagination.currentPage;
                me.loading = true;
                me.$http.post(
                    RESTFUL.injective.Api.User.userList,
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
            /**
             * @Description: 用户信息列表
             * @param
             * @return
             * @exception
             * @date        2019/6/11 16:33
             */
            queryRoleList(){
                let me = this;
                me.$http.get(
                    RESTFUL.injective.Api.User.roleList,
                    { emulateJSON : false, emulateHTTP: false }
                ).then(res => {
                    if(res.body.success) {
                        me.roleList =  res.body.model;
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
            handleEdit(row) {
                let me = this;
                me.userForm.id = row.id;
                me.userForm.account = row.account;
                me.userForm.mobile = row.mobile;
                me.userForm.role = row.roleId;
                me.hasUpdateDialogShow = true;
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
            updateForm(userInfo){
                let me = this;
                me.$refs[userInfo].validate((valid) => {
                    if (valid) {
                        me.$http.post(
                            RESTFUL.injective.Api.User.updateUser,
                            JSON.stringify({account: me.userForm.account, roleId:  me.userForm.role,
                                mobile: me.userForm.mobile,operator:  me.username  }),
                            { emulateJSON : true, emulateHTTP: false }
                        ).then(res => {
                            if(res.body.success) {
                                me.$message.success("修改成功！");
                                me.query();
                                me.handlerOverlayClosed();
                            }
                            me.$message.error(res.body.errorMessage);
                        });
                    }
                });
            },
            handleDelete(row) {
                this.$confirm('此操作将删除 ['+row.account+'] 用户, 是否继续?', '提示', {
                    customClass :　"smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    let me = this;
                    me.$http.post(
                        RESTFUL.injective.Api.User.deleteUser+'?account='+row.account,
                        { emulateJSON : false, emulateHTTP: false }
                    ).then(res => {
                        if(res.body.success) {
                            this.$message({
                                type: 'success',
                                message: '用户已删除!'
                            });
                            me.query();
                            return;
                        }
                        me.$message.error(res.body.errorMessage);
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            restPassWord(row) {
                let sha_1 = new keys();
                let password = sha_1.SHA('123456',true);
                let me = this;
                this.$confirm('此操作将重置用户的 ['+row.account+'] 密码, 是否继续?', '提示', {
                    customClass :　"smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    me.$http.post(
                        RESTFUL.injective.Api.User.resetPassword,
                        { account : row.account,password },
                        { emulateJSON : true, emulateHTTP: false }
                    ).then(res => {
                        if(res.body.success) {
                            this.$message({
                                type: 'success',
                                message: '重置密码成功!'
                            });
                            return;
                        }
                        me.$message.error(res.body.errorMessage);
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置密码'
                    });
                });
            },
            add() {
                let me = this;
                me.hasDialogShow = true;

            },
            resetForm(userInfo) {
                this.$refs[userInfo].resetFields();
                this.showConfirmButton = false;
                this.handlerOverlayClosed();
            },
            handlerOverlayClosed() {
                let me = this;
                me.hasUpdateDialogShow = false;
                me.hasDialogShow = false;
                me.userForm.account = '';
                me.userForm.role =  '';
                me.userForm.mobile = '';
                me.userForm.password = '';
            },
        },

        mounted() {
            let me = this;
            me.query();
            me.queryRoleList();
        }
    }
})()