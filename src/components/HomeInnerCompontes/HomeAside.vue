<template>
  <div class="home-aside">
    <!-- 折叠栏 -->
    <div class="asideBtn">
      <el-button
        @click="asideCollapse"
        title="伸缩"
        :class="btnSelectType ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
      ></el-button>
    </div>
    <!-- 侧边栏 -->
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      :collapse="this.isCollapse"
      router
      :collapse-transition="false"
    >
      <!-- 一级菜单 -->
      <el-submenu
        :index="item.id.toString()"
        v-for="(item, i) in menuList"
        :key="item.id"
      >
        <template slot="title">
          <i :class="iconList[i]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item-group v-for="subitem in item.children" :key="subitem.id">
          <el-menu-item :index="subitem.path" @click="saveNavState(subitem.path)">
            <i class="el-icon-menu"></i>
            <span>{{ subitem.authName }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'home-aside',
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      // el-ui图标的类名
      iconList: ['el-icon-user', 'el-icon-set-up', 'el-icon-goods', 'el-icon-shopping-cart-full', 'el-icon-pie-chart'],
      // 侧边栏是否伸缩
      isCollapse: false,
      // 伸缩按钮的选中状态
      btnSelectType: false,
      // 保存点击侧边二级栏的路径
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 获取用户列表
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 侧边栏伸缩
    asideCollapse () {
      this.isCollapse = !this.isCollapse
      this.btnSelectType = !this.btnSelectType
      this.$emit('asideWidthChange', this.isCollapse)
    },
    // 保存侧边栏点击后的状态
    saveNavState (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu{
  overflow: hidden;
}

.asideBtn {
  text-align: center;
  background-color: #333744;
  border-top: 1px rgb(124, 122, 122) solid;
  border-bottom: 1px rgb(120, 116, 116) solid;
  display: flex;
  flex-direction:row-reverse;
  .el-button{
    width: 100%;
    background-color: #333744;
    border: none;
    color: #909399;
  }
}
.home-aside {
  width: 100%;
  height: 100%;
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
</style>
