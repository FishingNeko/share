<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 搜索框与添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="通过用户名搜索"
            class="input-with-select"
            clearable
            v-model="queryInfo.query"
            @keyup.enter.native="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 状态列的作用域插槽 -->
          <template v-slot="scope">
            <div>
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#409eff"
                @change="dataChange(scope.row)"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 操作列的作用域插槽 -->
          <template v-slot="scope">
            <div>
              <!-- 编辑按钮 -->
              <el-tooltip
                content="编辑信息"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="EditDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip
                content="删除用户"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="delUser(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <!-- 设置按钮 -->
              <el-tooltip
                content="设置角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="small"
                  @click="getRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(queryInfo.pagenum)"
        :page-sizes="[3, 6, 8]"
        :page-size="Number(queryInfo.pagesize)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="60%"
      @close="addDialogClosed()"
    >
      <!-- 添加用户的表单区 -->
      <el-form
        :model="addForm"
        :rules="formRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="姓名：" prop="username"
          ><el-input
            placeholder="请输入姓名"
            v-model="addForm.username"
            clearable
          >
          </el-input
        ></el-form-item>
        <el-form-item label="密码：" prop="password"
          ><el-input
            placeholder="请输入密码"
            v-model="addForm.password"
            clearable
          ></el-input
        ></el-form-item>
        <el-form-item label="邮箱：" prop="email"
          ><el-input
            placeholder="请输入邮箱"
            v-model="addForm.email"
            clearable
          ></el-input
        ></el-form-item>
        <el-form-item label="电话：" prop="mobile"
          ><el-input
            placeholder="请输入电话"
            v-model="addForm.mobile"
            clearable
            @keyup.enter.native="addUserSurely"
          ></el-input
        ></el-form-item>
      </el-form>
      <!-- 添加用户的对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSurely">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="60%"
    >
      <!-- 编辑用户信息的表单区 -->
      <el-form
        :model="editForm"
        :rules="formRules"
        ref="editFormRef"
        label-width="80px"
        @close="editDialogClosed()"
      >
        <el-form-item label="姓名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            v-model="editForm.mobile"
            @keyup.enter.native="editUserSurely"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSurely">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
    >
      <div>
        <p>用户信息：{{setRoleForm.username}}</p>
        <p>用户角色：{{setRoleForm.role_name}}</p>
        <span>分配新角色：</span>
      <el-select v-model="selectedRoleId" placeholder="请选择角色">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleSurely"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索的名字
        query: '',
        // 当前的页数
        pagenum: '1',
        // 每一页显示多少条数据
        pagesize: '6'
      },
      // 用户信息列表
      userList: [],
      // 所有角色列表
      roleList: [],
      // 总数据条数
      total: 0,
      // 选中的角色ID
      selectedRoleId: '',
      // 添加用户的对话框是否可见
      addDialogVisible: false,
      // 修改用户信息的对话框是否可见
      editDialogVisible: false,
      // 删除用户信息的对话框是否可见
      delDialogVisible: false,
      // 设置角色信息的对话框是否可见
      setRoleDialogVisible: false,
      // 添加用户的表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户信息的表单
      editForm: {},
      // 设置用户角色的表单
      setRoleForm: {},
      // 用户表单的验证规则
      formRules: {
        username: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6~15之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '联系电话不能为空！', trigger: 'blur' },
          {
            pattern:
              /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8,6]|8[0-9]|9[1,8,9])\d{8}$/,
            message: '请输入正确的号码格式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听页面显示多少条数据的改变
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },
    // 将用户状态修改后的信息提交到数据库中
    async dataChange (userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 修改失败则重置用户修改的状态数据
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新状态成功')
    },
    // 添加用户对话框关闭后重置addForm表单数据
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户对话框关闭后重置aditForm表单数据
    editDialogClosed () {
      this.$refs.aditFormRef.resetFields()
    },
    // 确定添加新用户
    addUserSurely () {
      // 发起请求前的validata校验
      this.$refs.addFormRef.validate(async (validResult) => {
        if (!validResult) return this.$message.error('添加失败，请检查格式')
        // 验证完毕后发起请求，并重新渲染数据
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
        this.$message.success('添加新用户成功！')
      })
    },
    // 确定编辑用户
    async editUserSurely () {
      this.$refs.editFormRef.validate(async (validResult) => {
        if (!validResult) return this.$message.error('编辑用户失败，请检查格式')
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功！')
      })
    },
    // 根据ID查询需要编辑的用户
    async EditDialog (userId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/users/' + userId)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    // 根据用户ID删除用户
    async delUser (userId) {
      const confirmResult = await this.$confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((result) => result) // 返回可能的错误

      // confirm结果为确定 cancel结果为取消
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 发起删除请求并重新渲染数据
      const { data: res } = await this.$http.delete(`/users/${userId}`)
      if (res.meta.status !== 200) return this.message.error(res.meta.msg)
      this.getUserList()
      this.$message.success('删除成功')
    },
    // 获取用户角色信息
    async getRole (userInfo) {
      this.setRoleDialogVisible = true
      this.setRoleForm = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取用户角色列表失败，请检查网络！')
      this.roleList = res.data
    },
    // 确定修改角色
    async setRoleSurely () {
      if (!this.selectedRoleId) {
        this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(`users/${this.setRoleForm.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.setRoleDialogVisible = false
      this.getUserList()
      this.$message.success('修改用户角色成功！')
      // 关闭后重置选中的用户的id与角色表单
      this.setRoleForm = {}
      this.roleList = []
    }
  }
}
</script>
<style lang="less" scoped></style>
