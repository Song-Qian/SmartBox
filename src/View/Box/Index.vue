<template>
    <div class="smart-box smart-box-flex-row" v-loading.fullscreen.lock="loaded" element-loading-text="指令下发中" element-loading-spinner="fa fa-spin fa-spinner fa-5x" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear">
            <div class="smart-box smart-box-window" style="position:relative; float:left; background:none; width: 280px; height: 100%; z-index: 999; transition: width .6s ease;" :style="{ width : !hasFold ? '280px' : '0px' }">
                <div class="map-scrub"></div>
                <div class="map-fold" :class="{ 'unfold' : hasFold }"  @click="hasFold = !hasFold"><i :class="{ 'el-icon-caret-right' : hasFold, 'el-icon-caret-left' : !hasFold }"></i></div>
                <div class="smart-box-window-inner" style="border-radius:0px; border-width: 0px 1px 0px 0px; background: transparent; position:relative; z-index: 999;">
                    <div class="box-tree-panel"></div>
                    <div class="smart-box-window-title">区域</div>
                    <div class="smart-box-window-body" style="padding: 0px 30px; box-sizing: border-box;overflow-y:auto;">
                        <el-input class="smart-box smart-box-input" size="small" v-model="deviceName" style="margin: 15px 0px; width: 220px;" clearable></el-input>
                        <el-tree
                                class="smart-box smart-box-tree"
                                ref="tree"
                                node-key="id"
                                :data.sync="treeData"
                                :props="{ label: 'name', children: 'children', isLeaf: 'leaf' }"
                                :load="loadTreeNode"
                                @node-click="clickNode"
                                :filter-node-method="(value, data, node) => value === '' || data.type === 'area' || data.hasFilter || data.name.indexof(value) > -1"
                                lazy>
                            <template v-slot:default="scoped">
                                <div>
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
                    </div>
                </div>
            </div>
            <div class="box-container" :style="{ width : !hasFold ? 'calc(100% - 280px)' : '100%' }">
                <router-view />
            </div>
        </div>
    </div>
</template>
<script>
import { default as Equipment } from "./index"
export default Equipment
</script>
<style lang="scss" scoped>
    .box-tree-panel {
        position: absolute;
        z-index: -1;
        background-color: rgba(1, 161, 178, .2);
        width: 100%;
        height: 100%;
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

    .box-container {
        position: relative;
        z-index: 98;
        float: left;
        width: calc(100% - 360px);
        height: 100%;
        transition: width .6s ease;
    }
</style>