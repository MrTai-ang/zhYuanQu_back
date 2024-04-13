<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item,index) in roleList"
        :key="item.roleId"
        class="role-item "

        :class="{active:activeIndex===index}"
        @click="menuChange(index)"
      >
        <div class="role-info">
          <svg-icon :icon-class="activeIndex===index?'user-active':'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <svg-icon icon-class="more" />
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/sys/addRole')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="permission">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                :default-expand-all="true"
                show-checkbox
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员(${total})`" name="employee">
          <el-table :data="userList" style="width: 100%;">
            <el-table-column type="index" width="250" label="序号" />
            <el-table-column prop="name" label="员工姓名" />
            <el-table-column prop="userName" label="登录账号" />
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI, getRoleUserListAPI } from '@/api/system'
export default {
  name: 'Role',
  data() {
    return {
      activeName: 'permission',
      roleList: [],
      // 存储当前点击的是哪个菜单
      activeIndex: 0,
      // 存储所有的权限列表
      treeList: [],
      defaultProps: {
        label: 'title'
      },
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      userList: []
    }
  },
  async created() {
    // 这俩依然是异步任务
    await this.getRoleList()
    await this.getTreeList()
    this.menuChange(0)
  },
  methods: {
    async getRoleUserList(roleId) {
      const res = await getRoleUserListAPI(roleId, this.params)
      console.log('获取成员回显数据', res)
      this.total = res.data.total
      this.userList = res.data.rows
    },
    // 获取角色对应的权限列表
    async getRoleDetail(roleId) {
      const res = await getRoleDetailAPI(roleId)
      console.log('角色权限res', res)
      const perms = res.data.perms
      const treeComponentList = this.$refs.tree
      treeComponentList.forEach((tree, index) => {
        tree.setCheckedKeys(perms[index])
      })
    },

    // 获取所有的权限列表
    async getTreeList() {
      const res = await getTreeListAPI()
      console.log('权限res:', res)
      this.treeList = res.data
      this.addDisabled(this.treeList)
    },
    addDisabled(treeList) {
      treeList.forEach(item => {
        item.disabled = true
        // 递归处理
        if (item.children) {
          this.addDisabled(item.children)
        }
      })
    },

    // 点击菜单的事件
    menuChange(index) {
      this.activeIndex = index
      // 获取id
      const roleId = this.roleList[index].roleId
      // console.log('');
      this.getRoleDetail(roleId)
      this.getRoleUserList(roleId)
    },
    async getRoleList() {
      const res = await getRoleListAPI()
      console.log('res:', res)
      this.roleList = res.data
    }
  }

}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
