<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="smart-box smart-box-flex-row vertical">
        <div class="smart-box-flex-column-24" style=" padding: 20px;">
            <div class="smart-box smart-box-window" style="background:none; width: 100%; height: 100%;">
                <div class="smart-box-window-inner">
                    <div
                            class="smart-box-window-title"
                            style="background-size: 353px;padding: 0px 100px;height: 80px; line-height: 80px; position:relative; ">
                        操作日志
                    </div>
                    <div class="smart-box-window-body" style="padding: 40px 100px; box-sizing: border-box;">
                        <el-table :data="rows" height="calc(100% - 60px)" class="smart-box smart-box-table"
                                  style="font-size: 15px" size="small" stripe>
                            <el-table-column label="id" align="center" v-if="false" header-align="center" prop="account"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作名称" align="center" header-align="center" prop="commandCode"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作人" align="center" header-align="center" prop="username"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="访问者IP" align="center" header-align="center" prop="ip"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作时间" align="center" header-align="center" prop="createTime"
                                             show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="执行结果" align="center" header-align="center" prop="result"
                                             show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="1==scope.row.result">成功</span>
                                    <span v-else>失败</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作内容"  v-if="false"  align="center" header-align="center" prop="content"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="snm返回结果"  align="center" header-align="center" prop="snmResponse"
                                             show-overflow-tooltip></el-table-column>
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
    </div>
</template>

<script>
    import {default as Log} from './log'
    export default Log
</script>