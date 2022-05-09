<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col :span="8">
        <!-- 搜索框 -->
        <el-input
          v-model="queryInfo.query"
          placeholder="请输入内容"
          clearable
          prefix-icon="el-icon-search"
          @keyup.enter.native="searchOrders"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchOrders"
          ></el-button> </el-input
      ></el-col>
      <el-col :span="16"></el-col>
    </el-row>
    <!-- 卡片区 -->
    <el-card>
      <!-- 表格区 -->
      <el-table :data="orderslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <!-- 是否付款的插槽 -->
          <template v-slot="scope">
            <div>
              <el-tag type="success" v-if="scope.row.pay_status === '1'"
                >已付款</el-tag
              >
              <el-tag type="danger" v-if="scope.row.pay_status === '0'"
                >未付款</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <!-- 下单时间的插槽 -->
          <template v-slot="scope">
            <div>
              {{ scope.row.create_time | dataFormat }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <!-- 操作列的插槽 -->
          <template v-slot="scope">
            <div>
              <!-- 编辑地址按钮 -->
              <el-tooltip content="编辑地址" placement="top" :enterable="false">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editOrders()"
                ></el-button>
              </el-tooltip>
              <!-- 物流信息按钮 -->
              <el-tooltip content="物流信息" placement="top" :enterable="false">
                <el-button
                  type="success"
                  icon="el-icon-setting"
                  size="small"
                  @click="showProgress(scope.row.order_id)"
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
        :page-sizes="[4, 6, 10, 15]"
        :page-size="Number(queryInfo.pagesize)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(total)"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑订单的对话框 -->
    <el-dialog
      title="编辑订单"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="formRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="fuzzyAddress">
          <el-cascader
            :options="cityData"
            v-model="editForm.fuzzyAddress"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="clearAddress">
          <el-input v-model="editForm.clearAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrdersSurely">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度的对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="60%"
      center
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressList"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  name: 'orders-orders',
  data () {
    return {
      // 查询信息
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '6'
      },
      // 订单列表
      orderslist: [],
      // 订单总数
      total: '',
      // 编辑订单的对话框是否可见
      editDialogVisible: false,
      // 物流进度的对话框是否可见
      progressDialogVisible: false,
      // 编辑订单的表单
      editForm: {
        fuzzyAddress: [],
        clearAddress: ''
      },
      // 物流信息的列表
      progressList: [],
      // 表单验证规则
      formRules: {
        fuzzyAddress: [{ required: true, message: '不能为空', trigger: 'blur' }],
        clearAddress: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 城市县区列表数据
      cityData: cityData,
      // 物流接口没了，使用静态假数据
      res: {
        data: [
          {
            time: '2018-05-10 09:39:00',
            ftime: '2018-05-10 09:39:00',
            context: '已签收,感谢使用顺丰,期待再次为您服务',
            location: ''
          },
          {
            time: '2018-05-10 08:23:00',
            ftime: '2018-05-10 08:23:00',
            context:
              '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
            location: ''
          },
          {
            time: '2018-05-10 07:32:00',
            ftime: '2018-05-10 07:32:00',
            context: '快件到达 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-10 02:03:00',
            ftime: '2018-05-10 02:03:00',
            context:
              '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-09 23:05:00',
            ftime: '2018-05-09 23:05:00',
            context: '快件到达 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 21:21:00',
            ftime: '2018-05-09 21:21:00',
            context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 13:07:00',
            ftime: '2018-05-09 13:07:00',
            context: '顺丰速运 已收取快件',
            location: ''
          },
          {
            time: '2018-05-09 12:25:03',
            ftime: '2018-05-09 12:25:03',
            context: '卖家发货',
            location: ''
          },
          {
            time: '2018-05-09 12:22:24',
            ftime: '2018-05-09 12:22:24',
            context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
            location: ''
          },
          {
            time: '2018-05-08 21:36:04',
            ftime: '2018-05-08 21:36:04',
            context: '商品已经下单',
            location: ''
          }
        ],
        meta: { status: 200, message: '获取物流信息成功！' }
      }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('订单列表请求失败，请检查网络！')
      }
      this.total = res.data.total
      this.orderslist = res.data.goods
      console.log(this.orderslist)
    },
    // 监听分页大小变化时
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getOrderList()
    },
    // 监听当前页码数
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getOrderList()
    },
    // 搜索商品
    searchOrders () {
      this.getOrderList()
    },
    // 编辑订单
    editOrders () {
      this.editDialogVisible = true
    },
    // 编辑完成订单
    editOrdersSurely () {
      this.$refs.editFormRef.validate((validResult) => {
        if (!validResult) return this.$message.error('格式错误，请检查表单！')
        this.editDialogVisible = false
        this.$message.success('编辑成功！')
      })
    },
    // 编辑的对话框关闭时
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.editform = {
        fuzzyAddress: [],
        clearAdress: ''
      }
    },
    // 显示物流进度
    async showProgress (rowId) {
      // const { data: res } = await this.$http.get(`/kuaidi/${rowId}`)
      // if (res.meta.status !== 200) return this.$message.error('物流信息请求失败，请检查网络！')
      // this.progressList = res.data

      // 数据接口已经停运，这里用静态假数据代替
      this.progressDialogVisible = true
      this.progressList = this.res.data
      console.log(this.progressList)
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-cascader {
  width: 100%;
}
</style>
