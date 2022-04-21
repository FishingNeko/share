<template>
  <div><el-button type="info" @click="logout">登出</el-button></div>
</template>

<script>
export default {
  name: 'store-home',
  methods: {
    // 登出账号
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
