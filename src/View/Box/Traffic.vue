<template>
    <div class="smart-box smart-box-flex-row">
        <div class="smart-box-flex-column-8" style="padding: 15px 10px;" :style="alarmTableShow ? 'display: none' : 'display: block'" >
            <div class="smart-box smart-box-window" style="height: 100%; padding:10px; box-sizing: border-box;">
                <div class="smart-box-window-inner">
                    <div class="smart-box-window-title" style="position:relative;">
                        告警项目
                        <span style="color: #00fafe; top: 0px; right:10px; position:absolute; font-size: 1em; cursor: pointer;" title="告警信息查询" @click="alarmShow = true, queryAlarmDataSource()">更多...</span>
                    </div>
                    <div class="smart-box-window-body" style="padding:10px 20px; box-sizing:border-box;">
                        <el-table :data="alarmInfo" :cell-style="alarmInfoDataTableCellStyle" class="smart-box smart-box-table" height="calc(100%)" size="small" stripe>
                            <el-table-column label="告警详情" align="center" width="180px" header-align="center">
                                <template slot-scope="scope">
                                    <!-- <el-tooltip placement="top" :content="{ 57 : true, 58 : true, 67 : true, 68 : true, 69 : true, 70 : true, 73 : true, 74 : true }[scope.row.alarmTypeId] ? `${scope.row.alarmDesc} ${scope.row.alarmName}` : scope.row.alarmName"> -->
                                        <span>{{scope.row.alarmDesc}} {{scope.row.alarmName}}</span>
                                    <!-- </el-tooltip> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="时间" align="center" header-align="center">
                                <template slot-scope="scope">
                                    <span href="#">{{formatTimer(scope.row.alarmTime)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="告警状态" align="center" width="80" header-align="center">
                                <template slot-scope="scope">
                                    <span href="#">{{ ['', '未处理', '已派单','已忽略', '已完成'][scope.row.isDeal] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <div class="smart-box-flex-column-16" :class="{ 'smart-box-flex-column-24' : alarmTableShow, 'smart-box-flex-column-16' : !alarmTableShow }" style="padding: 10px 0px;">
            <div class="smart-box smart-box-flex-row vertical">
                <div class="smart-box-flex-column-2" style="display: table; ">
                    <div style="display: table-cell; vertical-align:middle;">
                        <el-checkbox v-model="alarmTableShow" class="el-button el-button--primary traffic-alarm-trigger" size="small" :label="alarmTableShow ? '显示告警项目' : '隐藏告警项目'" @change="alarmTableShow = $event" border></el-checkbox>
                        <el-button type="primary" size="small"  @click="dialogShow = true, queryInfo(), querySignalLight()">信号机详情</el-button>
                    </div>
                    <div style="display: table-cell; vertical-align:middle; color: #fff; text-align: right;">
                        <el-button style="vertical-align:middle; background: #E60012;" type="danger" circle></el-button> 停
                        <el-button style="vertical-align:middle; background: #FFF100;" type="warning" circle></el-button> 慢
                        <el-button style="vertical-align:middle; background: #359F40;" type="success" circle></el-button> 行
                        <el-button style="background:#000; vertical-align:middle;" circle></el-button> 故障
                    </div>
                </div>
                <div class="smart-box-flex-column-22">
                    <smart-box-intersection :e="intersection.E" :w="intersection.W" :s="intersection.S" :n="intersection.N" :title="dialogData.deviceInfo && dialogData.deviceInfo.DEV_NAME + getIntrsection|| ''" style='position:relative; top: 50%; left: 50%; transform:translate(-50%, -50%);'></smart-box-intersection>
                </div>
            </div>
        </div>

        <div v-show="debug_board" style="max-height: 100%; overflow-y: auto; background: #fff; border: 1px solid #66b1ff; border-radius:5px; padding: 10px; position: absolute; top: 0px; left: 0px; width: 500px; z-index: 9999;">
            <fieldset style="border: 1px solid #F56C6C;">
                <legend style="color: #F56C6C;">北</legend>
                <el-form size="mini">
                    <el-form-item label="北向车道" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.N.lane === 0 ? 'primary' : ''" size="mini" @click="intersection.N.lane = 0, $set(intersection.N, 'roads', [])">0</el-button>
                            <el-button :type="intersection.N.lane === 1 ? 'primary' : ''" size="mini" @click="intersection.N.lane = 1, $set(intersection.N, 'roads', new Array(1).fill('').map(() => ['default', 0, 'straight', '']))">1</el-button>
                            <el-button :type="intersection.N.lane === 2 ? 'primary' : ''" size="mini" @click="intersection.N.lane = 2, $set(intersection.N, 'roads', new Array(2).fill('').map(() => ['default', 0, 'straight', '']))">2</el-button>
                            <el-button :type="intersection.N.lane === 3 ? 'primary' : ''" size="mini" @click="intersection.N.lane = 3, $set(intersection.N, 'roads', new Array(3).fill('').map(() => ['default', 0, 'straight', '']))">3</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行红灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.N.sidewalkStop === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkStop', 0)">灭</el-button>
                            <el-button :type="intersection.N.sidewalkStop === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkStop', 1)">亮</el-button>
                            <el-button :type="intersection.N.sidewalkStop === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkStop', 2)">默认</el-button>
                            <el-button :type="intersection.N.sidewalkStop === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkStop', 3)">故障</el-button>
                            <el-button :type="intersection.N.sidewalkStop === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkStop', 4)">无灯</el-button>
                            <el-button :type="intersection.N.sidewalkStop === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkStop', 5)">故障且红灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行绿灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.N.sidewalkRun === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkRun', 0)">灭</el-button>
                            <el-button :type="intersection.N.sidewalkRun === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkRun', 1)">亮</el-button>
                            <el-button :type="intersection.N.sidewalkRun === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkRun', 2)">默认</el-button>
                            <el-button :type="intersection.N.sidewalkRun === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkRun', 3)">故障</el-button>
                            <el-button :type="intersection.N.sidewalkRun === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkRun', 4)">无灯</el-button>
                            <el-button :type="intersection.N.sidewalkRun === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkRun', 5)">故障且绿灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行灯读秒" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.N.sidewalkText === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkText', 0)">显示读秒</el-button>
                            <el-button :type="intersection.N.sidewalkText === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkText', -1)">读秒故障</el-button>
                            <el-button :type="intersection.N.sidewalkText === -2 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkText', -2)">无读秒灯</el-button>
                        </el-button-group>
                         <el-input-number v-show="intersection.N.sidewalkText >= 0" size="mini" style="width:90px;" v-model.number="intersection.N.sidewalkText" :min="-2" :max="99"></el-input-number>
                    </el-form-item>
                    <el-form-item label="人行灯模式" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.N.sidewalkLightMode === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkLightMode', 0)">正常</el-button>
                            <el-button :type="intersection.N.sidewalkLightMode === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkLightMode', 1)">两侧</el-button>
                            <el-button :type="intersection.N.sidewalkLightMode === 99 ? 'primary' : ''" size="mini" @click="$set(intersection.N, 'sidewalkLightMode', 99)">无信号灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <fieldset style="border: 1px solid #409EFF;" v-for="(item, i) in intersection.N.roads" :key="i">
                        <legend style="color: #409EFF;">第{{ i + 1 }}车道</legend>
                        <el-form-item label="车道信号灯" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.N.roads[i][0] === 'default' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 0, 'default')">默认</el-button>
                                <el-button :type="intersection.N.roads[i][0] === 'run' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 0, 'run')">绿灯</el-button>
                                <el-button :type="intersection.N.roads[i][0] === 'wait' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 0, 'wait')">黄灯</el-button>
                                <el-button :type="intersection.N.roads[i][0] === 'stop' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 0, 'stop')">红灯</el-button>
                                <el-button :type="intersection.N.roads[i][0] === 'none' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 0, 'none')">无灯</el-button>
                                <el-button :type="intersection.N.roads[i][0] === 'wait-flash' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 0, 'wait-flash')">黄闪</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="信号灯读秒" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.N.roads[i][1] === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 1, 0)">显示读秒</el-button>
                                <el-button :type="intersection.N.roads[i][1] === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 1, -1)">读秒故障</el-button>
                                <el-button :type="intersection.N.roads[i][1] === -3 ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 1, -3)">无读秒灯</el-button>
                            </el-button-group>
                            <el-input-number v-show="intersection.N.roads[i][1] >= 0" size="mini" style="width:90px;" v-model.number="intersection.N.roads[i][1]" :min="-3" :max="99"></el-input-number>
                        </el-form-item>
                        <el-form-item label="行车转向" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.N.roads[i][2] === 'left' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 2,'left')">左转地标</el-button>
                                <el-button :type="intersection.N.roads[i][2] === 'straight' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 2,'straight')">直行地标</el-button>
                                <el-button :type="intersection.N.roads[i][2] === 'right' ? 'primary' : ''" size="mini" @click="$set(intersection.N.roads[i], 2,'right')">右转地标</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="灯故障" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.N.roads[i][3].indexOf('run') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.N.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.N.roads[i], 3, b.includes('run') ? b.splice(b.indexOf('run'), 1) && b.join('-') : b.concat('run').join('-')) }">绿灯故障</el-button>
                                <el-button :type="intersection.N.roads[i][3].indexOf('wait') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.N.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.N.roads[i], 3, b.includes('wait') ? b.splice(b.indexOf('wait'), 1) && b.join('-') : b.concat('wait').join('-')) }">黄灯故障</el-button>
                                <el-button :type="intersection.N.roads[i][3].indexOf('stop') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.N.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.N.roads[i], 3, b.includes('stop') ? b.splice(b.indexOf('stop'), 1) && b.join('-') : b.concat('stop').join('-')) }">红灯故障</el-button>
                            </el-button-group>
                        </el-form-item>
                    </fieldset>
                </el-form>
            </fieldset>
            <fieldset style="border: 1px solid #F56C6C;">
                <legend style="color: #F56C6C;">南</legend>
                <el-form size="mini">
                    <el-form-item label="南向车道" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.S.lane === 0 ? 'primary' : ''" size="mini" @click="intersection.S.lane = 0, $set(intersection.S, 'roads', [])">0</el-button>
                            <el-button :type="intersection.S.lane === 1 ? 'primary' : ''" size="mini" @click="intersection.S.lane = 1, $set(intersection.S, 'roads', new Array(1).fill('').map(() => ['default', 0, 'straight', '']))">1</el-button>
                            <el-button :type="intersection.S.lane === 2 ? 'primary' : ''" size="mini" @click="intersection.S.lane = 2, $set(intersection.S, 'roads', new Array(2).fill('').map(() => ['default', 0, 'straight', '']))">2</el-button>
                            <el-button :type="intersection.S.lane === 3 ? 'primary' : ''" size="mini" @click="intersection.S.lane = 3, $set(intersection.S, 'roads', new Array(3).fill('').map(() => ['default', 0, 'straight', '']))">3</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行红灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.S.sidewalkStop === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkStop', 0)">灭</el-button>
                            <el-button :type="intersection.S.sidewalkStop === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkStop', 1)">亮</el-button>
                            <el-button :type="intersection.S.sidewalkStop === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkStop', 2)">默认</el-button>
                            <el-button :type="intersection.S.sidewalkStop === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkStop', 3)">故障</el-button>
                            <el-button :type="intersection.S.sidewalkStop === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkStop', 4)">无灯</el-button>
                            <el-button :type="intersection.S.sidewalkStop === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkStop', 5)">故障且红灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行绿灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.S.sidewalkRun === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkRun', 0)">灭</el-button>
                            <el-button :type="intersection.S.sidewalkRun === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkRun', 1)">亮</el-button>
                            <el-button :type="intersection.S.sidewalkRun === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkRun', 2)">默认</el-button>
                            <el-button :type="intersection.S.sidewalkRun === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkRun', 3)">故障</el-button>
                            <el-button :type="intersection.S.sidewalkRun === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkRun', 4)">无灯</el-button>
                            <el-button :type="intersection.S.sidewalkRun === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkRun', 5)">故障且绿灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行灯读秒" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.S.sidewalkText === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkText', 0)">显示读秒</el-button>
                            <el-button :type="intersection.S.sidewalkText === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkText', -1)">读秒故障</el-button>
                            <el-button :type="intersection.S.sidewalkText === -2 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkText', -2)">无读秒灯</el-button>
                        </el-button-group>
                         <el-input-number v-show="intersection.S.sidewalkText >= 0" size="mini" style="width:90px;" v-model.number="intersection.S.sidewalkText" :min="-2" :max="99"></el-input-number>
                    </el-form-item>
                    <el-form-item label="人行灯模式" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.S.sidewalkLightMode === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkLightMode', 0)">正常</el-button>
                            <el-button :type="intersection.S.sidewalkLightMode === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkLightMode', 1)">两侧</el-button>
                            <el-button :type="intersection.S.sidewalkLightMode === 99 ? 'primary' : ''" size="mini" @click="$set(intersection.S, 'sidewalkLightMode', 99)">无信号灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <fieldset style="border: 1px solid #409EFF;" v-for="(item, i) in intersection.S.roads" :key="i">
                        <legend style="color: #409EFF;">第{{ i + 1 }}车道</legend>
                        <el-form-item label="车道信号灯" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.S.roads[i][0] === 'default' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 0, 'default')">默认</el-button>
                                <el-button :type="intersection.S.roads[i][0] === 'run' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 0, 'run')">绿灯</el-button>
                                <el-button :type="intersection.S.roads[i][0] === 'wait' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 0, 'wait')">黄灯</el-button>
                                <el-button :type="intersection.S.roads[i][0] === 'stop' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 0, 'stop')">红灯</el-button>
                                <el-button :type="intersection.S.roads[i][0] === 'none' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 0, 'none')">无灯</el-button>
                                <el-button :type="intersection.S.roads[i][0] === 'wait-flash' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 0, 'wait-flash')">黄闪</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="信号灯读秒" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.S.roads[i][1] === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 1, 0)">显示读秒</el-button>
                                <el-button :type="intersection.S.roads[i][1] === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 1, -1)">读秒故障</el-button>
                                <el-button :type="intersection.S.roads[i][1] === -3 ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 1, -3)">无读秒灯</el-button>
                            </el-button-group>
                            <el-input-number v-show="intersection.S.roads[i][1] >= 0" size="mini" style="width:90px;" v-model.number="intersection.S.roads[i][1]" :min="-3" :max="99"></el-input-number>
                        </el-form-item>
                        <el-form-item label="行车转向" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.S.roads[i][2] === 'left' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 2,'left')">左转地标</el-button>
                                <el-button :type="intersection.S.roads[i][2] === 'straight' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 2,'straight')">直行地标</el-button>
                                <el-button :type="intersection.S.roads[i][2] === 'right' ? 'primary' : ''" size="mini" @click="$set(intersection.S.roads[i], 2,'right')">右转地标</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="灯故障" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.S.roads[i][3].indexOf('run') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.S.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.S.roads[i], 3, b.includes('run') ? b.splice(b.indexOf('run'), 1) && b.join('-') : b.concat('run').join('-')) }">绿灯故障</el-button>
                                <el-button :type="intersection.S.roads[i][3].indexOf('wait') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.S.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.S.roads[i], 3, b.includes('wait') ? b.splice(b.indexOf('wait'), 1) && b.join('-') : b.concat('wait').join('-')) }">黄灯故障</el-button>
                                <el-button :type="intersection.S.roads[i][3].indexOf('stop') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.S.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.S.roads[i], 3, b.includes('stop') ? b.splice(b.indexOf('stop'), 1) && b.join('-') : b.concat('stop').join('-')) }">红灯故障</el-button>
                            </el-button-group>
                        </el-form-item>
                    </fieldset>
                </el-form>
            </fieldset>
            <fieldset style="border: 1px solid #F56C6C;">
                <legend style="color: #F56C6C;">东</legend>
                <el-form size="mini">
                    <el-form-item label="东向车道" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.E.lane === 0 ? 'primary' : ''" size="mini" @click="intersection.E.lane = 0, $set(intersection.E, 'roads', [])">0</el-button>
                            <el-button :type="intersection.E.lane === 1 ? 'primary' : ''" size="mini" @click="intersection.E.lane = 1, $set(intersection.E, 'roads', new Array(1).fill('').map(() => ['default', 0, 'straight', '']))">1</el-button>
                            <el-button :type="intersection.E.lane === 2 ? 'primary' : ''" size="mini" @click="intersection.E.lane = 2, $set(intersection.E, 'roads', new Array(2).fill('').map(() => ['default', 0, 'straight', '']))">2</el-button>
                            <el-button :type="intersection.E.lane === 3 ? 'primary' : ''" size="mini" @click="intersection.E.lane = 3, $set(intersection.E, 'roads', new Array(3).fill('').map(() => ['default', 0, 'straight', '']))">3</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行红灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.E.sidewalkStop === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkStop', 0)">灭</el-button>
                            <el-button :type="intersection.E.sidewalkStop === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkStop', 1)">亮</el-button>
                            <el-button :type="intersection.E.sidewalkStop === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkStop', 2)">默认</el-button>
                            <el-button :type="intersection.E.sidewalkStop === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkStop', 3)">故障</el-button>
                            <el-button :type="intersection.E.sidewalkStop === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkStop', 4)">无灯</el-button>
                            <el-button :type="intersection.E.sidewalkStop === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkStop', 5)">故障且红灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行绿灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.E.sidewalkRun === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkRun', 0)">灭</el-button>
                            <el-button :type="intersection.E.sidewalkRun === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkRun', 1)">亮</el-button>
                            <el-button :type="intersection.E.sidewalkRun === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkRun', 2)">默认</el-button>
                            <el-button :type="intersection.E.sidewalkRun === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkRun', 3)">故障</el-button>
                            <el-button :type="intersection.E.sidewalkRun === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkRun', 4)">无灯</el-button>
                            <el-button :type="intersection.E.sidewalkRun === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkRun', 5)">故障且绿灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行灯读秒" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.E.sidewalkText === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkText', 0)">显示读秒</el-button>
                            <el-button :type="intersection.E.sidewalkText === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkText', -1)">读秒故障</el-button>
                            <el-button :type="intersection.E.sidewalkText === -2 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkText', -2)">无读秒灯</el-button>
                        </el-button-group>
                         <el-input-number v-show="intersection.E.sidewalkText >= 0" size="mini" style="width:90px;" v-model.number="intersection.E.sidewalkText" :min="-2" :max="99"></el-input-number>
                    </el-form-item>
                    <el-form-item label="人行灯模式" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.E.sidewalkLightMode === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkLightMode', 0)">正常</el-button>
                            <el-button :type="intersection.E.sidewalkLightMode === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkLightMode', 1)">两侧</el-button>
                            <el-button :type="intersection.E.sidewalkLightMode === 99 ? 'primary' : ''" size="mini" @click="$set(intersection.E, 'sidewalkLightMode', 99)">无信号灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <fieldset style="border: 1px solid #409EFF;" v-for="(item, i) in intersection.E.roads" :key="i">
                        <legend style="color: #409EFF;">第{{ i + 1 }}车道</legend>
                        <el-form-item label="车道信号灯" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.E.roads[i][0] === 'default' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 0, 'default')">默认</el-button>
                                <el-button :type="intersection.E.roads[i][0] === 'run' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 0, 'run')">绿灯</el-button>
                                <el-button :type="intersection.E.roads[i][0] === 'wait' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 0, 'wait')">黄灯</el-button>
                                <el-button :type="intersection.E.roads[i][0] === 'stop' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 0, 'stop')">红灯</el-button>
                                <el-button :type="intersection.E.roads[i][0] === 'none' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 0, 'none')">无灯</el-button>
                                <el-button :type="intersection.E.roads[i][0] === 'wait-flash' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 0, 'wait-flash')">黄闪</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="信号灯读秒" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.E.roads[i][1] === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 1, 0)">显示读秒</el-button>
                                <el-button :type="intersection.E.roads[i][1] === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 1, -1)">读秒故障</el-button>
                                <el-button :type="intersection.E.roads[i][1] === -3 ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 1, -3)">无读秒灯</el-button>
                            </el-button-group>
                            <el-input-number v-show="intersection.E.roads[i][1] >= 0" size="mini" style="width:90px;" v-model.number="intersection.E.roads[i][1]" :min="-3" :max="99"></el-input-number>
                        </el-form-item>
                        <el-form-item label="行车转向" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.E.roads[i][2] === 'left' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 2,'left')">左转地标</el-button>
                                <el-button :type="intersection.E.roads[i][2] === 'straight' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 2,'straight')">直行地标</el-button>
                                <el-button :type="intersection.E.roads[i][2] === 'right' ? 'primary' : ''" size="mini" @click="$set(intersection.E.roads[i], 2,'right')">右转地标</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="灯故障" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.E.roads[i][3].indexOf('run') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.E.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.E.roads[i], 3, b.includes('run') ? b.splice(b.indexOf('run'), 1) && b.join('-') : b.concat('run').join('-')) }">绿灯故障</el-button>
                                <el-button :type="intersection.E.roads[i][3].indexOf('wait') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.E.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.E.roads[i], 3, b.includes('wait') ? b.splice(b.indexOf('wait'), 1) && b.join('-') : b.concat('wait').join('-')) }">黄灯故障</el-button>
                                <el-button :type="intersection.E.roads[i][3].indexOf('stop') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.E.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.E.roads[i], 3, b.includes('stop') ? b.splice(b.indexOf('stop'), 1) && b.join('-') : b.concat('stop').join('-')) }">红灯故障</el-button>
                            </el-button-group>
                        </el-form-item>
                    </fieldset>
                </el-form>
            </fieldset>
            <fieldset style="border: 1px solid #F56C6C;">
                <legend style="color: #F56C6C;">西</legend>
                <el-form size="mini">
                    <el-form-item label="西向车道" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.W.lane === 0 ? 'primary' : ''" size="mini" @click="intersection.W.lane = 0, $set(intersection.W, 'roads', [])">0</el-button>
                            <el-button :type="intersection.W.lane === 1 ? 'primary' : ''" size="mini" @click="intersection.W.lane = 1, $set(intersection.W, 'roads', new Array(1).fill('').map(() => ['default', 0, 'straight', '']))">1</el-button>
                            <el-button :type="intersection.W.lane === 2 ? 'primary' : ''" size="mini" @click="intersection.W.lane = 2, $set(intersection.W, 'roads', new Array(2).fill('').map(() => ['default', 0, 'straight', '']))">2</el-button>
                            <el-button :type="intersection.W.lane === 3 ? 'primary' : ''" size="mini" @click="intersection.W.lane = 3, $set(intersection.W, 'roads', new Array(3).fill('').map(() => ['default', 0, 'straight', '']))">3</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行红灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.W.sidewalkStop === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkStop', 0)">灭</el-button>
                            <el-button :type="intersection.W.sidewalkStop === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkStop', 1)">亮</el-button>
                            <el-button :type="intersection.W.sidewalkStop === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkStop', 2)">默认</el-button>
                            <el-button :type="intersection.W.sidewalkStop === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkStop', 3)">故障</el-button>
                            <el-button :type="intersection.W.sidewalkStop === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkStop', 4)">无灯</el-button>
                            <el-button :type="intersection.W.sidewalkStop === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkStop', 5)">故障且红灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行绿灯" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.W.sidewalkRun === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkRun', 0)">灭</el-button>
                            <el-button :type="intersection.W.sidewalkRun === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkRun', 1)">亮</el-button>
                            <el-button :type="intersection.W.sidewalkRun === 2 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkRun', 2)">默认</el-button>
                            <el-button :type="intersection.W.sidewalkRun === 3 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkRun', 3)">故障</el-button>
                            <el-button :type="intersection.W.sidewalkRun === 4 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkRun', 4)">无灯</el-button>
                            <el-button :type="intersection.W.sidewalkRun === 5 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkRun', 5)">故障且绿灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <el-form-item label="人行灯读秒" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.W.sidewalkText === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkText', 0)">显示读秒</el-button>
                            <el-button :type="intersection.W.sidewalkText === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkText', -1)">读秒故障</el-button>
                            <el-button :type="intersection.W.sidewalkText === -2 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkText', -2)">无读秒灯</el-button>
                        </el-button-group>
                         <el-input-number v-show="intersection.W.sidewalkText >= 0" size="mini" style="width:90px;" v-model.number="intersection.W.sidewalkText" :min="-2" :max="99"></el-input-number>
                    </el-form-item>
                    <el-form-item label="人行灯模式" style="margin-bottom: 3px;">
                        <el-button-group>
                            <el-button :type="intersection.W.sidewalkLightMode === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkLightMode', 0)">正常</el-button>
                            <el-button :type="intersection.W.sidewalkLightMode === 1 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkLightMode', 1)">两侧</el-button>
                            <el-button :type="intersection.W.sidewalkLightMode === 99 ? 'primary' : ''" size="mini" @click="$set(intersection.W, 'sidewalkLightMode', 99)">无信号灯</el-button>
                        </el-button-group>
                    </el-form-item>
                    <fieldset style="border: 1px solid #409EFF;" v-for="(item, i) in intersection.W.roads" :key="i">
                        <legend style="color: #409EFF;">第{{ i + 1 }}车道</legend>
                        <el-form-item label="车道信号灯" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.W.roads[i][0] === 'default' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 0, 'default')">默认</el-button>
                                <el-button :type="intersection.W.roads[i][0] === 'run' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 0, 'run')">绿灯</el-button>
                                <el-button :type="intersection.W.roads[i][0] === 'wait' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 0, 'wait')">黄灯</el-button>
                                <el-button :type="intersection.W.roads[i][0] === 'stop' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 0, 'stop')">红灯</el-button>
                                <el-button :type="intersection.W.roads[i][0] === 'none' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 0, 'none')">无灯</el-button>
                                <el-button :type="intersection.W.roads[i][0] === 'wait-flash' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 0, 'wait-flash')">黄闪</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="信号灯读秒" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.W.roads[i][1] === 0 ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 1, 0)">显示读秒</el-button>
                                <el-button :type="intersection.W.roads[i][1] === -1 ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 1, -1)">读秒故障</el-button>
                                <el-button :type="intersection.W.roads[i][1] === -3 ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 1, -3)">无读秒灯</el-button>
                            </el-button-group>
                            <el-input-number v-show="intersection.W.roads[i][1] >= 0" size="mini" style="width:90px;" v-model.number="intersection.W.roads[i][1]" :min="-3" :max="99"></el-input-number>
                        </el-form-item>
                        <el-form-item label="行车转向" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.W.roads[i][2] === 'left' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 2,'left')">左转地标</el-button>
                                <el-button :type="intersection.W.roads[i][2] === 'straight' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 2,'straight')">直行地标</el-button>
                                <el-button :type="intersection.W.roads[i][2] === 'right' ? 'primary' : ''" size="mini" @click="$set(intersection.W.roads[i], 2,'right')">右转地标</el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="灯故障" style="margin-bottom: 3px;">
                            <el-button-group>
                                <el-button :type="intersection.W.roads[i][3].indexOf('run') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.W.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.W.roads[i], 3, b.includes('run') ? b.splice(b.indexOf('run'), 1) && b.join('-') : b.concat('run').join('-')) }">绿灯故障</el-button>
                                <el-button :type="intersection.W.roads[i][3].indexOf('wait') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.W.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.W.roads[i], 3, b.includes('wait') ? b.splice(b.indexOf('wait'), 1) && b.join('-') : b.concat('wait').join('-')) }">黄灯故障</el-button>
                                <el-button :type="intersection.W.roads[i][3].indexOf('stop') > -1 ? 'primary' : ''" size="mini" @click="() => { a = intersection.W.roads[i][3]; b = a.split(/\-/g) || []; $set(intersection.W.roads[i], 3, b.includes('stop') ? b.splice(b.indexOf('stop'), 1) && b.join('-') : b.concat('stop').join('-')) }">红灯故障</el-button>
                            </el-button-group>
                        </el-form-item>
                    </fieldset>
                </el-form>
            </fieldset>
        </div>
        
        <smart-box-dialog :show.sync="dialogShow" :footer-show="false"  width="1366px" height="600px" title="设备详情" is-click-mask-close>
            <template  v-slot:header="scoped">
                <span style="font-size: 24px; width: 50%; display: block; margin: 0px auto; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;" :title="(dialogData.deviceInfo && dialogData.deviceInfo.DEV_NAME || '') + '的' + scoped.title">{{dialogData.deviceInfo && dialogData.deviceInfo.DEV_NAME || ''}}的{{scoped.title}}</span>
            </template>
            <template>
                <el-tabs class="smart-box smart-box-tabs traffic-tabs" value="info" @tab-click='refresh_info'>
                    <el-tab-pane label="信号机信息" name="info">
                        <div class="traffic-panel">
                            <div class="smart-box smart-box-flex-row traffic-panel-wrapper">
                                <div class="smart-box-flex-column-8" style="padding: 0px 10px;" >
                                    <div class="smart-box smart-box-flex-row vertical">
                                        <div class="smart-box-flex-column-2 traffic-panel-item-title">
                                            <span style="position:relative;">设备信息</span>
                                        </div>
                                        <div class="smart-box-flex-column-22 traffic-panel-item-split traffic-panel-item-body">
                                            <el-row type="flex" class="traffic-panel-item-bottom-split" style="color: #fff;">
                                                <el-col :span="12" class="traffic-panel-item-info">设备名称</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;"><span :title="dialogData.deviceInfo && dialogData.deviceInfo.DEV_NAME || ''">{{ dialogData.deviceInfo && dialogData.deviceInfo.DEV_NAME || "" }}</span></el-col>
                                            </el-row>
                                            <el-row type="flex" class="traffic-panel-item-bottom-split" style="color: #fff;">
                                                <el-col :span="12" class="traffic-panel-item-info">设备型号</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{ dialogData.deviceInfo && dialogData.deviceInfo.DEV_MODEL || "" }}</el-col>
                                            </el-row>
                                            <el-row type="flex" class="traffic-panel-item-bottom-split" style="color: #fff;">
                                                <el-col :span="12" class="traffic-panel-item-info">设备IP</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{ dialogData.deviceInfo && dialogData.deviceInfo.DEV_IP || "" }}</el-col>
                                            </el-row>
                                            <el-row type="flex" class="traffic-panel-item-bottom-split" style="color: #fff;">
                                                <el-col :span="12" class="traffic-panel-item-info">GIS</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{ [dialogData.deviceInfo && dialogData.deviceInfo.DEV_LONGITUDE || "0", dialogData.deviceInfo && dialogData.deviceInfo.DEV_LATITUDE || "0"].join(",") }}</el-col>
                                            </el-row>
                                            <el-row type="flex" class="traffic-panel-item-bottom-split" style="color: #fff;">
                                                <el-col :span="12" class="traffic-panel-item-info">信号机状态</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.status}}</el-col>
                                            </el-row>
                                            <el-row type="flex" class="traffic-panel-item-bottom-split" style="color: #fff;">
                                                <el-col :span="12" class="traffic-panel-item-info">28V电源电压状态</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.voltage_status}}</el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </div>
                                <div class="smart-box-flex-column-8" style="padding: 0px 10px;">
                                    <div class="smart-box smart-box-flex-row vertical">
                                        <div class="smart-box-flex-column-2 traffic-panel-item-title">
                                            <span style="position:relative;">环境监测</span>
                                        </div>
                                        <div class="smart-box-flex-column-22 traffic-panel-item-split traffic-panel-item-body">
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info"><i class="traffic-volIcon"></i></el-col>
                                                <el-col :span="10" class="traffic-panel-item-info">输入电压</el-col>
                                                <el-col :span="10" class="traffic-panel-item-info" style="text-align:right;">{{ dialogData.environment.input_vol }}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info"><i class="traffic-tempValue"></i></el-col>
                                                <el-col :span="10" class="traffic-panel-item-info">箱内温度</el-col>
                                                <el-col :span="10" class="traffic-panel-item-info" style="text-align:right;">{{ dialogData.environment.dev_temp }}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="fa fa-tint"></i></el-col>
                                                <el-col :span="10" class="traffic-panel-item-info">湿度</el-col>
                                                <el-col :span="10" class="traffic-panel-item-info" style="text-align:right;">{{ dialogData.environment.humidity }}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;" v-for="(flash, n) in dialogData.environment.thunder" :key="n">
                                                <el-col :span="4"  class="traffic-panel-item-info"><i class="traffic-thunderIcon"></i></el-col>
                                                <el-col :span="10" class="traffic-panel-item-info">{{ flash[0] }}</el-col>
                                                <el-col :span="10" class="traffic-panel-item-info" style="text-align:right;">{{ flash[0].indexOf('防雷器') > -1 ? flash[1] : flash[3] }}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="fa fa-tint"></i></el-col>
                                                <el-col :span="10" class="traffic-panel-item-info">水漫状态</el-col>
                                                <el-col :span="10" class="traffic-panel-item-info" style="text-align:right;">{{ dialogData.environment.water_status }}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="fa fa-italic"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">倾斜状态</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{ dialogData.environment.lean_angle }}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="fa fa-sitemap" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">学习状态</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.learn_status}}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="traffic-icon in-electricity" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">市电空开</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.airswitch[0] && signal.airswitch[0][1]}}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="traffic-icon in-electricity" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">备电空开</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.airswitch[1] && signal.airswitch[1][1]}}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="el-icon-sunrise-1" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">设备输入空开</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.airswitch[2] && signal.airswitch[2][1]}}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="el-icon-sunrise-1" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">黄闪输入空开</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.airswitch[3] && signal.airswitch[3][1]}}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="el-icon-sunrise-1" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">控制器输入空开</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.airswitch[4] && signal.airswitch[4][1]}}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="el-icon-sunrise-1" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">检测输入空开</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.airswitch[5] && signal.airswitch[5][1]}}</el-col>
                                            </el-row>
                                            <el-row type="flex" style="color: #fff;">
                                                <el-col :span="4"  class="traffic-panel-item-info" style="text-align:center;"><i class="el-icon-sunrise-1" style="transform: rotate(180deg);"></i></el-col>
                                                <el-col :span="12" class="traffic-panel-item-info">辅助空开</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">{{signal.airswitch[6] && signal.airswitch[6][1]}}</el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </div>
                                <div class="smart-box-flex-column-8" style="padding: 0px 10px;">
                                    <div class="smart-box smart-box-flex-row vertical">
                                        <div class="smart-box-flex-column-2 traffic-panel-item-title" style="position:relative;">
                                            <span>设备控制</span>
                                        </div>
                                        <div class="smart-box-flex-column-22 traffic-panel-item-split traffic-panel-item-body">
                                            <el-row  type="flex" class="traffic-panel-item-switch" style="color: #fff;" justify="center" align="center" v-for="(item,index) in boxState" :key="index">
                                                <el-col :span="12" class="traffic-panel-item-info">{{item.PERFORM_DESCRIPTION}}</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">
                                                    <el-tooltip effect="dark" :content="item.index ? '开' : '关'" placement="bottom">
                                                        <span v-if="item.PERFORM_NAME === 'DOOR_STATUS'">{{ item.index ? '开' : '关' }}</span>
                                                        <el-switch 
                                                            v-else
                                                            v-model="item.index" 
                                                            v-show="item.PERFORM_NAME !== 'DOOR_STATUS' && (item.PERFORM_NAME !== 'LOCKTONGUE_STATUS' || item.PERFORM_NAME == 'LOCKTONGUE_STATUS' && item.PERFORM_VALUE == '0')" 
                                                            size="small" 
                                                            active-color="#13ce66" 
                                                            inactive-color="#ff4949" 
                                                            @input="sortDeviceControl($event,item.PERFORM_NAME)"
                                                            :disabled="User.role.id === 'op' || !dialogData.deviceInfo.ONLINE_STATUS">
                                                        </el-switch>
                                                    </el-tooltip>
                                                </el-col>
                                            </el-row>
                                            <el-row  type="flex" class="traffic-panel-item-switch" style="color: #fff;" justify="center" align="center">
                                                <el-col :span="12" class="traffic-panel-item-info">开始学习</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">
                                                    <el-button type="primary" size="mini" icon="el-icon-s-opportunity" style="color: pointer;" @click="modifyLearn(true)" circle></el-button>
                                                </el-col>
                                            </el-row>
                                            <el-row  type="flex" class="traffic-panel-item-switch" style="color: #fff;" justify="center" align="center">
                                                <el-col :span="12" class="traffic-panel-item-info">清除学习记录</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">
                                                    <el-button type="primary" size="mini" icon="el-icon-brush" style="color: pointer;" @click="modifyLearn(false)" circle></el-button>
                                                </el-col>
                                            </el-row>
                                            <el-row  type="flex" class="traffic-panel-item-switch" style="color: #fff;" justify="center" align="center">
                                                <el-col :span="12" class="traffic-panel-item-info">恢复出厂设置</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">
                                                    <el-button type="primary" size="mini" icon="el-icon-refresh" style="color: pointer;" @click="reStoreSetting" circle></el-button>
                                                </el-col>
                                            </el-row>
                                            <el-row  type="flex" class="traffic-panel-item-switch" style="color: #fff;" justify="center" align="center">
                                                <el-col :span="12" class="traffic-panel-item-info">重启</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">
                                                    <el-button type="primary" size="mini" icon="el-icon-refresh-left" style="color: pointer;" @click="reStart" circle></el-button>
                                                </el-col>
                                            </el-row>
                                            <el-row  type="flex" class="traffic-panel-item-switch" style="color: #fff;" justify="center" align="center">
                                                <el-col :span="12" class="traffic-panel-item-info">设置</el-col>
                                                <el-col :span="12" class="traffic-panel-item-info" style="text-align:right;">
                                                    <el-button type="primary" size="mini" icon="el-icon-setting" style="color: pointer;" @click="deviceInfoDailog.Isshow = true" circle></el-button>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="信号灯监控" name="signal_light">
                        <el-table :data="SignalLightData" class="smart-box smart-box-table" height="calc(100%)"  size="small" border stripe>
                            <el-table-column label="方向" align="center" header-align="center" prop="directDes" show-overflow-tooltip></el-table-column>
                            <el-table-column label="状态" align="center" header-align="center" prop="faultStatus" show-overflow-tooltip>
                                <template slot-scope="scoped">
                                    {{scoped.row.faultStatus == 1 && ['灭','亮', '黄闪'][scoped.row.beaconStatus] || '故障' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="倒计时" align="center" header-align="center" prop="countDownTime" show-overflow-tooltip>
                                <template slot-scope="scoped">
                                    {{ scoped.row.countDownTime == -1 ? '故障' : scoped.row.countDownTime == -3 ? '无灯' : scoped.row.countDownTime }}
                                </template>
                            </el-table-column>
                            <el-table-column label="电压" align="center" header-align="center" prop="voltage" show-overflow-tooltip></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </smart-box-dialog>

        <smart-box-dialog :show.sync="deviceInfoDailog.Isshow" :footer-show="false" width="560px" height="300px" title="设备倾斜阈值设置" :is-click-mask-close="false">
            <el-form  :model="deviceInfoDailog.deviceTilt" label-position="right"  label-width="50px" size="small" style="margin-top:20px;">
                <el-row justify="center" align="center" type="flex">
                    <el-col :span="10" :offset="2">
                        <el-form-item :rules="[{ type: 'number', message: '必须为数字值'}]" label="前">
                            <template v-slot:label>
                                <span style="color: #fff;">前：</span>
                            </template>
                            <el-input-number class="smart-box smart-box-number" style="width:120px" v-model="deviceInfoDailog.deviceTilt.frontValue" controls-position="right" :min="1" :max="89" clearable></el-input-number><span style="color:#FFF;">度</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="后" :rules="[{ type: 'number', message: '必须为数字值'}]">
                            <template v-slot:label>
                                <span style="color: #fff;">后：</span>
                            </template>
                            <el-input-number class="smart-box smart-box-number" style="width:120px" v-model="deviceInfoDailog.deviceTilt.afterValue" controls-position="right" :min="1" :max="89" clearable></el-input-number><span style="color:#FFF;">度</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row justify="center" align="center" type="flex">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="左" :rules="[{ type: 'number', message: '必须为数字值'}]">
                            <template v-slot:label>
                                <span style="color: #fff;">左：</span>
                            </template>
                            <el-input-number class="smart-box smart-box-number" style="width:120px" v-model="deviceInfoDailog.deviceTilt.leftValue" controls-position="right" :min="1" :max="89" clearable></el-input-number><span style="color:#FFF;">度</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="右" :rules="[{ type: 'number', message: '必须为数字值'}]">
                            <template v-slot:label>
                                <span style="color: #fff;">右：</span>
                            </template>
                            <el-input-number class="smart-box smart-box-number" style="width:120px" v-model="deviceInfoDailog.deviceTilt.rightValue" controls-position="right" :min="1" :max="89" clearable></el-input-number><span style="color:#FFF;">度</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10" :offset="6">
                        <el-form-item style="text-align:center;">
                                <el-button type="primary" icon="el-icon-refresh"  style="width: 130px;"  size="small" @click="leanThresholdControl">一键倾斜调校</el-button>
                            </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="12" :offset="5">
                        <el-form-item style="text-align:center;">
                            <el-button type="success" icon="el-icon-check"  style="width: 70px;"  size="small" @click="leftThresholdSet">确定</el-button>
                            <el-button type="warning" icon="el-icon-close"  style="width: 70px;"  size="small" @click="deviceInfoDailog.Isshow = false">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </smart-box-dialog>

        <smart-box-dialog :show.sync="alarmShow" :footer-show="false" width="1080px" height="600px" title="告警信息查询" :is-click-mask-close="false" @closed="$refs.searchForm.resetFields()">
            <template  v-slot:header="scoped">
                <span style="font-size: 120%; width: 80%; display: block; margin: 0px auto; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;" :title="scoped.title + '-' + (dialogData.deviceInfo && dialogData.deviceInfo.DEV_NAME || '')">{{ scoped.title }}-{{dialogData.deviceInfo && dialogData.deviceInfo.DEV_NAME || ""}}</span>
            </template>
            <el-form ref="searchForm" label-position="right" :model="search" label-width="90px" size="mini" style="display:table-cell; vertical-align:middle; padding:10px 20px; width:100%; text-align:center;" inline>
                <el-form-item style="margin-bottom:5px;" prop="errorProject">
                    <template v-slot:label>
                        <span style="color:#fff;">告警类型：</span>
                    </template>
                    <el-select v-model="search.errorProject" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width:310px;" clearable>
                        <el-option v-for="(item,index) in alaramItemList" :key="index" :value="item.value" :label="item.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom:5px;" prop="alarmDesc">
                    <template v-slot:label>
                        <span style="color:#fff;">告警描述：</span>
                    </template>
                    <el-input class="smart-box smart-box-input" v-model="search.alarmDesc"  style="width:310px;"  clearable/>
                </el-form-item>
                <el-form-item style="margin-bottom:0px;" prop="alarmTime">
                    <template v-slot:label>
                        <span style="color:#fff;">告警时间：</span>
                    </template>
                    <el-date-picker 
                        style="width:310px;" 
                        v-model="search.alarmTime" 
                        type="datetimerange" 
                        class="smart-box smart-box-daterange" 
                        popper-class="smart-box smart-box-popover" 
                        range-separator="-" 
                        start-placeholder="开始日期" 
                        end-placeholder="结束日期" 
                        value-format="yyyy-MM-dd HH:mm:ss"
                        unlink-panels 
                        clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item  label-width="0px" style="text-align:right;margin-bottom:0px; width: 400px">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="search.page = 1, queryAlarmDataSource()">查询</el-button>
                    <el-button type="primary" icon="el-icon-refresh" size="small" @click="$refs.searchForm.resetFields(), queryAlarmDataSource()">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="alarmInfoDataSource" :cell-style="alarmInfoDataTableCellStyle" class="smart-box smart-box-table" height="calc(100% - 160px)" size="small" style="width: 970px; margin-left: auto; margin-right: auto;" border stripe>
                <el-table-column label="编号" type="index" align="center" header-align="center"></el-table-column>
                <el-table-column label="告警类型" align="center" header-align="center">
                    <template slot-scope="scope">
                        <span href="#">{{scope.row.alarmName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" width="150px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <span href="#">{{formatTimer(scope.row.alarmTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="告警状态" width="90px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <span href="#">{{ ['', '未处理', '已派单','已忽略', '已完成'][scope.row.isDeal] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="恢复状态" width="90px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1" style="color: #FDB643">已恢复</span>
                        <span v-if="scope.row.status === 0" style="color: #05A2F4">未恢复</span>
                    </template>
                </el-table-column>
                <el-table-column  label="告警描述" align="left" prop="alarmDesc">
                    <template slot-scope="scope">
                        <span>{{scope.row.alarmDesc}} {{scope.row.alarmName}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                @size-change="handleSizeChange"  
                @current-change="handleCurrentChange" 
                :page-sizes="[10, 15, 50, 100]" 
                class="smart-box smart-box-pagination"
                style="width: 970px; margin-left:auto; margin-right:auto; margin-top: 3px;"
                :current-page.sync="pagination.page" 
                :page-size="pagination.pageSize" 
                layout="sizes, prev, pager, next, jumper, total" 
                :total="pagination.total">
            </el-pagination>
        </smart-box-dialog>
    </div>
</template>
<script>
import { default as Traffic } from "./traffic"
export default Traffic
</script>
<style lang="scss" scoped>
    .traffic-tree-panel {
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

    .traffic-panel {
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        .traffic-panel-wrapper {
            width : 100%; 
            height: 100%;
            border: 0px solid #026279;
            overflow: hidden;

            .traffic-panel-item-title {
                background-image: url(../../assets/Images/traffic-info-title.png);
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 120px 100%;
                padding: 0px 10px !important;
                font-weight: bold;
                text-align:center;
                color: rgba(0, 250, 254, .8);
                display: table;

                > span {
                    display:table-cell;
                    vertical-align: middle;
                }
            }

            .traffic-panel-item-split {
                border-right: 1px dashed rgba(0, 250, 254, .8);
            }

            .traffic-panel-item-bottom-split {
                border-bottom:2px solid;
                border-image: linear-gradient(to right, #0167E8, #13ACE8) 30 30;
            }

            .traffic-panel-item-switch {
                border-radius: 20px;
                padding: 2px;
                box-sizing: border-box;
                margin-top: 5px;
                background:linear-gradient(to right, #00FAFE, #112041);
                > div {
                    background-color:#112041;
                    &:first-child {
                        border-top-left-radius: 20px;
                        border-bottom-left-radius: 20px;
                    }
                    &:last-child {
                        border-top-right-radius: 20px;
                        border-bottom-right-radius: 20px;
                    }
                }
            }

            .traffic-panel-item-body {
                overflow-y:auto !important;

                &::-webkit-scrollbar {
                    background: transparent;
                    width: 15px;
                }

                &::-webkit-scrollbar-thumb {
                    background: linear-gradient(90deg, #00fafecc, #01a1b2);
                    width: 15px;
                    border-radius: 7px;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                }

                &::-webkit-scrollbar-button {
                    display:none;
                }
            }


            .traffic-panel-item-info {
                padding: 10px 5px;
                font-size: 14px;
                box-sizing: border-box;
                text-overflow:ellipsis;
                overflow:hidden;
                white-space: nowrap;
            }
        }
    }

    .traffic-container {
        position: relative;
        z-index: 98;
        float: left;
        width: calc(100% - 360px);
        // width: 100%;
        height: 100%;
        transition: width .6s ease;
    }

    .traffic-row {
        margin: 10px 20px;

        &.active {
            background-color: rgba(12, 68, 110, .5);
        }

        &.clear {
            margin : auto 20px;
        }

        > .traffic-col-item {
            box-sizing: border-box;
            padding: 10px;
            color: #fff;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;

            
            &.active {
                background-color: rgba(12, 68, 110, .5);
            }
        }
    }

    .traffic-icon {

        &.in-electricity::before {
            background: url(../../assets/Images/in-electricity-icon.png);
            background-position: center center;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            width: 16px;
            height: 16px;
            vertical-align: top;
            display: inline-block;
            content: " ";
        }

        &.traffic-box {
            background: url(../../assets/Images/box-icon.png);
            background-position: center center;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            width: 16px;
            height: 16px;
            vertical-align: top;
            display: inline-block;
            content: " ";
        }
    }

    .traffic-tag {
        border :1px solid #00FAFE;
        background:#0c446e;
        color:#fff;
    }

    .traffic-fanIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/fan-icon.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .traffic-tempValue {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/temperature-icon.png);
            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .traffic-volIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/vol-icon.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .traffic-electricityIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/in-electricity-icon.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .traffic-heaterIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/hot-icon.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .traffic-thunderIcon {
        font-size: 1.33333333em;
        line-height: 0.75em;
        vertical-align: -15%;

        &::before {
            content: ' ';
            background: url(../../assets/Images/flash-icon.png);
            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position:center center;
            display: block;
            width: 18px;
            height: 18px;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>
<style lang="scss">
    .traffic-tabs {
        display:block;
        margin: 0px auto;
        width: calc(100% - 100px);
        height: calc(100% - 50px);

        > .el-tabs__content {
            height: calc(100% - 55px);

            > .el-tab-pane {

                overflow-y: auto;
                overflow-x: hidden;
                height: 100%;

                &::-webkit-scrollbar {
                    background: transparent;
                    width: 15px;
                }

                &::-webkit-scrollbar-thumb {
                    background: linear-gradient(90deg, #00fafecc, #01a1b2);
                    width: 15px;
                    border-radius: 7px;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                }

                &::-webkit-scrollbar-button {
                    display:none;
                }
            }
        }
    }

    .traffic-alarm-trigger {
        margin-right: 0px !important;
        color: #fff !important; 
        border:0px solid #fff !important;

        &.is-checked{
            border:0px solid #fff !important;
        }

        &.is-checked > .el-checkbox__label {
            color: #fff !important;
        }
    }
</style>