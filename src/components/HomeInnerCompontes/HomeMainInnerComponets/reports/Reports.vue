<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <div class="container">
        <!-- 图表显示区 -->
        <div id="main"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'reports-reports',
  data () {
    return {
      // 折线图的设置
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () {
    // 获取dom容器
    const myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')

    // 指定配置数据
    const option = Object.assign(this.options, res.data)

    // 渲染
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
}

#main {
  width: 80%;
  height: 600px;
  margin: 10px auto;
}
</style>
