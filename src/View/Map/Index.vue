<template>
    <div class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear" style="position:relative;">
            <div class="smart-box smart-box-window"
                 style="position:relative; float:left; background:none; width: 280px; height: 100%; z-index: 999; transition: width .6s ease;" :style="{ width : !hasFold ? '280px' : '0px' }">
                <div class="map-scrub"></div>
                <div class="map-fold" :class="{ 'unfold' : hasFold }"  @click="hasFold = !hasFold"><i :class="{ 'el-icon-caret-right' : hasFold, 'el-icon-caret-left' : !hasFold }"></i></div>
                <div class="smart-box-window-inner"
                     style="border-radius:0px; border-width: 0px 1px 0px 0px; background: transparent; position:relative; z-index: 999;">
                    <div class="map-tree-panel"></div>
                    <div class="smart-box-window-title">区域</div>
                    <div class="smart-box-window-body" style="padding: 0px 30px; box-sizing: border-box; overflow-y:auto;">
                        <el-input class="smart-box smart-box-input" size="small" v-model="deviceName" style="margin: 15px 0px; width: 220px;" clearable></el-input>
                        <el-tree
                                class="smart-box smart-box-tree"
                                ref="tree"
                                node-key="guid"
                                :data.sync="treeData"
                                :default-checked-keys.sync="checkNodeKeys"
                                :props="treeProps"
                                :load="loadTreeNode"
                                :filter-node-method="handlerFilterNode"
                                @check-change="handlerTreeCheckChange"
                                @node-contextmenu="handlerTreeMenuContext"
                                @node-expand="() => { queryAlarmIdListFromNotDeal(), hasOpenTreeMenuContext = false; }"
                                @node-collapse="hasOpenTreeMenuContext = false"
                                @node-click="hasOpenTreeMenuContext = false"
                                show-checkbox
                                check-strictly
                                lazy
                                draggable
                                :allow-drop="handlerTreeAllowDrop"
                                @node-drop="handleDropEnd"
                                >
                            <template v-slot:default="scoped">
                                <div @dblclick.stop="handlerTreeNodeDbClick(scoped.node)" style="width:auto; max-width:calc(100% - 46px);">
                                    <span class="el-tree-node__label" v-if="scoped.node.data.type === 'area'" :title="scoped.node.label">
                                        <img src="../../assets/Images/area.png" /> {{scoped.node.label}} {{ handlerCalcTreeNodeTotal(scoped.node.data.guid) }}
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
                        <el-popover
                            popper-class="smart-box smart-box-popover"
                            ref="map_tree_popover"
                            placement="right-start"
                            :reference="treeNodeItem ? treeNodeItem.vnode.$children[1].$el : null"
                            v-model="hasOpenTreeMenuContext"
                            width="90">
                            <div style="width:100%;">
                                <div class="el-select-dropdown_wrap el-scrollbar__wrap" style="overflow:hidden;">
                                    <ul class="el-scrollbar__view el-select-dropdown__list">
                                        <ul v-show="treeNodeItem && treeNodeItem.data.type === 'area' || false"
                                            class="el-select-group__wrap">
                                            <li class="el-select-group__title"><i class="el-icon-crop"></i> 区域</li>
                                            <li>
                                                <ul class="el-select-group">
                                                    <li class="el-select-dropdown__item"
                                                        @click="handlerOpenAreaEdit(treeNodeItem.data)">添加区域
                                                    </li>
                                                    <li class="el-select-dropdown__item"
                                                        @click="handlerModifyArea(treeNodeItem.data, treeNodeItem.vnode)">
                                                        修改区域
                                                    </li>
                                                    <li class="el-select-dropdown__item"
                                                        @click="handlerDropArea(treeNodeItem.data, treeNodeItem.vnode)">删除区域
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <ul class="el-select-group__wrap">
                                            <li class="el-select-group__title"><i class="fa fa-microchip"></i> 设备</li>
                                            <li>
                                                <ul class="el-select-group">
                                                    <li v-show="treeNodeItem && treeNodeItem.data.type === 'area' || false"
                                                        class="el-select-dropdown__item"
                                                        @click="handlerOpenDeviceEdit(treeNodeItem.data, treeNodeItem.vnode)">添加主设备
                                                    </li>
                                                    <li v-show="treeNodeItem && ['WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(treeNodeItem.data.type) > -1 || false"
                                                        class="el-select-dropdown__item"
                                                        @click="handlerOpenDeviceEdit(treeNodeItem.data)">添加外设
                                                    </li>
                                                    <li v-show="treeNodeItem && ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'].indexOf(treeNodeItem.data.type) > -1 || false"
                                                        class="el-select-dropdown__item"
                                                        @click="handlerModifyDevice(treeNodeItem.data, treeNodeItem.vnode)">
                                                        修改设备
                                                    </li>
                                                    <li v-show="treeNodeItem && ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE', '1', '2', '3', '4', '5', '6'].indexOf(treeNodeItem.data.type) > -1 || false"
                                                        class="el-select-dropdown__item"
                                                        @click="handlerDropDevice(treeNodeItem.data, treeNodeItem.vnode)">删除设备
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </ul>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </div>
            </div>
            <div style='border: 0px solid; position: absolute; top: calc(20px + 80px * 0.5 - 33px * 0.5); z-index: 999; line-height: 29px; transition: all .3s ease;' :style="{ 'left' : hasFold ? '20px' : '320px' }">
                <el-select 
                    placeholder="请输入检索设备的名称" 
                    style="float:left;"
                    size="small"
                    ref="search_dev_query"
                    v-model="search_device_id"
                    :remote-method="handlerRemoteMethod" 
                    :loading="search_device_loading" 
                    @change="handlerDevQueryPosition"
                    filterable 
                    remote 
                    clearable
                    reserve-keyword>
                    <el-option v-for="item in deviceList" :key="item.id" :label="item.deviceName" :value="item.id"></el-option>
                </el-select>
                <!-- <el-checkbox v-model="disabled_alarm" style="margin-left: 5px; background: #409EFF;" size="small" border><span style="color: #fff;">{{ disabled_alarm ? '隐藏告警消息窗口' : '显示告警消息窗口' }}</span></el-checkbox> -->
            </div>
            <div ref="map" class="map-container" :style="{ 'cursor' : hasMoveFeature ? 'pointer' : '', width : !hasFold ? 'calc(100% - 280px)' : '100%' }" @contextmenu="handlerMapContextMenu">
            </div>
            <el-popover 
                popper-class="smart-box smart-box-popover"
                ref="map_menu_popover"
                placement="right-start"
                v-model="hasOpenMapMenuContext"
                :visible-arrow="false"
                :style="{ position : 'fixed', zIndex : 999, left : (mapContentMenuOffset.x + 'px'), top : (mapContentMenuOffset.y + 'px') }"
                width="90">
                <div style="width:100%;">
                    <div class="el-select-dropdown_wrap el-scrollbar__wrap" style="overflow:hidden;">
                        <ul class="el-scrollbar__view el-select-dropdown__list">
                            <ul class="el-select-group__wrap">
                                <li class="el-select-group__title"><i class="el-icon-crop"></i> 功能</li>
                                <li>
                                    <ul class="el-select-group">
                                        <li class="el-select-dropdown__item" @click="handlerOpenMapParamsConfirm">设置地图参数</li>
                                    </ul>
                                </li>
                            </ul>
                        </ul>
                    </div>
                </div>
            </el-popover>
        </div>
        <smart-box-dialog 
            ref="device_dialog" 
            :type="'popover'" 
            :show.sync="hasDialogShow" 
            height="360px" 
            width="550px"
            :footer-show="true"
            :value="['WTOS-VN','WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(dialogData.type) > -1 ? getDeviceInfoForVN : []" 
            :title="dialogData.name" 
            @closed="handlerOverlayClosed"
            :wrong="dialogData.isOnline === 0">
            <template v-slot:header="scoped" >
                <router-link 
                    :to="{ 
                        name : { 'WTOS-VN' : 'case', 'WTOS-VN-PE' : 'pe', 'WTOS-VN-TME200' : 'traffic', '6' : 'traffic' }[dialogData.type], 
                        params : { id : dialogData.id } 
                    }" 
                    style="color: #409EFF; font-size: 16px">
                        {{scoped.title}} <i class="el-icon-right smart-box-text-primary" ></i>
                </router-link>
            </template>
            <template v-slot:default="scoped">
                <div class="map-body-scrollbar" style="width: 100%; height: 100%;" @scroll.capture.stop="void 0">
                    <section v-if="['WTOS-VN','WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(dialogData.type) > -1" class="map-capability-list">
                        <el-row v-for="(item, key) in scoped.data" :key="key" type="flex" justify="center" align="center">
                            <el-col :span="4"><i class="fa fa-circle fa-lg" :class="{ 'smart-box-text-success' : item.state, 'smart-box-text-dangle' : !item.state }"></i></el-col>
                            <el-col :span="12" :title="item.perform_description">{{item.perform_description}}</el-col>
                            <el-col :span="8" :title="item.valueOf">{{item.valueOf}}</el-col>
                        </el-row>
                    </section>
                    <section v-if="['WTOS-VN','WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(dialogData.type) === -1" class="map-capability-list not-grid">
                        <el-row v-if="getDeviceTemperature" type="flex" justify="center" align="center">
                            <el-col :span="6" :title="getDeviceTemperature.perform_description">{{getDeviceTemperature.perform_description}}</el-col>
                            <el-col :span="18" :title="getDeviceTemperature.valueOf" style="text-indent: 1em;">  {{getDeviceTemperature.valueOf}}  </el-col>
                        </el-row>
                        <el-row v-if="getDevicePowerStatus" type="flex" justify="center" align="center">
                            <el-col :span="6" :title="getDevicePowerStatus.perform_description">{{getDevicePowerStatus.perform_description}}</el-col>
                            <el-col :span="18" style="text-indent: 1em;"> 
                                <span v-for="(item, key) in getDevicePowerStatus.valueOf" class="fa fa-circle fa-lg" :class="{ 'smart-box-text-success' : item[2], 'smart-box-text-info' : !item[2] }" :key="key">
                                    <i style="color: #fff; font-size: 14px; position:relative; left: -0.9em;">{{ item[0] }}</i>
                                </span>
                            </el-col>
                        </el-row>
                        <section v-if="getDeviceStatus" class="map-capability-table">
                            <el-row type="flex" justify="center" align="center" class="map-capability-table-header">
                                <el-col :span="6">{{ getDeviceStatus.headers['PORT_LINK_STATUS'] }}</el-col>
                                <el-col :span="6">{{ getDeviceStatus.headers['PORT_LINK_SPEED'] }}</el-col>
                                <el-col :span="6">{{ getDeviceStatus.headers['PORT_LINK_TYPE'] }}</el-col>
                                <el-col :span="6">{{ getDeviceStatus.headers['PORT_FLUX'] }}</el-col>
                            </el-row>
                            <el-row type="flex" justify="center" v-for="n in getDeviceStatus.total" :key="n"  align="center" class="map-capability-table-body">
                                <el-col :span="6"><i class="fa fa-circle fa-lg" :class="{ 'smart-box-text-success' : getDeviceStatus.data['PORT_LINK_STATUS'][n - 1][2], 'smart-box-text-dangle' : !getDeviceStatus.data['PORT_LINK_STATUS'][n - 1][2] }"></i></el-col>
                                <el-col :span="6">{{ getDeviceStatus.data['PORT_LINK_SPEED'][n - 1][1] }}</el-col>
                                <el-col :span="6">{{ getDeviceStatus.data['PORT_LINK_TYPE'][n - 1][1] }}</el-col>
                                <el-col :span="6">{{ getDeviceStatus.data['PORT_FLUX'][n - 1][1] }}</el-col>
                            </el-row>
                        </section>
                    </section>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog 
            ref="areaDialog" 
            :show.sync="hasAreaDialogShow" 
            :title="areaDialogModel.state === 'modify' ? '修改区域信息' : '添加区域信息'" 
            height="350px" 
            width="420px" 
            :IsClickMaskClose="false"
            @closed="handlerCancelAreaEdit">
            <template v-slot:default>
                <el-form ref="areaForm" :rules="areaRules" :model="areaDialogModel" label-width="120px" size="small"
                         style="margin: 40px 20px 0px 20px;">
                    <el-form-item prop="areaParentName">
                        <template v-slot:label>
                            <span style="color: #fff;">所属区域：</span>
                        </template>
                        <span style="color: #fff;">{{areaDialogModel.areaParentName}}</span>
                    </el-form-item>
                    <el-form-item prop="areaName">
                        <template v-slot:label>
                            <span style="color: #fff;">区域名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="areaDialogModel.areaName"/>
                    </el-form-item>
                    <el-form-item prop="areaCoordinates">
                        <template v-slot:label>
                            <span style="color: #fff;">区域坐标：</span>
                        </template>
                        <span :class="{ 'smart-box-text-success' : areaDialogModel.areaCoordinates.length, 'smart-box-text-dangle' : !areaDialogModel.areaCoordinates.length }">
                            <i class="el-icon-location-outline" style="cursor:pointer;" @click="handlerDrawArea"></i> {{ areaDialogModel.areaCoordinates.length ? '已绘制' : '未绘制'}}
                        </span>
                        <!-- <el-tooltip 
                            v-show="areaDialogModel.state === 'modify'" 
                            content="修改区域坐标时，Enter键确认修改完成，Esc键确认退出修改！" 
                            placement="right">
                                <i class="el-icon-question" style="color:#fff;"></i>
                        </el-tooltip> -->
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="handlerSaveTreeNode" :disabled="hasDisabledAreaSubmit">
                        <i class="el-icon-loading" v-show="hasDisabledAreaSubmit"/>确认
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerCancelAreaEdit">取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog 
            ref="deviceDialog" 
            :show.sync="hasDeviceDialogShow" 
            :width="getDeviceDialogSize.width"
            :height="getDeviceDialogSize.height" 
            :IsClickMaskClose="false"
            :title="deviceModel.state === 'modify' ? '修改设备' : '添加设备'" 
            @closed="handlerCancelDevice"
            >
            <template v-slot:default>
                <el-form
                    ref="deviceForm"
                    label-width="140px"
                    label-position="right"
                    :model="deviceModel"
                    class="map-device-form"
                    :style="hasOutDevice ? 'display:grid;' : 'display:block;' "
                    size="small">
                    <el-form-item v-show="hasOutDevice">
                        <template v-slot:label>
                            <span style="color: #fff;">设备名称：</span>
                        </template>
                        <span style="color: #fff;">{{ deviceModel.parentName }}</span>
                    </el-form-item>
                    <el-form-item v-show="hasOutDevice">
                        <template v-slot:label>
                            <span style="color: #fff;">设备IP：</span>
                        </template>
                        <span style="color: #fff;">{{ deviceModel.deviceIP }}</span>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" prop="type" :rules="handlerHasRequiredFormItem('type')">
                        <template v-slot:label>
                            <span style="color: #fff;">设备类型：</span>
                        </template>
                        <el-select v-show="deviceModel.state  !== 'modify'" class="smart-box smart-box-select" value-key="value" popper-class="smart-box smart-box-popover" style="width: 100%;" v-model="deviceModel.type" @change="handlerDeviceTypeChange" :disabled="deviceModel.type === '6'" >
                            <el-option 
                                v-for="(item, n) in devicedTypeList" 
                                :label="item.label" 
                                :value="item.value" 
                                :key="n"
                                v-show="treeNodeItem && deviceModel.state === 'add' && treeNodeItem.data.type === 'area'  && ['WTOS-VN', 'WTOS-VE', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(item.value) > -1 || 
                                    treeNodeItem && deviceModel.state === 'add' && ['WTOS-VN', 'WTOS-VN-PE'].indexOf(treeNodeItem.data.type) > -1 && ['1', '2', '3', '4', '5'].indexOf(item.value) > -1 || 
                                    treeNodeItem && deviceModel.state === 'add' && treeNodeItem.data.type === 'WTOS-VN-TME200' && ['6'].indexOf(item.value) > -1 ||
                                    treeNodeItem && deviceModel.state === 'modify' && ['1', '2', '3', '4', '5'].indexOf(treeNodeItem.data.type) > -1 && ['1', '2', '3', '4', '5'].indexOf(item.value) > -1 ||
                                    treeNodeItem && deviceModel.state === 'modify' && ['6'].indexOf(treeNodeItem.data.type) > -1 && ['6'].indexOf(item.value) > -1">
                            </el-option>
                        </el-select>
                        <span v-show="deviceModel.state  === 'modify'" style="color: #fff;">{{ { 'WTOS-VN' : '智能机箱', 'WTOS-VE' : '高清传输设备', 'WTOS-VN-TME200' : '智能前端设备', 'WTOS-VN-PE' : "智能动环", '1' : '补光灯', '2' : '闪光灯', '3' : '摄像机', '5' : '光传输设备', '6' : '信号机'}[deviceModel.type] }}</span>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VN-TME200', 'WTOS-VN', 'WTOS-VN-PE'].indexOf(deviceModel.type) > -1 }" prop="name" :rules="handlerHasRequiredFormItem('name')" v-show="!hasOutDevice">
                        <template v-slot:label>
                            <span style="color: #fff;">设备名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.name"/>
                    </el-form-item>
                    <el-form-item v-show="!hasOutDevice" prop="deviceIP" :rules="handlerHasRequiredFormItem('deviceIP')">
                        <template v-slot:label>
                            <span style="color: #fff;">设备IP：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.deviceIP"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="otherDeviceIP" :rules="handlerHasRequiredFormItem('otherDeviceIP')">
                        <template v-slot:label>
                            <span style="color: #fff;">外接设备IP：</span>
                        </template>
                        <el-input v-show="deviceModel.state !== 'modify'" class="smart-box smart-box-input" v-model="deviceModel.otherDeviceIP" :disabled="['1', '2'].indexOf(deviceModel.type) > -1"></el-input>
                        <span v-show="deviceModel.state  === 'modify'" style="color: #fff;">{{ deviceModel.otherDeviceIP }}</span>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="otherDeviceName" :rules="handlerHasRequiredFormItem('otherDeviceName')">
                        <template v-slot:label>
                            <span style="color: #fff;">外接设备名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.otherDeviceName"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="energyNo" :rules="handlerHasRequiredFormItem('energyNo')">
                        <template v-slot:label>
                            <span style="color: #fff;">电源通道：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.energyNo" :disabled="['6'].indexOf(deviceModel.type) > -1"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }"  v-show="hasOutDevice" prop="companyName" :rules="handlerHasRequiredFormItem('companyName')">
                        <template v-slot:label>
                            <span style="color: #fff;">厂家名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.companyName"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="port" :rules="handlerHasRequiredFormItem('port')">
                        <template v-slot:label>
                            <span style="color: #fff;">网口：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.port" :disabled="['1', '2', '6'].indexOf(deviceModel.type) > -1"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="interactionState" :rules="handlerHasRequiredFormItem('interactionState')">
                        <template v-slot:label>
                            <span style="color: #fff;">联动状态：</span>
                        </template>
                        <el-select class="smart-box smart-box-select" value-key="value" popper-class="smart-box smart-box-popover" style="width: 100%;" v-model="deviceModel.interactionState" :disabled="['1', '2', '6'].indexOf(deviceModel.type) > -1">
                            <el-option value="" label="--请选择--"></el-option>
                            <el-option v-for="(item, n) in interactionStateList" :label="item.label" :value="item.value" :key="n"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="power" :rules="handlerHasRequiredFormItem('power')">
                        <template v-slot:label>
                            <span style="color: #fff;">功率(W)：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.power" :disabled="['2', '5', '6'].indexOf(deviceModel.type) > -1"></el-input>
                    </el-form-item>
                    <!-- <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN'].indexOf(deviceModel.type) === -1 }" v-if="hasOutDevice" :rules="handlerHasRequiredFormItem('listenTotal')">
                        <template v-slot:label>
                            <span style="color: #fff;">监测次数：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.listenTotal" :disabled="['2', '5'].indexOf(deviceModel.type) > -1"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN'].indexOf(deviceModel.type) === -1 }" v-if="hasOutDevice" prop="listenState">
                        <template v-slot:label>
                            <span style="color: #fff">监测状态</span>
                        </template>
                        <el-select class="smart-box smart-box-select" value-key="value" popper-class="smart-box smart-box-popover" style="width: 100%;" v-model="deviceModel.listenState" :disabled="['1', '2', '3','5'].indexOf(deviceModel.type) > -1">
                            <el-option v-for="(item, n) in listenStateList" :label="item.label" :value="item.value" :key="n"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN'].indexOf(deviceModel.type) === -1 }" v-if="hasOutDevice" prop="checkedSpacing">
                        <template v-slot:label>
                            <span style="color: #fff;">Ping间隔(s)：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.checkedSpacing" :disabled="['1', '2', '3','5'].indexOf(deviceModel.type) > -1"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN'].indexOf(deviceModel.type) === -1 }" v-if="hasOutDevice" prop="reStartTotal">
                        <template v-slot:label>
                            <span style="color: #fff;">重启次数：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.reStartTotal" :disabled="['1', '2', '3','5'].indexOf(deviceModel.type) > -1"></el-input>
                    </el-form-item> -->
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="openPlanCheck" :rules="handlerHasRequiredFormItem('openPlanCheck')" :required="false">
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
                            :disabled="['2', '3', '5', '6'].indexOf(deviceModel.type) > -1">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="closePlanCheck" :rules="handlerHasRequiredFormItem('closePlanCheck')" :required="false">
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
                            :disabled="['2', '3', '5', '6'].indexOf(deviceModel.type) > -1">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : ['WTOS-VE', 'WTOS-VN', 'WTOS-VN-TME200', 'WTOS-VN-PE'].indexOf(deviceModel.type) === -1 }" v-show="hasOutDevice" prop="percent" :rules="handlerHasRequiredFormItem('percent')">
                        <template v-slot:label>
                            <span style="color: #fff;">占空比(%)：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.percent" :disabled="['2', '3', '5', '6'].indexOf(deviceModel.type) > -1"></el-input>
                    </el-form-item>
                    <el-form-item v-show="!hasOutDevice" prop="coordinates" :rules="handlerHasRequiredFormItem('coordinates')">
                        <template v-slot:label>
                            <span style="color: #fff;">经纬度：</span>
                        </template>
                        <span :class="{ 'smart-box-text-success' : deviceModel.coordinates.length, 'smart-box-text-dangle' : !deviceModel.coordinates.length }">
                            <i class="el-icon-location-outline" style="cursor:pointer;" @click="handlerDrawDevice"></i> {{ deviceModel.coordinates.length ? '已绘制' : '未绘制'}}
                        </span>
                    </el-form-item>
                    <el-form-item v-show="!hasOutDevice" prop="parentName">
                        <template v-slot:label>
                            <span style="color: #fff;">区域名称：</span>
                        </template>
                        <span style="color: #fff;">{{ deviceModel.parentName }}</span>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="handlerSaveDevice" :disabled="hasDisabledDeviceSumbit">
                        <i class="el-icon-loading" v-show="hasDisabledDeviceSumbit" /> 确认
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerCancelDevice">取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog :show.sync="alarmDialogModel.display" width="600px" height="380px" title="告警信息处理" @closed="handlerAlarmDialogClose">
            <el-row type="flex" justify="center" align="center">
                <el-col :span="20">
                    <el-form  label-width="120px" size="small" :model="alarmDialogModel" :rules="alarmRules" ref="alarmFrom" style="padding: 25px 0px;" >
                        <el-form-item label="处理人：" prop="dealMan">
                            <template v-slot:label>
                                <span style="color: #fff;">处理人：</span>
                            </template>
                            <el-select v-model="alarmDialogModel.dealMan" size="small" placeholder="请选择" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 300px"  resize clearable>
                                <el-option v-for="(item, key) in userList" :key="key" :label="item.label"  :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="处理状态" prop="radio">
                            <template v-slot:label>
                                <span style="color: #fff;">处理状态：</span>
                            </template>
                            <el-radio-group v-model="alarmDialogModel.radio">
                                <el-radio  :label='1' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">未处理</el-radio>
                                <el-radio  :label='2' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">已派单</el-radio>
                                <el-radio  :label='3' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">已忽略</el-radio>
                                <el-radio  :label='4' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">已完成</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="备注" class="waring-form-item">
                            <template v-slot:label>
                                <span style="color: #fff;">备注：</span>
                            </template>
                            <el-input type="textarea" placeholder="(可填)"  style="width: 300px" class="smart-box smart-box-input" v-model="alarmDialogModel.remark"  resize></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="insertDealInfo">确定</el-button>
                <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="handlerAlarmDialogClose">取消</el-button>
            </template>
        </smart-box-dialog>
        <div ref="alarmPlay" style="width: 0px; height: 0px; display: fixed; top: -999px; left: -999px;">
        </div>
    </div>
