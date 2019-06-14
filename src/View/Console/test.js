/**
 * Developer    :   SongQian
 * Time         :   2019/03/12
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   测试代码
 */

import { mapGetters } from 'vuex'

export default (function() {
    return {
        name : "CTest",
        data() {
            return {
            }
        },
        computed : {
            ...mapGetters({
                'getValue' : 'Console/getValue'
            })
        },
        methods: {
        }
    }
}())