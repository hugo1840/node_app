<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true" ref="add_data" :model="search_data">
                <el-form-item label="按时间筛选">
                    <el-date-picker v-model="search_data.startTime"
                                    type="datetime"
                                    placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker v-model="search_data.endTime"
                                    type="datetime"
                                    placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               size="small"
                               icon="search"
                               @click="handleSearch()">筛选</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button type="primary"
                               size="small"
                               icon="view"
                               v-if="user.identity == 'manager'"
                               @click="handleAdd()">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table v-if="tableData.length > 0"
                      :data="tableData"
                      max-height="450"
                      border
                      style="width: 100%">
                <el-table-column type="index"
                                 label="序号"
                                 align="center"
                                 width="70">
                </el-table-column>
                <el-table-column prop="date"
                                 label="创建时间"
                                 align="center"
                                 width="240">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type"
                                 label="收支类型"
                                 align='center'
                                 width="150">
                </el-table-column>
                <el-table-column prop="description"
                                 label="收支描述"
                                 align='center'
                                 width="200">
                </el-table-column>
                <el-table-column prop="income"
                                 label="收入"
                                 align='center'
                                 width="110">
                    <template slot-scope="scope">
                        <span style="color: #00d053">{{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="expense"
                                 label="支出"
                                 align='center'
                                 width="110">
                    <template slot-scope="scope">
                        <span style="color: #f56767">{{ scope.row.expense }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cash"
                                 label="账户现金"
                                 align='center'
                                 width="110">
                    <template slot-scope="scope">
                        <span style="color: #4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark"
                                 label="备注"
                                 align='center'
                                 width="220">
                </el-table-column>
                <el-table-column prop="operation"
                                 align="center"
                                 fixed="right"
                                 width="180"
                                 label="操作"
                                 v-if="user.identity == 'manager'">
                    <template slot-scope="scope">
                        <el-button size="small"
                                   icon="edit"
                                   @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small"
                                   icon="delete"
                                   type="danger"
                                   @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination @size-change="handleSizeChange"
                                       @current-change="handleCurrentChange"
                                       :current-page="paginations.page_index"
                                       :page-sizes="paginations.page_sizes"
                                       :page-size="paginations.page_size"
                                       :layout="paginations.layout"
                                       :total="paginations.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>

        <Dialog :dialogue="dialogue" :formData="formData" @update="getProfile"></Dialog>
    </div>
</template>

<script>
    import Dialog from '../components/Dialog';
    export default {
        name: "fundList",
        components: {
            Dialog
        },
        data() {
            return {
                search_data: {
                    startTime: "",
                    endTime: ""
                },
                paginations: {
                    page_index: 1, //当前页面
                    total: 0,      //总页数
                    page_size: 5,  //每页显示的记录条数
                    page_sizes: [5, 10, 15, 20],  //可选择的page_size范围
                    layout: "total, sizes, prev, pager, next, jumper"  //翻页属性
                },
                tableData: [],
                allTableData: [],
                filterTableData: [],
                formData: {
                    type: "",
                    description: "",
                    income: "",
                    expense: "",
                    cash: "",
                    remark: "",
                    id: ""
                },
                dialogue: {
                    show: false,
                    title: '',
                    option: 'edit'
                }
            };
        },
        computed: {
            user() {
                return this.$store.getters.user;
            }
        },
        created() {
            this.getProfile();
        },
        methods: {
            getProfile() {
                this.$axios.get('/api/profiles')
                    .then(res => {
                        this.allTableData = res.data;
                        this.filterTableData = res.data;
                        //设置分页数据
                        this.setPaginations();
                    })
                    .catch(err => console.log(err));
            },
            handleSearch() {
                if (!this.search_data.startTime || !this.search_data.endTime) {
                    this.$message({
                        type: "warning",
                        message: "请选择时间区间"
                    });
                    this.getProfile();
                    return;
                }

                const start_t = this.search_data.startTime.getTime();
                const end_t = this.search_data.endTime.getTime();
                this.allTableData = this.filterTableData.filter(item => {
                    //console.log(item);
                    let datee = new Date(item.date);
                    let timee = datee.getTime();
                    return timee >= start_t && timee <= end_t;
                });

                this.setPaginations();
            },
            handleEdit(index, row) {
                //console.log("HANDLE EDIT");
                this.dialogue = {
                    show: true,
                    title: "修改资金信息",
                    option: "edit"
                };
                this.formData = {
                    type: row.type,
                    description: row.description,
                    income: row.income,
                    expense: row.expense,
                    cash: row.cash,
                    remark: row.remark,
                    id: row._id
                };
            },
            handleDelete(index, row) {
                //console.log("HANDLE DELETE");
                this.$axios.delete(`/api/profiles/delete/${row._id}`)
                    .then(res => {
                        this.$message("删除成功");
                        this.getProfile();
                    })
            },
            handleAdd() {
                //console.log("HANDLE ADD");
                this.dialogue = {
                    show: true,
                    title: "添加资金信息",
                    option: "add"
                };
                this.formData = {
                    type: '',
                    description: '',
                    income: '',
                    expense: '',
                    cash: '',
                    remark: '',
                    id: ''
                };
            },
            handleSizeChange(page_size) {
                this.paginations.page_index = 1;
                this.paginations.page_size = page_size;
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < page_size;
                });
            },
            handleCurrentChange(page) {
                let index = this.paginations.page_size * (page - 1);
                let nums = this.paginations.page_size * page;
                let tables = [];   // 存储跳转页面要显示的记录

                for (let i = index; i < nums; i++) {
                    if (this.allTableData[i]) {
                        tables.push(this.allTableData[i]);
                    }
                    this.tableData = tables;
                }
            },
            setPaginations() {
                this.paginations.total = this.allTableData.length;
                this.paginations.page_index = 1;
                this.paginations.page_size = 5;
                //设置默认的分页数据
                this.tableData = this.allTableData.filter((item, index) => {
                    return index < this.paginations.page_size;
                });
            }
        }
    }

</script>

<style scoped>
    .fillContainer {
        width: 100%;
        height: 100%;
        padding: 16px;
        box-sizing: border-box;
    }

    .btnRight {
        float: right;
    }

    .pagination {
        text-align: right;
        margin-top: 10px;
    }
</style>