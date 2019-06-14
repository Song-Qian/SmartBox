/**
 * Developer    :   SongQian
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   模态框窗口组件
 */
export default (function() {
    return {
        name : 'SmartBoxDialog',
        props : {
            //控制Dialog是否显示，隐藏，支持sync双向绑定。
            Show : {
                default : false,
                type : Boolean
            },
            //Dialog宽度自定义
            Width : {
                default : 'auto',
                type : Number | String
            },
            //Dialog高度自定义
            Height : {
                default : 'auto',
                type : Number | String
            },
            //dialog 和 popover两种模态框
            Type : {
                default : 'dialog',
                type : String
            },
            //模态框标题
            Title : {
                default :  '',
                type : String
            },
            //是否警告模态框
            Wrong : {
                default : false,
                type : Boolean
            },
            //模态窗的任意值
            value : {
                default : null
            },
            //是否隐藏头部
            HeaderShow : {
                default : true,
                type : Boolean
            },
            //是否隐藏脚部
            FooterShow : {
                default : true,
                type : Boolean
            },
            //是否点击遮罩层关闭Dialog
            IsClickMaskClose : {
                default : true,
                type: Boolean
            }
        },
        computed : {
            getMaskStyles() {
                let me = this;
                let position = me.Type === 'dialog' ?  'fixed' : 'relative';
                let backgroundColor = me.Type === 'dialog' ? 'rgba(2, 3, 31, .8)' : 'none';
                let pointerEvents = me.Type === 'dialog' ? 'all' : 'none';
                return { width : '100%', height: '100%', backgroundColor, position, pointerEvents };
            },
            getWindowStyles() {
                let me = this;
                let width = typeof me.Width === "number" ? `${me.Width}px` : me.Width;
                let height = typeof me.Height === "number" ? `${me.Height}px` : me.Height;
                let transform = me.Type === 'dialog' ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)';
                return { width, height, top : '50%', left: '50%', transform };
            },
            getBodyStyles() {
                let me = this;
                let hasAutoWidth = me.Width === 'auto';
                let hasAutoHeight = me.Height === 'auto';
                let tolerance = 0;
                tolerance += (me.HeaderShow && 60);
                tolerance += (me.FooterShow && 80);
                return { width : hasAutoWidth ? '100%' : me.width, height : hasAutoHeight ? `calc(300px - ${tolerance}px)` : `calc(100% - ${tolerance}px)`, overflow: hasAutoHeight ? 'auto' : 'hidden' };
            }
        },
        data() {
            return {
                
            }
        },
        methods : {
            close () {
                let me = this;
                me.$emit('update:show', false);
                me.$emit('closed');
            },
        }
    }
})()