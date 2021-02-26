<template>
    <el-container direction="vertical" class="login-container-fixed" tabindex="0" @keyup.native.enter="submitForm('userRule')">
        <el-main class="login-container-main">
            <el-card class="login-window" body-style="background-color: transparent; width: 100%; height: 100%; padding: 50px; box-sizing: border-box;">
                <el-form :model="user" status-icon :rules="userRule" ref="userRule" label-width="0px" style="padding:0px 50px;">
                    <label class="login-subTitle">视频监控运维管理平台</label>
                    <el-form-item prop="username" class="form-item-label-bold" inline-message>
                        <el-input 
                            type="text" 
                            class="smart-box smart-box-input" 
                            style="line-height: normal;"
                            placeholder="请输入用户名" 
                            v-model="user.username" 
                            auto-complete="on" 
                            prefix-icon="fa fa-user fa-lg" 
                            :autofocus="true">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" class="form-item-label-bold">
                        <el-input 
                            type="password"  
                            class="smart-box smart-box-input" 
                            style="line-height: normal;"
                            placeholder="请输入密码" 
                            v-model="user.password" 
                            auto-complete="on" 
                            prefix-icon="fa fa-lock fa-lg" 
                            :autofocus="true">
                        </el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item class="form-item-label-bold">
                                <el-checkbox class="smart-box smart-box-check" v-model="record">记住密码</el-checkbox>
                            </el-form-item>
                        </el-col>
<!--                        <el-col :span="12">-->
<!--                            <el-form-item class="form-item-label-bold" style="float:right;">-->
<!--                                <el-checkbox class="smart-box smart-box-check" v-model="autoLogin">自动登录</el-checkbox>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
                    </el-row>
                    <el-form-item style="text-align:center;" label-width="0">
                        <el-button type="primary" class="smart-box smart-box-button" style="width: 100%;" @click="submitForm('userRule')">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>
<script>
import { default as login } from './login'
export default login
</script>
<style lang="scss">
    .login-container-fixed {
        height: 100%;
        width: 100%;
        background-image: url(../../assets/Images/bg.jpg);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;

        > .login-container-main {
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% 100%;

            > .login-window {
                width: 600px;
                height: 500px;
                padding: 0px 0px;
                position: fixed;
                box-sizing: border-box;
                bottom: 280px;
                left: 50%;
                transform:translateX(-50%);
                background-image: url(../../assets/Images/login-bg.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                background-position: center center;
                background-color: transparent !important;
                border: 0px solid #fff;
            }

            .login-subTitle {
                color: #00fafe;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin: 30px auto 50px auto;
                letter-spacing: 5px;
                display:block;
            }
        }
    }
</style>


