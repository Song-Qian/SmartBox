<template>
    <div class="smart-box smart-box-flex-row" >
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear">
            <div class="smart-box smart-box-window" style="background:none; width: 360px; height: 100%; z-index: 999; overflow: hidden; float: left;">
                <div class="smart-box-window-inner" style="border-radius:0px; border-width: 0px 1px 0px 0px; background: transparent; position:relative; z-index: 999;">
                    <div class="box-tree-panel"></div>
                    <div class="smart-box-window-title">区域</div>
                    <div class="smart-box-window-body" style="padding: 0px 30px; box-sizing: border-box;">
                        <el-select class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" v-model="deviceType" style="margin: 10px 0px; width: 300px;">
                            <el-option value="WTOE-VN" label="WTOE-VN" />
                            <el-option value="WTOE-VE" label="WTOE-VE" />
                            <el-option value="摄像头" label="摄像头" />
                            <el-option value="闪光灯" label="闪光灯" />
                            <el-option value="补光灯" label="补光灯" />
                            <el-option value="终端服务器" label="终端服务器" />
                        </el-select>
                        <label style="color: #fff;">钟祥市公安局 (5046)</label>
                        <el-tree
                            class="smart-box smart-box-tree"
                            :data="getTreeData"
                            :props="treeProps"
                            :render-content="renderTreeNode"
                            default-expand-all
                            show-checkbox
                            accordion>
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="box-container">
                <div class="smart-box smart-box-flex-row vertical">
                    <div class="smart-box-flex-column-4" style="padding: 20px 10px 0px 10px; position: relative; overflow:visible; ">
                        <div class="smart-box smart-box-mechanical" style="transition: all .6s linear; z-index: 999;" :style="{ height: hasExpandDevice ? '450px' : '100%', position : hasExpandDevice ? 'absolute' : 'relative' }">
                            <div class="smart-box-mechanical-inner">
                                <div class="smart-box-mechanical-body">
                                    <el-row v-for="i in 8" type="flex" class="box-device-list"  v-show="hasExpandDevice" justify="space-between" align="center" :key="i">
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                        <el-col class="box-device-list-item" :span="3">{{i}}</el-col>
                                    </el-row>
                                    <el-row class="box-device-list" style="height: auto; margin-top: 20px;" type="flex" justify="center" align="center">
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">1</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[1].trigger, 'smart-box-text-dangle' : videos[1].trigger}" style="cursor:pointer;" @click="getMessage(videos[1])"></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">2</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[2].trigger, 'smart-box-text-dangle' : videos[2].trigger}" style="cursor:pointer;" @click="getMessage(videos[2])"></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">3</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[3].trigger, 'smart-box-text-dangle' : videos[3].trigger}" style="cursor:pointer;" @click="getMessage(videos[3])" ></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">4</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[4].trigger, 'smart-box-text-dangle' : videos[4].trigger}" style="cursor:pointer;" @click="getMessage(videos[4])"></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">5</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[5].trigger, 'smart-box-text-dangle' : videos[5].trigger}" style="cursor:pointer;" @click="getMessage(videos[5])"></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">6</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[6].trigger, 'smart-box-text-dangle' : videos[6].trigger}" style="cursor:pointer;" @click="getMessage(videos[6])" ></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">7</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[7].trigger, 'smart-box-text-dangle' : videos[7].trigger}" style="cursor:pointer;" @click="getMessage(videos[7])" ></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="box-device-list-setting">
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #006584; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="4">
                                                        <span class="fa-stack fa-lg" style="height: 30px; line-height: 30px;">
                                                            <i class="fa fa-circle fa-stack-1x" style="color: #01A1B2;"></i>
                                                            <span class="fa-inverse" style="position:relative; font-size: 12px; top: -2px;">8</span>
                                                        </span>
                                                    </el-col>
                                                    <el-col :span="4"><i class="fa fa-plug"></i></el-col>
                                                    <el-col :span="8">244V</el-col>
                                                    <el-col :span="8">0A</el-col>
                                                </el-row>
                                                <el-row type="flex" style="text-align: center; height: 30px; background-color: #005676; line-height: 30px;" justify="center" align="center">
                                                    <el-col :span="8"><i class="el-icon-switch-button" :class="{ 'smart-box-text-success' : !videos[8].trigger, 'smart-box-text-dangle' : videos[8].trigger}" style="cursor:pointer;" @click="getMessage(videos[8])"></i></el-col>
                                                    <el-col :span="8"><i class="el-icon-refresh-right smart-box-text-warning" style="cursor:pointer;" ></i></el-col>
                                                </el-row>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <i style="color:#00fafe; position:absolute; bottom: 0px; left: 50%; transform: translateY(-50%); cursor:pointer;" :class="{ 'el-icon-arrow-up' : hasExpandDevice, 'el-icon-arrow-down' : !hasExpandDevice }" @click="hasExpandDevice = !hasExpandDevice"></i>
                            </div>
                        </div>
                    </div>
                    <div class="smart-box-flex-column-10 smart-box-flex-column-clear">
                        <div class="smart-box smart-box-flex-row">
                            <div class="smart-box-flex-column-8">
                                <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                                    <div class="smart-box-window-inner">
                                        <div class="smart-box-window-title" style="position:relative;">
                                            设备信息
                                            <i class="el-icon-setting" style="color: #00fafe; top: 10px; right:10px; position:absolute; font-size: 18px; cursor: pointer;" @click="deviceInfoDailog.Isshow = true"></i>
                                        </div>
                                        <div class="smart-box-window-body">
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">设备名称</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">10.255.32.23</el-col>
                                            </el-row>
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">设备型号</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">WT-MS400</el-col>
                                            </el-row>
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">设备IP</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">10.255.32.24</el-col>
                                            </el-row>
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">GIS</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">114.343534534,30.4324234</el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref="device_container" class="smart-box-flex-column-8">
                                <div class="box-device"><span>智能监控站</span></div>
                            </div>
                            <div class="smart-box-flex-column-8">
                                <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                                    <div class="smart-box-window-inner">
                                        <div class="smart-box-window-title">
                                            告警信息
                                        </div>
                                        <div class="smart-box-window-body" style="overflow: auto;">
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="6">设备名称</el-col>
                                                <el-col class="box-col-item" :span="6">设备类型</el-col>
                                                <el-col class="box-col-item" :span="6">异常时间</el-col>
                                                <el-col class="box-col-item" :span="6">处理状态</el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="6">高薪二路路口</el-col>
                                                <el-col class="box-col-item" :span="6">WTOS-VN</el-col>
                                                <el-col class="box-col-item" :span="6">11：03</el-col>
                                                <el-col class="box-col-item smart-box-text-info" :span="6">已忽略</el-col>
                                            </el-row>
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="6">高薪二路路口</el-col>
                                                <el-col class="box-col-item" :span="6">WTOS-VN</el-col>
                                                <el-col class="box-col-item" :span="6">11：03</el-col>
                                                <el-col class="box-col-item smart-box-text-success" :span="6">已完成</el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="6">高薪二路路口</el-col>
                                                <el-col class="box-col-item" :span="6">WTOS-VN</el-col>
                                                <el-col class="box-col-item" :span="6">11：03</el-col>
                                                <el-col class="box-col-item smart-box-text-success" :span="6">已完成</el-col>
                                            </el-row>
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="6">高薪二路路口</el-col>
                                                <el-col class="box-col-item" :span="6">WTOS-VN</el-col>
                                                <el-col class="box-col-item" :span="6">11：03</el-col>
                                                <el-col class="box-col-item smart-box-text-success" :span="6">已完成</el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="6">高薪二路路口</el-col>
                                                <el-col class="box-col-item" :span="6">WTOS-VN</el-col>
                                                <el-col class="box-col-item" :span="6">11：03</el-col>
                                                <el-col class="box-col-item smart-box-text-success" :span="6">已完成</el-col>
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
                                    <div class="smart-box-window-inner">
                                        <div class="smart-box-window-title" style="position:relative;">
                                            端口流量
                                            <i class="el-icon-setting" style="color: #00fafe; top: 10px; right:10px; position:absolute; font-size: 18px; cursor: pointer;" @click="portFlowDialog.Isshow = true"></i>
                                        </div>
                                        <div class="smart-box-window-body">
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">1</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口1&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">2</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口2&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">3</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口3&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">4</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口4&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">5</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口5&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">6</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口6&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">7</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口7&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">8</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口8&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">9</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口9&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="2">
                                                    <span style="width: 16px; height:16px; border-radius: 8px; background-color: #00fafe; display: inline-block; color: #002348;">10</span>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="6">
                                                    端口10&nbsp;&nbsp;0.1M/S
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-unlock smart-box-text-dangle" style="cursor:pointer;"></i>
                                                    <i class="fa fa-power-off smart-box-text-success" style="cursor:pointer;"></i>
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
                                        <div class="smart-box-window-body">
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-dashboard fa-lg"></i>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    输入电压
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    220V
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-dashboard fa-lg"></i>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    输入电流
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    1A
                                                </el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-thermometer-full fa-lg"></i>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    箱内温度
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    41℃
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-flash fa-lg"></i>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    雷击次数
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    10次
                                                </el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <img src="../../assets/Images/fan.png" />
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    风扇状态
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    工作
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <img src="../../assets/Images/hot.png" />
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    加热器状态
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    工作
                                                </el-col>
                                            </el-row>
                                            <el-row class="box-row" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-flash fa-lg"></i>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    防雷器
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    开
                                                </el-col>
                                                <el-col class="box-col-item" :span="1"></el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="3">
                                                    <i class="fa fa-flash fa-lg"></i>
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    防雷器2
                                                </el-col>
                                                <el-col class="box-col-item active" style="padding:10px 0px; text-align:center;" :span="4">
                                                    开
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
                                            <i class="el-icon-setting" style="color: #00fafe; top: 10px; right:10px; position:absolute; font-size: 18px; cursor: pointer;"  @click="deviceControlDailog.Isshow = true"></i>
                                        </div>
                                        <div class="smart-box-window-body">
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">箱门状态</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">
                                                    <el-switch v-model="boxState.boxDoor" size="small" active-color="#13ce66" inactive-color="#ff4949"></el-switch> {{boxState.boxDoor ? '开' : '关'}}
                                                </el-col>
                                            </el-row>
                                            
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">布防状态</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">
                                                    <el-switch v-model="boxState.boxDefense" active-color="#13ce66" inactive-color="#ff4949"></el-switch> {{boxState.boxDefense ? '开' : '关'}}
                                                </el-col>
                                            </el-row>
                                            
                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">风扇开关</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">
                                                    <el-switch v-model="boxState.boxSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch> {{boxState.boxSwitch ? '开' : '关'}}
                                                </el-col>
                                            </el-row>

                                            <el-row class="box-row active" type="flex" justify="center" align="center">
                                                <el-col class="box-col-item" :span="12">设备倾斜一键调校</el-col>
                                                <el-col class="box-col-item" style="text-align: right;" :span="12">
                                                    <el-switch v-model="boxState.boxTilt" active-color="#13ce66" inactive-color="#ff4949"></el-switch> {{boxState.boxTilt ? '开' : '关'}}
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <smart-box-dialog :show.sync="deviceInfoDailog.Isshow" :footer-show="false" width="600px" height="400px" title="设备阈值设置" is-click-mask-close>
            <el-tabs v-model="tabName" class="smart-box smart-box-tabs">
                <el-tab-pane label="自动重合闸" name="first">
                    <el-row type="flex" justify="center" align="center" style="margin-top:20px;">
                        <el-col :span="12">
                            <el-form  label-width="80px" size="small" >
                                <el-form-item label="过压阈值">
                                    <template v-slot:label>
                                        <span style="color: #fff;">过压阈值</span>
                                    </template>
                                <el-input class="smart-box smart-box-input" style="width: 180px" v-model="deviceInfoDailog.automatic.overValue" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="欠压阈值">
                                    <template v-slot:label>
                                        <span style="color: #fff;">欠压阈值</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="deviceInfoDailog.automatic.underValue" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="漏电阈值">
                                    <template v-slot:label>
                                        <span style="color: #fff;">漏电阈值</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="deviceInfoDailog.automatic.leakValue" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="控制能力">
                                    <template v-slot:label>
                                        <span style="color: #fff;">控制能力</span>
                                    </template>
                                    <el-button type="primary" icon="el-icon-refresh"  style="width: 70px;"  size="small">重启</el-button>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="deviceInfoDailog.Isshow = false">确定</el-button>
                                    <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceInfoDailog.Isshow = false">取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                     </el-row>
                </el-tab-pane>
                <el-tab-pane label="设备倾斜调校" name="second">
                    <el-form label-position="right"  label-width="50px" size="small" style="margin-top:20px;">
                        <el-row justify="center" align="center" type="flex">
                            <el-col :span="10">
                                <el-form-item label="前">
                                    <template v-slot:label>
                                        <span style="color: #fff;">前</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceInfoDailog.deviceTilt.frontValue" size="small" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="后">
                                    <template v-slot:label>
                                        <span style="color: #fff;">后</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceInfoDailog.deviceTilt.afterValue" size="small" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                        <el-row justify="center" align="center" type="flex">
                            <el-col :span="10">
                                <el-form-item label="左">
                                    <template v-slot:label>
                                        <span style="color: #fff;">左</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceInfoDailog.deviceTilt.leftValue" size="small" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="右">
                                    <template v-slot:label>
                                        <span style="color: #fff;">右</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceInfoDailog.deviceTilt.rightValue" size="small" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row justify="center" align="center" type="flex">
                            <el-col :span="10">
                                <el-form-item label="上">
                                    <template v-slot:label>
                                        <span style="color: #fff;">上</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceInfoDailog.deviceTilt.upValue" size="small" clearable/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="下">
                                    <template v-slot:label>
                                        <span style="color: #fff;">下</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceInfoDailog.deviceTilt.downValue" size="small" clearable/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row justify="center" align="center" type="flex">
                            <el-col :span="24">
                                <el-form-item style="text-align:center;">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="deviceInfoDailog.Isshow = false">确定</el-button>
                                    <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceInfoDailog.Isshow = false">取消</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </smart-box-dialog>

        <smart-box-dialog :show.sync="portFlowDialog.Isshow" width="600px" height="380px" title="网络状态监测配置" is-click-mask-close>
            <el-row type="flex" justify="center" align="center" style="margin-top:20px;">
                        <el-col :span="15">
                            <el-form  label-width="150px" size="small" >
                                <el-form-item label="监测状态">
                                    <template v-slot:label>
                                        <span style="color: #fff;">监测状态</span>
                                    </template>
                               <el-select v-model="portFlowDialog.status" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                    <el-option value="打开" label="打开" />
                                    <el-option value="关闭" label="关闭" />
                                </el-select>
                                </el-form-item>
                                <el-form-item label-width="150px" label="ping间隔时间（分）">
                                    <template v-slot:label>
                                        <span style="color: #fff;">ping间隔时间（分）</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="portFlowDialog.intervalTime" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label-width="150px" label="丢包率（%）">
                                    <template v-slot:label>
                                        <span style="color: #fff;">丢包率（%）</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="portFlowDialog.packetRate" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label-width="150px" label="延时（毫秒）">
                                    <template v-slot:label>
                                        <span style="color: #fff;">延时（毫秒）</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" style="width: 180px" v-model="portFlowDialog.delayedTime" size="small" clearable/>
                                </el-form-item>
                            </el-form>
                        </el-col>
                     </el-row>
                    <template v-slot:footer>
                        <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="portFlowDialog.Isshow = false">确定</el-button>
                        <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="portFlowDialog.Isshow = false">取消</el-button>
                    </template>
        </smart-box-dialog>

        <smart-box-dialog :show.sync="deviceControlDailog.Isshow" :footer-show="false" class="smart-box smart-box-tabs" width="600px" height="400px" title="设备箱控置" is-click-mask-close>
            <el-tabs v-model="tabName">
                <el-tab-pane label="风扇配置" name="first">
                    <el-row type="flex" justify="center" align="center" style="margin-top:20px;">
                        <el-col :span="12">
                            <el-form  label-width="80px" size="small" >
                                <el-form-item label="当前温度">
                                    <template v-slot:label>
                                        <span style="color: #fff;">当前温度</span>
                                    </template>
                                    <span style="color:#FFF;">{{deviceControlDailog.fanControl.nowTemperature}}</span>
                                </el-form-item>
                                <el-form-item label="控制模式">
                                    <template v-slot:label>
                                        <span style="color: #fff;">控制模式</span>
                                    </template>
                                    <el-select v-model="deviceControlDailog.fanControl.controlModel" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                        <el-option value="手动控制" label="手动控制" />
                                        <el-option value="温度控制" label="温度控制" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="风扇控制">
                                    <template v-slot:label>
                                        <span style="color: #fff;">风扇控制</span>
                                    </template>
                                    <el-select v-model="deviceControlDailog.fanControl.control" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                        <el-option value="打开" label="打开" />
                                        <el-option value="关闭" label="关闭" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="deviceControlDailog.Isshow = false">下发</el-button>
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
                                        <span style="color: #fff;">当前温度(摄氏度)</span>
                                    </template>
                                    <span style="color:#FFF;">{{deviceControlDailog.heaterControl.nowTemperature}}</span>
                                </el-form-item>
                                <el-form-item label="加热控制模式" label-width="150px">
                                    <template v-slot:label>
                                        <span style="color: #fff;">加热控制模式</span>
                                    </template>
                                    <el-select v-model="deviceControlDailog.heaterControl.controlModel" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 180px"  clearable>
                                        <el-option value="温度控制" label="温度控制" />
                                        <el-option value="手动控制" label="手动控制" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="温度阈值" label-width="150px">
                                    <template v-slot:label>
                                        <span style="color: #fff;">温度阈值</span>
                                    </template>
                                    <el-input class="smart-box smart-box-input" v-model="deviceControlDailog.heaterControl.heaterValue" style="width: 180px" size="small" clearable/>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="deviceControlDailog.Isshow = false">下发</el-button>
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
                                    <el-button type="primary" icon="el-icon-refresh-left"  style="width: 120px;"  size="small" >设备重启</el-button>
                                </el-form-item>
                                <el-form-item style="text-align:center;">
                                    <el-button type="primary" icon="el-icon-refresh"  style="width: 120px;"  size="small" >设备重置</el-button>
                                </el-form-item>
                                
                            </el-form>
                        </el-col>
                     </el-row>
                </el-tab-pane>
            </el-tabs>
        </smart-box-dialog>
    </div>
