<template xmlns:v-popover="http://www.w3.org/1999/xhtml" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <el-container class="home-container-flex" direction="vertical">
        <el-header class="home-container-header" height="74px">
            <el-row type="flex" style="height: 100%;">
                <el-col :span="4"></el-col>
                <el-col :span="2" style="height: 100%;">
                    <div class="home-header-menu-left" :class="{ 'active' : $route.name === 'sys' }"
                         @click="$router.push({ name : 'sys'})">
                        <span>系统总览</span>
                        <i class="activeBar"></i>
                    </div>
                </el-col>
                <el-col :span="2" style="height: 100%;">
                    <div class="home-header-menu-left" :class="{ 'active' : $route.name === 'map' }"
                         @click="$router.push({ name : 'map' })">
                        <span>地图显示</span>
                        <i class="activeBar"></i>
                    </div>
                </el-col>
                <el-col :span="9" style="height: 100%;">
                    <div class="home-header-menu-title">
                        <p>
                            <img :src="getLogoPicture.icon" :width="getLogoPicture.width" :height="getLogoPicture.height" style="vertical-align:sub;" />
                            {{systemName}}
                        </p>
                    </div>
                </el-col>
                <el-col :span="2" style="height: 100%;">
                    <div class="home-header-menu-right" :class="{ 'active' : ['proxy_page', 'box', 'traffic'].indexOf($route.name) > -1 }"
                         @click="handlerDefaultDevice">
                        <span>智能监控</span>
                        <i class="activeBar"></i>
                    </div>
                </el-col>
                <el-col :span="2" style="height: 100%;">
                    <div class="home-header-menu-right" :class="{ 'active' : $route.name === 'waringView' }"
                         @click="$router.push({ name : 'waringView' })">
                        <span>告警管理</span>
                        <i class="activeBar"></i>
                    </div>
                </el-col>
                <el-col :span="4" style="line-height: 80px; text-align:right;">
                    <span class="home-username-show-font">用户名：{{getUsername}} &ensp;</span>
                    <i class="fa fa-user fa-lg" v-popover:user_popover
                       style="color:#00fafe; margin-right: 10px; cursor:pointer;"></i>
                    <el-tooltip content="退出" placement="bottom">
                        <i class="fa fa-sign-out fa-lg" style="color:#00fafe; margin-right: 10px; cursor:pointer;"
                           @click="loginOut"></i>
                    </el-tooltip>
                    <el-popover
                            popper-class="smart-box smart-box-popover"
                            ref="user_popover"
                            placement="bottom"
                            width="200"
                            trigger="hover">
                        <p style="padding: 10px; box-sizing: border-box; margin-block: 10px;">
                            <small style=" float:left;"> 角色：{{userRole.roleName}}</small>
                        </p>
                        <el-row  v-if="userRole.id == 'admin'"  class="home-list-item" justify="left">
                            <div @click="visibleSysParamsDialog(true)">
                                <el-col :span="24">系统参数设置</el-col>
                            </div>
                        </el-row>
                        <el-row class="home-list-item" justify="left">
                            <div :class="{ 'active' : $route.name === 'users' }"
                                 @click="$router.push({ name : 'users' })">
                                <el-col :span="24">用户管理</el-col>
                            </div>
                        </el-row>
                        <el-row v-if="userRole.id !== 'op'" class="home-list-item" justify="left">
                            <div :class="{ 'active' : $route.name === 'log' }"
                                 @click="$router.push({ name : 'log' })">
                                <el-col :span="24">操作日志</el-col>
                            </div>
                        </el-row>
                        <el-row v-if="userRole.id !== 'admin'" class="home-list-item" justify="left">
                            <div @click="updatePassword">
                                <el-col :span="24">密码修改</el-col>
                            </div>
                        </el-row>
                        <el-row v-if="userRole.id == 'admin'" class="home-list-item" justify="left">
                            <div :class="{ 'active' : $route.name === 'trafficConfig' }"
                                 @click="$router.push({ name : 'trafficConfig'})">
                                <el-col :span="24">参数修改</el-col>
                            </div>
                        </el-row>
                    </el-popover>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="padding: 0; overflow:hidden; height: 100%;">
            <router-view ref="win_view"/>
        </el-main>
        <transition name="el-zoom-in-bottom">
            <el-footer v-show="['map', 'box', 'traffic'].indexOf($route.name) === -1" height="40px"
                       style="line-height: 40px;">
                <p style="color:#00fafe; width: 70%; text-overflow: ellipsis; overflow:hidden; white-space: nowrap; margin-left:auto; margin-right: auto; font-size: 12px; text-align: center; margin-block-start: 0px; margin-block-end: 0px;">
                    <span>powered by {{systemName}}</span><span
                        style="color:#fff;"> {{systemForm.companyName}} </span><span>提供技术支持</span> <span>软件版本号{{systemVersion}}</span>
                </p>
            </el-footer>
        </transition>
        <smart-box-dialog ref="update_password_dialog" width="500px" height="320px" :show.sync="hasDialogShow"
                          v-model="passWordInfo" :IsClickMaskClose="false"
                          :title="'密码修改'" :wrong="wrong" @closed="handlerOverlayClosed">
            <el-row type="flex" align="center" justify="center">
                <el-col :span="24" :offset="5">
                    <el-form label-width="0px" :rules="passwordRule" ref="passwordInfo" :model="passWordInfo"
                             label-position="left" size="small" style="padding: 30px 0px 0px 30px">
                        <el-form-item prop="oldPassword">
                            <el-input v-model="passWordInfo.oldPassword" type="password" size="small"
                                      class="smart-box smart-box-input" popper-class="smart-box smart-box-popover"
                                      placeholder="请输入原密码" style="width: 200px" resize>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="newPassword">
                            <el-input v-model="passWordInfo.newPassword" type="password" size="small"
                                      class="smart-box smart-box-input" popper-class="smart-box smart-box-popover"
                                      placeholder="请输入新密码" style="width: 200px" resize>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="confirmPassword">
                            <el-input v-model="passWordInfo.confirmPassword" size="small" type="password"
                                      class="smart-box smart-box-input" popper-class="smart-box smart-box-popover"
                                      placeholder="请确认新密码" style="width: 200px" resize>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <template v-slot:footer>
                <div style="width: 100%; height: 60px; padding: 10px 0px;">
                    <el-button class="smart-box smart-box-button" style="width: 90px;" size="small"
                               @click="submitUpdatePassword('passwordInfo')">
                        确认修改
                    </el-button>
                </div>
            </template>
        </smart-box-dialog>
        <smart-box-dialog
                ref="update_password_dialog"
                width="860px"
                height="570px"
                :show="hasSystemDialogShow"
                :IsClickMaskClose="false"
                :title="'系统参数修改'"
                :wrong="wrong"
                @closed="handlerCancelSysParamsDialog">
            <el-form
                    ref="systemForm"
                    label-width="140px"
                    label-position="right"
                    :model="systemForm"
                    class="home-params-form"
                    size="small">
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="12">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">系统名称：</span>
                            </template>
                            <el-input v-model="systemForm.systemName" size="small" class="smart-box smart-box-input"
                                      style="width: 100%" resize></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">网管地址：</span>
                            </template>
                            <el-input v-model="systemForm.gmIp" size="small" class="smart-box smart-box-input"
                                      style="width: 100%" resize></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="12">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">公司名称：</span>
                            </template>
                            <el-input  v-model="systemForm.companyName"  size="small"
                                      class="smart-box smart-box-input" style="width: 100%" resize ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">logo图片名称：</span>
                            </template>
                            <el-select v-model="systemForm.logoName" class="smart-box smart-box-select" popper-class="smart-box smart-box-popover" style="width: 100%" clearable placeholder="请选择">
                                <el-option v-for="item in logoList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="12">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">系统版本号：</span>
                            </template>
                            <el-input v-model="systemForm.sysVersion" size="small" class="smart-box smart-box-input"
                                      style="width: 100%" resize></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">首页联系方式：</span>
                            </template>
                            <el-input v-model="systemForm.companyTel" size="small" class="smart-box smart-box-input"
                                      style="width: 100%" resize></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="24">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">首页统计展示：</span>
                            </template>
                            <el-checkbox-group
                                    v-model="systemForm.checkedShow"
                                    :min="1">
                                <el-checkbox size="small" class="smart-box smart-box-check" :label="1" :key="1">
                                    <span style="color: #fff;">摄像机在线率</span>
                                </el-checkbox>
                                <el-checkbox size="small" class="smart-box smart-box-check" :label="2" :key="2">
                                    <span style="color: #fff;">智能机箱在线率</span>
                                </el-checkbox>
                                <el-checkbox size="small" class="smart-box smart-box-check" :label="3" :key="3">
                                    <span style="color: #fff;">信号机在线率</span>
                                </el-checkbox>
                                <el-checkbox size="small" class="smart-box smart-box-check" :label="4" :key="4">
                                    <span style="color: #fff;">交通灯故障率</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row type="flex" justify="center" align="center">
                    <el-col :span="8">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">地图默认显示层级：</span>
                            </template>
                            <el-input v-model="systemForm.zoon" size="small" class="smart-box smart-box-input"
                                      style="width: 100%" resize></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">最小瓦片等级：</span>
                            </template>
                            <el-input v-model="systemForm.minZoon" placeholder="最小瓦片等级" size="small"
                                      class="smart-box smart-box-input" style="width: 100%" resize></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">最大瓦片等级：</span>
                            </template>
                            <el-input v-model="systemForm.maxZoon" placeholder="最大瓦片等级" size="small"
                                      class="smart-box smart-box-input" style="width: 100%" resize></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="24">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">城市中心：</span>
                            </template>
                            <el-input :value="getMapCenter && getMapCenter.join(',') || ''" size="small"
                                      class="smart-box smart-box-input" style="width: 100%" resize disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="24">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">拖拽区域：</span>
                            </template>
                            <el-input :value="getMapExtent && getMapExtent.join(',') || ''" size="small"
                                      class="smart-box smart-box-input" style="width: 100%" resize disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" align="center">
                    <el-col :span="24">
                        <el-form-item>
                            <template v-slot:label>
                                <span style="color: #fff;">视野区域：</span>
                            </template>
                            <el-input :value="getViewExtent && getViewExtent.join(',') || ''" size="small"
                                      class="smart-box smart-box-input" style="width: 100%" resize disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template v-slot:footer>
                <el-button type="success" icon="el-icon-check" style="width: 70px;" size="small" @click="submitSystem">
                    确定
                </el-button>
                <el-button type="warning" icon="el-icon-close" style="width: 70px;" size="small"
                           @click="handlerCancelSysParamsDialog">取消
                </el-button>
            </template>
        </smart-box-dialog>
    </el-container>
