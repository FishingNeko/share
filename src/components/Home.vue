<template>
  <div class="home-container">
    <el-container>
      <!-- 头部区 -->
      <el-header>
        <HomeHeader></HomeHeader>
      </el-header>
      <el-container>
        <!-- 侧边栏区 -->
        <el-aside :width="isCollapse ? asideWidthSlow+'px' : asideWidth+'px'">
          <HomeAside @asideWidthChange="this.getAsideWidthChange"></HomeAside>
        </el-aside>
        <!-- 主体区 -->
        <el-main>
          <HomeMain></HomeMain>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HomeHeader from '@/components/HomeInnerCompontes/HomeHeader.vue'
import HomeAside from '@/components/HomeInnerCompontes/HomeAside.vue'
import HomeMain from '@/components/HomeInnerCompontes/HomeMain.vue'
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
    HomeMain,
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
  overflow: hidden;
}

.el-header{
  padding: 0;
}

.el-aside{
  transition: width .3s;
}

.el-container {
  height: 100%;
}
</style>
