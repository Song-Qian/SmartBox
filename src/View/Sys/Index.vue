<template>
    <div ref="container" class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24" style="padding: 15px;">
            <div class="smart-box smart-box-flex-row">
                <div class="smart-box-flex-column-6 smart-box smart-box-window">
                    <div class="smart-box-window-inner">
                        <div class="smart-box-window-title">告警分类统计（一周内）</div>
                        <div ref="type_ec" style="width:100%;" class="smart-box-window-body"></div>
                    </div>
                </div>
                <div class="smart-box-flex-column-12" style="padding: 0px 10px;">
                    <div class="smart-box smart-box-flex-row vertical">
                        <div class="smart-box-flex-column-12" style="padding: 0px 0px 10px 0px;">
                            <div ref="meterRef" class="sys-meter" style="padding: 10px 10px; box-sizing: border-box;"
                                 @mouseenter="showSysMeterDesc = true" @mouseleave="showSysMeterDesc = false">
                                <div class="smart-box smart-box-flex-row vertical" style="border-radius: 50px; overflow: hidden;">
                                    <div ref="meter_ec" class="smart-box-flex-column-14" style="padding: 20px 10px 0px 10px;"></div>
                                    <div class="smart-box-flex-column-10 smart-box-flex-column-clear" style="margin-top:-12px;">
                                        <div class="smart-box smart-box-flex-row">
                                            <div class="smart-box-flex-column-clear" @click="jumpToDeviceTable(1)" v-if="getMeterShow.indexOf(1) > -1" :class="{ 'smart-box-flex-column-6' : getMeterShow.length === 4, 'smart-box-flex-column-8' : getMeterShow.length === 3, 'smart-box-flex-column-12' : getMeterShow.length === 2, 'smart-box-flex-column-24' : getMeterShow.length === 1 }">
                                                <pre class="sys-meter-font-score">{{meter.camera.online}} / {{meter.camera.total}}</pre>
                                                <pre class="sys-meter-font-desc"><transition
                                                        name="el-fade-in-linear"><span v-show="showSysMeterDesc">摄像机在线数量 / 摄像机总量</span></transition></pre>
                                                <div class="sys-meter-font-text">
                                                    <span >摄像机在线率</span>
                                                </div>
                                            </div>
                                            <div class="smart-box-flex-column-clear"  @click="jumpToDeviceTable(2)" v-if="getMeterShow.indexOf(2) > -1" :class="{ 'smart-box-flex-column-6' : getMeterShow.length === 4, 'smart-box-flex-column-8' : getMeterShow.length === 3, 'smart-box-flex-column-12' : getMeterShow.length === 2, 'smart-box-flex-column-24' : getMeterShow.length === 1 }">
                                                <pre class="sys-meter-font-score">{{meter.box.online}} / {{meter.box.total}}</pre>
                                                <pre class="sys-meter-font-desc"><transition
                                                        name="el-fade-in-linear"><span v-show="showSysMeterDesc">智能机箱在线数量 / 智能机箱总量</span></transition></pre>
                                                <div class="sys-meter-font-text">
                                                    <span>智能机箱在线率</span>
                                                </div>
                                            </div>
                                            <div class="smart-box-flex-column-clear" v-if="getMeterShow.indexOf(3) > -1" :class="{ 'smart-box-flex-column-6' : getMeterShow.length === 4, 'smart-box-flex-column-8' : getMeterShow.length === 3, 'smart-box-flex-column-12' : getMeterShow.length === 2, 'smart-box-flex-column-24' : getMeterShow.length === 1 }">
                                                <pre class="sys-meter-font-score">{{meter.traffic.online}} / {{meter.traffic.total}}</pre>
                                                <pre class="sys-meter-font-desc"><transition
                                                        name="el-fade-in-linear"><span v-show="showSysMeterDesc">信号机在线数量 / 信号机总量</span></transition></pre>
                                                <div class="sys-meter-font-text">
                                                    <span>信号机在线率</span>
                                                </div>
                                            </div>
                                            <div class="smart-box-flex-column-clear" v-if="getMeterShow.indexOf(4) > -1" :class="{ 'smart-box-flex-column-6' : getMeterShow.length === 4, 'smart-box-flex-column-8' : getMeterShow.length === 3, 'smart-box-flex-column-12' : getMeterShow.length === 2, 'smart-box-flex-column-24' : getMeterShow.length === 1 }">
                                                <pre class="sys-meter-font-score">{{meter.light.online}} / {{meter.light.total}}</pre>
                                                <pre class="sys-meter-font-desc"><transition
                                                        name="el-fade-in-linear"><span v-show="showSysMeterDesc">交通灯故障数量 / 交通灯总量</span></transition></pre>
                                                <div class="sys-meter-font-text">
                                                    <span>交通灯故障率</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="smart-box-flex-column-12 smart-box smart-box-window"
                             style="padding: 10px 10px 10px 10px;">
                            <div class="smart-box-window-inner">
                                <div class="smart-box-window-title" style="background-size: 353px 20px;">实时告警信息（一小时内）
                                </div>
                                <div class="smart-box-window-body" style="padding: 10px 20px;box-sizing: border-box;">
                                    <el-table :data="formData" class="smart-box smart-box-table" size="small"
                                              height="calc(100%)" :cell-style="cellStyle" stripe>
                                        <el-table-column label="监控点" align="center" header-align="center" min-width="50%"   prop="devName"
                                                         show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <a href="#" style="text-decoration:none;color: #409EFF;"
                                                   @click="jump(scope.row)">
                                                    <i v-if="scope.row.isDeal === 1" style="color: #FDB643;"
                                                       class="fa fa-circle fa-lg"></i>
                                                    <i v-if="scope.row.isDeal === 2" style="color: #05A2F4;"
                                                       class="fa fa-circle fa-lg"></i>
                                                    <i v-if="scope.row.isDeal === 3" style="color: #969696;"
                                                       class="fa fa-circle fa-lg"></i>
                                                    <i v-if="scope.row.isDeal === 4" style="color: #61FD44;"
                                                       class="fa fa-circle fa-lg"></i>
                                                    {{scope.row.devName ? scope.row.devName : scope.row.devIp}}</a>
                                                <br>
                                                <span >{{ scope.row.alarmDesc}}{{scope.row.alarmName}}</span>
                                            </template>
                                        </el-table-column>
