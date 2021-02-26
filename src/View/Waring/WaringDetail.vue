<template>
    <div class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24" style="padding: 20px;">
            
            <div class="smart-box smart-box-window" style="background:none; height: 100%;">
                <div class="smart-box-window-inner">
                    <div class="smart-box-window-title"  style="background-size: 353px 20px; height:80px; line-height: 80px;position:relative;">
                        <!-- <el-button style="background:none;border-color:#00fafe;position:absolute;left:10px;top:10px;" circle size="small" @click="$router.push({ name : 'message'})"><i class="el-icon-back smart-box-text-primary"></i></el-button> -->
                        告警信息查看
                    </div>
                    <div class="smart-box-window-body" style="height: calc(100% - 80px);">
                        <div class="smart-box smart-box-flex-row" >
                            <div class="smart-box-flex-column-7 smart-box-flex-column-clear">
                                
                            </div>
                            <div class="smart-box-flex-column-10 smart-box-flex-column-clear" >
                                <div class="smart-box smart-box-flex-row vertical" >
                                    <div class="smart-box-flex-column-8 smart-box-flex-column-clear">
                                         <el-row style="padding:15px 0px; box-sizing: border-box;margin-top:10px;font-size:14px;">
                                            <el-col :span="4" :offset="2" style="color:#FFF;text-align:center;">设备名称：</el-col>
                                            <el-col :span="4"  style="font-size:14px;color:#FFF;text-overflow:ellipsis;overflow: hidden; white-space: nowrap">{{detail.devName}}&nbsp; </el-col>
                                            <el-col :span="4" :offset="3" style="color:#FFF;text-align:center;">处理人：</el-col>
                                            <el-col :span="4"  style="font-size:14px;color:#FFF;">{{detail.userName}}&nbsp;</el-col>
                                        </el-row>
                                        <el-row  style="padding:15px 0px; box-sizing: border-box;font-size:14px;">
                                            <el-col :span="4" :offset="2" style="color:#FFF;text-align:center;">设备类型：</el-col>
                                            <el-col :span="4"  style="font-size:14px;color:#FFF;text-overflow:ellipsis;overflow: hidden; white-space: nowrap">{{detail.devTypeName}}&nbsp; </el-col>
                                            <el-col :span="4" :offset="3" style="color:#FFF;text-align:center;">处理状态：</el-col>
                                            <el-col 
                                                :span="4"  
                                                style="font-size:14px;" 
                                                :class="{ 
                                                    'smart-box-text-warning' : detail.isDeal == '1', 
                                                    'smart-box-text-primary' : detail.isDeal == '2', 
                                                    'smart-box-text-info' : detail.isDeal == '3',
                                                    'smart-box-text-success' : detail.isDeal == '4'
                                                }"
                                                >
                                                {{ ['', '未处理', '已派单', '已忽略', '已完成'][detail.isDeal] }}
                                            </el-col>
                                        </el-row>
                                        <el-row  style="padding:15px 0px; box-sizing: border-box;font-size:14px;">
                                            <el-col :span="4" :offset="2" style="color:#FFF;text-align:center;">告警项目：</el-col>
                                            <el-col :span="4"  style="font-size:14px;color:#FFF;text-overflow:ellipsis;overflow: hidden; white-space: nowrap">{{detail.alarmName}}&nbsp; </el-col>
                                            <el-col :span="4" :offset="3" style="color:#FFF;text-align:center;">处理时间：</el-col>
                                            <el-col :span="4"  style="font-size:14px;color:#FFF;">{{detail.dealTime}}</el-col>
                                        </el-row>
                                        <el-row  style="padding:15px 0px; box-sizing: border-box;font-size:14px;">
                                            <el-col :span="4" :offset="2" style="color:#FFF;text-align:center;">告警时间：</el-col>
                                            <el-col :span="4"  style="font-size:14px;color:#FFF;text-overflow:ellipsis;overflow: hidden; white-space: nowrap">{{DateTimeFormate(detail.alarmTime)}} </el-col>
                                        </el-row>
                                    </div>

                                    <div class="smart-box-flex-column-12 smart-box-flex-column-clear waring-detail-step" style="overflow-y:auto;">
                                        <el-steps direction="vertical"  space="20%" :align-center="true" style="margin-left: 60px;">
                                            <el-step v-for="(item,index) in arr" :key="item.id">
                                                <template v-slot:icon>
                                                    <span style="color:black;">{{arr.length-index}}</span>
                                                </template>
                                                <template v-slot:title>
                                                    <el-row type="flex" justify="start" align="center" style="font-size: 14px;">
                                                        <el-col :span="4"  style="color:#FFF;">处理人</el-col>
                                                        <el-col :span="4"  style="color:#05A2F4;">{{item.opUid}}</el-col>
                                                        <el-col :span="4"  style="color:#FFF;">处理时间</el-col>
                                                        <el-col :span="6"  style="color:#05A2F4;">{{item.opTime}}</el-col>
                                                        <el-col :span="4"  style="color:#FFF;">处理状态</el-col>
                                                        <el-col :span="2"  style="color:#05A2F4;" >{{['', '未处理', '已派单', '已忽略', '已完成'][item.isDeal]}}</el-col>
                                                    </el-row>
                                                    <el-row type="flex" justify="start" align="center" style="font-size: 14px;">
                                                        <el-col :span="4"  style="color:#FFF;">备注</el-col>
                                                        <el-col :span="20"  style="color:#05A2F4;">{{item.opInfo}}</el-col> 
                                                    </el-row>
                                                </template>
                                            </el-step>
                                        </el-steps>
                                    </div>

                                    <div class="smart-box-flex-column-4 smart-box-flex-column-clear" style="text-align:center;line-height:100px;">
                       
                                        <el-button type="primary" icon="el-icon-back"    size="small"  @click="$router.push({ name : 'message'})">返回</el-button>
                                    </div>
                                </div>
                            </div>
                            <div class="smart-box-flex-column-7 smart-box-flex-column-clear">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import {default as WaringDetail } from './waringDetail'
export default WaringDetail 
</script>
<style lang="scss" scoped>
.waring-detail-step {
    &::-webkit-scrollbar {
                width: 10px;
                background-color: rgba(59, 184, 227, .5);
            }
        
            &::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background-color: rgba(59, 184, 227, .2);
            }
        
            &::-webkit-scrollbar-thumb {
                background-color: rgba(59, 184, 227, .3);
            }
}
</style>
