<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in statusList" :key="item.value" :label="item.text" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="addMonthCard">添加月卡</el-button>
      <el-button @click="batchDelete">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        />
        <!-- type=index 序号从0开始 -->
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <!-- scope是作用域插槽，可以获取变量 -->
            <el-button size="mini" type="text" @click="editCard(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteCard(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        :page-sizes="[2, 4, 5, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog
      title="添加楼宇"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardLsitAPI, delteCardAPI } from '@/api/card'
export default {
  data() {
    return {
      params: {
        page: 1,
        pageSize: 2,
        carNumber: '',
        personName: '',
        cardStatus: null // axios机制，如果这个参数值为null会自动忽略这个值，不携带到服务端
      },
      list: [],
      total: 0,
      statusList: [{ text: '全部', value: null }, { text: '可用', value: '0' }, { text: '已过期', value: '1' }],
      multipleSelection: []
    }
  },
  created() {
    this.getCardList()
  },

  methods: {
    editCard(id) {
      console.log('id', id)
      this.$router.push({
        path: '/car/addMonthCard',
        query: { id }
      })
    },
    addMonthCard() {
      this.$router.push('/car/addMonthCard')
    },
    // 计算序号
    indexMethod(index) {
      return index + this.params.pageSize * (this.params.page - 1) + 1
    },

    // formatter	用来格式化内容是el-table-column的属性
    formatStatus(row, column, cellValue, index) {
      const Map = {
        0: '可用',
        1: '不可用'
      }
      return Map[cellValue]
    },
    // 点击查询按钮
    search() {
      this.params.page = 1
      this.getCardList()
    },

    async getCardList() {
      // console.log('ceshi')
      const res = await getCardLsitAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.params.pageSize = val
      this.getCardList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.params.page = val
      this.getCardList()
    },
    handleSelectionChange(val) {
      console.log('val:', val)
      this.multipleSelection = val
    },
    batchDelete() {
      if (this.multipleSelection.length <= 0) {
        this.$message.warning('请先选择要删除的数据')
        return
      }
      this.$confirm('您确定要删除这些数据吗', '温馨提示').then(async() => {
        const ids = this.multipleSelection.map(item => item.id).toString()
        await delteCardAPI(ids)
        this.$message.success('批量删除成功')
        this.getCardList()
      }).catch(() => {

      })
    },
    deleteCard(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delteCardAPI(id)
        this.getCardList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn{
    margin-left:20px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
