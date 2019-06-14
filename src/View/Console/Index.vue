<template>
    <div>
        {{id}}
        <span>{{getVal}}</span>
        <input v-model="val" v-if="show" />
        <input v-for="(index, el) in result" :value="el" :key="index" />
        <button @click="setVal">click me </button>
        <el-input  :suffix-icon="icon"  v-model="val" @input="handlerChange" placeholder="请输入内容"></el-input>
    </div>
</template>
<script>
import { default as Index } from './index'
export default Index
</script>
<style lang="scss" scoped>
    .console-text {
        color : '#fff';

        > a {
            color :  '#fff';
        }
    }
</style>