<template>
    <div class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear" style="position:relative;">
            <div class="smart-box smart-box-window" style="background:none; position:absolute; top: 0px; left: 0px; width: 360px; height: 100%; z-index: 999; overflow: hidden;">
                <div class="map-scrub"></div>
                <div class="smart-box-window-inner" style="border-radius:0px; border-width: 0px 1px 0px 0px; background: transparent; position:relative; z-index: 999;">
                    <div class="map-tree-panel"></div>
                    <div class="smart-box-window-title">区域</div>
                    <div class="smart-box-window-body" style="padding: 0px 30px; box-sizing: border-box; overflow-y:auto;">
                        <el-select class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" v-model="deviceType" style="margin: 10px 0px; width: 300px;" clearable>
                            <el-option value="1" label="摄像机"/>
                            <el-option value="2" label="光传输设备"/>
                            <el-option value="3" label="闪光灯"/>
                            <el-option value="4" label="补光灯"/>
                            <el-option value="5" label="智能机箱"/>
                            <el-option value="6" label="风扇"/>
                        </el-select>
                        <el-tree
                            class="smart-box smart-box-tree"
                            ref="tree"
                            node-key="id"
                            :data.sync="treeData"
                            :props="treeProps"
                            :load="loadTreeNode"
                            @check-change="handlerTreeCheckChange"
                            @node-contextmenu="handlerTreeMenuContext"
                            show-checkbox
                            check-strictly
                            lazy
                            draggable
                            :allow-drop="handlerTreeAllowDrop"
                            @node-drop="handleDropEnd"
                            @node-expand="expandTreeNodes"
                            accordion>
                            <template v-slot:default="scoped">
                                <div @dblclick.stop="handlerTreeNodeDbClick(scoped.node)">
                                    <span class="el-tree-node__label" v-if="scoped.node.data.type === 'area'"><i class="fa fa-map-marker"></i> {{scoped.node.label}} ({{scoped.node.data.total}})</span>
                                    <span class="el-tree-node__label" v-if="scoped.node.data.type === 'WTOE-VE'"><i class="fa fa-microchip"></i> {{scoped.node.label}}</span>
                                    <span class="el-tree-node__label" v-if="scoped.node.data.type === 'WTOE-VN'"><i class="el-icon-cpu"></i> {{scoped.node.label}}</span>
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
                                        <ul v-show="treeNodeItem && treeNodeItem.data.type === 'area' || false" class="el-select-group__wrap">
                                            <li class="el-select-group__title"><i class="el-icon-crop"></i> 区域</li>
                                            <li>
                                                <ul class="el-select-group">
                                                    <li class="el-select-dropdown__item" @click="handlerOpenAreaEdit(treeNodeItem.data)">添加区域</li>
                                                    <li class="el-select-dropdown__item" @click="handlerModifyArea(treeNodeItem.data, treeNodeItem.vnode)">修改区域</li>
                                                    <li class="el-select-dropdown__item" @click="handlerDropArea(treeNodeItem.data)">删除区域</li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <ul class="el-select-group__wrap">
                                            <li class="el-select-group__title"><i class="fa fa-microchip"></i> 设备</li>
                                            <li>
                                                <ul class="el-select-group">
                                                    <li v-show="treeNodeItem && treeNodeItem.data.type === 'area' || false" class="el-select-dropdown__item" @click="handlerOpenDeviceEdit(treeNodeItem.data)">添加设备</li>
                                                    <li v-show="treeNodeItem && ['WTOE-VE', 'WTOE-VN'].indexOf(treeNodeItem.data.type) > -1 || false" class="el-select-dropdown__item" @click="handlerModifyDevice(treeNodeItem.data, treeNodeItem.vnode)">修改设备</li>
                                                    <li v-show="treeNodeItem && ['WTOE-VE', 'WTOE-VN'].indexOf(treeNodeItem.data.type) > -1 || false" class="el-select-dropdown__item" @click="handlerDropDevice(treeNodeItem.data)">删除设备</li>
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
            <div ref="map" class="map-container">
            </div>
        </div>
        <smart-box-dialog ref="device_dialog" :type="'popover'" :show.sync="hasDialogShow" :footer-show="false" v-model="dialogData" :title="'测试标题头'" @closed="handlerOverlayClosed" wrong>
            <template v-slot:default="scoped">
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">设备名称：</el-col>
                    <el-col :span="6" style="color: #fff; padding: 10px 0px; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">{{scoped.data.name}}</el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">坐标地址：</el-col>
                    <el-col :span="6" style="color: #fff; padding: 10px 0px; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">{{ scoped.data.coordinates&& scoped.data.coordinates.join(',') }}</el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="6" style="color: #fff; padding: 10px 0px;">传输速率：</el-col>
                    <el-col :span="6" style="color: #fff; padding: 10px 0px; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">{{scoped.data.post}}</el-col>
                </el-row>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button  type="success" style="width: 90px;" icon="el-icon-check" size="small">确认</el-button>
                    <el-button  type="warning" style="width: 90px;" icon="el-icon-close"  size="small">取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="areaDialog" :show.sync="hasAreaDialogShow" title="添加区域信息" height="400px" width="420px" @closed="handlerCancelAreaEdit" :IsClickMaskClose="false">
            <template v-slot:default>
                <el-form ref="areaForm" :rules="areaRules" :model="areaDialogModel" label-width="120px" size="small" style="margin-top: 20px;">
                    <el-form-item prop="areaNo">
                        <template v-slot:label>
                            <span style="color: #fff;">区域编号：</span>
                        </template>
                        <span style="color: #fff;">{{areaDialogModel.areaNo}}</span>
                    </el-form-item>
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
                        <el-input class="smart-box smart-box-input" v-model="areaDialogModel.areaName" />
                    </el-form-item>
                    <el-form-item prop="areaCoordinates">
                        <template v-slot:label>
                            <span style="color: #fff;">区域坐标：</span>
                        </template>
                        <span :class="{ 'smart-box-text-success' : areaDialogModel.areaCoordinates.length, 'smart-box-text-dangle' : !areaDialogModel.areaCoordinates.length }">
                            <i class="el-icon-location-outline" style="cursor:pointer;" @click="handlerDrawArea" ></i> {{ areaDialogModel.areaCoordinates.length ? '已绘制' : '未绘制'}}
                        </span>
                        <el-tooltip v-show="areaDialogModel.state === 'modify'" content="修改区域坐标时，Enter键确认修改完成，Esc键确认退出修改！" placement="right"><i class="el-icon-question" style="color:#fff;"></i></el-tooltip>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button  type="success" style="width: 90px;"  size="small" @click="handlerSaveTreeNode">确认</el-button>
                    <el-button  type="warning" style="width: 90px;"  size="small" @click="handlerCancelAreaEdit">取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="deviceDialog" :show.sync="hasDeviceDialogShow" :width="getDeviceDialogSize.width" :height="getDeviceDialogSize.height" :title="deviceTitle" @closed="handlerCancelDevice" :IsClickMaskClose="false">
            <template v-slot:default>
                <el-form 
                    ref="deviceForm"
                    label-width="120px" 
                    label-position="right" 
                    :rules="deviceRules" 
                    :model="deviceModel" 
                    class="map-device-form"
                    size="small"
                    >
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" prop="name">
                        <template v-slot:label>
                            <span style="color: #fff;">设备名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.name" />
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" prop="type">
                        <template v-slot:label>
                            <span style="color: #fff;">设备类型：</span>
                        </template>
                        <el-select class="smart-box smart-box-select" value-key="value" popper-class="smart-box smart-box-popover" style="width: 100%;" v-model="deviceModel.type" @change="handlerDevictTypeChange">
                            <el-option v-for="(item, n) in devicedTypeList" :label="item.label" :value="item.value" :key="n"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" prop="areaName">
                        <template v-slot:label>
                            <span style="color: #fff;">所在区域：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.areaName"  readonly disabled></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" prop="deviceIP">
                        <template v-slot:label>
                            <span style="color: #fff;">设备IP：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.deviceIP"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" prop="coordinates">
                        <template v-slot:label>
                            <span style="color: #fff;">经纬度：</span>
                        </template>
                        <span :class="{ 'smart-box-text-success' : deviceModel.coordinates.length, 'smart-box-text-dangle' : !deviceModel.coordinates.length }">
                            <i class="el-icon-location-outline" style="cursor:pointer;" @click="handlerDrawDevice" ></i> {{ deviceModel.coordinates.length ? '已绘制' : '未绘制'}}
                        </span>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="otherDeviceName">
                        <template v-slot:label>
                            <span style="color: #fff;">外接设备名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.otherDeviceName"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="companyName">
                        <template v-slot:label>
                            <span style="color: #fff;">厂家名称：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.companyName"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="listenState">
                        <template v-slot:label>
                            <span style="color: #fff">监测状态</span>
                        </template>
                        <el-select class="smart-box smart-box-select" value-key="value" popper-class="smart-box smart-box-popover" style="width: 100%;" v-model="deviceModel.listenState">
                            <el-option v-for="(item, n) in listenStateList" :label="item.label" :value="item.value" :key="n"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="port">
                        <template v-slot:label>
                            <span style="color: #fff;">端口：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.port"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="energyNo">
                        <template v-slot:label>
                            <span style="color: #fff;">电源编号：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.energyNo"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="otherDeviceIP">
                        <template v-slot:label>
                            <span style="color: #fff;">外接设备IP：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.otherDeviceIP"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="interactionState">
                        <template v-slot:label>
                            <span style="color: #fff;">联动状态：</span>
                        </template>
                        <el-select class="smart-box smart-box-select" value-key="value" popper-class="smart-box smart-box-popover" style="width: 100%;" v-model="deviceModel.interactionStateList">
                            <el-option v-for="(item, n) in listenStateList" :label="item.label" :value="item.value" :key="n"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="checkedSpacing">
                        <template v-slot:label>
                            <span style="color: #fff;">检查间隔时间：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model="deviceModel.checkedSpacing"></el-input>
                    </el-form-item>
                    <el-form-item :class="{ 'map-device-form-item' : deviceModel.type === 'WTOE-VE' }" v-if="hasDeviceVE" prop="reStartTotal">
                        <template v-slot:label>
                            <span style="color: #fff;">重启次数：</span>
                        </template>
                        <el-input class="smart-box smart-box-input" v-model.number="deviceModel.reStartTotal"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button  type="success" style="width: 90px;"  size="small" @click="handlerSaveDevice">确认</el-button>
                    <el-button  type="warning" style="width: 90px;"  size="small" @click="handlerCancelDevice">取消</el-button>
                </div>
            </template>
        </smart-box-dialog>
    </div>
</template>

<script>
import { default as Map } from './index'
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
        // background-repeat: no-repeat;
        // background-attachment: fixed;
        // background-position: top left;
        // background-size: 100% 100%;
        z-index: 998;
        margin: -20px;
    }

    .map-container {
        position: relative;
        z-index: 98;
        width: 100%;
        height: 100%;
    }

    .map-list-item {
        padding: 12px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .map-list-item:hover  {
        background-color: #01A1B2;
    }


   .form-label-padding{
       padding: 0px 10px;
       height: 30px;
   }

   .map-device-form {
        margin-top: 20px; 
        margin-left:auto;
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
</style>
