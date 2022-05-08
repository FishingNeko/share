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
      <!-- 搜索框与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @keyup.enter.native="searchGoods"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoodsPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <!-- 时间戳的作用域插槽 -->
          <template v-slot="scope">
            <div>
              <!-- 对返回的时间戳数据过滤处理 -->
              {{ scope.row.add_time | dataFormat }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <div>
              <el-button type="primary" class="el-icon-setting" size="small" @click="getGoodsById(scope.row.goods_id)"
                >编辑</el-button
              >
              <el-button type="danger" class="el-icon-delete" size="small" @click="delGoodsById(scope.row.goods_id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(queryInfo.pagenum)"
        :page-sizes="[2, 5, 10]"
        :page-size="Number(queryInfo.pagesize)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(total)"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods-goods',
  data () {
    return {
      // 搜索信息
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '5'
      },
      // 商品表格信息
      tableData: [],
      // 总商品条数
      total: '',
      // 添加商品的对话框是否可见
      addDialogVisible: false,
      // 添加商品的表单
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: ''
      },
      // 添加商品的对话框是否可见
      addGoodsDialogVisible: false,
      // // 表单验证规则
      formRules: {
        goods_name: [
          { required: true, message: '商品名不能为空！', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 通过ID搜索商品
    searchGoodsById () {},
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败，请检查网络！')
      }
      this.total = res.data.total
      this.tableData = res.data.goods
    },
    // 监听页面大小的改变
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 监听页面数的改变
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 搜索商品
    searchGoods () {
      this.getGoodsList()
    },
    // 通过ID查询商品信息
    getGoodsById (goodsId) {
      //  this.editDialogVisible = true
      //       const { data: res } = await this.$http.get(
      //         `categories/${this.cateId}/attributes/${id}`
      //       )
      //       this.editForm = res.data
    },
    // 通过ID删除商品
    async delGoodsById (goodsId) {
      const confirmResult = await this.$confirm('确定删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((result) => result) // 返回可能的错误

      // confirm结果为确定 cancel结果为取消
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 发起删除请求并重新渲染数据
      const { data: res } = await this.$http.delete(
        `goods/${goodsId}`
      )
      if (res.meta.status !== 200) return this.message.error(res.meta.msg)
      this.getGoodsList()
      this.$message.success('删除成功')
    },
    // 跳转到添加商品页
    goAddGoodsPage () {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style lang="less" scoped></style>
