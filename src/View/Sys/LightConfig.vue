<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" xmlns:color="http://www.w3.org/1999/xhtml">
    <div ref="container" class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear">
            <div class="smart-box smart-box-window"
                 style="position:relative; float:left; background:none; width: 360px; height: 100%; z-index: 999; transition: width .6s ease;"
                 :style="{ width : !hasFold ? '280px' : '0px' }">
                <div class="map-scrub"></div>
                <div class="map-fold" :class="{ 'unfold' : hasFold }" @click="hasFold = !hasFold"><i
                        :class="{ 'el-icon-caret-right' : hasFold, 'el-icon-caret-left' : !hasFold }"></i></div>
                <div class="smart-box-window-inner"
                     style="border-radius:0px; border-width: 0px 1px 0px 0px; background: transparent; position:relative; z-index: 999;">
                    <div class="box-tree-panel"></div>
                    <div class="smart-box-window-title">区域</div>
                    <div class="smart-box-window-body"
                         style="padding: 30px 30px 0px; box-sizing: border-box;overflow-y:auto;">
                        <el-tree
                                class="smart-box smart-box-tree"
                                ref="tree"
                                node-key="id"
                                :data.sync="treeData"
                                :props="{ label: 'name', children: 'children', isLeaf: 'leaf' }"
                                :load="loadTreeNode"
                                @node-click="clickNode"
                                lazy>
                             <template v-slot:default="scoped">
                                <div @dblclick.stop="handlerTreeNodeDbClick(scoped.node)" style="width:auto; max-width:calc(100% - 46px);">
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
            <div class="box-container" :style="{ width : !hasFold ? 'calc(100% - 280px)' : '100%' }">
                <div class="smart-box smart-box-flex-row vertical">
                    <div class="smart-box-flex-column-24">
                        <div class="smart-box smart-box-window"
                             style="height: 100%; padding-top:10px; box-sizing: border-box; background: none; ">
                            <div class="smart-box-window-inner">
                                <div class="smart-box-window-title"
                                     style="background-size: 353px;padding: 10px 0px;height: 8%; line-height: 80px;position:relative; ">
                                    信号灯列表
                                    <el-button-group style="position: absolute; right: 0px; top : 50%; transform: translate(-50%, -50%)" >
                                        <el-button  type="primary" size="small"    @click="$router.push({ name : 'trafficConfig'})">交通灯参数设置</el-button>
                                        <el-button   type="primary" size="small"    @click="$router.push({ name : 'warnConfig'})">告警等级设置</el-button>
                                    </el-button-group>
                                </div>
                                <div class="smart-box-mechanical-body"
                                     style=" box-sizing: border-box;padding: 0px 30px;height: 100%;width: 100%;">
                                    <el-form label-position="left" label-width="90px" style="padding-top: 30px">
                                        <el-row type="flex" justify="center" align="left"
                                                style="height: 50px;padding-top: 10px">
                                            <el-col :span="24" align="left">
                                                <el-button size="small" icon="el-icon-edit" type="warning"
                                                           @click="showConfigDialog">
                                                    批量设置参数
                                                </el-button>
                                                <el-button size="small" icon="el-icon-edit" type="warning"
                                                           @click="showTimeDialog">
                                                    批量设置运行时长
                                                </el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                    <el-table ref="configTable" :data="rows" height="calc(78%)" width="100%"
                                              class="smart-box smart-box-table"
                                              style="font-size: 14px;" size="small"
                                              stripe>
                                        <el-table-column v-if="showSelect"
                                                type="selection"
                                                width="55">

                                        </el-table-column>
                                        <el-table-column label="信号灯编号" align="center" hidden header-align="center"
                                                         prop="no"
                                                         show-overflow-tooltip></el-table-column>
                                        <el-table-column label="信号灯名称" align="center" header-align="center"
                                                         prop="name" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="信号灯检测开关" align="center" header-align="center"
                                                         prop="switchConfig" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.switchConfig === 1">开启</span>
                                                <span v-if="scope.row.switchConfig === 0">关闭</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="信号灯能力集合" align="center" header-align="center"
                                                         prop="capConfig" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.capConfig === 3">有灯和半程倒计时器</span>
                                                <span v-if="scope.row.capConfig === 2">有灯和全程倒计时器</span>
                                                <span v-if="scope.row.capConfig === 1">有灯无倒计时器</span>
                                                <span v-if="scope.row.capConfig === 0">无灯</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="信号灯功率阈值(%)" align="center" header-align="center"
                                                         prop="powerConfig" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="倒计时器运行时长(s)" align="center" header-align="center"
                                                         prop="userLightConfig" show-overflow-tooltip>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <smart-box-dialog ref="light_config_dialog" width="750px" height="380px" :show.sync="hasConfigDialogShow"
                          :title="'修改信号灯参数'" @closed="handlerOverlayClosed">
            <el-form label-width="160px" ref="configUpdate" :model="configForm"
                     label-position="left" size="small" style="padding: 40px 0px 0px 30px">
                <el-row type="flex" align="center" justify="center" >
                    <el-col :offset="1" :span="18">
                        <el-form-item label="信号灯检测开关">
                            <template v-slot:label>
                                <span style="color: #fff;">信号灯检测开关：</span>
                            </template>
                            <el-select class="smart-box smart-box-time-select"
                                       popper-class="smart-box smart-box-popover"
                                       v-model="configForm.switchConfig"
                                       clearable placeholder="请选择">
                                <el-option
                                        v-for="item in switchOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" style="width: 100px;" size="small" @click="setLightSwitchs">设置检测开关
                        </el-button>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center" style="padding-top: 20px">
                    <el-col :offset="1" :span="18">
                        <el-form-item prop="mobile" label="信号灯能力集合">
                            <template v-slot:label>
                                <span style="color: #fff;">信号灯能力集合：</span>
                            </template>
                            <el-select v-model="configForm.capConfig"
                                       class="smart-box smart-box-time-select"
                                       popper-class="smart-box smart-box-popover"
                                       clearable placeholder="请选择">
                                <el-option
                                        v-for="item in capOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" style="width: 100px" size="small" @click="setLightCap">设置能力集
                        </el-button>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center" style="padding-top: 20px">
                    <el-col :offset="1" :span="18">
                        <el-form-item label="信号灯功率阈值">
                            <template v-slot:label>
                                <span style="color: #fff;">信号灯功率阈值(%)：</span>
                            </template>
                            <el-input v-model="configForm.powerConfig" type="number" max="99" min="1" class="smart-box smart-box-input" style="width: 212px" placeholder="检测功率阈值范围：1%~99%"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" style="width: 100px" size="small" @click="setLightPower">设置功率阈值
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>

        <smart-box-dialog ref="light_time_dialog" width="530px" height="180px" :show.sync="hasTimeDialogShow"
                          :title="'信号灯时长设置'" @closed="handlerOverlayClosed">
            <el-form label-width="150px" ref="timeUpdate" :model="configForm"
                     label-position="left" size="small" style="padding: 40px 0px 0px 30px">
                <el-row type="flex" align="center" justify="center" style="padding-top: 20px">
                    <el-col :offset="1" :span="24">
                        <el-form-item label="信号灯功率阈值">
                            <template v-slot:label>
                                <span style="color: #fff;">信号灯时长(秒)：</span>
                            </template>
                            <el-input v-model="configForm.timeConfig" type="number" max="256" min="1" class="smart-box smart-box-input" style="width: 212px" placeholder="信号灯亮灯时长范围：1-256 "/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="setLightTime">设置
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed2">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
    </div>
</template>
<script>
    import {default as LightConfig} from "./lightConfig"

    export default LightConfig
</script>
<style lang="scss" scoped>

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
        text-align: center;
        cursor: pointer;

        &.unfold {
            right: -30px;
            border-radius: 0px 5px 5px 0px;
            background-color: rgb(1, 161, 178);
            border-top: 1px solid rgba(0, 250, 254, .8);
            border-right: 1px solid rgba(0, 250, 254, .8);
            border-bottom: 1px solid rgba(0, 250, 254, .8);
            transition: all .6s ease;
        }

        > i {
            display: block;
        }
    }

    .box-container {
        position: relative;
        z-index: 98;
        float: left;
        width: calc(100% - 360px);
        height: 100%;
        transition: width .6s ease;
    }

    .box-tree-panel {
        position: absolute;
        z-index: -1;
        background-color: rgba(1, 161, 178, .2);
        width: 100%;
        height: 100%;
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
</style>


