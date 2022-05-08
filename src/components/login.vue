<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/MyNeko.jpg" alt="" />
      </div>
      <!-- 表单区 -->
      <el-form
        :rules="loginFormRules"
        label-width="60px"
        class="login_form"
        :model="loginForm"
        ref="loginFormRef"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            placeholder="请输入账号"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
            autofocus
            clearable
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            show-password
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'log-in',
  data () {
    return {
      // 储存的登录表单数据
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入账号' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单数据
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录后的路由判断
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 后端返回的结果是promise对象，故用async-await并结构数据
        if (valid) {
          // valid判断用户输入的格式决定是否发起请求
          const { data: res } = await this.$http.post('login', this.loginForm)
          // 登录失败
          if (res.meta.status !== 200) {
            return this.$message.error('账号或密码错误')
          }
          // 登录成功
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } else {
          return 0
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@login-box-height: 450px;
@login-box-width: 300px;
@avatar-box-height: 130px;
@avatar-box-width: 130px;
@avatar-box-border-color: #2b4b6b;

.login_container {
  height: 100%;
  // background-image: url(../assets/backgroundIMG.svg);
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.2)
    ),
    url(../assets/backgroundIMG.svg);
  .login_box {
    width: @login-box-height;
    height: @login-box-width;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: @avatar-box-width;
      height: @avatar-box-height;
      border: 1px solid @avatar-box-border-color;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -160%);
      img {
        height: 85%;
        width: 100%;
      }
    }
    .login_form {
      width: 95%;
      position: absolute;
      bottom: 0;
      .btns {
        display: flex;
        justify-content: right;
      }
    }
  }
}
</style>
