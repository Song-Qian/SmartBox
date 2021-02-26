<template>
    <div ref="container" class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24" style="padding: 20px;">
            
            <div class="smart-box smart-box-window" style="background:none; height: 100%;">
                <div class="smart-box-window-inner">
                    <div class="smart-box-window-title"  style="background-size: 353px 20px; height:80px; line-height: 80px;overflow:hidden; position:relative;">
                        故障统计视图
                        <el-button-group style="position: absolute; right: 50px; top : 31%; transform: translate(-50%, -50%) white-space: nowrap">
                            <el-button  type="primary" icon="el-icon-s-grid"   size="small" @click="$router.push({ name : 'message'})">列表</el-button> 
                            <el-button disabled type="info" icon="el-icon-s-data"   size="small" @click="$router.push({ name : 'waringView'})">视图</el-button>
                        </el-button-group>
                    </div>
                    <div class="smart-box-window-body" style="height: calc(100% - 80px);">
                        <div class="smart-box smart-box-flex-row vertical" >
                            <div class="smart-box-flex-column-4 smart-box-flex-column-clear">
                                <el-row  style="padding:20px 0px; box-sizing: border-box;" type="flex" justify="center" align="center" >
                                        <el-date-picker size="small" v-model="search.waringTime" value-format="yyyy-MM-dd" type="daterange" popper-class="smart-box smart-box-popover" style="width: 250px;margin-right:50px;"  class="smart-box smart-box-daterange"  range-separator="-" unlink-panels clearable/>
                                        <el-button  type="primary" icon="el-icon-search"   size="small" @click="init">查询</el-button>
                                        <el-button  type="primary" icon="el-icon-refresh" style="margin-right:50px;"  size="small" @click="clearSearch">重置</el-button>
                                       <a style="color:#00fafe; text-decoration: none; cursor:pointer;margin-right:20px;" @click="exportCharts"><i class="el-icon-download" />导出</a>
                                </el-row>
                            </div>
                            <div class="smart-box-flex-column-20 smart-box-flex-column-clear">
                                <div class="smart-box smart-box-flex-row" ref="container">
                                    <div class="smart-box-flex-column-12 smart-box-flex-column-clear" style="position:relative;">
                                        <el-form  label-width="80px" size="small" inline style="position:absolute;right:13%;z-index:999;">
                                             <el-form-item label="选择区域:">
                                                <template v-slot:label>
                                                    <span style="color: #fff;">选择区域:</span>
                                                </template>
                                                <el-select  multiple  v-model="search.areaValue" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px;" collapse-tags clearable @change="areaInit">
                                                    <el-option v-for="item in search.area" :key="item.value" :value="item.ID" :label="item.AREA_NAME" />
                                                </el-select>
                                            </el-form-item> 
                                        </el-form>
                                        <div ref="area_ec" style="width:100%;height:100%;"></div>
                                    </div>
                                    <div class="smart-box-flex-column-12 smart-box-flex-column-clear">
                                        <div ref="type_ec" style="width:100%;height:100%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import {default as WaringStatistics} from './waringStatistics'
export default WaringStatistics
</script>
