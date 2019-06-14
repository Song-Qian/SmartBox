<template>
    <div v-show="Show" class="smart-box-dialog-mask" :style="getMaskStyles"  @click.self="IsClickMaskClose ? close() : void 0">
        <div class="smart-box-dialog-window animated" :class="{ 'fadeIn' : Show, 'fadeOut' : !Show, 'wrong' : Wrong }" :style="getWindowStyles">
            <div class="smart-box-dialog-scrub"></div>
            <div class="smart-box-dialog-inner">
                <i class="el-icon-circle-close"  style="color: #00fafe; position:absolute; top: 5%; right: 5%; cursor:pointer; margin-right: 10px;" @click.self="close"></i>
                <div class="smart-box-dialog-header">
                    <slot name="header" v-bind:title="Title">{{Title}}</slot>
                </div>
                <div class="smart-box-dialog-body" :style="getBodyStyles">
                    <slot v-bind:data="value"></slot>
                </div>
                <div ref="footer" class="smart-box-dialog-footer">
                    <slot name="footer" v-bind:data="value">
                    </slot>
                </div>
            </div>
            <div class="smart-box-dialog-linear">
                <hr />
                <i v-if="Type === 'popover'" class="el-icon-caret-bottom"></i>
            </div>
        </div>
    </div>
</template>
<script>
import { default as SmartBoxDialog } from './smartbox-dialog'
export default SmartBoxDialog
</script>
<style lang="scss" scoped>
    .smart-box-dialog-mask {
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 999;
        width: 100%;
        height: 100%;

        > .smart-box-dialog-window {
            min-height: 300px;
            min-width: 420px;
            background: 
                url(../../../assets/Images/smartbox-dialog-border-primary-top-left.png),
                url(../../../assets/Images/smartbox-dialog-border-primary-bottom-left.png),
                url(../../../assets/Images/smartbox-dialog-border-primary-top-right.png),
                url(../../../assets/Images/smartbox-dialog-border-primary-bottom-right.png),
                url(../../../assets/Images/smartbox-dialog-bg-primary.png);
            background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat;
            background-position: left top, left bottom, right top, right bottom, center center;
            background-size: 23px 23px, 28px 27px, 29px 29px, 29px 28px, 98% 95%;
            box-sizing: border-box;
            transition: all .6s linear;
            pointer-events: all;
            position: absolute;
            z-index: 999;

            &.wrong {
                background:
                    url(../../../assets/Images/smartbox-dialog-border-danger-top-left.png),
                    url(../../../assets/Images/smartbox-dialog-border-danger-bottom-left.png),
                    url(../../../assets/Images/smartbox-dialog-border-danger-top-right.png),
                    url(../../../assets/Images/smartbox-dialog-border-danger-bottom-right.png),
                    url(../../../assets/Images/smartbox-dialog-bg-danger.png);
                background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat;
                background-position: left top, left bottom, right top, right bottom, center center;
                background-size: 23px 23px, 28px 27px, 29px 29px, 29px 28px, 98% 95%;
                transition: all .6s linear;
            }

            > .smart-box-dialog-scrub {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: url(../../../assets/Images/dialog-scrub.png);
                background-size: 98% 95%;
                background-position: center center;
                background-repeat: no-repeat;
                z-index: 200;
                overflow:hidden;
            }

            &.wrong > .smart-box-dialog-scrub {
                background-image: url(../../../assets/Images/dialog-scrub-danger.png);
            }

            > .smart-box-dialog-inner {
                position:absolute;
                width: 100%;
                height: 100%;
                z-index: 201;
                pointer-events: all;
                overflow: hidden;
                z-index: 201;


                > .smart-box-dialog-header {
                    height: 60px;
                    padding: 20px;
                    color: #fff;
                    text-align: center;
                    background-image: url(../../../assets/Images/title_bg.png);
                    background-size: 60% 20px;
                    background-position: center bottom;
                    background-repeat: no-repeat;
                    box-sizing: border-box;
                }

                > .smart-box-dialog-body {
                    padding: 0px 20px;
                    box-sizing: border-box;
                    overflow: auto;
                }

                >.smart-box-dialog-footer {
                    text-align: center;
                    padding:10px 20px 30px 20px;
                    height: 80px;
                    box-sizing: border-box;
                }

            }

            &.wrong > .smart-box-dialog-linear {
                
                > hr {
                    border:1px solid #FF5C4D;
                }

                > i {
                    color : #FF5C4D;
                }
            }

            > .smart-box-dialog-linear {
                display: block;
                position: absolute;
                text-align: center;
                top: 100%;
                width: 100%;
                height: 40px;

                > hr {
                    width: 45%;
                    border:1px solid #00fafe;
                    margin-block-start: 0px;
                    margin-block-end: 0px;
                }

                > i {
                    //FF5C4D;
                    font-size: 24px;
                    color: #FF5C4D;
                }
            }
        }
    }
</style>
