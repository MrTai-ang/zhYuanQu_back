<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="id?'编辑月卡':'增加月卡'" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="carInfoForm" label-width="100px" :model="carInfoForm" :rules="carInfoRules">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeInfoForm" label-width="100px" :model="form" :rules="carInfoRules2">

            <el-form-item label="有效日期" required>
              <el-col :span="11">
                <el-form-item prop="cardStartDate">
                  <el-date-picker v-model="form.cardStartDate" format="yyyy/MM/dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">至</el-col>
              <el-col :span="11">
                <el-form-item prop="cardEndDate">
                  <el-date-picker v-model="form.cardEndDate" format="yyyy/MM/dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="form.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="form.paymentMethod">
                <el-option
                  v-for="item in paymentList"
                  :key="item.vindustryCode"
                  :value="item.vindustryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addCardAPI, getCardDetailAPI, editCardAPI } from '@/api/card'
export default {
  name: 'AddMonthCard',
  data() {
    return {
    // 第一个表单
      carInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      carInfoRules: {
        personName: [{ required: true, message: '车主姓名不可为空', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '联系方法不可为空', trigger: 'blur' }, {
          // 正则校验
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        carNumber: [{ required: true, message: '车牌号码不可为空', trigger: 'blur' },
          // 自定义校验 validator:校验方法,不用配置message
          { validator: this.validatorCarNumber, trigger: 'blur' }
        ],
        carBrand: [{ required: true, message: '车辆品牌不可为空', trigger: 'blur' }]
      },

      // 第二个表单
      form: {
        paymentMethod: '',
        cardStartDate: '',
        cardEndDate: '',
        paymentAmount: ''
      },
      carInfoRules2: {
        paymentMethod: [{ required: true, message: '不可为空', trigger: 'blur' }],
        cardStartDate: [{ required: true, message: '不可为空', trigger: 'blur' }],
        cardEndDate: [{ required: true, message: '不可为空', trigger: 'blur' }],
        paymentAmount: [{ required: true, message: '不可为空', trigger: 'blur' }]

      },

      paymentList: [
        { industryName: '支付宝', vindustryCode: 'Alipay' },
        { industryName: '微信', vindustryCode: 'WeChat' },
        { industryName: '银行卡', vindustryCode: 'Cash' }
      ]
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    if (this.id) {
      this.getCardDetail()
    }
  },
  methods: {

    async getCardDetail() {
      const { data } = await getCardDetailAPI(this.id)
      console.log('data:', data)
      const { personName, phoneNumber, carNumber, carBrand, carInfoId, rechargeId, paymentMethod, cardStartDate, cardEndDate, paymentAmount } = data
      this.carInfoForm = { personName, phoneNumber, carNumber, carBrand, carInfoId, rechargeId }

      this.form = { paymentMethod, cardStartDate, cardEndDate, paymentAmount }
    },
    // rule value callback
    validatorCarNumber(rule, value, callback) {
      const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
      if (plateNumberRegex.test(value)) {
        callback()
      } else {
        callback(new Error('车牌号格式不正确'))
      }
    },
    confirmAdd() {
      this.$refs.carInfoForm.validate((flag) => {
        if (!flag) return
        this.$refs.feeInfoForm.validate(async(flag) => {
          if (!flag) return
          const requestData = { ...this.carInfoForm, ...this.form }
          if (this.id) {
            await editCardAPI(requestData)
            this.$message.success('月卡编辑成功')
          } else {
            await addCardAPI(requestData)
            this.$message.success('月卡添加成功')
          } this.$router.back()
        })
      })
    },
    resetForm() {
      this.$refs.carInfoForm.resetFields()
      this.$refs.feeInfoForm.resetFields()
    }
  }

}
</script>

  <style scoped lang="scss">
  .add-card {
    background-color: #f4f6f8;
    height: 100vh;

    .add-header {
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 64px;
      background-color: #fff;

      .left {
        span {
          margin-right: 4px;
        }
        .arrow{
          cursor: pointer;
        }
      }

      .right {
        text-align: right;
      }
    }

    .add-main {
      background: #f4f6f8;
      padding: 20px 130px;

      .form-container {
        background-color: #fff;

        .title {
          height: 60px;
          line-height: 60px;
          padding-left: 20px;
        }

        .form {
          margin-bottom: 20px;
          padding: 20px 65px 24px;

          .el-form {
            display: flex;
            flex-wrap: wrap;

            .el-form-item {
              width: 50%;
            }
          }
        }
      }
      .preview{
        img{
          width: 100px;
        }
      }
    }

    .add-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 24px 50px;
      color: #000000d9;
      font-size: 14px;
      background: #fff;
      text-align: center;
    }
  }
  </style>
