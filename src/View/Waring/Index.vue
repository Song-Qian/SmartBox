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
                                        <el-select v-model="search.deviceType" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 150px;" clearable>
                                            <el-option value="WTOE-VN" label="WTOE-VN" />
                                            <el-option value="WTOE-VE" label="WTOE-VE" />
                                            <el-option value="摄像头" label="摄像头" />
                                            <el-option value="闪光灯" label="闪光灯" />
                                            <el-option value="补光灯" label="补光灯" />
                                            <el-option value="终端服务器" label="终端服务器" />
                                        </el-select>
                                    </el-form-item>
                                
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">异常时间：</span>
                                        </template>
                                        <el-date-picker style="width:240px;"  type="daterange" class="smart-box smart-box-daterange" popper-class="smart-box smart-box-popover" v-model="search.errorTime" range-separator="-" :editable="false" unlink-panels clearable/>
                                    </el-form-item>
                                
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">异常项目：</span>
                                        </template>
                                        <el-select v-model="search.errorProject" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 150px;" clearable>
                                            <el-option value="市电停电" label="市电停电" />
                                            <el-option value="空开跳闸" label="空开跳闸" />
                                            <el-option value="摄像机故障" label="摄像机故障" />
                                            <el-option value="光传输设备故障" label="光传输设备故障" />
                                            <el-option value="光纤故障" label="光纤故障" />
                                            <el-option value="网线故障" label="网线故障" />
                                        </el-select>
                                    </el-form-item>
                                
                                
                                    <el-form-item label-width="0px" style="float:right;">
                                        <el-button type="primary" icon="el-icon-s-data" style="width: 90px;"  size="small" @click="$router.push({ name : 'waringView'})">视图</el-button>
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
                                        <el-select v-model="search.resolveStatus"  style="width: 150px;" popper-class="smart-box smart-box-popover" class="smart-box smart-box-select" clearable>
                                            <el-option value="未处理" label="未处理" />
                                            <el-option value="已派工" label="已派工" />
                                            <el-option value="已完成" label="已完成" />
                                            <el-option value="已忽略" label="已忽略" />
                                        </el-select>
                                    </el-form-item>
                                
                                
                                    <el-form-item>
                                        <template v-slot:label>
                                            <span style="color:#fff;">处理时间：</span>
                                        </template>
                                        <el-date-picker style="width:240px;"  type="daterange"  class="smart-box smart-box-daterange" popper-class="smart-box smart-box-popover" v-model="search.resolveTime" range-separator="-" :editable="false" unlink-panels clearable/>
                                    </el-form-item>
                                
                                    <el-form-item  label-width="0px" style="text-align:right;">
                                        <el-button-group style="float: right; white-space: nowrap">
                                            <el-button type="primary" icon="el-icon-search"  style="width: 90px;"  size="small" @click="searchDate">查询</el-button>
                                            <el-button type="primary" icon="el-icon-refresh"  style="width: 90px;"  size="small" @click="clearSearch">重置</el-button>
                                        </el-button-group>
                                    </el-form-item>
                                
                                    <el-form-item  label-width="0px" style="float:right;margin-right:20px;">
                                        <a style="color:#00fafe; text-decoration: none; cursor:pointer;"><i class="el-icon-download" />导出</a>
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
                    <div class="smart-box-window-body" style="padding: 50px 100px; box-sizing: border-box;">
                        <el-table :data="getDataTable" class="smart-box smart-box-table" height="100%" size="small" stripe>
                            <el-table-column label="设备名称" align="center" header-align="center" prop="name" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <i v-if="scope.row.state === '未处理'" style="color: #FDB643;" class="fa fa-circle fa-lg"></i>
                                    <i v-if="scope.row.state === '已派工'" style="color: #05A2F4;" class="fa fa-circle fa-lg"></i>
                                    <i v-if="scope.row.state === '已完成'" style="color: #61FD44;" class="fa fa-circle fa-lg"></i>
                                    <i v-if="scope.row.state === '已忽略'" style="color: #969696;" class="fa fa-circle fa-lg"></i>
                                    {{scope.row.name}}
                                </template>
                            </el-table-column>
                            <el-table-column label="设备类型" align="center" header-align="center" prop="devieTypeTable" show-overflow-tooltip></el-table-column>
                            <el-table-column label="异常项目" align="center" header-align="center" prop="type" show-overflow-tooltip></el-table-column>
                            <el-table-column label="异常时间" align="center" header-align="center" prop="time" show-overflow-tooltip></el-table-column>
                            <el-table-column label="处理人" align="center" header-align="center" prop="dealMan" show-overflow-tooltip></el-table-column>
                            <el-table-column label="处理状态" align="center" header-align="center" prop="state" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.state === '未处理'" style="color: #FDB643">{{scope.row.state}}</span>
                                    <span v-if="scope.row.state === '已派工'" style="color: #05A2F4">{{scope.row.state}}</span>
                                    <span v-if="scope.row.state === '已完成'" style="color: #61FD44">{{scope.row.state}}</span>
                                    <span v-if="scope.row.state === '已忽略'" style="color: #969696">{{scope.row.state}}</span>
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
                            :total="getTotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <smart-box-dialog :show.sync="changeStateDailog.Isshow" width="600px" height="330px" title="告警处理" @closed="closeDialog">
            <el-row type="flex" justify="center" align="center">
                <el-col :span="20">
                    <el-form :model="form" label-width="80px" size="small" style="padding:20px 0px;">
                        <el-form-item label="处理时间">
                            <template v-slot:label>
                                <span style="color: #fff;">处理人：</span>
                            </template>
                                <el-select v-model="changeStateDailog.processor" size="small"
                                            class="smart-box smart-box-select" popper-class="smart-box smart-box-popover"
                                         style="width: 377px"  resize>
                                    <el-option value="王部长" label="王部长"/>
                                    <el-option value="张工" label="张工"/>
                                    <el-option value="李工" label="李工"/>
                                    <el-option value="admin" label="admin"/>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="处理状态">
                            <template v-slot:label>
                                 <span style="color: #fff;">处理状态</span>
                            </template>
                            <el-radio v-model="changeStateDailog.radio" label="未处理" style="color: #05A2F4;">未处理</el-radio>
                            <el-radio v-model="changeStateDailog.radio" label="已派工" style="color: #05A2F4;">已派工</el-radio>
                            <el-radio v-model="changeStateDailog.radio" label="已完成" style="color: #05A2F4;">已完成</el-radio>
                            <el-radio v-model="changeStateDailog.radio" label="已忽略" style="color: #05A2F4;">已忽略</el-radio>
                        </el-form-item>
                        <el-form-item label="备注" class="waring-form-item">
                            <template v-slot:label> 
                                <span style="color: #fff;">备注</span>
                            </template>
                            <el-input type="textarea" class="smart-box smart-box-input" v-model="changeStateDailog.remark"  resize></el-input>
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
import { default as Waring } from './index'
export default Waring
</script>