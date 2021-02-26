<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="smart-box smart-box-flex-row vertical">
        <div class="smart-box-flex-column-24" style=" padding: 20px;">
            <div class="smart-box smart-box-window" style="background:none; width: 100%; height: 100%;">
                <div class="smart-box-window-inner">
                    <div
                            class="smart-box-window-title"
                            style="background-size: 353px;padding: 0px 100px;height: 80px; line-height: 80px; position:relative; ">
                        用户管理
                        <el-button
                                v-if="userRole.id !== 'op'"
                                icon="el-icon-plus"
                                size="small"
                                type="success"
                                style="position:absolute; right:100px; top: 40px;"
                                @click="hasDialogShow = true">
                            新增
                        </el-button>
                    </div>
                    <div class="smart-box-window-body" style="padding: 40px 100px; box-sizing: border-box;">
                        <el-table :data="rows" height="calc(100% - 60px)" class="smart-box smart-box-table"
                                  style="font-size: 15px" size="small" stripe>
                            <el-table-column label="id" align="center" v-if="false" header-align="center" prop="account"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="roleId" align="center" v-if="false" header-align="center"
                                             prop="account"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="用户名称" align="center" header-align="center" prop="account"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="用户角色" align="center" header-align="center" prop="rolename"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="联系方式" align="center" header-align="center" prop="mobile"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作" align="center" header-align="center" prop="operate"
                                             show-overflow-tooltip>
                                <template slot-scope="scoped">
                                    <el-button size="small" type="warning" class="el-icon-edit" style="cursor:pointer;"
                                               @click="handleEdit(scoped.row)"
                                               v-if="scoped.row.account === username || userRole.id !== 'op'">修改
                                    </el-button>
                                    <el-button size="small" type="danger" class="el-icon-refresh"
                                               style="cursor:pointer;"   @click="restPassWord(scoped.row)"
                                               v-if="scoped.row.account !== username && userRole.id === 'admin'">重置密码
                                    </el-button>
                                    <el-button size="small" type="danger" class="el-icon-edit" style="cursor:pointer;"
                                               @click="handleDelete(scoped.row)"
                                               v-if="scoped.row.account !== username && userRole.id !== 'op'">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="[10, 20, 30, 40]"
                                class="smart-box smart-box-pagination"
                                :current-page.sync="pagination.page"
                                :page-size.sync="pagination.size"
                                :layout="pagination.total == 0 ? ['total', 'sizes', 'jumper'].join(', ') : ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'].join(', ')"
                                :total="pagination.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!--        用户信息新增对话框-->
        <smart-box-dialog ref="user_dialog" width="520px" height="340px" :show.sync="hasDialogShow" :title="'添加用户'"
                          @closed="handlerOverlayClosed" :IsClickMaskClose="false">
            <el-row type="flex" align="center" justify="center">
                <el-col :span="20">
                    <el-form label-width="120px" :rules="userRule" ref="userInfo" :model="userForm"
                             label-position="left" size="small" style="padding: 30px 0px 0px 30px">
                        <el-form-item prop="account" label="用户名称" required>
                            <template v-slot:label>
                                <span style="color: #fff;">用户名称：</span>
                            </template>
                            <el-input v-model="userForm.account" size="small" class="smart-box smart-box-input"
                                      popper-class="smart-box smart-box-popover"
                                      style="width: 180px" resize>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="mobile" label="手机号">
                            <template v-slot:label>
                                <span style="color: #fff;">手机号：</span>
                            </template>
                            <el-input v-model.number="userForm.mobile" size="small"
                                      class="smart-box smart-box-input" popper-class="smart-box smart-box-popover"
                                      style="width: 180px" resize>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="role" label="角色选择" required>
                            <template v-slot:label>
                                <span style="color: #fff;">角色选择：</span>
                            </template>
                            <el-radio v-model="userForm.role" v-for="role in roleList" :span="6"
                                      style="height: 30px;color: #fff;margin:0px 30px 0px 0px;" :key="role.id"
                                      :label="role.id">
                                {{role.rolename}}
                            </el-radio>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" :disabled="showConfirmButton"
                               @click="createUser('userInfo')">确认
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="resetForm('userInfo')">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
        <!--        用户信息修改对话框-->
        <smart-box-dialog ref="user_update_dialog" width="500px" height="350px" :show.sync="hasUpdateDialogShow"
                          v-model="userForm"
                          :title="'修改用户信息'" @closed="handlerOverlayClosed">
            <el-row type="flex" align="center" justify="center">
                <el-col :span="20">
                    <el-form label-width="120px" :rules="userRule" ref="userInfoUpdate" :model="userForm"
                             label-position="left" size="small" style="padding: 30px 0px 0px 30px">
                        <el-form-item :offset="2" label="用户名称">
                            <template v-slot:label>
                                <span style="color: #fff;">用户名称：</span>
                            </template>
                            <span style="color: #fff;">{{userForm.account}}</span>
                        </el-form-item>
                        <el-form-item prop="mobile" label="手机号">
                            <template v-slot:label>
                                <span style="color: #fff;">手机号：</span>
                            </template>
                            <el-input v-model="userForm.mobile" size="small"
                                      class="smart-box smart-box-input" popper-class="smart-box smart-box-popover"
                                      style="width: 230px" resize>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="角色选择">
                            <template v-slot:label>
                                <span style="color: #fff;">角色选择：</span>
                            </template>
                            <el-radio v-model="userForm.role" :disabled="userForm.account===username"
                                      v-for="role in roleList" :span="6"
                                      style="height: 30px;color: #fff;margin:0px 30px 0px 0px;" :key="role.id"
                                      :label="role.id">
                                {{role.rolename}}
                            </el-radio>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="updateForm('userInfoUpdate')">
                        确认
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
    </div>
</template>

<script>
    import {default as Users} from './users'

    export default Users
</script>