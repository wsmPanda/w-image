<template>
  <div class="tree-panel">
    <div class="tree-header">
      <div class="tree-header-left">
        <Button @click="onAddDictiry" icon="md-add" size="small"></Button>
        <Button @click="onAddGroup" icon="md-add-circle" size="small" />
        <Button
          @click="onTreeEdit"
          icon="md-create"
          :type="editing ? 'primary' : 'default'"
          :ghost="editing"
          size="small"
        ></Button>
        <Button @click="updateDictory" icon="md-refresh" size="small"></Button>
        <Button icon="md-briefcase" @click="processShow = true" size="small" />
        <Button @click="openAll" size="small"><i class="ri-expand-up-down-line"></i></Button>
        <Button @click="closeAll" size="small"><i class="ri-contract-up-down-line"></i></Button>
      </div>
      <div class="tree-header-right">
        <!-- <Button @click="updateDictory" icon="md-git-network" size="small"></Button> -->
        <ButtonGroup>
          <Button
            size="small"
            @click.native.stop="$main.storage.folderListMode = 'tree'"
            :type="$main.storage.folderListMode === 'tree' ? 'primary' : 'default'"
          >
            <i class="ri-node-tree"></i>
          </Button>
          <Button
            size="small"
            @click.native.stop="$main.storage.folderListMode = 'list'"
            :type="$main.storage.folderListMode !== 'tree' ? 'primary' : 'default'"
          >
            <i class="ri-list-check-2"></i
          ></Button>
        </ButtonGroup>
      </div>
    </div>
    <CommonTree
      class="tree-body"
      ref="commonTree"
      :data="dictory"
      :initActive="active && active.path"
      :subGetter="subGetter"
      :nameWrap="$main.config.image.folderNameWrap"
      @on-active="onTreeItemActive"
      @on-fresh="onTreeFersh"
      :menu="menu"
    >
      <template v-slot:name="{ data }">
        <Icon
          class="icon-fold"
          :class="{
            'icon-dictory': data.type === 'dictory',
            'icon-set': data.type === 'set',
            'icon-empty': data.hasRead && (!data.sub || !data.sub.length),
            'icon-error': data.error
          }"
          :type="data.open ? 'ios-folder-open' : 'md-folder'"
        />
        {{ data.path && data.path.split(/\/|\\/).pop() }}</template
      >
    </CommonTree>
    <Modal v-model="processShow" title="批量处理" @on-ok="onProcessOk">
      <div>
        <div>后缀修改</div>
        <div>
          <Input v-model="formatFrom" />->
          <Input v-model="formatTo" />
        </div>
        <Checkbox v-model="addMode">添加后缀</Checkbox>
      </div>
      <div>
        <Button
          @click="
            $connect.run('clearEmpty', {
              path: $main.storage.activeTree && $main.storage.activeTree.path
            })
          "
          >清理空目录</Button
        >
        <Button
          @click="
            $connect.run('shellFiles', {
              path: $main.storage.activeTree && $main.storage.activeTree.path
            })
          "
          >文件退壳</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonTree from "render/components/tree/index.vue"
import { functionDebounce, isMac } from "render/util"

