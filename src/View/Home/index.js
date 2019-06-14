/**
 * Developer    :   SongQian
 * Time         :   2019/03/12
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   首页业务逻辑代码
 */
import { mapGetters, mapActions } from 'vuex'
import RESTFUL from '~/Scripts/Util/RestfulApi'

export default (function() {
    return {
        name : "Index",
        data() {
            return {
                isCollapse : false
            }
        },
        methods: {
            ...mapActions({
                'out' : 'User/out',
                'getId' : 'User/getId'
            })
        },
        mounted() {
        }
    }
}())