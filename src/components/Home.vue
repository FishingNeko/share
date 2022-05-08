<template>
    <el-container class="home-container">
      <!-- 头部区 -->
      <el-header>
        <HomeHeader></HomeHeader>
      </el-header>
      <el-container>
        <!-- 侧边栏区 -->
        <el-aside
          :width="isCollapse ? asideWidthSlow + 'px' : asideWidth + 'px'"
        >
          <HomeAside @asideWidthChange="this.getAsideWidthChange"></HomeAside>
        </el-aside>
        <!-- 主体区 -->
        <el-main>
          <!-- home-main区，组件的切换主要在此显示 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import HomeHeader from '@/components/HomeInnerCompontes/HomeHeader.vue'
import HomeAside from '@/components/HomeInnerCompontes/HomeAside.vue'

export default {
  name: 'store-home',
  data () {
    return {
      // 侧边栏是否伸缩
      isCollapse: false,
      // 侧边栏原来的宽度
      asideWidth: 200,
      // 侧边栏收缩后的宽度
      asideWidthSlow: 64
    }
  },
  components: {
    HomeAside,
    HomeHeader
  },
  methods: {
    // 获取子组件传来的伸缩标志
    getAsideWidthChange (val) {
      this.isCollapse = val
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  padding: 0;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
}

.el-aside {
  transition: width 0.3s;
}
.el-main{
  background-color: #eaedf1;
}
</style>
