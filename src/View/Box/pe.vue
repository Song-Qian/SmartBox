<template>
    <div class="smart-box smart-box-flex-row vertical">

        <div class="smart-box-flex-column-4" style="padding: 20px 10px 0px 10px; position: relative; overflow:visible; " title="">
            <div class="smart-box smart-box-mechanical" style="transition: all .6s linear; z-index: 999;" :style="{ height: hasExpandDevice ? `${networkMax * 41 + 120}px` : '100%', position : hasExpandDevice ? 'absolute' : 'relative' }">
                <el-tooltip content="电源可开启、关闭或重启" placement="bottom">
                <div class="smart-box-mechanical-inner">
                    <div class="smart-box-mechanical-body" style="padding: 10px 0px; box-sizing:border-box;">
                        <el-row v-for="i in networkMax" type="flex" class="box-device-list"  v-show="hasExpandDevice" justify="space-between" align="center" :key="i">
                            <el-col class="box-device-list-item" :title="getOutDeviceClass(i, k).title" :class="getOutDeviceClass(i, k).style"  :span="3" v-for="k in monitorLength" :key="k">{{getPort(i,k) ? getPort(i,k) : ''}}</el-col>
                        </el-row>
                        <el-row class="box-device-list" style="height: auto; margin-top: 10px;" type="flex" justify="center" align="center">
                            <el-col :span="3" v-for="(vol,index) in devicePower" :key="index" v-show="vol[4]">
                                <div class="box-device-list-setting" >
                                    <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                        <el-col :span="4">
                                            <span class="fa-stack fa-lg" style="height: 30px; width: 16px; line-height: 30px;">
                                                <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                <span class="fa-inverse" style="position:relative; font-size: 12px; top: -4px;">{{vol[0]}}</span>
                                            </span>
                                        </el-col>
                                        <el-col :span="20" style="text-overflow:ellipsis; overflow: hidden; text-align: left;" :title="vol[5]">{{ vol[5] }}</el-col>
                                        <!-- <el-col :span="8">{{vol[2]!==undefined ? Math.floor(Math.round(vol[2]*1000)/1000) : ''}}W</el-col> -->
                                    </el-row>
                                    <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                        <el-col :span="12">
                                            <i 
                                                class="el-icon-switch-button" 
                                                :title="vol[3] ? '点击关闭' : '点击开启'" 
                                                :style="handlerDisabledReset(vol, index)" 
                                                :class="{ 'smart-box-text-success' : vol[3], 'smart-box-text-dangle' : !vol[3],'smart-box-text-info' : getTransDevStatus(vol[0])}" 
                                                style="cursor:pointer;font-weight: bold;" 
                                                @click="getMessage(vol)">
                                            </i>{{vol[3] ? '开启' : '关闭'}}
                                            </el-col>
                                        <el-col :span="12"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;font-weight: bold;" :style="handlerDisabledReset(vol, index)" @click="powerReset(vol[0])" title="点击重启"></i>重启</el-col>
                                    </el-row>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-tooltip :content="hasExpandDevice ? '收缩' : '展开'" placement="top">
                        <i style="color:#00fafe; position:absolute; bottom: 0px; left: 50%; cursor:pointer;" :class="{ 'el-icon-arrow-up' : hasExpandDevice, 'el-icon-arrow-down' : !hasExpandDevice }" @click="hasExpandDevice = !hasExpandDevice"></i>
                    </el-tooltip>
                </div>
                </el-tooltip>
            </div>
        </div>
        <div class="smart-box-flex-column-10 smart-box-flex-column-clear">
            <div class="smart-box smart-box-flex-row">
                <div class="smart-box-flex-column-8">
                    <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                        <div class="smart-box-window-inner" style=" position:relative;z-index:991;">
                            <div class="box-scrub"></div>
                            <div class="smart-box-window-title" style="position:relative;">
                                设备信息
                                <i class="el-icon-setting" style="color: #00fafe; top: 10px; right:10px; position:absolute; font-size: 18px; cursor: pointer;" @click="deviceInfoDailog.Isshow = true,tabName = 'first'"></i>
                            </div>
                            <div class="smart-box-window-body">
                                <el-row class="box-row active" type="flex" justify="center" align="center">
                                    <el-col class="box-col-item" :span="12">设备名称</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12"><i :style="{'color' : deviceInfoBox.onlineStatus ? '#67C23A' : '#F56C6C'}" class="fa fa-circle fa-lg"></i>&nbsp;&nbsp;
                                        <span :title="deviceInfoBox.deviceName ? deviceInfoBox.deviceName : deviceInfoBox.deviceIp">{{ deviceInfoBox.deviceName ? deviceInfoBox.deviceName : deviceInfoBox.deviceIp }}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="box-row active" type="flex" justify="center" align="center">
                                    <el-col class="box-col-item" :span="12">设备型号</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12">{{deviceInfoBox.deviceModel}}</el-col>
                                </el-row>
                                <el-row class="box-row active" type="flex" justify="center" align="center">
                                    <el-col class="box-col-item" :span="12">设备IP</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12">{{deviceInfoBox.deviceIp}}</el-col>
                                </el-row>
                                <!-- <el-row class="box-row active" type="flex" justify="center" align="center" >
                                    <el-col class="box-col-item" :span="12">GIS</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12">{{deviceInfoBox.deviceX ? Math.round(deviceInfoBox.deviceX * 10000000)/10000000 : 0}},{{deviceInfoBox.deviceY ? Math.round(deviceInfoBox.deviceY * 1000000)/1000000 : 0}}</el-col>
                                </el-row> -->
                                <el-row class="box-row active" type="flex" justify="center" align="center" >
                                    <el-col class="box-col-item" :span="12">所在区域</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12">{{deviceInfoBox.areaName}}</el-col>
                                </el-row>
                                <!-- <el-row class="box-row active" type="flex" justify="center" align="center" >
                                    <el-col class="box-col-item" :span="12">在线状态</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12">{{deviceInfoBox.onlineStatus ? '在线' : '不在线'}}</el-col>
                                </el-row> -->
                                <el-row class="box-row active" type="flex" justify="center" align="center" >
                                    <el-col class="box-col-item" :span="12">经纬度</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12"><span :class="{'smart-box-text-success' : deviceInfoBox.deviceX  && deviceInfoBox.deviceY ,'smart-box-text-dangle' : !deviceInfoBox.deviceX || !deviceInfoBox.deviceY}"><i class="el-icon-location-outline"  style="cursor:pointer;" ></i>{{deviceInfoBox.deviceX ? '已绘制' : '未绘制'}}</span></el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref="device_container" class="smart-box-flex-column-8">
                    <!--@click="boxOpen = !boxOpen"-->
                    <div class="box-device" @click="boxOpen = !boxOpen" :class="{ 'box-is-open' : boxOpen }"><span v-show="!boxOpen">智能动环</span><pre style="position:absolute;bottom:0px;left:110px;font-size:14px;color:#FFF;">此页面30秒刷新一次，或点此按钮立刻刷新<i class="el-icon-refresh-right smart-box-text-success" style="cursor:pointer;" @click.stop="refreshAllData"></i></pre></div>
                </div>
                <div class="smart-box-flex-column-8">
                    <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                        <div class="smart-box-window-inner">
                            <div class="smart-box-window-title" style="position:relative;">
                                告警信息
                                <el-tooltip class="item" effect="light" content="告警处理" placement="top-start">
                                    <i class="el-icon-edit" style="color: #00fafe; top: 10px; right:12px; position:absolute; font-size: 18px; cursor: pointer; height:30px;" @click="$router.push({ name : 'message',params : {id :id}})">
                                    </i>
                                </el-tooltip>


                            </div>
                            <div class="smart-box-window-body" style="overflow: auto;">
                                <el-row class="box-row active" type="flex" justify="center" align="center">
                                    <!-- <el-col class="box-col-item" :span="5">设备名称</el-col>
                                    <el-col class="box-col-item" :span="5">设备类型</el-col> -->
                                    <el-col class="box-col-item" :span="8">告警类型</el-col>
                                    <el-col class="box-col-item" :span="10">告警时间</el-col>
                                    <el-col class="box-col-item" :span="6">处理状态</el-col>
                                </el-row>
                                <el-row class="box-row" :class="{active : index%2 === 1}" type="flex" justify="center" align="center" v-for="(item,index) in alarmInfoBox" :key="item.id" >
                                    <!-- <el-col class="box-col-item" :title="item.deviceName" :span="5">{{item.deviceName}}</el-col>
                                    <el-col class="box-col-item" :title="item.typeName" :span="5">{{item.typeName}}</el-col> -->
                                    <el-col class="box-col-item" :title="item.alarmName" :span="8">{{item.alarmName}}</el-col>
                                    <el-col class="box-col-item" :title="renderTime(item.alarmTime)" :span="10">{{ renderTime(item.alarmTime) }}</el-col>
                                    <el-col class="box-col-item" :class="{
                                        'smart-box-text-warning' : item.isDeal == '1', 
                                        'smart-box-text-primary' : item.isDeal == '2', 
                                        'smart-box-text-info' : item.isDeal == '3',
                                        'smart-box-text-success' : item.isDeal == '4'}"  :span="6">{{['', '未处理', '已派单', '已忽略', '已完成'][item.isDeal]}}</el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="smart-box-flex-column-10 smart-box-flex-column-clear">
            <div class="smart-box smart-box-flex-row">
                <div class="smart-box-flex-column-8">
                    <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                        <div class="smart-box-window-inner" style="position:relative; z-index:991;">
                            <div class="box-scrub"></div>
                            <div class="smart-box-window-title" style="position:relative;">
                                端口流量
                                <i class="el-icon-setting" style="color: #00fafe; top: 10px; right:10px; position:absolute; font-size: 18px; cursor: pointer;" @click="portFlowDialog.Isshow = true"></i>
                            </div>
                            <div class="smart-box-window-body" style="overflow-y:auto;">
                                <el-row class="box-row" type="flex" justify="center" align="center" v-for="([item_1, item_2], rowIndex) in portData" :key="rowIndex">
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                        <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348; line-height: 16px;">{{item_1[0]}}</span>
                                    </el-col>
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:left;" :span="6">
                                        端口{{item_1[0]}}&nbsp;&nbsp;{{ Math.round(item_1[1]/1024/1024 * 100)/100 }}M/S
                                    </el-col>
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                        <!-- <i :class="{'fa fa-unlock smart-box-text-dangle' : !item_1[2],'fa fa-lock smart-box-text-success' :  item_1[2]}" ></i>&nbsp;&nbsp; -->
                                        <i v-if="rowIndex < 5" class="fa fa-power-off" style="cursor:pointer;" :title="item_1[3]? '关闭' : '开启'" :class="{'smart-box-text-success' : item_1[3],'smart-box-text-dangle' : !item_1[3]}" @click="portSwitchControl(item_1, rowIndex, 0)"></i>
                                    </el-col>
                                    <el-col class="box-col-item" :span="1"></el-col>
                                    <el-col class="box-col-item" style="padding:10px 0px; text-align:center;" :span="2" :class="{'active' : item_2}">
                                        <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348; line-height: 16px;" v-if="item_2">{{item_2[0]}}</span>
                                    </el-col>
                                    <el-col class="box-col-item" style="padding:10px 0px; text-align:left;" :span="6" :class="{'active' : item_2}">
                                        <span v-if="item_2"> 端口{{item_2[0]}}&nbsp;&nbsp;&nbsp;&nbsp;{{Math.round(item_2[1]/1024/1024 * 100)/100}}M/S</span>
                                    </el-col>
                                    <el-col class="box-col-item" style="padding:10px 0px; text-align:center;" :span="3" :class="{'active' : item_2}">
                                        <!-- <i v-if="item_2" :class="{'fa fa-unlock smart-box-text-dangle' : !item_2[2],'fa fa-lock smart-box-text-success' :  item_2[2]}"></i>&nbsp;&nbsp; -->
                                        <i v-if="rowIndex < 5 && item_2" class="fa fa-power-off" style="cursor:pointer;" :title="item_2[3]? '关闭' : '开启'" :class="{'smart-box-text-success' : item_2[3],'smart-box-text-dangle' : !item_2[3]}" @click="portSwitchControl(item_2, rowIndex, 1)"></i>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="smart-box-flex-column-8">
                    <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                        <div class="smart-box-window-inner">
                            <div class="smart-box-window-title">
                                环境监测
                            </div>
                            <div class="smart-box-window-body" style="overflow-y:auto; padding:0px 20px; box-sizing:border-box;">
                                <el-row class="box-row" v-for="(item,index) in getMonitoringData" :key="index" type="flex" justify="center" align="center" style="width: 50%; margin: 5px 0px; float:left;">
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                        <i :class="getIconStyle(item.perform_name, item.perform_value)"></i>
                                    </el-col>
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="8" :title="item.perform_description">
                                        {{item.perform_description}}
                                    </el-col>
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="8" :title="item.valueOf()">
                                        {{ item.valueOf() }}
                                    </el-col>
                                </el-row>
                                <el-row class="box-row" v-for="(item,index) in getMonitoringDataArr" :key="getMonitoringData.length + index" type="flex" justify="center" align="center"  style="width: 50%; margin: 5px 0px; margin-bottom:5px; float:left;">
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                        <i :class="getIconStyle(item.perform_name, item.perform_value)"></i>
                                    </el-col>
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="8" :title="item.perform_description">
                                        {{item.perform_description}}
                                    </el-col>
                                    <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="8" :title="item.perform_value[1]">
                                        {{ item.perform_value[1] }}
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="smart-box-flex-column-8">
                    <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                        <div class="smart-box-window-inner">
                            <div class="smart-box-window-title" style="position:relative;">
                                设备监控
                                <i class="el-icon-setting" style="color: #00fafe; top: 10px; right:10px; position:absolute; font-size: 18px; cursor: pointer;"  @click="deviceControlDailog.Isshow = true,tabName = 'first'"></i>
                            </div>
                            <div class="smart-box-window-body">
                                <el-row class="box-row active" type="flex" justify="center" align="center" v-for="(item,index) in boxState" :key="index">
                                    <el-col class="box-col-item" :span="12">{{item.PERFORM_DESCRIPTION}}</el-col>
                                    <el-col class="box-col-item" style="text-align: right;" :span="12">
                                        <el-switch
                                            v-model="item.index"
                                            v-show="item.PERFORM_NAME !== 'PER_BACK_DOOR_STATUS' && item.PERFORM_NAME !== 'DOOR_STATUS' && (item.PERFORM_NAME !== 'LOCKTONGUE_STATUS' || item.PERFORM_NAME == 'LOCKTONGUE_STATUS' && item.PERFORM_VALUE == '0')"
                                            size="small"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            @input="sortDeviceControl($event,item.PERFORM_NAME)"
                                            :disabled="User.role.id === 'op' || !deviceInfoBox.onlineStatus">
                                        </el-switch> {{item.index ? '开' : '关'}}
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <smart-box-dialog :show.sync="deviceInfoDailog.Isshow" :footer-show="false" width="600px" height="400px" title="设备阈值设置" :is-click-mask-close="false">
            <el-tabs v-model="tabName" class="smart-box smart-box-tabs">
                <el-tab-pane label="自动重合闸" name="first">
                    <el-row type="flex" justify="center" align="center" style="margin-top:50px;">
                        <el-col :span="12">
                            <el-form label-width="90px" size="small" >
                                <!-- <el-form-item label="过压阈值">
                                    <template v-slot:label>
                                        <span style="color: #fff;">过压阈值：</span>
                                    </template>
                                <el-input class="smart-box smart-box-input" style="width: 180px" v-model="deviceInfoDailog.automatic.overValue" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="欠压阈值">
                                    <template v-slot:label>
                                        <span style="color: #fff;">欠压阈值：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="deviceInfoDailog.automatic.underValue" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="漏电阈值">
                                    <template v-slot:label>
                                        <span style="color: #fff;">漏电阈值：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="deviceInfoDailog.automatic.leakValue" size="small" clearable/>
                                </el-form-item> -->
                                <!-- <el-form-item label="控制能力">
                                    <template v-slot:label>
                                        <span style="color: #fff;">控制能力：</span>
                                    </template>
                                    <el-button type="primary" icon="el-icon-refresh"  style="width: 130px;"  size="small" @click="autoRecloseResetControl">自动重合闸重启</el-button>
                                </el-form-item> -->

                                <el-form label-width='80px;'  size="small" label-position='right'>
                                    <el-form-item style="text-align:center;">
                                        <el-button type="primary" icon="el-icon-refresh"  style="width: 130px;"  size="small" @click="autoRecloseResetControl">自动重合闸重启</el-button>
                                    </el-form-item>
                                </el-form>
                                <!-- <el-form-item label="">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="autoRecloseResetSet">确定</el-button>
                                    <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceInfoDailog.Isshow = false">取消</el-button>
                                </el-form-item> -->
                            </el-form>
                        </el-col>
                     </el-row>
                </el-tab-pane>
                <el-tab-pane label="设备倾斜阈值设置" name="second">
                    <el-form  :model="deviceInfoDailog.deviceTilt" label-position="right"  label-width="50px" size="small" style="margin-top:20px;">
                        <el-row justify="center" align="center" type="flex">
                            <el-col :span="10" :offset="2">
                                <el-form-item :rules="[{ type: 'number', message: '必须为数字值'}]" label="前">
                                    <template v-slot:label>
                                        <span style="color: #fff;">前：</span>
                                    </template>
                                    <el-input  class="smart-box smart-box-input" style="width:120px" v-model.number="deviceInfoDailog.deviceTilt.frontValue" clearable/><span style="color:#FFF;">度</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="后" :rules="[{ type: 'number', message: '必须为数字值'}]">
                                    <template v-slot:label>
                                        <span style="color: #fff;">后：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width:120px" v-model.number="deviceInfoDailog.deviceTilt.afterValue" clearable/><span style="color:#FFF;">度</span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row justify="center" align="center" type="flex">
                            <el-col :span="10" :offset="2">
                                <el-form-item label="左" :rules="[{ type: 'number', message: '必须为数字值'}]">
                                    <template v-slot:label>
                                        <span style="color: #fff;">左：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width:120px" v-model.number="deviceInfoDailog.deviceTilt.leftValue" clearable/><span style="color:#FFF;">度</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="右" :rules="[{ type: 'number', message: '必须为数字值'}]">
                                    <template v-slot:label>
                                        <span style="color: #fff;">右：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width:120px" v-model.number="deviceInfoDailog.deviceTilt.rightValue" clearable/><span style="color:#FFF;">度</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!-- <el-row justify="center" align="center" type="flex">
                            <el-col :span="10" :offset="2">
                                <el-form-item label="上" :rules="[{ type: 'number', message: '必须为数字值'}]">
                                    <template v-slot:label>
                                        <span style="color: #fff;">上：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width:120px" v-model.number="deviceInfoDailog.deviceTilt.upValue" size="small" clearable/><span style="color:#FFF;">度</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="下" :rules="[{ type: 'number', message: '必须为数字值'}]">
                                    <template v-slot:label>
                                        <span style="color: #fff;">下：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width:120px" v-model.number="deviceInfoDailog.deviceTilt.downValue" size="small" clearable/><span style="color:#FFF;">度</span>
                                </el-form-item>
                            </el-col>
                        </el-row> -->
                        <el-row>
                            <el-col :span="10" :offset="6">
                                <el-form-item style="text-align:center;">
                                        <el-button type="primary" icon="el-icon-refresh"  style="width: 130px;"  size="small" @click="leanThresholdControl">一键倾斜调校</el-button>
                                    </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row >
                            <el-col :span="12" :offset="5">
                                <el-form-item style="text-align:center;">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="leftThresholdSet">确定</el-button>
                                    <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceInfoDailog.Isshow = false">取消</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </smart-box-dialog>

        <smart-box-dialog ref="portDialog" :show.sync="portFlowDialog.Isshow" width="600px" height="380px" title="网络状态监测配置" @closed="closePortDialog" :is-click-mask-close="false">
            <el-row type="flex" justify="center" align="center" style="margin-top:20px;">
                        <el-col :span="15">
                            <el-form  label-width="150px" size="small" ref="ruleForm" :rules="portFlowRules" :model="portFlowDialog">
                                <el-form-item label="监测状态">
                                    <template v-slot:label>
                                        <span style="color: #fff;">监测状态：</span>
                                    </template>
                               <el-select v-model="portFlowDialog.status" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                    <el-option value="1" label="打开" />
                                    <el-option value="0" label="关闭" />
                                </el-select>
                                </el-form-item>
                                <el-form-item label-width="150px" label="ping间隔时间（分）" prop="intervalTime">
                                    <template v-slot:label>
                                        <span style="color: #fff;">ping间隔时间(分)：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="portFlowDialog.intervalTime" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label-width="150px" label="丢包率(%)：" prop="packetRate">
                                    <template v-slot:label>
                                        <span style="color: #fff;">丢包率(%)：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model.number="portFlowDialog.packetRate" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label-width="150px" label="延时（毫秒）" prop="delayedTime">
                                    <template v-slot:label>
                                        <span style="color: #fff;">延时(毫秒)：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="portFlowDialog.delayedTime" size="small" clearable/>
                                </el-form-item>
                            </el-form>
                        </el-col>
                     </el-row>
                    <template v-slot:footer>
                        <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="netWorkStatusSet">确定</el-button>
                        <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="$refs.portDialog.close()">取消</el-button>
                    </template>
        </smart-box-dialog>

        <smart-box-dialog :show.sync="deviceControlDailog.Isshow" :footer-show="false" class="smart-box smart-box-tabs" width="600px" height="400px" title="设备箱控制" :is-click-mask-close="false">
            <el-tabs v-model="tabName">
                <el-tab-pane label="风扇配置" name="first">
                    <el-row type="flex" justify="center" align="center" style="margin-top:20px;">
                        <el-col :span="12">
                            <el-form  label-width="90px" size="small" >
                                <el-form-item label="当前温度">
                                    <template v-slot:label>
                                        <span style="color: #fff;">当前温度：</span>
                                    </template>
                                    <span style="color:#FFF;">{{Math.round(deviceControlDailog.fanControl.nowTemperature * 100)/100 }}℃</span>
                                </el-form-item>

                                <el-form-item label="电源编号">
                                    <template v-slot:label>
                                        <span style="color: #fff;">电源编号：</span>
                                    </template>
                                    <span style="color:#FFF;">{{deviceControlDailog.fanControl.fanPowerId}}</span>
                                </el-form-item>

                                <el-form-item label="控制模式">
                                    <template v-slot:label>
                                        <span style="color: #fff;">控制模式：</span>
                                    </template>
                                    <el-select v-model="deviceControlDailog.fanControl.controlModel" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                        <el-option value="0" label="手动控制" />
                                        <el-option value="1" label="温度控制" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="风扇控制" v-show="deviceControlDailog.fanControl.controlModel === '0'">
                                    <template v-slot:label>
                                        <span style="color: #fff;">风扇控制：</span>
                                    </template>
                                    <el-select v-model="deviceControlDailog.fanControl.control" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                        <el-option value="1" label="打开" />
                                        <el-option value="0" label="关闭" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="温度阈值" v-show="deviceControlDailog.fanControl.controlModel === '1'">
                                    <template v-slot:label>
                                        <span style="color: #fff;">温度阈值：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceControlDailog.fanControl.temperValue" style="width: 180px" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="fanCfgControlOrTemperAtureSet">下发</el-button>
                                    <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceControlDailog.Isshow = false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                     </el-row>
                </el-tab-pane>

                <el-tab-pane label="加热器配置" name="second">
                   <el-row type="flex" justify="center" align="center" style="margin-top:20px;">
                        <el-col :span="12">
                            <el-form  label-width="80px" size="small" label-position='left'>
                                <el-form-item label="当前温度(摄氏度)" label-width="150px">
                                    <template v-slot:label>
                                        <span style="color: #fff;">当前温度(摄氏度)：</span>
                                    </template>
                                    <span style="color:#FFF;">{{Math.round(deviceControlDailog.heaterControl.nowTemperature * 100)/100}}℃</span>
                                </el-form-item>
                                <el-form-item label="电源编号" label-width="150px">
                                    <template v-slot:label>
                                        <span style="color: #fff;">电源编号：</span>
                                    </template>
                                    <span style="color:#FFF;">{{deviceControlDailog.heaterControl.heaterPowerId}}</span>
                                </el-form-item>
                                <el-form-item label="加热控制模式" label-width="150px">
                                    <template v-slot:label>
                                        <span style="color: #fff;">加热控制模式：</span>
                                    </template>
                                    <el-select v-model="deviceControlDailog.heaterControl.controlModel" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                        <el-option value="1" label="温度控制" />
                                        <el-option value="0" label="手动控制" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="加热器控制" label-width="150px" v-show="deviceControlDailog.heaterControl.controlModel === '0'">
                                    <template v-slot:label>
                                        <span style="color: #fff;">加热器控制：</span>
                                    </template>
                                    <el-select v-model="deviceControlDailog.heaterControl.control" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                        <el-option value="1" label="打开" />
                                        <el-option value="0" label="关闭" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="温度阈值" label-width="150px" v-show="deviceControlDailog.heaterControl.controlModel === '1'">
                                    <template v-slot:label>
                                        <span style="color: #fff;">温度阈值：</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceControlDailog.heaterControl.heaterValue" style="width: 180px" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="heaterTemperControOrSet">下发</el-button>
                                    <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceControlDailog.Isshow = false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                     </el-row>
                </el-tab-pane>

                <el-tab-pane label="设备箱控制" name="third">
                    <el-row type="flex" justify="center" align="center" style="margin-top:50px;">
                        <el-col :span="12">
                            <el-form label-width='80px;'  size="small" label-position='right'>
                                <el-form-item style="text-align:center;">
                                    <el-button type="primary" icon="el-icon-refresh-left"  style="width: 120px;"  size="small" @click="deviceRestartControl">设备重启</el-button>
                                </el-form-item>
                                <el-form-item style="text-align:center;">
                                    <el-button type="danger" icon="el-icon-refresh"  style="width: 120px;"  size="small" @click="checkRoleIsControlDevice" >设备重置</el-button>
                                </el-form-item>

                            </el-form>
                        </el-col>
                     </el-row>
                </el-tab-pane>
            </el-tabs>
        </smart-box-dialog>

        <smart-box-dialog :show.sync="deviceResetDialog.isshow" :footer-show="false"  width="600px" height="300px" title="设备重置" :is-click-mask-close="false">
            <el-row type="flex" justify="center" align="center" style="margin-top:50px;">
                <el-col :span="15">
                    <el-form  status-icon  label-width="100px" @submit.native.prevent="deviceResetControl" @keyup.enter="deviceResetControl">
                        <el-form-item label="密码" label-width="80px">
                            <template v-slot:label>
                                <span style="color: #fff;">密码：</span>
                            </template>
                            <el-input class="smart-box smart-box-input" v-model="deviceResetDialog.password" type="password" size="small" clearable/>
                        </el-form-item>
                         <el-form-item label="">
                                <!-- <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click.enter="deviceResetControl">确定</el-button> -->
                                <el-button type="success" native-type="submit" icon="el-icon-check"  style="width: 70px;"  size="small">确定</el-button>
                                <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceResetDialog.isshow = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

        </smart-box-dialog>
    </div>
