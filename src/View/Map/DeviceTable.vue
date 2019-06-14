<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24" style="padding: 15px;">
            <div class="smart-box smart-box-flex-row">
                <div class="smart-box-flex-column-6 smart-box smart-box-window"
                     style="background:none; width: 360px; height: 100%; z-index: 999; overflow: hidden; float: left;">
                    <div class="smart-box-window-inner"  style="border-radius:0px; border-width: 0px 1px 0px 0px; background: transparent; position:relative; z-index: 999;">
                        <div class="box-tree-panel"></div>
                        <!--树结构-->
                        <div class="smart-box-window-title">区域</div>
                        <div class="smart-box-mechanical-body" style="padding: 0px 30px; box-sizing: border-box;">
                            <el-select class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"
                                       v-model="search.deviceType" style="margin: 10px 0px; width: 300px;">
                                    <el-option value="1" label="摄像机"/>
                                    <el-option value="2" label="光传输设备"/>
                                    <el-option value="3" label="闪光灯"/>
                                    <el-option value="4" label="补光灯"/>
                                    <el-option value="5" label="视屏服务器"/>
                                    <el-option value="6" label="风扇"/>
                            </el-select>
                            <label style="color: #fff;">钟祥市公安局 (5046)</label>
                            <el-tree
                                    class="smart-box smart-box-tree"
                                    ref="tree"
                                    :data="getTreeData"
                                    :props="treeProps"
                                    :render-content="renderTreeNode"
                                    @node-contextmenu="handlerTreeMenuContext"
                                    default-expand-all
                                    show-checkbox
                                    accordion>
                            </el-tree>