</template>
<script>
import { default as Box } from "./box" 
export default Box
</script>
<style lang="scss" scoped>

    .box-tree-panel {
        position: absolute;
        z-index: -1;
        background-color: rgba(1, 161, 178, .2);
        width: 100%;
        height: 100%;
    }

    .box-scrub {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        filter: blur(20px);
        background: rgba(1, 161, 178, .2);
        background-size: 100% 100%;
        background-attachment: fixed;
        background-position: left top;
        z-index: 998;
        margin: -20px;
    }

    .box-container {
        width: calc(100% - 360px);
        height: 100%;
        float: left;
    }

    .box-device {
        width: 100%;
        height: 100%;
        background-image: url(../../assets/Images/box.png);
        background-position: center center;
        background-size: 60% 80%;
        background-repeat: no-repeat;
        text-align: center;
        color: #131F65;
        font-size: 24px;
        font-weight: bold;
        overflow: hidden;

        > span {
            display: block;
            margin-top: 20%;
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
        height: 40px;

        .box-device-list-item {
            background:
                url(../../assets/Images/flag.png),
                url(../../assets/Images/camera.png);
            background-repeat: no-repeat, no-repeat;
            background-position: 25% center, 75% center;
            background-size: auto auto, auto auto;
            color: #050C3C;
            height: 40px;
            text-indent: 25%;
            line-height: 30px;
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
</style>