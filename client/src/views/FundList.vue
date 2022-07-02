<template>
    <div class="fillContainer">

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
                             label="操作">
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
    </div>
</template>

<script>
    export default {
        name: "fundList",
        data() {
            return {
                tableData: []
            };
        },
        created() {
            this.getProfile();
        },
        methods: {
            getProfile() {
                this.$axios.get('/api/profiles')
                    .then(res => {
                        this.tableData = res.data;
                    })
                    .catch(err => console.log(err));
            },
            handleEdit(index, row) {
                console.log("HANDLE EDIT");
            },
            handleDelete(index, row) {
                console.log("HANDLE DELETE");
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