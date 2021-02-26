<template>
    <el-container direction="vertical" class="login-container-fixed" tabindex="0" @keyup.native.enter="submitForm('userRule')">
        <el-main style="overflow:hidden;">
            <div class="smart-box smart-box-flex-row vertical">
                <div class="smart-box-flex-column-6" style="display: table; padding: 10px 120px;">
                    <pre class="login-project-name">{{systemName}}</pre>
                </div>
                <div class="smart-box-flex-column-17">
                    <div class="smart-box smart-box-flex-row">
                        <div class="smart-box-flex-column-12">
                            <div class="login-box">
                                <h2 style="letter-spacing:10px; color: #606266; margin-bottom: 60px;">用户登录</h2>
                                <el-form label-position="left" ref="userRule" :rules="userRule" :model="user">
                                    <el-form-item prop="username">
                                        <el-input v-model="user.username" placeholder="请输入用户名"  prefix-icon="el-icon-s-custom"/>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input v-model="user.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-unlock"/>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-checkbox v-model="record">记住密码</el-checkbox>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="button" class="login-btnSignIn" @click="submitForm('userRule')">登录</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div class="smart-box-flex-column-12 login-project-block"></div>
                    </div>
                </div>
                <div class="smart-box-flex-column-1" style="display:table;">
                    <pre class="login-project-verion">powered by {{companyName}} {{companyTel}} 提供技术支持    版本{{systemVersion}}</pre>
                </div>
            </div>
        </el-main>
    </el-container>
</template>
<script>
import { default as Signle } from './signin'
export default Signle
</script>
<style lang="scss" scoped>
.login-container-fixed {
    height: 100%;
    width: 100%;
    background-image: url(../../assets/Images/login-bg-1.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    min-width: 1366px;
    min-height: 768px;

    .login-project-name  {
        display:table-cell; 
        vertical-align:bottom; 
        font-size: 52px; 
        font-weight: bold; 
        color:#fff; 
        font-family : 'Gen Jyuu Gothic Normal', 'Gen Jyuu Gothic P Normal', 'Gen Jyuu Gothic LP Normal', '思源黑体 Normal', '方正黑体简体'; 
        letter-spacing: 10px;
    }

    .login-project-verion {
        display:table-cell; 
        vertical-align:middle; 
        font-size: 14px;
        color:#fff; 
        text-align: center;
        font-family : 'Gen Jyuu Gothic Normal', 'Gen Jyuu Gothic P Normal', 'Gen Jyuu Gothic LP Normal', '思源黑体 Normal', '方正黑体简体';
        margin-left:auto;
        margin-right:auto;
    }

    .login-box {
        width: 80%;
        height: 480px;
        background: #fff;
        margin-left: auto;
        margin-right: auto;
        padding: 30px;
        box-sizing: border-box;
        box-shadow: 0px 0px 30px 0px rgba(11, 15, 65, .36);

        .login-btnSignIn {
            width: 100%;
            height: 48px;
            border:1px solid rgba(255,255,255, 0);
            color:#fff;
            font-size: 24px;
            letter-spacing: 10px;
            cursor: pointer;
            background: -webkit-linear-gradient(0deg, #3182FF, #5B43E7);
            box-shadow: 0px 7px 27px 0px rgba(50, 129, 255, .5);
        }
    }

    .login-project-block {
        background: url(../../assets/Images/login-right.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 80% 80%;
    }
}
</style>
