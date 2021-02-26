<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" xmlns:color="http://www.w3.org/1999/xhtml">
    <div ref="container" class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24 smart-box-flex-column-clear">
            <div class="smart-box smart-box-flex-row vertical">
                <div class="smart-box-flex-column-24">
                    <div class="smart-box smart-box-window"
                         style="height: 100%; padding-top:10px; box-sizing: border-box; background: none; ">
                        <div class="smart-box-window-inner">
                            <div class="smart-box-window-title"
                                 style="background-size: 353px;padding: 10px 0px;height: 8%; line-height: 80px;position:relative; ">
                                交通灯参数设置
                                <el-button-group
                                        style="position: absolute; right: 0px; top : 50%; transform: translate(-50%, -50%)">
                                    <el-button type="primary" size="small"
                                               @click="$router.push({ name : 'lightConfig'})">信号机能力集设置
                                    </el-button>
                                    <el-button type="primary" size="small"
                                               @click="$router.push({ name : 'warnConfig'})">告警等级设置
                                    </el-button>
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
                                                批量检测周期
                                            </el-button>
                                            <el-button size="small" icon="el-icon-edit" type="warning"
                                                       @click="showModeDialog">
                                                批量设置时长运行模式
                                            </el-button>
                                            <el-button size="small" icon="el-icon-edit" type="warning"
                                                       @click="showCheckDialog">
                                                设置屏蔽信号检测时段
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </el-form>
                                <el-table ref="configTable" :data="rows" height="calc(78%)" width="100%"
                                          class="smart-box smart-box-table" style="font-size: 14px;" size="small"
                                          @select="handleSelectionChange" @select-all="handleSelectionAll" stripe>
                                    <el-table-column type="selection" width="55">
                                    </el-table-column>
                                    <el-table-column label="id" align="center" hidden header-align="center"
                                                     prop="deviceId" v-if="false" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="设备名称" align="center" header-align="center"
                                                     prop="deviceName" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="设备IP" align="center" header-align="center"
                                                     prop="deviceIp" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="在线状态" align="center" header-align="center"
                                                     prop="online" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.online === 1" style="color: #61FD44">在线</span>
                                            <span v-if="scope.row.online === 0" style="color: #FDB643">离线</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="检测周期" align="center" header-align="center"
                                                     prop="detectionCycle" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="超时时间" align="center" header-align="center"
                                                     prop="timeOut" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="检测次数" align="center" header-align="center"
                                                     prop="detectTimes" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="信号机紊乱恢复时间" align="center" header-align="center"
                                                     prop="recoveryTime" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="灯亮时长运行模式" align="center" header-align="center"
                                                     prop="lightConfigMode" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.lightConfigMode == 0"
                                                  style="color: #FDB643">手动模式</span>
                                            <span v-else style="color: #61FD44">自动模式</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="左右转检测时段" align="center" header-align="center"
                                                     prop="turnSignalIgnore" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column label="所有灯检测时段" align="center" header-align="center"
                                                     prop="signalIgnore" show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <smart-box-dialog ref="traffic_update_dialog" width="700px" height="390px" :show.sync="hasConfigDialogShow"
                          :title="'修改信号灯参数'" @closed="handlerOverlayClosed">
            <el-form label-width="250px" ref="trafficUpdate" :model="trafficForm"
                     label-position="left" size="small" style="padding: 40px 0px 0px 30px">
                <el-row type="flex" align="center" justify="center">
                    <el-col :offset="3" :span="24">
                        <el-form-item label="检测周期">
                            <template v-slot:label>
                                <span style="color: #fff;">检测周期（单位：s）：</span>
                            </template>
                            <el-input v-model="trafficForm.detectionCycle" type="number" max="99" min="1"
                                      class="smart-box smart-box-input" style="width: 212px"
                                      placeholder=""/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center">
                    <el-col :offset="3" :span="24">
                        <el-form-item label="超时">
                            <template v-slot:label>
                                <span style="color: #fff;">超时（单位：min）：</span>
                            </template>
                            <el-input v-model="trafficForm.timeOut" type="number" max="99" min="1"
                                      class="smart-box smart-box-input" style="width: 212px"
                                      placeholder=""/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center">
                    <el-col :offset="3" :span="24">
                        <el-form-item label="检测次数">
                            <template v-slot:label>
                                <span style="color: #fff;">检测次数（单位：次）：</span>
                            </template>
                            <el-input v-model="trafficForm.detectTimes" type="number" max="99" min="1"
                                      class="smart-box smart-box-input" style="width: 212px"
                                      placeholder=""/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center">
                    <el-col :offset="3" :span="24">
                        <el-form-item label="信号机紊乱恢复时间">
                            <template v-slot:label>
                                <span style="color: #fff;">信号机紊乱恢复时间（单位：min）：</span>
                            </template>
                            <el-input v-model="trafficForm.recoveryTime" type="number" max="99" min="1"
                                      class="smart-box smart-box-input" style="width: 212px"
                                      placeholder=""/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="setTrafficOptions">设置
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>

        <smart-box-dialog ref="mode_update_dialog" width="500px" height="150px" :show.sync="hasModeDialogShow"
                          :title="'修改信号灯时长运行模式'" @closed="handlerOverlayClosed">
            <el-form label-width="100px" ref="modeUpdate"
                     label-position="left" size="small" style="padding: 40px 0px 0px 30px">
                <el-row type="flex" align="center" justify="center">
                    <el-col :offset="3" :span="24">
                        <el-form-item label="倒计时模式">
                            <template v-slot:label>
                                <span style="color: #fff;">运行模式：</span>
                            </template>
                            <el-radio v-model="modeConfig" label="2"><span style="color: #fff;">自动模式</span></el-radio>
                            <el-radio v-model="modeConfig" label="1"><span style="color: #fff;">手动模式</span></el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px;">
                    <el-button type="success" style="width: 90px;" size="small" @click="setTrafficMode">设置
                    </el-button>
                    <el-button type="warning" style="width: 90px;" size="small" @click="handlerOverlayClosed">取消
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog ref="mode_update_dialog" width="1000px" height="480px" :show.sync="hasCheckDialogShow"
                          :title="'设置屏蔽信号检测时段'" @closed="handlerOverlayClosed">
            <el-form label-width="100px" ref="modeUpdate"
                     label-position="left" size="small" style="padding: 40px 0px 0px 30px">
                <el-row type="flex" align="center" justify="center" style="padding-top: 20px">
                    <el-col :span="9">
                        <el-form-item label="左右转灯">
                            <template v-slot:label>
                                <span style="color: #fff;">左右转灯：</span>
                            </template>
                            <el-time-select
                                    v-model="turn0"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                            <span style="color: #FFF">-</span>
                            <el-time-select
                                    v-model="turn1"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-time-select
                                v-model="turn2"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                        <span style="color: #FFF">-</span>
                        <el-time-select
                                v-model="turn3"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                    </el-col>
                    <el-col :span="7">
                        <el-time-select
                                v-model="turn4"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                        <span style="color: #FFF">-</span>
                        <el-time-select
                                v-model="turn5"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">

                        </el-time-select>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center" style="padding-top: 20px">
                    <el-col :span="9">
                        <el-form-item label="">
                            <template v-slot:label>
                                <span style="color: #fff;"></span>
                            </template>
                            <el-time-select
                                    v-model="turn6"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                            <span style="color: #FFF">-</span>
                            <el-time-select
                                    v-model="turn7"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col  :span="8">
                        <el-time-select
                                v-model="turn8"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                        <span style="color: #FFF">-</span>
                        <el-time-select
                                v-model="turn9"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                    </el-col>
                    <el-col :span="7">
                        <el-button type="primary" style="width: 100px" size="small" @click="setAllTurnLight">设置左右转灯
                        </el-button>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center" style="padding-top: 20px">
                    <el-col :span="9">
                        <el-form-item label="所有灯">
                            <template v-slot:label>
                                <span style="color: #fff;">所有灯：</span>
                            </template>
                            <el-time-select
                                    v-model="all0"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                            <span style="color: #FFF">-</span>
                            <el-time-select
                                    v-model="all1"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-time-select
                                v-model="all2"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                        <span style="color: #FFF">-</span>
                        <el-time-select
                                v-model="all3"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                    </el-col>
                    <el-col :span="7">
                        <el-time-select
                                v-model="all4"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                        <span style="color: #FFF">-</span>
                        <el-time-select
                                v-model="all5"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">

                        </el-time-select>
                    </el-col>
                </el-row>
                <el-row type="flex" align="center" justify="center" style="padding-top: 20px">
                    <el-col :span="9">
                        <el-form-item label="">
                            <template v-slot:label>
                                <span style="color: #fff;"></span>
                            </template>
                            <el-time-select
                                    v-model="all6"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                            <span style="color: #FFF">-</span>
                            <el-time-select
                                    v-model="all7"
                                    size="small"
                                     class="smart-box smart-box-time-select"
                                    style="width: 99px;"
                                    format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col  :span="8">
                        <el-time-select
                                v-model="all8"
                                size="small"
                                class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                        <span style="color: #FFF">-</span>
                        <el-time-select
                                v-model="all9"
                                size="small"
                                 class="smart-box smart-box-time-select"
                                style="width: 99px;"
                                format="HH:mm"
                                    :picker-options="{
                                         start: '00:00',
                                        step: '00:01',
                                        end: '24:00'
                                      }">
                        </el-time-select>
                    </el-col>
                    <el-col :span="7">
                        <el-button type="primary" style="width: 100px" size="small" @click="setAllTrafficLight">设置所有灯
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
    </div>
</template>
<script>
    import {default as TrafficConfig} from "./trafficConfig"

    export default TrafficConfig
</script>
<style lang="scss" scoped>

</style>


