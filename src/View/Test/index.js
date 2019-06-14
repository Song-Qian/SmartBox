/**
 * Developer    :   SongQian
 * Time         :   2019/03/12
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   Test
 */
import moment from 'moment'
import _ from 'lodash'
import XLSX from 'xlsx'

export default (function() {
    return {
        name : "Test",
        data() {
            return {
                activeName : "first",
                page : 1,
                total : 1000,
                pageSize : 100,
                searching : false,
                dialogVisible : false,
                dialogTitle : '',
                search :  {
                    val : '',
                    type: ''
                },
                form : {
                    date : '',
                    name : '',
                    job : '',
                    city : '',
                    sex : '男',
                    zip : ''
                },
                rulesForm : {
                    date : [ { required: true, message: '请输入日期', trigger: 'blur' } ],
                    name : [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
                    job : [ { required: true, message: '请输入职业', trigger: 'blur' } ],
                    city : [ { required: true, message: '请输入城市', trigger: 'blur' } ]
                },
                data : new Array(1000).fill('').map(it => {
                    let i = Math.floor(Math.random() * 7);
                    return {
                        date : moment().format('YYYY-MM-DD HH:mm:ss'),
                        name : ['曹某某', '张某某', '李某某', '王某某', '唐某某', '刘某某', '陈某某', '卢某某', '郑某某', '毛某某'][Math.floor(Math.random() * 10)],
                        job : ['军人', '医生', '教师', '文员', '编辑', '演员', '播音员'][Math.floor(Math.random() * 7)],
                        city : ['哈尔滨', '敦煌', '西安', '西藏', '新疆', '上海', '北京'][i],
                        sex : ['男', '女'][Math.floor(Math.random() * 2)],
                        zip : ['150000', '736202', '710000', '850000', '830000', '200001', '100000'][i]
                    }
                })
            }
        },
        computed : {
            getDataTableList() {
                let me = this;
                let data = _.clone(me.data);
                if(me.search.val)
                    data = data.filter(it => it.name.indexOf(me.search.val) > -1);
                if(me.search.type)
                    data = data.filter(it => it.job.indexOf(me.search.type) > -1);
                me.total = _.size(data);
                return _.take(_.drop(data, (me.page - 1) * me.pageSize), me.pageSize);
            }
        },
        methods: {
            handleSave() {
                let me = this;
                let zip = { '哈尔滨' : '150000', '敦煌' : '736202', '西安' : '710000', '西藏' : '850000', '新疆' : '830000', '上海' : '200001', '北京' : '100000' };
                me.data.push({ ...me.form, zip : zip[me.form.city] });
                me.handleClose();
            },
            handleEdit(data) {
                let me = this;
                me.dialogVisible = true;
                me.dialogTitle = "修改数据";
                me.form = data;
            },
            handleClose() {
                let me = this;
                me.dialogVisible = false;
                me.$refs.ruleForm.resetFields();
                me.$refs.ruleForm.clearValidate();
            },
            handleDownExcel() {
                let me = this;
                let wb = XLSX.utils.book_new();
                debugger
                let data = me.getDataTableList.map(it => ([it.date, it.name, it.job, it.city, it.sex, it.zip ]));
                let ws = XLSX.utils.aoa_to_sheet([['日期', '姓名', '职业', '城市', '性别', '邮编'], ...data]);
                XLSX.utils.book_append_sheet(wb, ws, 'SmartBox 数据导出测试');
                XLSX.writeFile(wb, `SmartBox 数据导出测试.xlsx`);
            },
            handleInputSearch() {
                let me = this;
                me.searching = true;
                me.__debounceAsyncSearch();
            },
            handleSearch() {
                let me = this;
                me.searching = false;
            },
            handleSizeChange(val) {
                let me = this;
                me.pageSize = val;
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                let me = this;
                me.page = val;
                console.log(`当前页: ${val}`);
            }
        },
        mounted() {
            let me = this;
            me.__debounceAsyncSearch = _.debounce(me.handleSearch, 500);
        }
    }
}())