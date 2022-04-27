<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addRoleDialogVisible = true"
        >添加角色</el-button
      >
      <el-table :data="rolesForm" border stripe>
        <el-table-column type="expand">
          <!-- 展开列的作用域插槽 -->
          <template v-slot="scope">
            <div class="el-row-box">
              <el-row
                v-for="(item, i) in scope.row.children"
                :key="item.id"
                :class="[i === 0 ? 'row-top' : '', 'row-bottom', 'center']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag @close="delRightById(scope.row, item1.id)" closable>{{
                    item.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级与三级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, i2) in item.children"
                    :key="item2.id"
                    :class="['center', i2 === 0 ? '' : 'row-top']"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        @close="delRightById(scope.row, item2.id)"
                        closable
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        @close="delRightById(scope.row, item3.id)"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <div>
              <!-- 编辑按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit-outline"
                size="small"
                @click="getRolesById(scope.row.id)"
                >编辑</el-button
              >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="delRoles(scope.row.id)"
                >删除</el-button
              >
              <!-- 分配权限按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="getRoleRightTree(scope.row)"
                >分配权限</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="60%"
    >
      <el-form :model="addRolesForm" ref="addRolesRef" :rules="formRules">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input
            v-model="addRolesForm.roleName"
            placeholder="请输入角色名"
            clearable
            @keyup.enter.native="addRoleSurely"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input
            v-model="addRolesForm.roleDesc"
            placeholder="请输入角色描述"
            clearable
            @keyup.enter.native="addRoleSurely"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSurely">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="60%"
    >
      <el-form :model="editRolesForm" ref="editRolesRef" :rules="formRules">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input
            v-model="editRolesForm.roleName"
            @keyup.enter.native="editRolesSurely"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px" prop="roleDesc">
          <el-input
            v-model="editRolesForm.roleDesc"
            @keyup.enter.native="editRolesSurely"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesSurely">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRoleRightDialogVisible"
      width="60%"
    >
    <!-- 权限树 -->
      <el-tree
        :data="setRoleRightForm"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleRightsSurely">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'home-roles',
  data () {
    return {
      // 存储角色的表单
      rolesForm: [],
      // 添加角色的暂存表单
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色的暂存表单
      editRolesForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 存储角色id,发起权限修改请求时使用
      roleId: '',
      // 默认选中的角色权限id数组
      defKeys: [],
      // 分配权限的数据表单
      setRoleRightForm: {},
      // 添加角色的对话框是否出现
      addRoleDialogVisible: false,
      // 编辑角色的对话框是否出现
      editRoleDialogVisible: false,
      // 分配权限对话框是否可见
      setRoleRightDialogVisible: false,
      // 表单的验证规则
      formRules: {
        roleName: [
          { required: true, message: '角色名不能为空！', trigger: 'blur' }
        ],
        roleDesc: []
      }
    }
  },
  created () {
    this.getRolesForm()
  },
  methods: {
    // 获取角色列表
    async getRolesForm () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesForm = res.data
    },

    // 添加角色
    addRoleSurely () {
      // 表单预校验
      this.$refs.addRolesRef.validate(async (validResult) => {
        if (!validResult) {
          return this.$message.error('添加角色失败，请检查格式！')
        }
        // 校验完毕发起添加请求并重新渲染数据
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addRoleDialogVisible = false
        this.getRolesForm()
        this.$message.success('添加角色成功!')
        // 重置暂存添加角色数据的表单
        this.addRolesForm = {
          roleName: '',
          roleDesc: ''
        }
      })
    },

    // 根据ID查询角色信息
    async getRolesById (userId) {
      this.editRoleDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${userId}`)
      this.editRolesForm = res.data
    },

    // 确定编辑角色信息
    editRolesSurely () {
      // 表单预校验
      this.$refs.editRolesRef.validate(async (validResult) => {
        if (!validResult) {
          return this.$message.error('修改角色失败，请检查格式！')
        }
        // 校验完毕发起添加请求并重新渲染数据
        const { data: res } = await this.$http.put(
          `roles/${this.editRolesForm.roleId}`,
          this.editRolesForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色失败！')
        }
        this.editRoleDialogVisible = false
        this.getRolesForm()
        this.$message.success('编辑角色成功！')
      })
    },

    // 根据用户ID删除用户
    async delRoles (userId) {
      const confirmResult = await this.$confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((result) => result) // 返回可能的错误

      // confirm结果为确定 cancel结果为取消
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 发起删除请求并重新渲染数据
      const { data: res } = await this.$http.delete(`/roles/${userId}`)
      if (res.meta.status !== 200) return this.message.error(res.meta.msg)
      this.getRolesForm()
      this.$message.success('删除成功')
    },

    // 根据id删除用户权限
    async delRightById (role, rightId) {
      const confirmResult = await this.$confirm('确定删除该权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((result) => result) // 返回可能的错误

      // confirm结果为确定 cancel结果为取消
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      // 发起删除请求并重新渲染数据
      const { data: res } = await this.$http.delete(
        `/roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.message.error(res.meta.msg)
      role.children = res.data
      this.$message.success('删除成功')
    },

    // 获取权限列表树
    async getRoleRightTree (role) {
      // 存储角色id，调用提交权限修改请求时使用
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      // 首先清空defKeys,再递归得出对应角色三级权限的id数组defKeys
      this.defKeys = []
      this.getLeafKeys(role, this.defKeys)
      this.setRoleRightDialogVisible = true
      this.setRoleRightForm = res.data
    },

    // 获取三级权限的id，并将其保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果节点是三级节点，将返回拼接后的节点id数组
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果节点非三级节点，则开始递归向下判断
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 确定为角色分配权限
    async addRoleRightsSurely () {
      // 获取所有全选和半选中权限的id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) this.$message.error('分配权限失败，请检查网络！')
      this.setRoleRightDialogVisible = true
      this.getRolesForm()
      this.$message.success('权限设置成功！')
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 8px;
}

.row-top {
  border-top: 4px #eee solid;
}

.row-bottom {
  border-bottom: 4px #eee solid;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-col-5{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
