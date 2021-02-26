<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" xmlns:color="http://www.w3.org/1999/xhtml">
    <div ref="container" class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear">
            <div class="smart-box smart-box-window"
                 style="position:relative; float:left; background:none; width: 280px; height: 100%; z-index: 999; transition: width .6s ease;" :style="{ width : !hasFold ? '280px' : '0px' }">
                <div class="map-scrub"></div>
                <div class="map-fold" :class="{ 'unfold' : hasFold }"  @click="hasFold = !hasFold"><i :class="{ 'el-icon-caret-right' : hasFold, 'el-icon-caret-left' : !hasFold }"></i></div>
                <div class="smart-box-window-inner"
                     style="border-radius:0px; border-width: 0px 1px 0px 0px; background: transparent; position:relative; z-index: 999;">
                    <div class="box-tree-panel"></div>
                    <!--树结构-->
                    <div class="smart-box-window-title">区域</div>
                    <div class="smart-box-window-body" style="padding: 0px 30px; box-sizing: border-box; overflow-y:auto;">
                        <el-select class="smart-box smart-box-select" size="small"
                                   popper-class="smart-box smart-box-popover"
                                   v-model="search.deviceType" style="margin: 15px 0px; width: 220px;"
                                   @change="loadTreeNodeByCheckBox" clearable>
                            <el-option
                                    v-for="item in deviceType"
                                    :key="item.typeCode"
                                    :label="item.typeName"
                                    :value="item.typeCode">
                            </el-option>
                        </el-select>
                        <el-tree
                                class="smart-box smart-box-tree"
                                ref="tree"
                                node-key="id"
                                :data.sync="treeData"
                                :props="{ label: 'name', children: 'children', isLeaf: 'leaf' }"
                                :load="loadTreeNode"
                                lazy>
                            <template v-slot:default="scoped">
                                <div @click.stop="handlerTreeNodeDbClick(scoped.node)">
                                    <span class="el-tree-node__label" v-if="scoped.node.data.type === 'area'" :title="scoped.node.label">
                                        <img src="../../assets/Images/area.png" /> {{scoped.node.label}} {{ handlerCalcTreeNodeTotal(scoped.node.data.id) }}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-info' : !scoped.node.data.isOnline, 'smart-box-text-dangle' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1, 'smart-box-text-success' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) === -1 }" v-if="scoped.node.data.type === 'WTOS-VE'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/light-view.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1" src="../../assets/Images/light-view-active-dangle.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) == -1" src="../../assets/Images/light-view-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-info' : !scoped.node.data.isOnline, 'smart-box-text-dangle' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1, 'smart-box-text-success' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) === -1 }" v-if="scoped.node.data.type === 'WTOS-VN'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/box.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1" src="../../assets/Images/box-active-dangle.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) == -1" src="../../assets/Images/box-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-info' : !scoped.node.data.isOnline, 'smart-box-text-dangle' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1, 'smart-box-text-success' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) === -1 }" v-if="scoped.node.data.type === 'WTOS-VN-PE'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/pe.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1" src="../../assets/Images/pe-active-dangle.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) == -1" src="../../assets/Images/pe-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-info' : !scoped.node.data.isOnline, 'smart-box-text-dangle' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1, 'smart-box-text-success' : scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) === -1 }" v-if="scoped.node.data.type === 'WTOS-VN-TME200'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/semaphore.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) > -1" src="../../assets/Images/semaphore-active-dangle.png" />
                                        <img v-if="scoped.node.data.isOnline && exceptionDeviceList.indexOf(scoped.node.data.id) == -1" src="../../assets/Images/semaphore-active.png" />
                                        <i class="fa fa-circle" style='color: #E6A23C;' v-if="scoped.node.data.flash" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-success' : scoped.node.data.isOnline, 'smart-box-text-info' : !scoped.node.data.isOnline }" v-if="scoped.node.data.type == '1'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/fill-light.png" />
                                        <img v-else src="../../assets/Images/fill-light-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-success' : scoped.node.data.isOnline, 'smart-box-text-info' : !scoped.node.data.isOnline }" v-if="scoped.node.data.type == '2'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/flash-light.png" />
                                        <img v-else src="../../assets/Images/flash-light-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-success' : scoped.node.data.isOnline, 'smart-box-text-info' : !scoped.node.data.isOnline }" v-if="scoped.node.data.type == '3'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/video.png" />
                                        <img v-else src="../../assets/Images/video-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-success' : scoped.node.data.isOnline, 'smart-box-text-info' : !scoped.node.data.isOnline }" v-if="scoped.node.data.type == '4'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/terminal.png" />
                                        <img v-else src="../../assets/Images/terminal-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-success' : scoped.node.data.isOnline, 'smart-box-text-info' : !scoped.node.data.isOnline }" v-if="scoped.node.data.type == '5'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/ray.png" />
                                        <img v-else src="../../assets/Images/ray-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                    <span class="el-tree-node__label" :class="{ 'smart-box-text-success' : scoped.node.data.isOnline, 'smart-box-text-info' : !scoped.node.data.isOnline }" v-if="scoped.node.data.type == '6'" :title="scoped.node.label">
                                        <img v-if="!scoped.node.data.isOnline" src="../../assets/Images/signal.png" />
                                        <img v-else src="../../assets/Images/signal-active.png" />
                                        {{scoped.node.label || scoped.node.data.deviceIP}}
                                    </span>
                                </div>
                            </template>
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="box-container" :style="{ width : !hasFold ? 'calc(100% - 360px)' : '100%' }" >
                <div class="smart-box smart-box-flex-row vertical">
                    <div class="smart-box-flex-column-24">
                        <div class="smart-box smart-box-window"
                             style="height: 100%; padding-top:10px; box-sizing: border-box; background: none; ">
                            <div class="smart-box-window-inner">
                                <div class="smart-box-window-title"
                                     style="background-size: 353px;padding: 10px 0px;height: 8%; line-height: 80px;position:relative; ">
                                    设备列表
                                    <el-button-group style="position: absolute; right: 0px; top : 50%; transform: translate(-50%, -50%)" >
                                        <el-button  type="primary" size="small" icon="el-icon-map-location"   @click="$router.push({ name : 'map'})">地图</el-button>
                                        <el-button   size="small" icon="el-icon-map-location"  disabled  @click="$router.push({ name : 'map'})">列表</el-button>
                                    </el-button-group>
                                </div>
                                <div class="smart-box-mechanical-body"
                                     style=" box-sizing: border-box;padding: 0px 30px;height: 100%;width: 100%;">
                                    <el-form label-position="left" label-width="90px" style="padding-top: 30px">
                                        <el-row type="flex" justify="center" align="center" style="height: 60px">
                                            <el-col :span="6">
                                                <el-form-item prop="deviceName">
                                                    <template v-slot:label>
                                                        <span style="color:#fff;">设备名称：</span>
                                                    </template>
                                                    <el-input v-model="search.deviceName" size="small"
                                                              class="smart-box smart-box-input" style="width: 80%;"
                                                              @input="() => { pagination.currentPage = 1}"
                                                              clearable>
                                                    </el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item prop="onlineStatus">
                                                    <template v-slot:label>
                                                        <span style="color:#fff;">在线状态：</span>
                                                    </template>
                                                    <el-select v-model="search.onlineStatus" size="small"
                                                               class="smart-box smart-box-select"
                                                               popper-class="smart-box smart-box-popover"
                                                               @input="() => { pagination.currentPage = 1,queryTable() }"
                                                               style="width: 80%;" clearable>
                                                        <el-option value="1" label="在线"/>
                                                        <el-option value="0" label="离线"/>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item prop="deviceType">
                                                    <template v-slot:label>
                                                        <span style="color:#fff;">设备类型：</span>
                                                    </template>
                                                    <el-select v-model="search.deviceType" size="small"
                                                               class="smart-box smart-box-select"
                                                               popper-class="smart-box smart-box-popover"
                                                               @input="() => { pagination.currentPage = 1,queryTable() }"
                                                               style="width: 80%;" clearable>
                                                        <el-option
                                                                v-for="item in deviceType"
                                                                :key="item.typeCode"
                                                                :label="item.typeName"
                                                                :value="item.typeCode">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6" style="text-align: left ;padding: 5px 10px">
                                                <el-button icon="el-icon-search" type="primary" size="small"
                                                           @click="queryTable"> 查询
                                                </el-button>
                                                <el-button icon="el-icon-refresh" type="primary" size="small"
                                                           @click="resetForm('search')"> 重置
                                                </el-button>
                                            </el-col>
                                        </el-row>
                                        <el-row type="flex" justify="center" align="center" style="height: 50px;padding-top: 10px">
                                            <el-col :span="6">
                                                <el-button-group>
                                                    <el-button size="small" icon="el-icon-plus" type="success" @click="openDeviceEdit">新增</el-button>
                                                    <el-button size="small" icon="el-icon-edit" type="warning" @click="modifyDevice">修改</el-button>
                                                    <el-button size="small" icon="el-icon-delete" type="danger" @click="handlerDropDevice">删除</el-button>
                                                    <el-button size="small" icon="el-icon-copy-document" type="primary" @click="hasDivisionDialogShow = true">区域划分</el-button>
                                                </el-button-group>
                                            </el-col>

                                            <el-col :span="6" :offset="12"
                                                    style="text-align: right;padding:10px 0px 0px 0px">
                                                <a style="color:#00fafe; text-decoration: none; cursor:pointer;margin-right:20px;"
                                                   @click="importDevicePoint()"><i class="el-icon-upload2"/>导入设备经纬度</a>
                                                <a style="color:#00fafe; text-decoration: none; cursor:pointer;margin-right:20px;"
                                                   @click="importDevice()"><i class="el-icon-upload2"/>导入</a>
                                                <a style="color:#00fafe;  text-decoration: none; cursor:pointer;"
                                                   @click="downloadModel"><i class="el-icon-download"/>导出</a>
                                            </el-col>
                                        </el-row>
                                    </el-form>

                                    <el-table ref="device_table" :data="rows" height="calc(70% - 60px)" width="100%"
                                              class="smart-box smart-box-table"
                                              style="font-size: 14px;" size="small"
                                              stripe>
                                        <el-table-column label="" width="55">
                                            <template slot-scope="scope">
                                                <el-checkbox v-bind:value="selectRow && selectRow.deviceType === scope.row.deviceType
                                                &&selectRow.id === scope.row.id"
                                                             @change="getTableRow(scope.row,scope.$index)">
                                                </el-checkbox>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="id" align="center" hidden header-align="center"
                                                         prop="id" v-if="false"
                                                         show-overflow-tooltip></el-table-column>
                                        <el-table-column label="devId" align="center" hidden header-align="center"
                                                         prop="devId" v-if="false"
                                                         show-overflow-tooltip></el-table-column>
                                        <el-table-column label="站点名称" align="center" header-align="center"
                                                         prop="siteName" show-overflow-tooltip>
                                            <template slot-scope="{row}">
                                                <a v-if="row.deviceType != 'WTOS-VE'" href="#" style="text-decoration:none;color: #409EFF;"
                                                   @click="$router.push({ name : 'box',params : {id : row.devId} })">
                                                    {{row.siteName}}</a>
                                                <span  v-if="row.deviceType == 'WTOS-VE'"> {{row.siteName}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="设备名称" align="center" header-align="center"
                                                         prop="deviceName" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="设备类型" align="center" header-align="center"
                                                         prop="deviceType" show-overflow-tooltip>
                                            <template slot-scope="{row}">
                                                <span>{{deviceTypeMap.get(row.deviceType)?deviceTypeMap.get(row.deviceType):row.deviceType}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="设备IP" align="center" header-align="center" prop="ip"
                                                         show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="在线状态" align="center" header-align="center"
                                                         prop="" show-overflow-tooltip>
                                            <template slot-scope="{row}">
                                                <i v-if="row.isOnline !== 1" style="color: #F56C6C;"
                                                   class="fa fa-circle fa-lg"></i>
                                                <i v-if="row.isOnline === 1" style="color: #67C23A;"
                                                   class="fa fa-circle fa-lg"></i>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="同步状态" align="center" header-align="center"
                                                         prop="syncStatus" show-overflow-tooltip>
                                            <template slot-scope="{row}">
                                                <span style="color: #FFFFFF" v-if="row.syncStatus !== 1">未同步</span>
                                                <span style="color: #FFFFFF" v-if="row.syncStatus === 1">已同步</span>
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
            </div>
        </div>
        <smart-box-dialog :show.sync="hasDivisionDialogShow" title="区域划分" width="800px" height="520px" :is-click-mask-close="false">
            <el-row justify="center" align="center" type="flex" style="margin: 10px 20px;">
                <el-col :span="24">
                    <el-form label-width="0px" label-position="left" size="mini" inline>
                        <el-form-item style="margin-bottom: 0px;">
                            <el-input type="text" class="smart-box smart-box-input" v-model="searchDeviceName" placeholder="请输入筛选的设备名称"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 0px;">
                            <el-button type="primary" @click="handlerDeviceList" round>筛选</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div style="padding: 0px 20px 30px 20px; box-sizing: border-box; display: flex; flex-flow: row nowrap; width: 100%; height: calc(100% - 65px);">
                <div style='flex: 0 0 calc(50% - 10px); overflow: hidden;'>
                    <el-table :data="deviceTableData" ref="divisionTable" width="100%" height="100%" size="mini" class="smart-box smart-box-table" style="font-size: 14px;" @selection-change="handleSelectionChange" stripe>
                        <el-table-column type="selection" align="center" header-align="center"></el-table-column>
                        <el-table-column label="设备名称" prop="deviceName" align="center" header-align="center"></el-table-column>
                        <el-table-column label="设备IP" prop="ip" align="center" header-align="center"></el-table-column>
                        <template v-slot:empty>
                            <span style="color: #909399; font-size: 14px;">暂无数据</span>
                        </template>
                    </el-table>
                </div>
                <div style='flex: 0 0 20px; overflow: hidden; color: #fff; align-self: center; text-align: center;'>
                    <i class="el-icon-sort" style="transform: rotate(90deg);"></i>
                </div>
                <div style='flex: 0 0 calc(50% - 10px); overflow: hidden;'>
                    <div class="device-division-tree">
                        <div class="device-division-header">
                            <span style="color: #fff;">所属区域</span>
                        </div>
                        <div class="device-division__wapper">
                            <div class="device-division-body">
                                <el-tree
                                    class="smart-box smart-box-tree"
                                    node-key="guid"
                                    ref="divisionTree"
                                    :data.sync="areaTreeData"
                                    :props="{ label: 'name', children: 'children', isLeaf: 'leaf' }"
                                    :load="loadAreaNode"
                                    @node-click="handlerTreeNodeClick"
                                    highlight-current
                                    lazy>
                                        <template v-slot:default="scoped">
                                            <div>
                                                <span class="el-tree-node__label" :title="scoped.node.label">
                                                    <img src="../../assets/Images/area.png" /> {{scoped.node.label}}
                                                </span>
                                            </div>
                                        </template>
                                </el-tree>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="modifyDeviceToArea">确认</el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="cancleModifyDeviceToArea">取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
        <!--外设信息添加框-->
        <smart-box-dialog ref="outDeviceDialog" :show.sync="hasOutDeviceDialogShow"  width="860px" height="480px"
                          :title="deviceTitle" @closed="handlerCancelDevice"
                          :IsClickMaskClose="false">
            <template v-slot:default>
                <el-form
                        ref="outDeviceForm"
                        label-width="140px"
                        label-position="right"
                        :rules="outDeviceRules"
                        :model="deviceModel"
                        class="map-device-form"
                        size="small">
                    <el-row type="flex" justify="center" align="center">
                        <el-col :span="12">
                            <el-form-item prop="name">
                                <template v-slot:label>
                                    <span style="color: #fff;">设备名称：</span>
                                </template>
                                <span style="color: #fff;">{{deviceModel.name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="deviceIP">
                                <template v-slot:label>
                                    <span style="color: #fff;">设备IP：</span>
                                </template>
                                <span style="color: #fff;">{{deviceModel.deviceIP}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="center">
                        <el-col :span="12">
                            <el-form-item prop="deviceType">
                                <template v-slot:label>
                                    <span style="color: #fff;">外接设备类型：</span>
                                </template>
                                <el-select v-if="deviceModel.state === 'add'" class="smart-box smart-box-select"
                                           value-key="value"    @change="outDeviceTypeChange"
                                           popper-class="smart-box smart-box-popover" style="width: 100%;"
                                           v-model="deviceModel.type">
                                    <el-option v-for="(item, n) in deviceType" :label="item.typeName"
                                               :value="item.typeCode"
                                               :key="n"
                                               v-show=" outDeviceTypeMap.has(item.typeCode) &&
                                               (deviceModel.mainDeviceType === 'WTOS-VN'&& item.typeCode!=='6'
                                               || deviceModel.mainDeviceType === 'WTOS-VN-TME200'&& item.typeCode==='6'
                                               || deviceModel.mainDeviceType === 'WTOS-VN-PE'&& item.typeCode!=='6')">
                                    </el-option>
                                </el-select>
                                <span v-if="deviceModel.state === 'modify'" style="color: #fff;">{{deviceTypeMap.get(deviceModel.type)}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="otherDeviceIP" :required="(['3', '5', '6'].indexOf(deviceModel.type) > -1)">
                                <template v-slot:label>
                                    <span style="color: #fff;">外接设备IP：</span>
                                </template>
                                <el-input v-if="deviceModel.state === 'add'" class="smart-box smart-box-input"
                                          v-model="deviceModel.otherDeviceIP"
                                          :disabled="(['1', '2'].indexOf(deviceModel.type) > -1)"
                                          style="width: 100%;"></el-input>
                                <span v-if="deviceModel.state === 'modify'" style="color: #fff;">
                                    {{deviceModel.otherDeviceIP === '0.0.0.0'?'':deviceModel.otherDeviceIP }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="center">
                        <el-col :span="12">
                            <el-form-item prop="otherDeviceName">
                                <template v-slot:label>
                                    <span style="color: #fff;">外接设备名称：</span>
                                </template>
                                <el-input class="smart-box smart-box-input" v-model="deviceModel.otherDeviceName"
                                          style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="energyNo" :required="(['2','1'].indexOf(deviceModel.type) > -1)">
                                <template v-slot:label>
                                    <span style="color: #fff;">电源通道：</span>
                                </template>
                                <el-input class="smart-box smart-box-input" v-model.number="deviceModel.energyNo"
                                          :disabled="(['6'].indexOf(deviceModel.type) > -1)"
                                          style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="center">
                        <el-col :span="12">
                            <el-form-item prop="companyName">
                                <template v-slot:label>
                                    <span style="color: #fff;">厂家名称：</span>
                                </template>
                                <el-input class="smart-box smart-box-input" v-model="deviceModel.companyName"
                                          style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="port"  :required="(['3', '5'].indexOf(deviceModel.type) > -1)" >
                                <template v-slot:label>
                                    <span style="color: #fff;">网口：</span>
                                </template>
                                <el-input class="smart-box smart-box-input"  v-model.number="deviceModel.port"
                                          :disabled="!(['3', '5'].indexOf(deviceModel.type) > -1)" style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="center">
                        <el-col :span="12">
                            <el-form-item prop="interactionState">
                                <template v-slot:label>
                                    <span style="color: #fff;">联动状态：</span>
                                </template>
                                <el-select class="smart-box smart-box-select" value-key="value"
                                           popper-class="smart-box smart-box-popover" style="width: 100%;"
                                            v-model="deviceModel.interactionState"
                                           :disabled="!(['5'].indexOf(deviceModel.type) > -1)">
                                    <el-option v-for="(item, n) in listenStateList" :label="item.label"
                                               :value="item.value" :key="n"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="power">
                                <template v-slot:label>
                                    <span style="color: #fff;">功率(W)：</span>
                                </template>
                                <el-input class="smart-box smart-box-input"  :disabled="!(['3', '1'].indexOf(deviceModel.type) > -1)"
                                          v-model="deviceModel.power" style="width: 100%;"></el-input>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="center">
                        <el-col :span="12">
                            <el-form-item prop="openPlanCheck">
                                <template v-slot:label>
                                    <span style="color: #fff;">计划开启时间：</span>
                                </template>
                                <el-time-picker
                                        class="smart-box smart-box-time-select"
                                        popper-class="smart-box smart-box-popover"
                                        value-format="HH:mm"
                                        style="width: 100%;"
                                        :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
                                        v-model="deviceModel.openPlanCheck"
                                        :disabled="['2', '3','5','6'].indexOf(deviceModel.type) > -1">
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="closePlanCheck">
                                <template v-slot:label>
                                    <span style="color: #fff;">计划关闭时间：</span>
                                </template>
                                <el-time-picker
                                        class="smart-box smart-box-time-select"
                                        popper-class="smart-box smart-box-popover"
                                        value-format="HH:mm"
                                        style="width: 100%;"
                                        :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
                                        v-model="deviceModel.closePlanCheck"
                                        :disabled="['2', '3','5','6'].indexOf(deviceModel.type) > -1">
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="center">
                        <el-col :span="12">
                            <el-form-item prop="percent">
                                <template v-slot:label>
                                    <span style="color: #fff;">占空比(%)：</span>
                                </template>
                                <el-input class="smart-box smart-box-input"
                                          :disabled="!([ '1'].indexOf(deviceModel.type) > -1)"
                                          v-model="deviceModel.percent" style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
<!--                            <el-form-item prop="checkTimes">-->
<!--                            <template v-slot:label>-->
<!--                                <span style="color: #fff;">检测次数:</span>-->
<!--                            </template>-->
<!--                            <el-input class="smart-box smart-box-input"-->
<!--                                      :disabled="!([ '1', '2', '3'].indexOf(deviceModel.type) > -1)"-->
<!--                                      v-model="deviceModel.checkTimes" style="width: 100%;"></el-input>-->
<!--                            </el-form-item>-->
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" :disabled="hasDisabledAreaSubmit"
                               @click="handlerSaveOutDevice">确认
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerCancelDevice">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
        <!--设备信息添加框-->
        <smart-box-dialog ref="deviceDialog" :show.sync="hasDeviceDialogShow" :width="520"
                          :height="400" :title="deviceTitle" @closed="handlerCancelDevice"
                          :IsClickMaskClose="false">
            <template v-slot:default>
                <el-form
                        ref="deviceForm"
                        :label-width="getLabelWidth"
                        label-position="right"
                        :rules="deviceRules"
                        :model="deviceModel"
                        class="map-device-form"
                        size="small">
                    <el-form-item
                            :class="{ 'map-device-form-item' : !hasAddMainDevice }"
                            prop="type">
                        <template v-slot:label>
                            <span style="color: #fff;">设备类型：</span>
                        </template>
                        <el-select v-if="deviceModel.state === 'add'" class="smart-box smart-box-select"
                                   value-key="value"
                                   popper-class="smart-box smart-box-popover" style="width: 90%;"
                                   v-model="deviceModel.type" @input="handlerDevictTypeChange">
                            <el-option v-for="(item, n) in deviceType" :label="item.typeName" :value="item.typeCode"
                                       :key="n"
                                       v-show=" deviceModel.state === 'add'  && mainDeviceTypeMap.has(item.typeCode)">
                            </el-option>
                        </el-select>
                        <span v-if="deviceModel.state === 'modify'" style="color: #fff;">{{deviceTypeMap.get(deviceModel.type)}}</span>
                    </el-form-item>
                    <el-form-item prop="name" >
                        <template v-slot:label>
                            <span style="color: #fff;">设备名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.name" style="width: 90%;"/>
                    </el-form-item>
                    <el-form-item prop="deviceIP" >
                        <template v-slot:label>
                            <span style="color: #fff;">设备IP：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.deviceIP" v-if="deviceModel.state === 'add'"
                                  style="width: 90%;"></el-input>
                        <span v-if="deviceModel.state === 'modify'" style="color: #fff;">{{deviceModel.deviceIP}}</span>
                    </el-form-item>
                    <el-form-item prop="coordinates">
                        <template v-slot:label>
                            <span style="color: #fff;">经纬度：</span>
                        </template>
                        <span :class="{ 'smart-box-text-success' :  mapPosition.x, 'smart-box-text-dangle' : ! mapPosition.x }">
                            <i class="el-icon-location-outline" style="cursor:pointer;" @click="mapVisible = true"><span
                                    style="color: #fff;"> {{ mapPosition.x ? '已绘制' : '未绘制'}}</span></i>
                        </span>
                    </el-form-item>
                    <el-form-item prop="areaName">
                        <template v-slot:label>
                            <span style="color: #fff;">区域名称：</span>
                        </template>
                        <span style="color: #fff;">{{deviceModel.areaName}}</span>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" :disabled="hasDisabledAreaSubmit"
                               @click="handlerSaveDevice">确认
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerCancelDevice">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="import_dialog" width="550px" height="270px" :show.sync="hasImportDialogShow"
                          :title="'导入Excel数据'" :wrong="wrong" @closed="handlerOverlayClosed" :IsClickMaskClose="false">
            <template v-slot:default>
                <div style="padding: 40px 10px">
                    <el-row style="text-align: center ;padding: 20px 0px;height: 20px">
                        <el-col>
                        <span style="color:#00fafe; font-size: 14px; text-decoration: none; cursor:pointer;">
                            如不清楚Execl样式请先下载模板，批量修改请先到</span>
                        </el-col>
                    </el-row>
                    <el-row style="text-align: center ;padding: 20px 0px;height: 20px">
                        <el-col>
                        <span style="color:#00fafe; font-size: 14px; text-decoration: none; cursor:pointer;">
                            表格上方执行要修改的数据导入，编辑好要修改的字段信息先选择上传的文件
                        </span>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <template v-slot:footer>
                <el-upload
                        ref="upload"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="(value)=> resolveDate(value)"
                        :auto-upload="true">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="deviceModelExport">下载模板
                    </el-button>
                </el-upload>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="import_point_dialog" width="550px" height="270px" :show.sync="hasImportPointDialogShow"
                          :title="'导入设备经纬度'" :wrong="pointWrong" @closed="handlerOverlayClosed" :IsClickMaskClose="false">
            <template v-slot:default>
                <div style="padding: 40px 10px">
                    <el-row style="text-align: center ;padding: 20px 0px;height: 20px">
                        <el-col>
                        <span style="color:#00fafe; font-size: 14px; text-decoration: none; cursor:pointer;">
                            请先点击下载模板按钮，下载经纬度导入模板！填写完成后点击选择文件按钮，选择填写完成的模板文件上传</span>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <template v-slot:footer>
                <el-upload
                        ref="upload"
                        :action="uploadPointUrl"
                        :show-file-list="false"
                        :on-success="(value)=> resolvePointDate(value)"
                        :auto-upload="true">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="devicePointModelExport">下载模板
                    </el-button>
                </el-upload>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="import_point_result_dialog" width="550px" height="270px" :show.sync="hasImportPointResultDialogShow"
                          :title="'设备经纬度导入结果'" :wrong="pointResultWrong" @closed="handlerOverlayClosed" :IsClickMaskClose="false">
            <template v-slot:default>
                <div style="padding: 40px 10px">
                    <el-row style="text-align: center ;padding: 20px 0px;height: 20px">
                        <el-col>
                        <span style="color:#00fafe; font-size: 14px; text-decoration: none; cursor:pointer;">
                            {{importPointResult}}</span>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <template v-slot:footer>
                <el-button v-show="showDownloadMessage" style="margin-left: 10px;" size="small" type="danger" @click="errorDevicePointModelExport">下载失败数据
                </el-button>
                <el-button @click="closePointResult" size="small" style="margin-left: 10px;"
                           type="warning">关闭
                </el-button>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="update_import_dialog" width="1200px" height="550px" :show.sync="hasUpdateImportDialogShow"
                          :title="'导入数据信息'" :wrong="wrong" :modal-append-to-body="false"  @closed="cancleImportDevice"
                          :IsClickMaskClose="false">
            <template v-slot:default>
                <div style="width: 100%; height: 100%">
                    <el-table ref="update_import_table" :data="importRows"  :cell-style="cellStyle" height="400"  row-key="id"
                              class="smart-box smart-box-table" default-expand-all size="small"  :tree-props="tableTreeProps"
                              style="font-size: 14px;width: calc(95%);margin-left: 40px"  @row-dblclick="openUpdateColumn"
                              stripe border>
                        <el-table-column label="设备名称" align="center" header-align="center" prop="outDeviceName"
                                         width="240px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput" v-model="row.outDeviceName"  width="120px"/>
                                <span v-if="!row.showInput">{{row.outDeviceName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备箱IP" align="center" header-align="center" prop="boxIP" width="120px"
                                         show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput" v-model="row.boxIP" style="width: 80%;"/>
                                <span v-if="!row.showInput">{{row.boxIP}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备类型" align="center" header-align="center" prop="deviceType"
                                         width="140px"
                                         show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <span>{{deviceTypeMap.get(row.deviceType)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="外接设备IP" align="center" header-align="center" width="120px"
                                         show-overflow-tooltip prop="outDeviceIp">
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && !mainDeviceTypeMap.get(row.deviceType)"
                                       v-model="row.outDeviceIp" style="width: 80%;"/>
                                <span v-if="!row.showInput && !mainDeviceTypeMap.get(row.deviceType)">{{row.outDeviceIp}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="厂家名称" align="center" header-align="center" prop="factory" width="80px"
                                         show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput" v-model="row.factory"/>
                                <span v-if="!row.showInput">{{row.factory}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="监测状态" align="center" header-align="center" prop="checkStatus"
                                         width="100px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <el-select v-model="row.checkStatus" class="smart-box smart-box-select" size="small"
                                           v-if="row.showInput && ['5','3','4'].indexOf(row.deviceType) > -1" style="width: 80%;" clearable>
                                    <el-option v-for="(item) in listenStateList" :label="item.label"
                                               :value="item.value"
                                               :key="item.label" ></el-option>
                                </el-select>
                                <span v-if="!row.showInput && ['5','3',4].indexOf(row.deviceType) > -1">{{row.checkStatus}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="联动状态" align="center" header-align="center" prop="unionStatus"
                                         width="100px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <el-select v-model="row.unionStatus" class="smart-box smart-box-select" size="small"
                                           v-if="row.showInput && ['5','3'].indexOf(row.deviceType) > -1" style="width: 80%;" clearable>
                                    <el-option v-for="(item) in interactionStateList" :label="item.label"
                                               :value="item.value"
                                               :key="item.label"></el-option>
                                </el-select>
                                <span v-if="!row.showInput && ['5','3'].indexOf(row.deviceType) > -1">{{row.unionStatus}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="检测次数" align="center" header-align="center" prop="checkTimes"
                                         width="60px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && ['1'].indexOf(row.deviceType) > -1"
                                       v-model="row.checkTimes" style="width: 80%;"/>
                                <span v-if="!row.showInput && ['1'].indexOf(row.deviceType) > -1">{{row.checkTimes}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="检测间隔时间(s)" align="center" header-align="center" prop="checkedSpacing"
                                         width="60px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && ['5','3'].indexOf(row.deviceType) > -1"
                                       v-model="row.checkedSpacing" style="width: 80%;"/>
                                <span v-if="!row.showInput && ['5','3'].indexOf(row.deviceType) > -1">{{row.checkedSpacing}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="功率(W)" align="center" header-align="center" prop="power" width="80px"
                                         show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput&& ['1','3'].indexOf(row.deviceType) > -1"
                                       v-model="row.power" style="width: 80%;"/>
                                <span v-if="!row.showInput && ['1','3'].indexOf(row.deviceType) > -1">{{row.power}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="红外功率(W)" align="center" header-align="center" prop="redPower"
                                         width="80px"
                                         show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && ['3'].indexOf(row.deviceType) > -1"
                                       v-model="row.redPower" style="width: 80%;"/>
                                <span v-if="!row.showInput && ['3'].indexOf(row.deviceType) > -1">{{row.redPower}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="网口" align="center" header-align="center" prop="port" width="60px"
                                         show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && ['5','3'].indexOf(row.deviceType) > -1"
                                       v-model="row.port" style="width: 80%;"/>
                                <span v-if="!row.showInput && ['5','3'].indexOf(row.deviceType) > -1">{{row.port}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="电源通道" align="center" header-align="center" prop="energyNo" width="60px"
                                         show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && ['5','3','1','2'].indexOf(row.deviceType) > -1"
                                       v-model="row.energyNo" style="width: 80%;"/>
                                <span v-if="!row.showInput  && ['5','3','1','2'].indexOf(row.deviceType) > -1">{{row.energyNo}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="计划开启时间" align="center" header-align="center" prop="openPlanCheck"
                                         width="100px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && ['3'].indexOf(row.deviceType) > -1"
                                       v-model="row.openPlanCheck" style="width: 80%;"/>
                                <span v-if="!row.showInput && ['3'].indexOf(row.deviceType) > -1">{{row.openPlanCheck}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="计划结束时间" align="center" header-align="center" prop="closePlanCheck"
                                         width="100px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && ['3'].indexOf(row.deviceType) > -1"
                                       v-model="row.closePlanCheck" style="width: 80%;"/>
                                <span v-if="!row.showInput && ['3'].indexOf(row.deviceType) > -1">{{row.closePlanCheck}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="经度" align="center" header-align="center" prop="lat"
                                         width="130px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput  && mainDeviceTypeMap.get(row.deviceType)" style="width: 80%;"  v-model="row.lat"/>
                                <span v-if="!row.showInput  && mainDeviceTypeMap.get(row.deviceType)">{{row.lat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="纬度" align="center" header-align="center" prop="lon"
                                         width="130px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <input v-if="row.showInput && mainDeviceTypeMap.get(row.deviceType)" style="width: 80%;" v-model="row.lon"/>
                                <span v-if="!row.showInput && mainDeviceTypeMap.get(row.deviceType)">{{row.lon}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" align="center" header-align="center"
                                         v-if="ifShowSaveButton"
                                         width="60px" prop="showInput">
                            <template slot-scope="{row}">
                                <el-button v-if="row.showInput" icon="el-icon-check" type="success"
                                           @click="saveUpdateImportRowData(row)" size="small"></el-button>
                                <span v-if="!row.showInput"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="提示" fixed="right" align="center" header-align="center"
                                         width="100px" prop="errorMessage" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <i :style="{ color: row.rowAllowSubmit? '#67C23A' : '#F56C6C'}"
                                   :class="row.rowAllowSubmit? 'el-icon-success' : 'el-icon-error'"></i>
                                <i></i>
                                <span>{{row.errorMessage}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" :disabled="formImportSubmit"
                               @click="uploadImportDevice">确认
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="cancleImportDevice">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
        <el-dialog :visible.sync="mapVisible" width="60%" @opened="$refs.map.EnablePosition()">
            <template v-slot:default>
                {{mapPosition.x}}, {{mapPosition.y}}
                <smart-box-map ref="map" width="100%" :height="600" :center="[114.26639556884767, 30.574824300270137]"
                               :x.sync="mapPosition.x" :y.sync="mapPosition.y"></smart-box-map>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 20px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="mapVisible = false">确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
    import {default as DeviceTable} from "./deviceTable"
    export default DeviceTable
</script>
<style lang="scss" scoped>

    .map-fold {
        position: absolute;
        top: 0px;
        width: 30px;
        right: 0px;
        color: #fff;
        height: 15px;
        z-index: 1000;
        text-align:center;
        cursor: pointer;

        &.unfold {
            right: -30px;
            border-radius: 0px 5px 5px 0px;
            background-color:rgb(1, 161, 178);
            border-top: 1px solid rgba(0, 250, 254, .8);
            border-right: 1px solid rgba(0, 250, 254, .8);
            border-bottom: 1px solid rgba(0, 250, 254, .8);
            transition: all .6s ease;
        }

        > i {
            display: block;
        }
    }

    .form-label-padding {
        padding: 0px 10px;
        height: 30px;
    }

    .box-tree-panel {
        position: absolute;
        z-index: -1;
        background-color: rgba(1, 161, 178, .2);
        width: 100%;
        height: 100%;
    }

    .map-scrub {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: 100% 100%;
        background-position: left top;
        background-image: url(../../assets/Images/tree-scrub.png);
        z-index: 998;
    }

    .map-list-item {
        padding: 12px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .map-list-item:hover {
        background-color: #01A1B2;
    }


    .form-label-padding {
        padding: 0px 10px;
        height: 30px;
    }

    .map-device-form {
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        width: calc(100% - 60px);
        display: grid;
        grid-auto-flow: dense;

        > .map-device-form-item:nth-child(2n) {
            grid-column: 1;
            transition: all .6s linear;
        }

        > .map-device-form-item:nth-child(2n+1) {
            grid-column: 2;
            transition: all .6s linear;
        }
    }

    .dialog-map-pad {
        padding: 10px 0px;
        text-align: center;
        font-size: 12px;
    }

    .box-container {
        position: relative;
        z-index: 98;
        float: left;
        width: calc(100% - 360px);
        // width: 100%;
        height: 100%;
        transition: width .6s ease;
    }
    .el-row {
        height: 45px;
    }

    .device-division-tree {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        > .device-division-header {
            width: 100%;
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-size: 12px;
            color: #fff;
            box-sizing: border-box;
            background-color: rgba(59, 184, 227, 0.4);
        }

        > .device-division__wapper {
            width: 100%;
            height: calc(100% - 70px);
            box-sizing: border-box;
            > .device-division-body {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                overflow-y: auto;
            }
        }
    }
</style>


