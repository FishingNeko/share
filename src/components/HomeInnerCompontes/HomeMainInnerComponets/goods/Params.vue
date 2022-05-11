<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 提示语区 -->
      <el-alert
        title="注意！只能选择三级分类的参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <span>请选择商品分类：</span>
      <!-- 级联选择框区 -->
      <el-cascader
        label="选择商品分类"
        v-model="selectedKeys"
        :options="CateList"
        :props="{
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
        }"
        @change="handleChange"
        clearable
        checkStrictly
      >
      </el-cascader>
      <!-- 标签页区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加{{ titleText }}</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyList" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <div>
                  <!-- 标签区 -->
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="tagClose(i,scope.row)"
                    >{{ scope.row.attr_vals[i] }}</el-tag
                  >
                  <!-- 添加框区 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="addTagRef"
                    size="small"
                    @keyup.enter.native="addTag(scope.row)"
                    @blur="addTag(scope.row)"
                  >
                  </el-input>
                  <el-button
                    class="input-new-tag"
                    v-else
                    size="small"
                    @click="showInput(scope.row)"
                    >+ 新标签</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template v-slot="scope">
                <div>
                  <el-button
                    class="el-icon-setting"
                    type="primary"
                    size="small"
                    @click="get(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    class="el-icon-delete"
                    type="danger"
                    size="small"
                    @click="delParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加{{ titleText }}</el-button
          >
          <!--静态属性 -->
          <el-table :data="onlyList" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <div>
                  <!-- 标签区 -->
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="tagClose(i,scope.row)"
                    >{{ scope.row.attr_vals[i] }}</el-tag
                  >
                  <!-- 添加框区 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="addTagRef"
                    size="small"
                    @keyup.enter.native="addTag(scope.row)"
                    @blur="addTag(scope.row)"
                  >
                  </el-input>
                  <el-button
                    class="input-new-tag"
                    v-else
                    size="small"
                    @click="showInput(scope.row)"
                    >+ 新标签</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              :label="titleText + '名称'"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template v-slot="scope">
                <div>
                  <el-button
                    class="el-icon-setting"
                    type="primary"
                    size="small"
                    @click="get(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    class="el-icon-delete"
                    type="danger"
                    size="small"
                    @click="delParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
    </el-card>
    <!-- 设置参数或属性的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClosed"
    >
      <!-- 设置参数或属性的表单区 -->
      <el-form
        :model="editForm"
        :rules="formRules"
        ref="editRef"
        label-width="80px"
      >
        <el-form-item label="名称：" prop="attr_name">
          <el-input
            placeholder="请输入名称"
            v-model="editForm.attr_name"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加参数或属性的对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSurely">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加参数或属性的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="addDialogVisible"
      width="60%"
      @close="editDialogClosed"
    >
      <!-- 添加参数或属性的表单区 -->
      <el-form
        :model="addForm"
        :rules="formRules"
        ref="addRef"
        label-width="80px"
      >
        <el-form-item label="名称：" prop="attr_name">
          <el-input
            placeholder="请输入名称"
            v-model="addForm.attr_name"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加参数或属性的对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSurely">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'goods-params',
  data () {
    return {
      // 分类列表
      CateList: [],
      // 选中的分类的id数组
      selectedKeys: [],
      // 选中的标签页
      activeName: 'many',
      //  动态参数
      manyList: [],
      //  静态属性
      onlyList: [],
      // 设置的对话框是否可见
      editDialogVisible: false,
      // 添加的对话框是否可见
      addDialogVisible: false,
      // 添加的表单
      addForm: {
        attr_name: ''
      },
      // 编辑的表单
      editForm: {},
      // 表单验证规则
      formRules: {
        attr_name: [
          { required: true, message: '该名不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 控制按钮禁用
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的分类的ID
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 对话框标题
    titleText () {
      if (this.activeName === 'many') {
        return '参数'
      }
      return '属性'
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { type: 3 })
      if (res.meta.status !== 200) {
        return this.$message.error('请求分类参数失败，请检查网络！')
      }
      this.CateList = res.data
    },
    // 获取参数列表
    async getParamsList () {
      // 选中非三级分类则清空列表与选中记录
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyList = []
        this.onlyList = []
        return null
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('请求分类参数失败，请检查网络！')
      }
      // 解决空字符串分割时 会生成包含一个空字符串的数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 为每一项添加以下两属性
        // 文本框是否可见
        item.inputVisible = false
        // 文本框的输入值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyList = res.data
      }
      if (this.activeName === 'only') {
        this.onlyList = res.data
      }
    },
    // 监听参数选中状态
    async handleChange (params) {
      this.selectedKeys = params
      this.getParamsList()
    },
    // 控制标签页的数据显示
    async handleClick () {
      this.getParamsList()
    },
    // 添加
    async addSurely () {
      // 表单预校验
      this.$refs.addRef.validate(async (validResult) => {
        if (!validResult) return this.$message.error('编辑失败！请检查格式')
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('编辑失败，请检查网络')
        }
        this.addDialogVisible = false
        this.getParamsList()
        this.$message.success('添加成功！')
      })
    },
    // 通过ID获取
    async get (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`
      )
      this.editForm = res.data
    },
    // 确定编辑
    async editSurely () {
      // 表单预校验
      this.$refs.editRef.validate(async (validResult) => {
        if (!validResult) return this.$message.error('编辑失败！请检查格式')
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败，请检查网络')
        }
        this.editDialogVisible = false
        this.getParamsList()
        this.$message.success('修改成功！')
      })
    },
    // 删除
    async delParams (paramsId) {
      const confirmResult = await this.$confirm('确定删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((result) => result) // 返回可能的错误

      // confirm结果为确定 cancel结果为取消
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 发起删除请求并重新渲染数据
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${paramsId}`
      )
      if (res.meta.status !== 200) return this.message.error(res.meta.msg)
      this.getParamsList()
      this.$message.success('删除成功')
    },
    // 编辑的对话框关闭
    addDialogClosed () {
      this.$resf.addRef.resetFields()
    },
    // 编辑的对话框关闭
    editDialogClosed () {
      this.editForm = {}
    },
    // 添加标签
    async addTag (row) {
      // 若输入内容不合法
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return null
      }
      // 若合法,将输入内容添加到attr_vals数组中
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      // 上传数据
      this.pushTagDate(row)
    },
    // 显示输入框
    showInput (row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick((_) => {
        this.$refs.addTagRef.$refs.input.focus()
      })
    },
    // 删除标签
    tagClose (i, row) {
      // 删除对应标签
      row.attr_vals.splice(i, 1)
      // 更新数据
      this.pushTagDate(row)
    },
    // 将标签的数据传到服务器
    async pushTagDate (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.toString()
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败，请检查网络！')
      }
      this.$message.success('操作成功！')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 0 10px;
}

.input-new-tag {
  margin-left: 5px;
  max-width: 120px;
}
</style>