export default {
  inject: ["$main"],
  components: { CommonTree },
  props: {
    active: {}
  },
  data() {
    let vm = this
    return {
      dev: true,
      dictory: [],
      editing: false,
      processShow: false,
      formatFrom: "",
      formatTo: "",
      addMode: false,
      foldMenu: [
        {
          name: "在系统中打开",
          icon: "md-open",
          action({ path }) {
            shell.openPath(path)
          }
        },
        {
          icon: "md-refresh",
          name: "刷新",
          action({ path }) {
            vm.$refs.commonTree.refreshNode(path)
          }
        },
        {
          icon: "ri-expand-up-down-line",
          name: "展开全部",
          action({ path }) {
            vm.$refs.commonTree.openAll(path)
          }
        },
        {
          icon: "ri-contract-up-down-line",
          name: "收起全部",
          action({ path }) {
            vm.$refs.commonTree.closeAll(path)
          }
        },

        {
          icon: "md-trash",
          name: "库中删除",
          action({ path }) {
            vm.$refs.commonTree.removeNode(path)
          }
        },
        {
          name: "重命名",
          disabled: true
        }
        // {
        //   name: "s",
        //   children: [
        //     {
        //       name: "重命名"
        //     },
        //     {
        //       name: "重命名"
        //     }
        //   ]
        // }
      ]
    }
  },
  methods: {
    menu() {
      return this.foldMenu
    },
    async subGetter(data) {
      let res = await window.ConnectRun("getDictoryFolder", {
        path: data.path,
        deep: 2
      })

      return res.sub
    },
    onProcessOk() {
      window.ConnectRun("processBatch", {
        process: "format",
        from: this.formatFrom,
        to: this.formatTo,
        add: this.addMode,
        path: this.$main.storage.activeTree && this.$main.storage.activeTree.path
      })
    },
    onAddGroup() {
      let data = {
        name: "group",
        type: "group",
        sub: []
      }
      this.dictory.push(data)
      this.$connect.addData("dictory", data)
    },
    onTreeEdit() {
      this.editing = !this.editing
    },
    async updateDictoryCache() {
      try {
        this.dictory = await window.ConnectRun("getDictoryCache")
      } catch (ex) {
        console.error(ex)
      }
      if (!this.dictory || !this.dictory.length) {
        this.updateDictory()
      }
    },
    async onAddDictiry() {
      let path = await window.ConnectRun("selectDictory")
      await window.ConnectRun("addDictory", { path })
      this.addDictory(path)
    },
    async updateDictory() {
      this.dictoryList = await window.ConnectRun("getDictory")
      this.dictory = this.dictoryParse(this.dictoryList)
    },
    onTreeFersh(data) {
      this.onTreeActive(data, false)
    },
    onTreeActive(data, cache) {
      this.$emit("on-active", { data, cache })
    },
    onTreeItemActive(data) {
      this.$emit("on-active", { ...data, path: data.id })
    },
    dictoryParse(data) {
      if (this.$main.storage.folderListMode !== "tree") {
        return this.dictoryList
      }
      let list = []
      for (let dictory of data) {
        let path = (dictory.path || "").split(/\\|\//)
        if (path[0] === "") {
          path.splice(0, 1)
        }
        let node = list
        let pathText = ""
        if (isMac) {
          pathText = "/"
        }
        path.forEach((item, index) => {
          let folder = node.find((i) => i.name === item)
          pathText += (pathText ? "/" : "") + item
          if (!folder) {
            folder = {
              open: index !== path.length - 1,
              name: item,
              path: pathText,
              type: index !== path.length - 1 ? "set" : "dictory",
              sub: []
            }
            node.push(folder)
          }
          node = folder.sub
        })
      }
      return this.mergeDictoryList(list)
    },
    addDictory(dir) {
      let path = dir.split(/\\|\//)
      if (path[0] === "") {
        path.splice(0, 1)
      }
      let node = this.dictory
      let pathText = ""
      let currentFolder
      if (isMac) {
        pathText = "/"
      }
      path.forEach((item, index) => {
        pathText += (pathText ? "/" : "") + item
        let folder = node.find((i) => i.name === item || (i.path && i.path.indexOf(pathText) === 0))

        if (!folder || folder.path === pathText) {
          if (!folder) {
            folder = {
              open: index !== path.length - 1,
              name: item,
              path: pathText,
              type: index !== path.length - 1 ? "set" : "dictory",
              sub: []
            }
            node.push(folder)
          }
          node = folder.sub
          this.$set(folder, "open", true)
          currentFolder = folder
        }
      })
      setTimeout(() => {
        this.$main.onDictoryChange(currentFolder)
      })
    },
    mergeDictoryList(list) {
      let res = []
      if (list.length) {
        for (let item of list) {
          let sub = this.mergeDictoryList(item.sub)
          if (sub.length === 1) {
            res.push({ ...sub[0], name: `${item.name}/${sub[0].name}` })
          } else {
            res.push({ ...item, sub })
          }
        }
      }
      return res
    },
    openAll() {
      this.$refs.commonTree.openAll()
    },
    closeAll() {
      this.$refs.commonTree.closeAll()
    }
  },

  async beforeMount() {
    this.onTreeChange = functionDebounce(() => {
      window.ConnectRun("saveDictoryCache", { data: JSON.parse(JSON.stringify(this.dictory)) })
    })
    await this.updateDictoryCache()
    this.$watch("$main.storage.folderListMode", {
      deep: true,
      handler() {
        this.updateDictory()
      }
    })
    setTimeout(() => {
      this.$watch("dictory", {
        deep: true,
        handler() {
          this.onTreeChange()
        }
      })
    })
  }
}
</script>

<style lang="less">
.tree-panel {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .tree-header {
    padding: 8px;
    display: flex;
  }
  .tree-header-left {
    flex: 1;
  }
  .tree-body {
    flex: 1;
    overflow: auto;
  }
}
</style>