</template>

<script>
    import {default as Map} from './index'
    export default Map
</script>
<style lang="scss" scoped>
    .map-tree-panel {
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

    .map-container {
        position: relative;
        z-index: 98;
        float: left;
        width: calc(100% - 360px);
        // width: 100%;
        height: 100%;
        transition: width .6s ease;
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

        > .map-device-form-item:nth-child(2n+1) {
            grid-column: 1;
            transition: all .6s linear;
        }

        > .map-device-form-item:nth-child(2n) {
            grid-column: 2;
            transition: all .6s linear;
        }
    }

    .dialog-map-pad {
        padding: 10px 0px;
        text-align: center;
        font-size: 12px;
    }

    .map-body-scrollbar {
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 10px;
            background-color: rgba(59, 184, 227, .2);
        }
    
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: rgba(0, 250, 254, .8);
        }
    }

    .map-capability-list {
        display: grid;
        padding: 5px;
        grid-template-columns: repeat(auto-fill, 50%);
        grid-auto-flow: column dense;

        &.not-grid {
            display: block;

            > div {
                border-left: 1px solid #00fafe;
            }

            > div:nth-last-of-type(1),
            > div:nth-last-of-type(2) {
                border-bottom: none;
            }
        }

        > .map-capability-table {

            > .map-capability-table-header {
                color: #fff;
                text-align: center;
                padding: 10px 0px;
                box-sizing: border-box;
                border-top:1px solid #00FAFE;
                border-left:1px solid #00FAFE;
                border-right:1px solid #00FAFE;

                > .el-col:not(:last-child) {
                    border-right:1px solid #00FAFE;
                }
            }

            > .map-capability-table-body {
                color: #fff;
                text-align: center;
                padding: 10px 0px;
                box-sizing: border-box;
                border-top:1px solid #00FAFE;
                border-left:1px solid #00FAFE;
                border-right:1px solid #00FAFE;

                &:last-child {
                    border-bottom:1px solid #00FAFE;
                }

                > .el-col:not(:last-child) {
                    border-right:1px solid #00FAFE;
                }
            }
        }

        > div.el-row {
            padding: 10px 0px;
            box-sizing: border-box;
            border-top:1px solid #00FAFE;
            border-right:1px solid #00FAFE;

            > div.el-col {
                color: #fff;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: center;
                height: 24px;

                &:not(:last-child) {
                    border-right: 1px solid #00FAFE;
                }
            }

            > div:first-child {
                text-align: center;
            }
        }

        > div:nth-child(2n+1) {
            grid-column: 1;
            transition: all .6s linear;
            border-left: 1px solid #00fafe;
        }

        > div:nth-child(2n) {
            grid-column: 2;
            transition: all .6s linear;
        }

        > div:nth-last-of-type(1),
        > div:nth-last-of-type(2) {
            border-bottom: 1px solid #00fafe;
        }
    }

    .map-icon {
        background-blend-mode: lighten; 
        width:15px; 
        height: 15px; 
        display:inline-block;

        &.map-icon-ray {
            background-image: url(../../assets/Images/ray.png);

            &.is-online {
                background-image: url(../../assets/Images/ray.png), linear-gradient(#00FAFE, #00FAFE);
            }
        }

        &.map-icon-box {
            background-image: url(../../assets/Images/box-icon.png);

            &.is-online {
                background-image: url(../../assets/Images/box-icon.png),linear-gradient(#00FAFE, #00FAFE);
            }
        }

        &.map-icon-fill-light {
            background-image: url(../../assets/Images/fill-light.png);

            &.is-online {
                background-image: url(../../assets/Images/fill-light.png),linear-gradient(#00FAFE, #00FAFE);
            }
        }

        &.map-icon-flash-light {
            background-image: url(../../assets/Images/flash-light.png);

            &.is-online {
                background-image: url(../../assets/Images/flash-light.png),linear-gradient(#00FAFE, #00FAFE);
            }
        }

        &.map-icon-video {
            background-image: url(../../assets/Images/video.png);

            &.is-online {
                background-image: url(../../assets/Images/video.png),linear-gradient(#00FAFE, #00FAFE);
            }
        }
        
        &.map-icon-terminal {
            background-image: url(../../assets/Images/terminal.png);

            &.is-online {
                background-image: url(../../assets/Images/terminal.png),linear-gradient(#00FAFE, #00FAFE);
            }
        }
    }


    .map-popover-title:hover {
        color : #409EFF;
    }
</style>