<!--                            <el-popover-->
<!--                                    popper-class="smart-box smart-box-popover"-->
<!--                                    ref="map_tree_popover"-->
<!--                                    placement="right-start"-->
<!--                                    :reference="treeNodeItem"-->
<!--                                    v-model="hasOpenTreeMenuContext"-->
<!--                                    width="90">-->
<!--                                <el-row class="box-list-item" style="text-align: center;" type="flex" align="middle">-->
<!--                                    <el-col :span="24">添加区域</el-col>-->
<!--                                </el-row>-->
<!--                                <el-row class="box-list-item" style="text-align: center;" type="flex" align="middle">-->
<!--                                    <el-col :span="24">添加设备</el-col>-->
<!--                                </el-row>-->
<!--                                <el-row class="box-list-item" style="text-align: center;" type="flex" align="middle">-->
<!--                                    <el-col :span="24">删除设备</el-col>-->
<!--                                </el-row>-->
<!--                                <el-row class="box-list-item" style="text-align: center;" type="flex" align="middle">-->
<!--                                    <el-col :span="24">自动上报</el-col>-->
<!--                                </el-row>-->
<!--                            </el-popover>-->
                        </div>
                    </div>
                </div>
                <!--设备列表-->
                <div class="smart-box-flex-column-18 smart-box smart-box-window"
                     style="background:none; width: calc(100% - 360px); height: 100%;padding: 10px 10px  0px 0px;float: right;">
                    <div class="smart-box-window-inner">
                        <div class="smart-box-window-title"
                             style="background-size: 353px;padding: 10px 100px;height: 8%; line-height: 80px; position:relative; ">
                            设备列表
                        </div>
                        <div class="smart-box-mechanical-body" style=" box-sizing: border-box;padding: 0px 100px;height: 100%;width: 100%;">
                            <el-form  label-position="left" label-width="90px" style="padding: 20px 0px">
                                <el-row  type="flex" justify="center" align="center">
                                    <el-col :span="6">
                                        <el-form-item>
                                            <template v-slot:label>
                                                <span style="color:#fff;">设备名称：</span>
                                            </template>
                                            <el-input v-model="search.deviceName" size="small" class="smart-box smart-box-input" style="width: 180px;" clearable>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item>
                                            <template v-slot:label>
                                                <span style="color:#fff;">在线状态：</span>
                                            </template>
                                            <el-select v-model="search.onlineStatus" size="small" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"  style="width: 180px;" clearable>
                                                <el-option value="1" label="在线"/>
                                                <el-option value="0" label="离线"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item>
                                            <template v-slot:label>
                                                <span style="color:#fff;">设备类型：</span>
                                            </template>
                                            <el-select v-model="search.deviceType" size="small" class="smart-box smart-box-select"
                                                       popper-class="smart-box smart-box-popover" style="width: 180px;" clearable>
                                                <el-option value="1" label="摄像机"/>
                                                <el-option value="2" label="光传输设备"/>
                                                <el-option value="3" label="闪光灯"/>
                                                <el-option value="4" label="补光灯"/>
                                                <el-option value="5" label="智能机箱"/>
                                                <el-option value="6" label="风扇"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4" style="text-align: left ;padding: 5px 10px">
                                            <el-button icon="el-icon-search" type="primary"   size="small" @click="queryByParams"> 查询 </el-button>
                                            <el-button icon="el-icon-refresh" type="primary"  size="small"  @click="resetForm('search')"> 重置  </el-button>
                                    </el-col>
                                    <el-col :span="2"  style="text-align: right ;padding: 5px 0px">
                                        <el-button icon="el-icon-map-location" type="primary"  style="background: #E4E7ED;color: black"   size="small" @click="jump"> 地图</el-button>
                                    </el-col>
                                </el-row>
                                <el-row  type="flex" justify="center" align="center">
                                    <el-col :span="6">
                                        <el-button-group>
                                            <el-button size="small" icon="el-icon-plus" type="success" @click="addDevice">新增</el-button>
                                            <el-button size="small" icon="el-icon-edit" type="warning" @click="updateDevice">修改</el-button>
                                            <el-button size="small" icon="el-icon-delete" type="danger" @click="handleDelete">删除</el-button>
                                        </el-button-group>
                                    </el-col>

                                    <el-col :span="6"  :offset="12" style="text-align: right;padding:10px 0px 0px 0px">
                                        <a style="color:#00fafe; text-decoration: none; cursor:pointer;margin-right:20px;" @click="importDevice()"><i class="el-icon-upload2"/>导入</a>
                                        <a style="color:#00fafe; text-decoration: none; cursor:pointer;"><i class="el-icon-download" />导出</a>
                                    </el-col>
                                </el-row>
                            </el-form>

                            <el-table ref="device_table"  :data="rows" height="calc(70% - 60px)" width="100%"
                                      class="smart-box smart-box-table"
                                      style="font-size: 14px;" size="small" stripe>
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                                <el-table-column label="id" align="center" hidden header-align="center" prop="id" v-if="false"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column label="设备名称" align="center" header-align="center" prop="deviceName"
                                                 show-overflow-tooltip></el-table-column>
                                <el-table-column label="设备类型" align="center" header-align="center" prop="deviceType"
                                                 show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.deviceType === 1">摄像机</span>
                                        <span v-if="scope.row.deviceType === 2">光传输设备</span>
                                        <span v-if="scope.row.deviceType === 3">闪光灯</span>
                                        <span v-if="scope.row.deviceType === 4">补光灯</span>
                                        <span v-if="scope.row.deviceType === 5">智能机箱</span>
                                        <span v-if="scope.row.deviceType === 6">风扇</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="设备IP" align="center" header-align="center" prop="boxIP" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column label="在线状态" align="center" header-align="center" prop="onlineStatus" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <i v-if="scope.row.onlineStatus === 1" style="color: #67C23A;" class="fa fa-circle fa-lg"></i>
                                        <i v-if="scope.row.onlineStatus !== 1" style="color: #F56C6C;" class="fa fa-circle fa-lg"></i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="查看详情" align="center" header-align="center" prop="operate" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <i class="el-icon-document" style="cursor:pointer;" @click="$router.push({ name : 'box' })"></i>
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
        </div>
        <!--外设信息添加框-->
        <smart-box-dialog ref="out_device_dialog" Width="940px" Height="460px" :show.sync="hasOutDeviceDialogShow" v-model="deviceForm"
                          :title="'测试标题头'" :wrong="wrong" @closed="handlerOverlayClosed">
            <template v-slot:header="scoped">
                添加外接设备信息
            </template>
            <template v-slot:default="scoped" >
                <el-form label-width="80px" class="demo-ruleForm" label-position="left" label-hight="20px"  size="small" style="padding: 20px 0px 0px 0px">
                    <el-form-item class="form-label-padding">
                        <el-col class="line" :offset="1" style="color: #fff;" :span="3">设备箱名称：</el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-input class="smart-box smart-box-input" size="small" v-model="deviceForm.deviceName" style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" style="color: #fff;" :span="3">外接设备类型：</el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-select   class="smart-box smart-box-select" size="small"
                                             popper-class="smart-box smart-box-popover" v-model="deviceForm.deviceType"
                                             @change="choseDeviceType" style="width: 180px;height: 30px;" clearable>
                                    <el-option value="1" label="摄像机"/>
                                    <el-option value="2" label="光传输设备"/>
                                    <el-option value="3" label="闪光灯"/>
                                    <el-option value="4" label="补光灯"/>
                                    <el-option value="5" label="智能机箱"/>
                                    <el-option value="6" label="风扇"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item class="form-label-padding">
                        <el-col class="line" :offset="1" style="color: #fff;" :span="3">外接设备名称：</el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.outDeviceName"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" style="color: #fff;" :span="3">设备箱IP：</el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.boxIP"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item class="form-label-padding">
                        <el-col class="line" :offset="1" style="color: #fff;" :span="3">厂家名称：</el-col>
                        <el-col :span="8">
                            <el-form-item >
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.factory"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" style="color: #fff;" :span="3">检测状态：</el-col>
                        <el-col :span="8">
                            <el-form-item >
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.checkStatus"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item class="form-label-padding">
                        <el-col class="line" :offset="1" style="color: #fff;" :span="3">端口：</el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.port"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" style="color: #fff;" :span="3">电源端口：</el-col>
                        <el-col :span="8">
                            <el-form-item >
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.powerNum"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item class="form-label-padding">
                        <el-col class="line" :offset="1" style="color: #fff;" :span="3">外接设备IP：</el-col>
                        <el-col :span="8">
                            <el-form-item >
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.outDeviceIP"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" style="color: #fff;" :span="3">联动状态：</el-col>
                        <el-col :span="8">
                            <el-form-item>
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.UnionStatus"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item class="form-label-padding">
                        <el-col class="line" :offset="1" style="color: #fff;" :span="3">检测间隔时间：</el-col>
                        <el-col :span="8">
                            <el-form-item prop="date1">
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.intervalTime"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" style="color: #fff;" :span="3">重启次数：</el-col>
                        <el-col :span="8">
                            <el-form-item prop="date2">
                                <el-input   class="smart-box smart-box-input" size="small" v-model="deviceForm.restartTimes"
                                            style="width: 180px;height: 30px;" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="submitForm">确认</el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed" >取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
        <!--设备信息添加框-->
        <smart-box-dialog ref="device_dialog" Width="500px" Height="420px" :show.sync="hasDialogShow" v-model="deviceForm"
                          :title="'测试标题头'" :wrong="wrong" @closed="handlerOverlayClosed">
            <template v-slot:header="scoped">
                设备新增
            </template>
            <template v-slot:default="scoped">
                <el-row type="flex" justify="center" align="center" style="padding: 20px 0px 0px 0px">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">设备名称：</el-col>
                    <el-input :span="6"  class="smart-box smart-box-input" size="mini" v-model="deviceForm.deviceName"
                              style="width: 180px;height: 30px; padding: 10px 0px; " clearable>
                    </el-input>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">设备类型：</el-col>
                    <el-select v-model="deviceForm.deviceType" size="small"
                               @change="choseDeviceType" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"
                               style="width: 180px; padding: 10px 0px;" clearable>
                        <el-option value="1" label="摄像机"/>
                        <el-option value="2" label="光传输设备"/>
                        <el-option value="3" label="闪光灯"/>
                        <el-option value="4" label="补光灯"/>
                        <el-option value="5" label="智能机箱"/>
                        <el-option value="6" label="风扇"/>
                    </el-select>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">所在区域：</el-col>
                    <el-input :span="6" class="smart-box smart-box-input" size="mini"  v-model="deviceForm.areaName"
                              style="width: 180px;height: 30px; padding: 10px 0px; " clearable>
                    </el-input>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">设备IP：</el-col>
                    <el-input :span="6" class="smart-box smart-box-input" size="mini"  v-model="deviceForm.deviceIP"
                              style="width: 180px;height: 30px; padding: 10px 0px; " clearable>
                    </el-input>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">经纬度：</el-col>
                    <el-col :span="2" style="color: #fff; padding: 15px 10px 10px 0px; text-align: left">
                        <i class="el-icon-map-location"/>
                    </el-col>
                    <el-input :span="3" class="smart-box smart-box-input" size="mini" type="text"  v-model="deviceForm.lat" style="width: 40px;height: 30px; padding: 10px 15px; " clearable></el-input>
                    <el-input :span="3" class="smart-box smart-box-input" size="mini" type="text"  v-model="deviceForm.lon" style="width: 40px;height: 30px; padding: 10px 15px; " clearable></el-input>
                </el-row>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="submitForm">确认</el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed" >取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="import_dialog" Width="550px" Height="270px" :show.sync="hasImportDialogShow"
                          :title="'测试标题头'" :wrong="wrong" @closed="handlerOverlayClosed">
            <template v-slot:header="scoped">
               导入Excel数据
            </template>
            <template v-slot:default="scoped">
               <div style="padding: 40px 10px">
                   <row style="text-align: center ;padding: 20px 0px;height: 20px" >
                       <el-col>
                        <span style="color:#00fafe; font-size: 14px; text-decoration: none; cursor:pointer;">
                            如不清楚Execl样式请先下载模板，批量修改请先到</span>
                       </el-col>
                   </row>
                   <row  style="text-align: center ;padding: 20px 0px;height: 20px">
                       <el-col>
                        <span style="color:#00fafe; font-size: 14px; text-decoration: none; cursor:pointer;">
                            表格上方执行要修改的数据导入，编辑好要修改的字段信息先选择上传的文件
                        </span>
                       </el-col>
                   </row>
               </div>
            </template>
            <template v-slot:footer>
                <el-upload
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-change="openUpdataTable"
                    :auto-upload="true">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="downloadModel">下载模板</el-button>
                </el-upload>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="update_import_dialog"  Width="1000px" Height="580px" :show.sync="hasUpdateImportDialogShow"
                          :title="'测试标题头'" :wrong="wrong" @closed="handlerOverlayClosed">
            <template v-slot:header="scoped">
                导入数据信息
            </template>
            <template v-slot:default="scoped">
                <div style="padding: 20px;text-align: center" >
                    <el-table ref="update_import_table"  :data="importRows" height="380px" width="900px" row-style="height:30px;width:170px"
                              class="smart-box smart-box-table"  style="font-size: 14px;" size="small;;padding: 80px;" stripe
                              @row-dblclick="openUpdateColimn">
                        <el-table-column label="设备名称" align="center" header-align="center" prop="deviceName"
                                         show-overflow-tooltip>
                            <template slot-scope="{row,$index}">
                                <input v-if="row.showInput"   v-model="row.deviceName"/>
                                <span v-if="!row.showInput">{{row.deviceName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备箱IP" align="center" header-align="center" prop="boxIP" >
                            <template slot-scope="{row,$index}">
                                <input v-if="row.showInput"   v-model="row.boxIP"/>
                                <span v-if="!row.showInput">{{row.boxIP}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备类型" align="center" header-align="center" prop="deviceType"
                                         show-overflow-tooltip>
                            <template slot-scope="{row,$index}">
                                <el-select v-model="row.deviceType" size="small"  v-if="row.showInput" clearable>
                                    <el-option value="1" label="摄像机"/>
                                    <el-option value="2" label="光传输设备"/>
                                    <el-option value="3" label="闪光灯"/>
                                    <el-option value="4" label="补光灯"/>
                                    <el-option value="5" label="智能机箱"/>
                                    <el-option value="6" label="风扇"/>
                                </el-select>
                                <span v-if="row.deviceType === '1' && !row.showInput">摄像机</span>
                                <span v-if="row.deviceType === '2' && !row.showInput">光传输设备</span>
                                <span v-if="row.deviceType === '3' && !row.showInput">闪光灯</span>
                                <span v-if="row.deviceType === '4' && !row.showInput">补光灯</span>
                                <span v-if="row.deviceType === '5' && !row.showInput">智能机箱</span>
                                <span v-if="row.deviceType === '6' && !row.showInput">风扇</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="厂家名称" align="center" header-align="center" prop="factory">
                            <template slot-scope="{row,$index}">
                                <input v-if="row.showInput"   v-model="row.factory"/>
                                <span v-if="!row.showInput">{{row.factory}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="检测状态" align="center" header-align="center" prop="checkStatus" >
                            <template slot-scope="{row,$index}">
                                <input v-if="row.showInput"   v-model="row.checkStatus"/>
                                <span v-if="!row.showInput">{{row.checkStatus}}</span>
                            </template>
                        </el-table-column>
                          <el-table-column label="检测次数" align="center" header-align="center" prop="checkTimes" >
                            <template slot-scope="{row,$index}">
                                <input v-if="row.showInput"   v-model="row.checkTimes"/>
                                <span v-if="!row.showInput">{{row.checkTimes}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="showInput" v-if="false" align="center" prop="showInput" header-align="center"/>
                        <el-table-column label="操作" align="center" header-align="center" v-if="ifShowSaveButton"  width="60px">
                            <template slot-scope="{row,$index}">
                                <el-button  v-if="row.showInput"   icon="el-icon-check" type="success" @click="saveUpdateImportData(row)" size="small">

                                </el-button>
<!--                                <i class="el-icon-circle-check" v-if="row.showInput"  @click="saveUpdateImportData(row)"style="color: #F56C6C" ></i>-->
                                <span v-if="!row.showInput"></span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="handlerOverlayClosed">确认</el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed" >取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
    </div>
</template>
<script>
    import {default as DeviceTable} from "./deviceTable"
    export default DeviceTable
</script>

<style lang="scss" scoped>
        .form-label-padding{
            padding: 0px 10px;
            height: 30px;
        }
</style>


