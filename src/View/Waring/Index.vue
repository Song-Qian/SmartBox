<template>
    <div class="smart-box smart-box-flex-row vertical" style="min-width: 1366px;">
        <div class="smart-box-flex-column-6">
            <div class="smart-box smart-box-mechanical" style="height:100%;">
                <div class="smart-box-mechanical-inner">
                    <div class="smart-box-mechanical-body" style="display:table;overflow:hidden">
                        <el-form label-position="right" label-width="90px" size="small" style="display:table-cell; vertical-align:middle;padding:10px 20px;width:100%;" inline>
                            
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">设备名称：</span>
                                        </template>
                                        <el-input class="smart-box smart-box-input" v-model="search.deviceName" style="width:150px;"  clearable/>
                                    </el-form-item>
                                
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">设备类型：</span>
                                        </template>
                                        <el-select v-model="search.deviceType" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 150px;" clearable @input="() => { pagination.page = 1,getAlarmInfoGridDate() }">
                                            <!-- <el-option value="补光灯" label="补光灯" />
                                            <el-option value="闪光灯" label="闪光灯" />
                                            <el-option value="摄像机" label="摄像机" />
                                            <el-option value="终端服务器" label="终端服务器" />
                                            <el-option value="智能机箱" label="智能机箱" />
                                            <el-option value="光传输设备" label="光传输设备" /> -->
                                            <el-option
                                                v-for="(item, key) in devicedTypeList"
                                                :key="key"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">告警时间：</span>
                                        </template>
                                        <el-date-picker style="width:240px;" value-format="yyyy-MM-dd HH:mm:ss"  type="daterange" class="smart-box smart-box-daterange" popper-class="smart-box smart-box-popover" v-model="search.errorTime" range-separator="-" :editable="false" unlink-panels clearable />
                                    </el-form-item>
                                
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">告警类型：</span>
                                        </template>
                                        <el-select v-model="search.errorProject" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 150px;" clearable @input="() => { pagination.page = 1,getAlarmInfoGridDate() }">
                                            <el-option v-for="(item,index) in alaramItemList" :key="index" :value="item.value" :label="item.label"/>
                                            <!-- <el-option value="空开跳闸" label="空开跳闸" />
                                            <el-option value="摄像机故障" label="摄像机故障" />
                                            <el-option value="光传输设备故障" label="光传输设备故障" />
                                            <el-option value="光纤故障" label="光纤故障" />
                                            <el-option value="网线故障" label="网线故障" /> -->
                                        </el-select>
                                    </el-form-item>
                                
                                
                                    <el-form-item label-width="0px" style="float:right;">
                                        <el-button-group style="float: right; white-space: nowrap">
                                            <el-button disabled  type="info" icon="el-icon-s-grid"  size="small" @click="$router.push({ name : 'message'})">列表</el-button>  
                                            <el-button type="primary" icon="el-icon-s-data"   size="small" @click="$router.push({ name : 'waringView'})">视图</el-button>
                                        </el-button-group>
                                        
                                    </el-form-item>
                                
                            
                            
                                <br/>
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">处理人：</span>
                                        </template>
                                        <el-input style="width:150px;"  class="smart-box smart-box-input" v-model="search.username" clearable/>
                                    </el-form-item>
                                

                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">处理状态：</span>
                                        </template>
                                        <el-select v-model="search.resolveStatus"  style="width: 150px;" popper-class="smart-box smart-box-popover" class="smart-box smart-box-select" clearable @input="() => { pagination.page = 1,getAlarmInfoGridDate() }">
                                            <el-option value="1" label="未处理" />
                                            <el-option value="2" label="已派单" />
                                            <el-option value="3" label="已忽略" />
                                            <el-option value="4" label="已完成" />
                                        </el-select>
                                    </el-form-item>
                                
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">处理时间：</span>
                                        </template>
                                        <el-date-picker style="width:240px;" value-format="yyyy-MM-dd HH:mm:ss"  type="daterange"  class="smart-box smart-box-daterange" popper-class="smart-box smart-box-popover" v-model="search.resolveTime" range-separator="-" :editable="false" unlink-panels clearable/>
                                    </el-form-item>
                                
                                    <el-form-item  label-width="0px" style="text-align:right;">
                                        <el-button-group style="float: right; white-space: nowrap;padding-left: 2px">
                                        <el-button type="warning" icon="el-icon-edit"    size="small" @click="batchChangeState">一键批处理</el-button>
                                        </el-button-group>
                                        <el-button-group style="float: right; white-space: nowrap">
                                            <el-button type="primary" icon="el-icon-search"    size="small" @click="searchDate">查询</el-button>
                                            <el-button type="primary" icon="el-icon-refresh"    size="small" @click="clearSearch">重置</el-button>
                                        </el-button-group>

                                    </el-form-item>
                                
                                    <el-form-item  label-width="0px" style="float:right;margin-right:65px;">
                                        <a style="color:#00fafe; text-decoration: none; cursor:pointer;" @click="exportAlarmInfo"><i class="el-icon-download"/>导出</a>
                                    </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
        <div class="smart-box-flex-column-18">
            <div class="smart-box smart-box-window" style="background:none; width: 100%; height: 100%;">
                <div class="smart-box-window-inner">
                    <div class="smart-box-window-title" style="background-size: 353px 20px;">
                        告警信息
                    </div>
                    <div class="smart-box-window-body" style="padding: 40px 30px; box-sizing: border-box;">
                        <el-table :data="tableList" class="smart-box smart-box-table" :cell-style="cellStyle" height="calc(100%)" size="small" stripe>
                            
                            <el-table-column label="设备名称" align="center" header-align="center" prop="devName" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <i v-if="scope.row.isDeal === 1" style="color: #FDB643;" class="fa fa-circle fa-lg"></i>
                                    <i v-if="scope.row.isDeal === 2" style="color: #05A2F4;" class="fa fa-circle fa-lg"></i>
                                    <i v-if="scope.row.isDeal === 3" style="color: #969696;" class="fa fa-circle fa-lg"></i>
                                    <i v-if="scope.row.isDeal === 4" style="color: #61FD44;" class="fa fa-circle fa-lg"></i>
                                    <a href="#" style="text-decoration:none;color: #409EFF;" @click="clickDevName(scope.row.devId,scope.row.devTypeCode)">{{scope.row.devName ? scope.row.devName : scope.row.devIp}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="设备类型" align="center" header-align="center" prop="devTypeName" show-overflow-tooltip></el-table-column>
                            <el-table-column label="告警类型" align="center" width="300px"  header-align="center" prop="alarmName" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span>{{scope.row.alarmDesc}} {{scope.row.alarmName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="告警时间" align="center" header-align="center" prop="alarmTime" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{DateTimeFormate(scope.row.alarmTime)}}
                                </template>
                            </el-table-column>
                            <el-table-column label="处理人" align="center" header-align="center" prop="userName" show-overflow-tooltip></el-table-column>
                            <el-table-column label="处理状态" align="center" header-align="center" prop="isDeal" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isDeal === 1" style="color: #FDB643">未处理</span>
                                    <span v-if="scope.row.isDeal === 2" style="color: #05A2F4">已派单</span>
                                    <span v-if="scope.row.isDeal === 3" style="color: #969696">已忽略</span>
                                    <span v-if="scope.row.isDeal === 4" style="color: #61FD44">已完成</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="恢复状态" align="center" header-align="center" prop="status" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status === 1" style="color: #FDB643">已恢复</span>
                                    <span v-if="scope.row.status === 0" style="color: #05A2F4">未恢复</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="处理时间" align="center" header-align="center" prop="dealTime" show-overflow-tooltip ></el-table-column>
                            <el-table-column label="操作" align="center" header-align="center"  show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!-- <el-button  class="smart-box smart-box-button" style="width: 50px;"  size="mini"  @click="changeState(scope.row)">操作</el-button> -->
                                    <i class="el-icon-setting" style="font-size: 16px;cursor:pointer;" @click="changeState(scope.row)"></i>
                                    <i class="el-icon-document" style="font-size: 16px;cursor:pointer;" @click="handleQueryDetail(scope.row)"></i>
                                    <!-- <el-button  class="smart-box smart-box-button" style="width: 50px;"  size="mini"  @click="$router.push({ name : 'messageDetail' ,params : { detail : scope.row}})">查看</el-button> -->
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination 
                            @size-change="handleSizeChange"  
                            @current-change="handleCurrentChange" 
                            :page-sizes="[10, 15, 50, 100]" 
                            class="smart-box smart-box-pagination"
                            :current-page.sync="pagination.page" 
                            :page-size="pagination.pageSize" 
                            layout="sizes, prev, pager, next, jumper, total" 
                            :total="pagination.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <smart-box-dialog :show.sync="changeStateDailog.Isshow" width="600px" height="380px" title="告警信息处理" @closed="closeDialog">
            <el-row type="flex" justify="center" align="center">
                <el-col :span="20">
                    <el-form  label-width="120px" size="small" :model="changeStateDailog.ruleForm" :rules="rules" ref="ruleForm" style="padding: 25px 0px;" >
                        <el-form-item label="处理人：" prop="dealMan">
                            <template v-slot:label>
                                <span style="color: #fff;">处理人：</span>
                            </template>
                            <el-select v-model="changeStateDailog.ruleForm.dealMan"  size="small" placeholder="请选择"
                                        class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"
                                        style="width: 300px"  resize clearable>
                                <el-option v-for="(item, key) in changeStateDailog.processor" :key="key" :label="item.label"  :value="item.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="处理状态" prop="radio">
                            <template v-slot:label>
                                <span style="color: #fff;">处理状态：</span>
                            </template>
                            <el-radio-group v-model="changeStateDailog.ruleForm.radio">
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
                            <el-input type="textarea" placeholder="(可填)"  style="width: 300px" class="smart-box smart-box-input" v-model="changeStateDailog.ruleForm.remark"  resize></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="insertDealInfo">确定</el-button>
                <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="closechangeStateDailog">取消</el-button>
            </template>
        </smart-box-dialog>

        <smart-box-dialog :show.sync="batchChangeStateDailog.Isshow" width="600px" height="320px" title="告警信息一键处理" @closed="closeDialog">
            <el-row type="flex" justify="center" align="center">
                <el-col :span="20">
                    <el-form  label-width="120px" size="small" :model="batchChangeStateDailog.ruleForm" :rules="rules" ref="ruleFormBatch" style="padding: 20px 0px;" >
                        <el-form-item label="处理条数：">
                            <template v-slot:label>
                                <span style="color: #fff;">处理条数：</span>
                            </template>
                            <span style="color: #fff">{{pagination.total}} 条</span>
                        </el-form-item>
                        <el-form-item label="处理人：" prop="dealMan">
                            <template v-slot:label>
                                <span style="color: #fff;">处理人：</span>
                            </template>
                            <el-select v-model="batchChangeStateDailog.ruleForm.dealMan"  size="small" placeholder="请选择"
                                       class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"
                                       style="width: 300px"  resize clearable>
                                <el-option v-for="(item, key) in batchChangeStateDailog.processor" :key="key" :label="item.label"  :value="item.value"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="处理状态" prop="radio">
                            <template v-slot:label>
                                <span style="color: #fff;">处理状态：</span>
                            </template>
                            <el-radio-group v-model="batchChangeStateDailog.ruleForm.radio">
                                <el-radio  :label='1' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">未处理</el-radio>
                                <el-radio  :label='2' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">已派单</el-radio>
                                <el-radio  :label='3' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">已忽略</el-radio>
                                <el-radio  :label='4' name="radio" style="color: #05A2F4;margin:0px 10px 0px 0px;">已完成</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="batchProcessing">确定</el-button>
                <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="batchClosechangeStateDailog">取消</el-button>
            </template>
        </smart-box-dialog>
    </div>

     
</template>

<script>
import { default as Waring } from './index'

export default Waring

</script>