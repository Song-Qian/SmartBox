/**
 * Developer    :   SongQian
 * Time         :   2019/03/12
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   测试代码
 */
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import _ from 'lodash'
import RESTFULAPI from '~/Scripts/Util/RestfulApi'

export default (function() {
    return {
        name : "Console",
        props : {
            id : {
                default : "0",
                type : String
            }
        },
        data() {
            return {
                val : '',
                icon : 'el-icon-edit',
                show : true,
                data : {
                    name : 'consonle',
                    result : {
                        a : 1,
                        b : 2
                    }
                },
                result : [1, 2, 3, 4, 5, 6, 7]
            }
        },
        computed : {
            getVal() {
                return this.val;
            }
        },
        methods: {
            async setVal() {
                let me = this;
                me.show = !me.show;
                // me.changeValue(me.val);
                // me.result.filter(it => it < 5);
                // me.val = 'click me';
                //RequestParam(name='xxx')User user
                // let res = await me.$http.post(RESTFULAPI.injective.Api.Console.Save, {
                    // params : {
                        // name : 'xxx',
                        // age : 12
                    // }
                // }, {
                    // emulateJSON : false,
                    // emulateHTTP : true
                // });
                //Arrar
                //Map、 Set
                // *[Symbol.iterator]() {
                //     for(let el of this.elements)
                //         yield el;
                // } 
                // let list = new List();
                // list.push('a');
                // list.push('b');
                // list.push('c');
                // list.push('d');
                // list.push('e');
                // console.log(...list);
               
                // let total = me.result.reduce((sum,  next) => sum + next);
                // me.call((num) => {
                //     console.log('me test call' + num);
                // })
                // console.log(total);
                // let { ...a } = me.data;
                //let [a,b, ...c] = me.result;
                // console.log(a);

            },

            handlerChange(val) {
                let me = this;
                me.icon = 'el-icon-loading';
                me.__stopChange();
            },
            stopChange() {
                let me = this;
                me.icon = 'el-icon-edit';
            },

            // call(fn){
            //     if(typeof fn === 'function') {
            //         fn.call(null, 111);
            //     }
            // },
            ...mapActions({
                'changeValue' : 'Console/changeValue'
            })
        },
        mounted() {
            let me = this;
            me.__stopChange = _.debounce(me.stopChange, 500);
        }
    }
}())