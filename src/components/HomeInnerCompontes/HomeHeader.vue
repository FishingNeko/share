<template>
  <div class="home-header">
    <div class="home-header-left">
      <div class="home-header-left-img">
        <img src="../../assets/MyNeko.jpg" alt="" />
      </div>
      <div class="home-header-left-title">
        <span>后台管理系统主页</span>
      </div>
    </div>
    <el-button type="info" @click="logout" class="logout-btn">登出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home-header',
  methods: {
    // 登出账号
    logout () {
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('activePath')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
@header-height: 60px;
@aside-width: 200px;
@font-size: 20px;

.home-header {
  background-color: #373d41;
  color: #fff;
  width: 100%;
  height: 100%;
  font-size: @font-size;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .home-header-left {
    line-height: @header-height;
    .home-header-left-img {
      position: absolute;
      width: @aside-width;
      height: @header-height;
      img {
        height: 100%;
        padding: 0;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .home-header-left-title {
      padding-left: @aside-width;
    }
  }
  .logout-btn {
    margin-right: 2%;
  }
}
</style>
