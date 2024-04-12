<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="search" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="EnterPrise">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="list" @expand-change="expandChange" >
        <el-table-column type="expand">
  <template #default="scope">
    <el-table :data="scope.row.rentList">
      <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
      <el-table-column label="租赁起始时间" prop="startTime">
        <template #default="rentObj">
        {{ rentObj.row.startTime }}至{{ rentObj.row.endTime }}
        </template>
      </el-table-column>
   <el-table-column label="合同状态" prop="status" >
    <template #default="rentObj">
      <el-tag :type="formatInfoType(rentObj.row.status)">
        {{ formatStatus(rentObj.row.status) }}
      </el-tag>
        </template>
   </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="mini" type="text">续租</el-button>
          <el-button size="mini" type="text">退租</el-button>
          <el-button size="mini" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </template>
</el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">

          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="toEditPage(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="toDelEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加合同弹窗 -->
    <el-dialog
  title="添加合同"
  :visible="rentDialogVisible"
  width="580px"
  @close="closeDialog"
  >
  <!-- 表单区域 -->
<!-- 表单模版 -->
<div class="form-container">
  <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
    <el-form-item label="租赁楼宇" prop="buildingId">
      <el-select v-model="rentForm.buildingId" placeholder="请选择">
        <el-option
          v-for="item in getRentBuildList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="租赁起止日期" prop="rentTime">
      <el-date-picker
        v-model="rentForm.rentTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item label="租赁合同" prop="contractId">
      <el-upload
        action="#"
        :http-request="httpRequest"
        :before-upload="beforeUpload"
        :limit="1"
        :on-exceed="onExceed"
        :on-remove="onRemove"
        ref="upload"
      >
        <el-button size="small" type="primary" plain>上传合同文件</el-button>
        <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
      </el-upload>
    </el-form-item>
  </el-form>
</div>
  <template #footer>
    <el-button size="mini" @click="closeDialog">取 消</el-button>
    <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
  </template>
</el-dialog>
    <div class="page-container">
      <el-pagination
        :page-size="params.pageSize"
        :current-page.sync="params.page"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getEnterpriseListAPI, delExterpriseAPI, getRentBuildListAPI,addRentAPI,getRentListAPI } from '@/api/enterprise'
import { uploadFile} from '@/api/common'
export default {
  name: 'EnterPrise',
  data() {
    return {
      params: {
        name: '',
        page: 1,
        pageSize: 2
      },
      list: [],
      total: 0,
      // 控制弹窗的显示隐藏
      rentDialogVisible: false,
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
    },
    rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      },
    getRentBuildList:[]

    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    formatInfoType(status) {
  const MAP = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'danger'
  }
  // return 格式化之后的中文显示
  return MAP[status]
},
    formatStatus(status) {
      const Map = {
        0: '在生效',
        1: '生效中',
        2: '已到期',
        3:'已退租'
      }
      return Map[status]
    },
    // 点击展开或关闭都会触发该事件
    async expandChange(row, expandRows) {
      // row是当前展开或关闭哪一行的数据
      // 判断状态，展开时，发起网络请求
      const inInclude=expandRows.find(item=>item.id===row.id)
      if(inInclude)
      {
        console.log('kai');
        const res = await getRentListAPI(row.id)
        row.rentList=res.data
     }
    },
    confirmAdd() {
      this.$refs.addForm.validate(async (flag) => {
        if (!flag) return
        const [startTime, endTime] = this.rentForm.rentTime
        this.rentForm.startTime=startTime
        this.rentForm.endTime = endTime
        delete this.rentForm.rentTime
        await addRentAPI(this.rentForm)
        this.$message.success('添加合同成功')
        this.getEnterpriseList()
        this.closeDialog()
      })

    },
    async httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 2)
      const res = await uploadFile(formData)
      this.rentForm.contractId=res.data.id
      this.rentForm.contractUrl = res.data.url
      // 单独校验文件
      this.$refs.addForm.validateField('contractId')
    },
    beforeUpload(file) {
      // 提交文件前的统一校验
      // 主要对文件类型和文件大小的校验
    },
    onExceed() {
      // 超出文件个数的限制时自动执行
      this.$message.warning('超出文件上传个数');
    },
      // 打开
  async addRent(id){
    this.rentDialogVisible = true
      this.rentForm.enterpriseId=id
      const res = await getRentBuildListAPI()
      console.log('可租赁合同res:', res);
      this.getRentBuildList=res.data
    },
    onRemove() {
      // 删除文件之后，表单内容不会自动清空，这里借助自带属性当文件移除的时候，手动清空
    this.rentForm.contractId=''
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validateField('contractId')
    
  },
  // 关闭
  closeDialog(){
    this.rentDialogVisible = false
    // 关闭的时候清空表单
    // 智能清空绑定了prop的表单域，同时清空校验提示
    this.$refs.addForm.resetFields()
// 清空所有数据
    this.rentForm = {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
    }
    // 清空已上传的文件
this.$refs.upload.clearFiles()

  },
    toEditPage(id) {
      console.log('id', id)
      this.$router.push({
        path: '/park/addEnterprise',
        query: { id }
      })
    },
    toDelEnterprise(id) {
      this.$confirm('您确定要删除该企业吗', '温馨提示').then(async() => {
        await delExterpriseAPI(id)
        this.$message.success('删除成功')
        // 如果删除的是最后一页的唯一一条数据
        if (this.list.length === 1 && this.params.page > 1) {
          this.params.page--
         
        }
        this.getEnterpriseList()
      }).catch(() => {
        
      })
    },
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      this.list = res.data.rows.map(item => {
        return {
          ...item,rentList:[]
        }
      })
      this.total = res.data.total
    },
    search() {
      this.params.page = 1
      this.getEnterpriseList()
    },
    indexMethod(index) {
      return (this.params.page - 1) * (this.params.pageSize) + index + 1
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.params.page = val
      this.getEnterpriseList(this.params)
    },
    EnterPrise() {
      this.$router.push('/park/addEnterprise')
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
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
