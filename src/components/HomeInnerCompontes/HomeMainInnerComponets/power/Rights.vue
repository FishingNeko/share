<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 表格区 -->
      <el-table :data="rightsForm" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
        ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column label="权限等级" >
          <!-- 权限等级的作用域插槽 -->
          <template v-slot="scope">
            <div>
              <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
              <el-tag v-if="scope.row.level === '1'" type="success">等级二</el-tag>
              <el-tag v-if="scope.row.level === '2'" type="info">等级三</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'home-rights',
  data () {
    return {
      // 权限列表表单
      rightsForm: []
    }
  },
  created () {
    this.getRightsForm()
  },
  methods: {
    // 获取用户权限列表
    async getRightsForm () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsForm = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>
