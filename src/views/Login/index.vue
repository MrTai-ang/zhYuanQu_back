<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="ruleForm.username" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="ruleForm.password" type="password" />
        </el-form-item>

        <el-form-item prop="remember">
          <!-- 实现账号密码的自动填充 -->
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { loginAPI } from '@/api/user'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      rememberMe: false,
      ruleForm:
        {
          username: '',
          password: ''
        },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5, max: 10, message: '长度在5到10个字符', trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5, max: 10, message: '长度在5到10个字符', trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    // 提交时统一验证
    ...mapActions(['loginaction']),
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 不规范
          // const res = await loginAPI(this.ruleForm)
          // // console.log('res:', res)
          // this.$store.commit('user/setToken','123')

          await this.loginaction(this.ruleForm)
          // 在登录之后判断要不要保存账户密码
          if (this.rememberMe) {
            localStorage.setItem('form_key', JSON.stringify(this.ruleForm))
          } else {
            // 没勾选记住我
            localStorage.removeItem('form_key')
          }
          this.$router.push('/')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created() {
    // 数据回显\
    const loginData = localStorage.getItem('form_key')
    if (loginData) {
      this.ruleForm = JSON.parse(loginData)
    }
  }

}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
