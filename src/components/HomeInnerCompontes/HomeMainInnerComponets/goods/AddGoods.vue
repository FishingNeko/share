<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert
        :title="titleText"
        center
        show-icon
        type="info"
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区 -->
      <el-steps
        :space="200"
        :active="succeedStep - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单区 -->
      <el-form
        :model="addGoodsForm"
        :rules="formRules"
        ref="addFormRef"
        label-width="145px"
      >
        <!-- tab面板区 -->
        <el-tabs
          tab-position="left"
          v-model="succeedStep"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 商品名称栏 -->
            <el-form-item label="商品名称：" prop="goods_name">
              <el-input
                v-model="addGoodsForm.goods_name"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <!-- 商品价格栏 -->
            <el-form-item label="商品价格：" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
                placeholder="请输入商品价格"
              ></el-input>
            </el-form-item>
            <!-- 商品重量栏 -->
            <el-form-item label="商品重量：" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
                placeholder="请输入商品重量,单位为kg"
              ></el-input>
            </el-form-item>
            <!-- 商品数量栏 -->
            <el-form-item label="商品数量：">
              <el-slider
                v-model="addGoodsForm.goods_number"
                show-input
                :min="1"
                :max="999"
              >
              </el-slider>
            </el-form-item>
            <!-- 级联选择框 -->
            <el-form-item label="商品分类：" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                clearable
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数列 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name + '：'"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                  :checked="false"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性列 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 上传图片列  -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :headers="this.headersObj"
              :on-success="upLoadSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 文本描述栏 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodsForm.goods_introduce"
              placeholder="在此添加商品描述"
            >
            </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
      center
    >
      <img :src="previewUrl" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'add-goods',
  data () {
    return {
      flag: false,
      // 提示区标题
      titleText: '添加商品信息',
      // 完成的步骤索引
      succeedStep: '0',
      // 上传图片的url路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 添加商品的表单
      addGoodsForm: {
        goods_name: '', // 商品名
        goods_cat: [], // 级联选择框的选中的ID数组
        goods_price: '', // 商品价格
        goods_number: 1, // 商品数量
        goods_weight: '', // 商品重量
        goods_introduce: '', // 商品介绍
        pics: [], // 商品图片
        attrs: [] // 商品描述
      },
      // 商品分类查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 6
      },
      // 商品分类列表
      cateList: [],
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传的图片列表
      fileList: [],
      // 上传图片的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览的路径
      previewUrl: '',
      // 预览图片的对话框是否可见
      previewDialogVisible: false,
      // 表单的验证规则
      formRules: {
        goods_name: [
          { required: true, message: '商品名不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '商品分类不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 三级商品分类的ID
    cateId () {
      return this.addGoodsForm.goods_cat[2]
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
      if (res.meta.status !== 200) {
        return this.$message.error('请求商品分类失败，请检查网络！')
      }
      this.cateList = res.data.result
    },
    // 级联选择器列表变化时
    handleChange (arr) {
      this.addGoodsForm.goods_cat = arr
    },
    // tab栏切换前的判断
    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && !this.cateId) {
        this.$message.error('请填写正确格式的完整表单！')
        return false
      }
    },
    // 表单校验的回调函数
    valid () {},
    // 标签页切换时
    async tabClicked () {
      // 切换到第二栏时
      if (this.succeedStep === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('请求商品参数失败，请检查网络！')
        }
        res.data.forEach((item) => {
          if (item.attr_vals) {
            item.attr_vals = item.attr_vals.split(',')
          }
        })
        this.manyTableData = res.data
      }
      // 切换到第三栏时
      if (this.succeedStep === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('请求商品属性失败，请检查网络！')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理预览图片
    handlePreview (file) {
      console.log(1)
      this.previewDialogVisible = true
      this.previewUrl = file.response.data.url
    },
    // 处理删除图片
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      console.log(filePath)
      // 找到所删除图片的对应路径
      const i = this.addGoodsForm.pics.findIndex(
        (item) => item.pics === filePath
      )
      console.log(i)
      this.addGoodsForm.pics.splice(i, 1)
      console.log(this.addGoodsForm)
    },
    // 文件上传成功时
    upLoadSuccess (response) {
      // 1.拼接得到信息对象
      const picObj = { pics: response.data.tmp_path }
      // 2.添加到表单中
      this.addGoodsForm.pics.push(picObj)
      console.log(this.addGoodsForm)
    },
    // 添加商品
    async addGoods () {
      // 格式处理
      this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',')
      this.manyTableData.forEach(item => {
        const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals.join(' ') }
        this.addGoodsForm.attrs.push(newInfo)
      })
      this.onlyTableData.forEach(item => {
        const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
        this.addGoodsForm.attrs.push(newInfo)
      })
      // 发起添加请求
      const { data: res } = await this.$http.post('goods', this.addGoodsForm)
      console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加失败，请检查网络！')
      this.$message.success('添加商品成功！')
      this.$router.push('/home/goods')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs--left {
  margin: 20px auto;
}

.el-checkbox {
  margin: 0 1% 0 0 !important;
}
</style>
