<template>
  <el-tabs v-model="activeName" class="test-user-tabs" style="height: 100%;" closable addable>
    <el-tab-pane label="用户管理" name="first" style="height: 100%;">
        <el-form inline>
            <el-form-item >
                <el-input placeholder="搜索字段" size="small" v-model="search.val" @input="handleInputSearch" auto-complete>
                     <i class="el-input__icon" :class="{ 'el-icon-loading' : searching,  'el-icon-edit' : !searching }" slot="suffix"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-select placeholder="请选择" size="small" v-model="search.type" style="width: 120px" clearable>
                    <el-option label="军人" value="军人"></el-option>
                    <el-option label="医生" value="医生"></el-option>
                    <el-option label="教师" value="教师"></el-option>
                    <el-option label="文员" value="文员"></el-option>
                    <el-option label="编辑" value="编辑"></el-option>
                    <el-option label="演员" value="演员"></el-option>
                    <el-option label="播音员" value="播音员"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker size="small" v-model="search.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" unlink-panels></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogTitle = '新增数据', dialogVisible = true"></el-button>
                    <el-button type="primary" size="small" icon="el-icon-share"></el-button>
                    <el-button type="primary" size="small" icon="el-icon-delete"></el-button>
                </el-button-group>
                <el-button type="primary" size="small" icon="el-icon-download" @click="handleDownExcel">下载</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="getDataTableList" style="width: 100%" height="calc(100% - 120px)">
            <el-table-column type="index" header-align="center" align="center" width="50" label="#"></el-table-column>
            <el-table-column header-align="center" align="center" prop="date" label="日期"></el-table-column>
            <el-table-column header-align="center" align="center" prop="name" label="姓名"></el-table-column>
            <el-table-column header-align="center" align="center" prop="job" label="职业"></el-table-column>
            <el-table-column header-align="center" align="center" prop="city" label="城市"></el-table-column>
            <el-table-column header-align="center" align="center" prop="sex" label="性别">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" round>{{scope.row.sex}}</el-button>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" prop="zip" label="邮编">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain>{{scope.row.zip}}</el-button>
                </template>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <i class="el-icon-edit" style="color: #409EFF; cursor:pointer;" @click="handleEdit(scope.row)"></i>
                    <i class="el-icon-delete" style="color: #F56C6C; cursor:pointer;"></i>
                    <i class="el-icon-setting" style="color: #409EFF; cursor:pointer;"></i>
                    <i class="el-icon-printer" style="color: #409EFF; cursor:pointer;"></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-sizes="[100, 200, 300, 400]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total.sync="total">
        </el-pagination>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form :model="form" :rules="rulesForm" ref="ruleForm" size="small" label-width="100px">
                <el-form-item label="日期" prop="date">
                    <el-date-picker v-model="form.date" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="输入日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input placeholder="输入姓名" size="small" style="width: 220px" v-model="form.name">
                        <i class="el-icon-edit el-input__icon" slot="suffix"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="职业" prop="job">
                    <el-select placeholder="请选择" size="small" v-model="form.job" clearable>
                        <el-option label="军人" value="军人"></el-option>
                        <el-option label="医生" value="医生"></el-option>
                        <el-option label="教师" value="教师"></el-option>
                        <el-option label="文员" value="文员"></el-option>
                        <el-option label="编辑" value="编辑"></el-option>
                        <el-option label="演员" value="演员"></el-option>
                        <el-option label="播音员" value="播音员"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <el-select placeholder="请选择" size="small" v-model="form.city" clearable>
                        <el-option label="哈尔滨" value="哈尔滨"></el-option>
                        <el-option label="敦煌" value="敦煌"></el-option>
                        <el-option label="西安" value="西安"></el-option>
                        <el-option label="西藏" value="西藏"></el-option>
                        <el-option label="新疆" value="新疆"></el-option>
                        <el-option label="上海" value="上海"></el-option>
                        <el-option label="北京" value="北京"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </span>
        </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="配置管理" name="second" style="height: 100%;" disabled>
    </el-tab-pane>
    <el-tab-pane label="角色管理" name="third" style="height: 100%;" disabled>
    </el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth" style="height: 100%;" disabled>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { default as Index } from './index'
export default Index
</script>

<style lang="scss">
  .test-user-tabs > .el-tabs__content {
    height: calc(100% - 55px);
  }
</style>