</template>
<script>
    import {default as Home} from "./home"

    export default Home
</script>
<style lang="scss" scoped>
    .home-container-flex {
        height: 100%;
        width: 100%;
        background-image: url(../../assets/Images/bg.jpg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;

        &.home-container-other-bg {
            background-image: url(../../assets/Images/other-bg.jpg);
        }

        .home-container-header {
            background-color: #10205B;
            border-bottom: 1px solid #13327C;
            z-index: 999;

            .home-header-menu-left {
                position: relative;
                transform: skewX(30deg);
                margin: 0px 5px;
                height: 100%;
                line-height: 100%;
                box-sizing: border-box;
                background: linear-gradient(0deg, rgba(1, 161, 178, .4), rgba(16, 32, 91, .1));
                cursor: pointer;
                transition: all linear .3s;

                > span {
                    display: block;
                    height: 100%;
                    color: #fff;
                    transform: skewX(-30deg);
                    text-align: center;
                    line-height: 78px;
                    overflow: hidden;
                }

                &.active {
                    background: linear-gradient(0deg, rgba(1, 161, 178, 1), rgba(16, 32, 91, .1));
                    border-image: linear-gradient(0deg, rgba(0, 250, 254, 1), rgba(16, 32, 91, .1)) 30 30;
                    border-style: solid;
                    border-left-width: 1px;
                    border-right-width: 1px;
                    border-top-width: 0px;
                    border-bottom-width: 0px;

                    > .activeBar {
                        display: block;
                    }
                }

                > .activeBar {
                    display: none;
                    position: absolute;
                    bottom: -2.5px;
                    width: calc(100% + 8px);
                    transform: translateX(-4px) skewX(-30deg);
                    height: 5px;
                    background-color: #00FAFE;
                    border-radius: 2.5px;
                }
            }

            .home-header-menu-right {
                position: relative;
                transform: skewX(-30deg);
                margin: 0px 5px;
                height: 100%;
                line-height: 100%;
                box-sizing: border-box;
                background: linear-gradient(0deg, rgba(1, 161, 178, .4), rgba(16, 32, 91, .1));
                cursor: pointer;
                transition: all linear .3s;

                > span {
                    display: block;
                    height: 100%;
                    color: #fff;
                    transform: skewX(30deg);
                    text-align: center;
                    line-height: 78px;
                    overflow: hidden;
                }

                &.active {
                    background: linear-gradient(0deg, rgba(1, 161, 178, 1), rgba(16, 32, 91, .1));
                    border-image: linear-gradient(0deg, rgba(0, 250, 254, 1), rgba(16, 32, 91, .1)) 30 30;
                    border-style: solid;
                    border-left-width: 1px;
                    border-right-width: 1px;
                    border-top-width: 0px;
                    border-bottom-width: 0px;

                    > .activeBar {
                        display: block;
                    }
                }

                > .activeBar {
                    display: none;
                    position: absolute;
                    bottom: -2.5px;
                    width: calc(100% + 8px);
                    transform: translateX(-4px) skewX(30deg);
                    height: 5px;
                    background-color: #00FAFE;
                    border-radius: 2.5px;
                }
            }

            .home-header-menu-title {
                width: 90%;
                height: 120%;
                line-height: 74px;
                background-image: url(../../assets/Images/title.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center center;
                margin-left: auto;
                margin-right: auto;

                > p {
                    color: #fff;
                    font-size: 27px;
                    padding: 10px 0px;
                    font-weight: bold;
                    text-align: center;
                    margin-block-start: 0px;
                    margin-block-end: 0px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    // background-image: url(../../assets/Images/logo.png);
                    // background-size: 120px 40px;
                    // background-repeat: no-repeat;
                    // background-position: calc(50% - 8em) center;
                }
            }
        }
    }

    .home-params-form {
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        width: calc(100% - 60px);
        display: grid;
        grid-auto-flow: dense;

        > .home-params-form-item:nth-child(2n) {
            grid-column: 1;
            transition: all .6s linear;
        }

        > .home-params-form-item:nth-child(2n+1) {
            grid-column: 2;
            transition: all .6s linear;
        }
    }

    .home-list-item {
        padding: 12px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .home-list-item:hover {
        background-color: #01A1B2;
    }

    .home-username-show-font {
        color: #FFFFFF;
        font-family: 'Gen Jyuu Gothic Normal', 'Gen Jyuu Gothic P Normal', 'Gen Jyuu Gothic LP Normal', '思源黑体 Normal', '方正黑体简体';
    }
</style>



