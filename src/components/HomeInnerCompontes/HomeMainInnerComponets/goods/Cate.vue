<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="getParentCateList">添加分类</el-button>
      <!-- 表格区 -->
      <el-table
        :data="cateList"
        border
        style="width: 100%"
        stripe
        ref="cateRef"
        row-key="cat_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column label="是否有效">
          <!-- 状态列的作用域插槽 -->
          <template v-slot="scope">
            <div>
              <i
                v-if="scope.row.cat_deleted === true"
                class="el-icon-circle-check"
                style="color: #bfa"
              ></i>
              <i
                v-if="scope.row.cat_deleted === false"
                class="el-icon-circle-close"
                style="color: red"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <!-- 排序列的作用域插槽 -->
          <template v-slot="scope">
            <div>
              <el-tag type="success" v-if="scope.row.cat_level === 0"
                >一级</el-tag
              >
              <el-tag type="warning" v-if="scope.row.cat_level === 1"
                >二级</el-tag
              >
              <el-tag type="info" v-if="scope.row.cat_level === 2">三级</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 操作列的作用域插槽 -->
          <template v-slot="scope">
            <div>
              <!-- 编辑按钮 -->
              <el-tooltip content="编辑分类" placement="top" :enterable="false">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="getCateById(scope.row.cat_id)"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip content="删除分类" placement="top" :enterable="false">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="delCate(scope.row.cat_id)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(queryInfo.pagenum)"
        :page-sizes="[4, 6, 15]"
        :page-size="Number(queryInfo.pagesize)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="60%"
      @close="addCateDialogClosed"
    >
      <!-- 添加用户的表单区 -->
      <el-form
        :model="addCateForm"
        :rules="formRules"
        ref="addCateRef"
        label-width="80px"
      >
        <el-form-item label="分类名：" prop="cat_name">
          <el-input
            placeholder="请输入分类名"
            v-model="addCateForm.cat_name"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="parentCateChanged"
            clearable
            checkStrictly
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 添加分类的对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateSurely">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="60%"
      @close="editCateDialogClosed"
    >
      <!-- 编辑分类的表单区 -->
      <el-form
        :model="editCateForm"
        :rules="formRules"
        ref="editCateRef"
        label-width="80px"
      >
        <el-form-item label="分类名：" prop="cat_name">
          <el-input
            placeholder="请输入分类名"
            v-model="editCateForm.cat_name"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加分类的对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateSurely">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'goods-cate',
  data () {
    return {
      // 发起请求的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 6
      },
      // 接收到的商品分类数据
      cateList: [],
      // 总数据条数
      total: 0,
      // 添加分类的表单
      addCateForm: {
        cat_pid: '0',
        cat_name: '',
        cat_level: '0'
      },
      // 父分类列表
      parentCateList: [],
      // 选中的父级分类的ID数组
      selectedKeys: [],
      // 添加角色的对话框是否可见
      addCateDialogVisible: false,
      // 编辑角色的对话框是否可见
      editCateDialogVisible: false,
      // 编辑用户时的表单
      editCateForm: {},
      // 表单验证规则
      formRules: {
        cat_name: [
          { required: true, message: '分类名不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('请求商品分类失败，请检查网络！') }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听页面显示多少条数据的改变
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCateList()
    },
    // 监听页码值改变
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCateList()
    },
    // 编辑分类
    editCate (t) {
    },
    // 删除分类
    async delCate (cateId) {
      const confirmResult = await this.$confirm('确定删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((result) => result) // 返回可能的错误

      // confirm结果为确定 cancel结果为取消
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 发起删除请求并重新渲染数据
      const { data: res } = await this.$http.delete(`/categories/${cateId}`)
      if (res.meta.status !== 200) return this.message.error(res.meta.msg)
      this.getCateList()
      this.$message.success('删除成功')
    },
    // 确定添加分类
    addCateSurely () {
      // 表单预校验
      this.$refs.addCateRef.validate(async (validResult) => {
        if (!validResult) return this.$message.error('添加分类失败！请检查格式')
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) { return this.$message.error('添加分类失败，请检查网络') }
        this.addCateDialogVisible = false
        this.getCateList()
        this.$message.success('添加分类成功！')
      })
    },
    // 获取所有父级分类
    async getParentCateList () {
      this.addCateDialogVisible = true
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('请求商品分类失败，请检查网络！')
      this.parentCateList = res.data
    },
    // 选中的父级分类变化时
    parentCateChanged () {
      this.addCateForm.cat_level = this.selectedKeys.length
      this.addCateForm.cat_pid =
        this.selectedKeys.length === 0
          ? 0
          : this.selectedKeys[this.selectedKeys.length - 1]
    },
    // 添加分类对话框关闭后
    addCateDialogClosed () {
      this.addCateDialogVisible = false
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = '0'
      this.addCateForm.cat_level = '0'
    },
    // 根据ID查询分类
    async getCateById (cateId) {
      this.editCateDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${cateId}`)
      if (res.meta.status !== 200) return this.$message.error('请求商品分类失败，请检查网络！')
      this.editCateForm = res.data
    },
    // 确定编辑用户
    async editCateSurely () {
      const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
      if (res.meta.status !== 200) return this.$message.error('编辑分类失败，请检查格式！')
      this.getCateList()
      this.$message.success('编辑分类名成功！')
      this.editCateDialogVisible = false
    },
    // 编辑分类的表单关闭后
    editCateDialogClosed () {
      this.editCateDialogVisible = false
      this.$refs.editCateRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