</template>
<script>
import { default as PE } from "./pe"
import moment from "moment"
export default PE
</script>
<style lang="scss" scoped>

    .box-device {
        width: 100%;
        height: 100%;
        background-image: url(../../assets/Images/box1-close.png);
        background-position: center top;
        background-size: 60% 90%;
        background-repeat: no-repeat;
        text-align: center;
        color: #131F65;
        font-size: 24px;
        font-weight: bold;
        overflow: hidden;
        position:relative;
        &.box-is-open {
            background-image: url(../../assets/Images/box1-open.png);
            background-size: 90% 90%;
            transition: all .6s ease;
        }

        > span {
            display: block;
            margin-top: 15%;
        }
    }

    .box-list-item {
        padding: 12px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .box-list-item:hover  {
        background-color: #01A1B2;
    }

    .box-row {
        margin: 10px 20px;
        &.active {
            background-color: #0c446e;
        }

        > .box-col-item {
            box-sizing: border-box;
            padding: 10px;
            color: #fff;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;


            &.active {
                background-color: #0c446e;
            }
        }
    }

    .box-device-list {
        height: 41px;

        .box-device-list-item {
            background:
                // url(../../assets/Images/outFlagPlus.png),
                none;
            background-repeat: no-repeat, no-repeat;
            background-position: calc(50% - 30px) center, calc(50% + 30px) center;
            background-size: auto auto, auto auto;
            color: #050C3C;
            height: 41px;
            text-indent: calc(50% - 52px);
            line-height: 25px;

            &.video {
                background:
                    url(../../assets/Images/outFlagPlus.png),
                    url(../../assets/Images/outCamera.png);
                background-repeat: no-repeat, no-repeat;
                background-position: calc(50% - 30px) center, calc(50% + 30px) center;
                background-size: auto auto, auto auto;
            }

            &.end-server {
                background:
                    url(../../assets/Images/outFlagPlus.png),
                    url(../../assets/Images/end-server-60-41.png);
                background-repeat: no-repeat, no-repeat;
                background-position: calc(50% - 30px) center, calc(50% + 30px) center;
                background-size: auto auto, auto auto;
            }

            &.fill-light {
                background:
                    url(../../assets/Images/outFlagPlus.png),
                    url(../../assets/Images/fill-light-60-41.png);
                background-repeat: no-repeat, no-repeat;
                background-position: calc(50% - 30px) center, calc(50% + 30px) center;
                background-size: auto auto, auto auto;
            }

            &.flash-light {
                background:
                    url(../../assets/Images/outFlagPlus.png),
                    url(../../assets/Images/flash-light-60-41.png);
                background-repeat: no-repeat, no-repeat;
                background-position: calc(50% - 30px) center, calc(50% + 30px) center;
                background-size: auto auto, auto auto;
            }

            &.ray {
                background:
                    url(../../assets/Images/outFlagPlus.png),
                    url(../../assets/Images/ray-60-41.png);
                background-repeat: no-repeat, no-repeat;
                background-position: calc(50% - 30px) center, calc(50% + 30px) center;
                background-size: auto auto, auto auto;
            }
        }

        .box-device-list-setting {
            width: 90%;
            height: 60px;
            border: 1px solid #00fafe;
            border-radius: 10px;
            background-color: transparent;
            font-size: 14px;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin:0px auto;
        }
    }

    .box-fanIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/fan.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }

        &.active::before {
            background: url(../../assets/Images/fan-active.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
        }
    }

    .box-tempValue {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/temperature-active.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .box-volIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/vol-active.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .box-electricityIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/in-electricity-active.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .box-heaterIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/hot.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
          &.active::before {
            background: url(../../assets/Images/hot-active.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
        }
    }

    .box-numValueIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/numValue.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .box-thunderIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/flash-active.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

</style>