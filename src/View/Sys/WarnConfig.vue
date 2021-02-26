<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" xmlns:color="http://www.w3.org/1999/xhtml">
    <div ref="container" class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear">
            <div class="smart-box smart-box-flex-row vertical">
                <div class="smart-box-flex-column-24">
                    <div class="smart-box smart-box-window"
                         style="height: 100%; padding-top:10px; box-sizing: border-box; background: none; ">
                        <div class="smart-box-window-inner">
                            <div class="smart-box-window-title"
                                 style="background-size: 353px;padding: 10px 0px;height: 8%; line-height: 80px;position:relative; ">
                                告警等级设置
                                <el-button-group style="position: absolute; right: 0px; top : 50%; transform: translate(-50%, -50%)" >
                                    <el-button  type="primary" size="small"    @click="$router.push({ name : 'trafficConfig'})">交通灯参数设置</el-button>
                                    <el-button   type="primary" size="small"   @click="$router.push({ name : 'lightConfig'})">信号机能力集设置</el-button>
                                </el-button-group>
                            </div>
                            <div class="smart-box-window-body" style="padding: 30px 20px;box-sizing: border-box;">
                                <el-table :data="rows" style="font-size: 14px;" class="smart-box smart-box-table"
                                          size="small"  height="calc(95%)" :cell-style="cellStyle" stripe >
                                    <el-table-column label="编号" align="center" hidden header-align="center"
                                                     prop="id" width="150px"
                                                     show-overflow-tooltip></el-table-column>
                                    <el-table-column label="告警名称" width="200px" align="center" header-align="center"
                                                     prop="alarmName" show-overflow-tooltip>
                                    </el-table-column>

                                    <el-table-column label="当前级别" width="200px" align="center" header-align="center"
                                                     prop="alarmLevel" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.alarmLevel === 3"><span>低级</span></span>
                                            <span v-if="scope.row.alarmLevel === 2"><span>中级</span></span>
                                            <span v-if="scope.row.alarmLevel === 1"><span>高级</span></span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="告警级别设置" width="350px" align="center" header-align="center"
                                                     prop="grade" show-overflow-tooltip>
                                        <template slot-scope="scope" >
                                            <el-radio-group v-model="scope.row.alarmLevel" @change="updateWarnGrade(scope.row)">
                                                <el-radio :label=1><span style="color:#fff;">高级</span></el-radio>
                                                <el-radio :label=2><span style="color:#fff;">中级</span></el-radio>
                                                <el-radio :label=3><span style="color:#fff;">低级</span></el-radio>
                                            </el-radio-group>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="告警描述" align="center" header-align="center"
                                                     prop="alarmReason" show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {default as WarnConfig} from "./warnConfig"

    export default WarnConfig
</script>
<style lang="scss" scoped>
</style>


