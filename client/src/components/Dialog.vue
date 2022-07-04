<template>
    <div class="dialogue">
        <el-dialog :title="dialogue.title"
                   :visible.sync="dialogue.show"
                   :close-on-click-modal="false"
                   :modal-append-to-body="false">
            <div class="form">
                <el-form ref="form"
                         :model="formData"
                         :rules="form_rules"
                         label-width="120px"
                         style="margin:10px;width:auto;">
                    <el-form-item label="收支类型：">
                        <el-select v-model="formData.type" placeholder="收支类型">
                            <el-option v-for="(formtype, index) in format_type_list"
                                       :key="index"
                                       :label="formtype"
                                       :value="formtype">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="description" label="收支描述：">
                        <el-input type="description" v-model="formData.description"></el-input>
                    </el-form-item>
                    <el-form-item prop="income" label="收入：">
                        <el-input type="income" v-model="formData.income"></el-input>
                    </el-form-item>
                    <el-form-item prop="expense" label="支出：">
                        <el-input type="expense" v-model="formData.expense"></el-input>
                    </el-form-item>
                    <el-form-item prop="cash" label="账户现金：">
                        <el-input type="cash" v-model="formData.cash"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-form-item>
                    <el-form-item class="text_right">
                        <el-button @click="dialogue.show = false">取消</el-button>
                        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "dialogue",
        data() {
            return {
             
                format_type_list: [
                    "提现","手续费","管理费","充值","转账","优惠劵"
                ],
                form_rules: {
                    description: [
                        {
                            required: true, message: "收支描述不能为空", trigger: "blur"
                        }
                    ],
                    income: [
                        {
                            required: true, message: "收入不能为空！", trigger: "blur"
                        }
                    ],
                    expense: [
                        {
                            required: true, message: "支出不能为空！", trigger: "blur"
                        }
                    ],
                    cash: [
                        {
                            required: true, message: "账户现金不能为空！", trigger: "blur"
                        }
                    ]
                }
            }
        },
        props: {
            dialogue: Object,
            formData: Object
        },
        methods: {
            onSubmit(form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        //console.log(this.formData);
                        const msg = this.dialogue.option == 'add' ? "添加成功" : "修改成功";
                        const url = this.dialogue.option == 'add' ? 'add' : `edit/${this.formData.id}`;
                        this.$axios.post(`/api/profiles/${url}`, this.formData)
                            .then(res => {
                                this.$message({
                                    message: msg,
                                    type: "successs"
                                });
                                // 关闭对话框
                                this.dialogue.show = false;
                               // 刷新表格信息
                                this.$emit('update');
                            });
                    }
                })
            }
        }
    };
</script>

