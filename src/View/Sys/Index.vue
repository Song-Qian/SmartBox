<template>
    <div ref="container" class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-24" style="padding: 15px;">
            <div class="smart-box smart-box-flex-row">
                <div class="smart-box-flex-column-6 smart-box smart-box-window">
                    <div class="smart-box-window-inner">
                        <div class="smart-box-window-title">分类故障统计（一周内）</div>
                        <div ref="type_ec" style="width:100%;" class="smart-box-window-body">
                            
                        </div>
                    </div>
                </div>
                <div class="smart-box-flex-column-12" style="padding: 0px 10px;">
                    <div class="smart-box smart-box-flex-row vertical">
                        <div class="smart-box-flex-column-12" style="padding: 0px 0px 10px 0px;">
                            <div class="sys-meter" style="padding: 10px 10px; box-sizing: border-box;">
                                <div class="smart-box smart-box-flex-row vertical">
                                    <div ref="meter_ec" class="smart-box-flex-column-14" style="padding: 20px 10px 0px 10px;">
                                    </div>
                                    <div class="smart-box-flex-column-10 smart-box-flex-column-clear">
                                        <div class="smart-box smart-box-flex-row">
                                            <div class="smart-box-flex-column-12 smart-box-flex-column-clear">
                                                <pre class="sys-meter-font-score">{{meter.camera.online}} / {{meter.camera.total}}</pre>
                                                <pre class="sys-meter-font-desc">摄像机在线数量 / 摄像机总量</pre>
                                                <div class="sys-meter-font-text">
                                                    <span>操像机在线率</span>
                                                </div>
                                            </div>
                                            <div class="smart-box-flex-column-12 smart-box-flex-column-clear">
                                                <pre class="sys-meter-font-score">{{meter.box.online}} / {{meter.box.total}}</pre>
                                                <pre class="sys-meter-font-desc">智能机箱在线数量 / 智能机箱总量</pre>
                                                <div class="sys-meter-font-text">
                                                    <span>智能机箱在线率</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="smart-box-flex-column-12 smart-box smart-box-window" style="padding: 10px 10px 10px 10px;">
                            <div class="smart-box-window-inner">
                                <div class="smart-box-window-title" style="background-size: 353px 20px;">实时告警信息（一小时内）</div>
                                <div class="smart-box-window-body" style="padding: 10px 20px;box-sizing: border-box;">
                                    <el-table :data="getDataTable" class="smart-box smart-box-table" height="100%" size="small" stripe>
                                        <el-table-column label="监控点" align="center" header-align="center" prop="name" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <i v-if="scope.row.state === '未处理'" style="color: #E6A23C;" class="fa fa-circle fa-lg"></i>
                                                <i v-if="scope.row.state === '已处理'" style="color: #67C23A;" class="fa fa-circle fa-lg"></i>
                                                <a  href="#" style="color: #409EFF;" @click="$router.push({ name : 'box' })">{{scope.row.name}}</a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="故障类型" align="center" header-align="center" prop="type" show-overflow-tooltip></el-table-column>
                                        <el-table-column label="故障时间" align="center" header-align="center" prop="time" show-overflow-tooltip></el-table-column>
                                        <el-table-column label="故障状态" align="center" header-align="center" prop="state" show-overflow-tooltip>
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.state === '未处理'" style="color: #E6A23C">{{scope.row.state}}</span>
                                                <span v-if="scope.row.state === '已处理'" style="color: #67C23A">{{scope.row.state}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" header-align="center" align="center">
                                            <template>
                                                <i class="el-icon-setting" style="cursor:pointer;" @click="changeState()"></i>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="smart-box-flex-column-6 smart-box smart-box-window">
                    <div class="smart-box-window-inner">
                        <div class="smart-box-window-title">各区故障统计（一周内）</div>
                        <div ref="area_ec" class="smart-box-window-body">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <smart-box-dialog :show.sync="changeStateDailog.Isshow" width="550px" height="330px" title="实时告警信息处理" @closed="closeDialog">
            <el-row type="flex" justify="center" align="center">
                <el-col :span="20">
                    <el-form :model="form" label-width="90px" size="small" style="padding: 20px 0px 0px 0px" >
                        <el-form-item label="处理人">
                            <template v-slot:label>
                                <span style="color: #fff;">处理人：</span>
                            </template>
                                <el-select v-model="changeStateDailog.processor" size="small"
                                            class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"
                                         style="width: 300px"  resize>
                                    <el-option value="王部长" label="王部长"/>
                                    <el-option value="张工" label="张工"/>
                                    <el-option value="李工" label="李工"/>
                                    <el-option value="admin" label="admin"/>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="处理状态">
                            <template v-slot:label>
                                <span style="color: #fff;">处理状态：</span>
                            </template>
                            <el-radio v-model="changeStateDailog.radio" label="未处理" style="color: #05A2F4;margin:0px 10px 0px 0px;">未处理</el-radio>
                            <el-radio v-model="changeStateDailog.radio" label="已派工" style="color: #05A2F4;margin:0px 10px 0px 0px;">已派工</el-radio>
                            <el-radio v-model="changeStateDailog.radio" label="已完成" style="color: #05A2F4;margin:0px 10px 0px 0px;">已完成</el-radio>
                            <el-radio v-model="changeStateDailog.radio" label="已忽略" style="color: #05A2F4;margin:0px 10px 0px 0px;">已忽略</el-radio>
                        </el-form-item>
                        <el-form-item label="备注" class="waring-form-item">
                            <template v-slot:label>
                                <span style="color: #fff;">备注：</span>
                            </template>
                            <el-input type="textarea"  style="width: 300px" class="smart-box smart-box-input" v-model="changeStateDailog.remark"  resize></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="changeStateDailog.Isshow = false">确定</el-button>
                <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="changeStateDailog.Isshow = false">取消</el-button>
            </template>
        </smart-box-dialog>
    </div>
</template>
<script>
import { default as Sys } from './index'
export default Sys
</script>
<style lang="scss" scoped>

.sys-meter {
    width: 100%;
    height: 100%;
    background-image:url(../../assets/Images/line-box.png);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;

    .sys-meter-font-score {
        font-size: 24px;
        color : #fff;
        width: 100%;
        text-align: center;
        margin: 10px 0px;
    }

    .sys-meter-font-desc {
        font-size: 14px;
        color : #fff;
        width: 100%;
        text-align: center;
    }

    .sys-meter-font-text {
        width: 160px;
        height: 40px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        border:1px solid #10205b;
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


