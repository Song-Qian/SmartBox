<template>
    <el-container style="height: 100%;">
        <el-aside width="auto" style="background-color: #545c64; padding: 5px; box-sizing: border-box;">
            <el-row type="flex" class="home-logo">
                <el-col :span="24">
                    Logo
                </el-col>
            </el-row>
            <el-menu default-active="1-4-1" :router="true" background-color="#545c64" active-text-color="#ffd04b" text-color="#fff" style="border-right:0px solid #fff;" :collapse="isCollapse">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span slot="title">导航一</span>
                    </template>
                    <el-menu-item index="/home/console/1">选项1</el-menu-item>
                    <el-menu-item index="/home/console/2">选项2</el-menu-item>
                    <el-menu-item index="/home/console/3">选项3</el-menu-item>
                    <el-submenu index="1-4">
                        <span slot="title">选项4</span>
                        <el-menu-item index="/home/ctest">CTest</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/home/myvueFirst">选项5</el-menu-item>
                </el-submenu>
                <el-menu-item index="/home/test">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航三</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="home-header">
                <el-row type="flex" align="middle" style="height:100%;">
                    <el-col :span="1" style="text-align:center;">
                        <i class="el-icon-menu" style="cursor:pointer;" @click="isCollapse = !isCollapse"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="3" style="text-align:center;">
                        <el-button type="primary" size="mini" icon="fa fa-user fa-lg" v-popover:user_popover round></el-button>
                        <el-popover
                            class="home-user-popover"
                            ref="user_popover"
                            placement="bottom"
                            width="200"
                            trigger="hover">
                            <el-row class="home-user-row" type="flex" justify="center">
                                <el-col :span="24">用户信息</el-col>
                            </el-row>
                            <el-row class="home-user-row" justify="center">
                                <el-col :span="24">修改密码</el-col>
                            </el-row>
                            <el-row class="home-user-row" justify="center">
                                <el-col :span="24">XXXX</el-col>
                            </el-row>
                            <el-row class="home-user-row" justify="center" @click.native="$router.push({ name : 'login' })">
                                <el-col :span="24"><i class="fa fa-sign-out fa-lg" ></i>登出</el-col>
                            </el-row>
                        </el-popover>
                    </el-col>
                </el-row>
            </el-header>
            <el-main class="home-main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import { default as Index } from './index'
export default Index
</script>
<style lang="scss" scoped>
    .home-logo {
        padding: 20px 0px;
        box-sizing: border-box;

        > div.el-col {
            color: #fff;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
    }

    .home-header {
        background-position:center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-color: #fff;
        box-shadow: 0 2px 4px 0 rgba(43,43,43,.1);
        padding: 0px;
        z-index: 999;
    }

    .home-main {
        background-color: #F0F0F0;
    }

    .home-user-row {
        height: 40px;
        padding: 10px;
        box-sizing: border-box;
        background-color: #F2F6FC;
        
        &:hover {
            background-color: #E4E7ED;
            cursor: pointer;
        }
    }

    .el-aside >>> .el-tree {
        background-color: #545c64;
    }
</style>