import RESTFUL from '~/Scripts/Util/RestfulApi'

export default (function () {
    return {
        name: 'Users',
        data() {
            let checkUserName = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9\u4e00-\u9fa5]{1,6}$/.test(value)) {
                    callback(new Error('登录用户名只能1-6个中文、字母、数字'));
                } else {
                    callback();
                }
            }

            let checkPassword = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9]{1,6}$/g.test(value)) {
                    callback(new Error('登录密码只能1-6个字母、数字'));
                } else {
                    callback();
                }
            }

            let checkMobile = (rule, value, callback) => {
                if (!/^[0-9]{11}$/g.test(value)) {
                    callback(new Error('手机号只能是11数字'));
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
                selectIndex:'',
                username: sessionStorage.getItem("username"),
                useRole: sessionStorage.getItem('role'),
                rows: [],
                roleList:[],
                wrong: false,
                hasDialogShow: false,
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
                    password: [
                        {validator: checkPassword, trigger: 'blur'}
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
            handleEdit(index, row) {
                let me = this;
                me.userForm.id = row.id;
                me.userForm.account = row.account;
                me.userForm.mobile = row.mobile;
                me.userForm.role = row.roleId;
                me.hasUpdateDialogShow = true;
                me.selectIndex = index;

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
                    if (valid) {
                        me.$http.post(
                            RESTFUL.injective.Api.User.createUser,
                            JSON.stringify({
                                account: me.userForm.account, roleId: me.userForm.role,
                                mobile: me.userForm.mobile, password: me.userForm.password, operator: me.username
                            }),
                            {emulateJSON: true, emulateHTTP: false}
                        ).then(res => {
                            if (res.body.success) {
                                me.$message.success("新增成功！");
                                me.query();
                                me.handlerOverlayClosed();
                            }
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
                                mobile: me.userForm.mobile,operator: sessionStorage.getItem("username")}),
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
            handleDelete(index, row) {
                this.$confirm('此操作将删除'+row.account+'用户, 是否继续?', '提示', {
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
            restPassWord(index, row) {
                this.$confirm('此操作将重置用户的'+row.account+'密码, 是否继续?', '提示', {
                    customClass :　"smart-box smart-box-message",
                    confirmButtonClass: 'el-button--success',
                    cancelButtonClass: 'el-button--warning',
                    type: 'warning'
                }).then(() => {
                    let me = this;
                    me.$http.post(
                        RESTFUL.injective.Api.User.resetPassword+'?account='+row.account,
                        { emulateJSON : false, emulateHTTP: false }
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
            ifShowDeleted: function (account) {
                let me = this;
                if (me.useRole==='op') {
                    return false;
                }else{
                    return !(account === me.username);
                }

            },
            ifShowResetPassword: function (account) {
                let me = this;
                if (me.useRole==='op') {
                    return false;
                }else if (me.useRole==='admin'){
                    return true;
                }else{
                    return account !== me.username;
                }
            },
            ifShowEdit: function (account) {
                let me = this;
                if (me.useRole==='op') {
                    return account === me.username;
                }else if (me.useRole==='admin'){
                    return true;
                } else{
                    return true;
                }


            },
            resetForm(userInfo) {
                this.$refs[userInfo].resetFields();
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