<!--                                        <el-table-column label="告警类型"  width="200px" align="center" header-align="center"-->
<!--                                                         prop="alarmName" show-overflow-tooltip>-->
<!--                                            <template slot-scope="scope">-->

<!--                                            </template>-->
<!--                                        </el-table-column>-->

                                        <el-table-column label="告警时间"  min-width="15%"  align="center" header-align="center"
                                                         prop="alarmTime" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                {{ scope.row.alarmTime && renderTime(scope.row.alarmTime) || '' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="告警状态" align="center"  min-width="15%"   header-align="center" prop="isDeal"
                                                         show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.isDeal === 1" style="color: #FDB643">未处理</span>
                                                <span v-if="scope.row.isDeal === 2" style="color: #05A2F4">已派单</span>
                                                <span v-if="scope.row.isDeal === 3" style="color: #969696">已忽略</span>
                                                <span v-if="scope.row.isDeal === 4" style="color: #61FD44">已完成</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作"  header-align="center"  min-width="20%"  align="center">
                                            <template slot-scope="scope">
                                                <el-button-group>
                                                    <el-button size="mini" type="warning" v-if="scope.row.isDeal === 1 || scope.row.isDeal ===2 "
                                                               @click="ignore(scope.row)">忽略
                                                    </el-button>
                                                    <el-button size="mini" type="primary" v-if="scope.row.isDeal === 1"
                                                               @click="changeState(scope.row)">派单
                                                    </el-button>
                                                    <el-button size="mini" type="success" v-if="scope.row.isDeal === 2"
                                                               @click="complete(scope.row)">完成
                                                    </el-button>
                                                    <el-button size="mini" type="warning" v-if="scope.row.isDeal === 3 || scope.row.isDeal ===4"
                                                               @click="undo(scope.row)">撤销
                                                    </el-button>
                                                </el-button-group>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="smart-box-flex-column-6 smart-box smart-box-window">
                    <div class="smart-box-window-inner" style="padding-bottom: 20px">
                        <div class="smart-box-window-title">各区告警统计（一周内）</div>
                        <div ref="area_ec" class="smart-box-window-body">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <smart-box-dialog :show.sync="changeStateDailog.Isshow" width="600px" height="280px" title="告警信息派单"
                          @closed="closeDialog">
            <el-row type="flex" justify="center" align="center">
                <el-col :span="20">
                    <el-form label-width="120px" size="small" :model="changeStateDailog.ruleForm" :rules="rules"
                             ref="ruleForm" style="padding: 25px 0px;">
                        <el-form-item label="接单人：" prop="dealMan">
                            <template v-slot:label>
                                <span style="color: #fff;">接单人：</span>
                            </template>
                            <el-select v-model="changeStateDailog.ruleForm.dealMan" size="small" placeholder="请选择"
                                       class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"
                                       style="width: 300px" resize clearable>
                                <el-option v-for="(item, key) in changeStateDailog.processor" :key="key"
                                           :label="item.label" :value="item.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注" class="waring-form-item" prop="remark">
                            <template v-slot:label>
                                <span style="color: #fff;">备注：</span>
                            </template>
                            <el-input type="textarea" style="width: 300px" class="smart-box smart-box-input"
                                      v-model="changeStateDailog.ruleForm.remark" resize></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <el-button type="success" icon="el-icon-check" style="width: 70px;" size="small"
                           @click="insertDealInfo">确定
                </el-button>
                <el-button type="warning" icon="el-icon-close" style="width: 70px;" size="small"
                           @click="closechangeStateDailog">取消
                </el-button>
            </template>
        </smart-box-dialog>
    </div>
</template>
<script>
    import {default as Sys} from './index'

    export default Sys
</script>
<style lang="scss" scoped>
    .sys-meter {
        width: 100%;
        height: 100%;
        background-image: url(../../assets/Images/line-box.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
       
        .sys-meter-font-score {
            font-size: 24px;
            color: #fff;
            width: 100%;
            text-align: center;
            margin: 10px 0px;
        }

        .sys-meter-font-desc {
            font-size:55%;
            height: 20px;
            color: #fff;
            width: 100%;
            text-align: center;
        }

        .sys-meter-font-text {
            width: 160px;
            height: 40px;
            font-size: 14px;
            color: #fff;
            text-align: center;
            border: 1px solid #10205b;
            border-radius: 3px;
            background-color: #00002d;
            margin-left: auto;
            margin-right: auto;

            > span {
                height: 20px;
                margin: 10px auto;
                display: inline-block;
                border-left: 3px solid #00fafe;
                text-indent: 1em;
            }
        }
    }


</style>


