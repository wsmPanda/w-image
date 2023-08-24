<template>
  <div class="page-view" v-if="pageInit">
    <Header></Header>
    <Layout class="page-content" ref="layout" :config="config.mainLayout || {}">
      <template v-slot:left>
        <div class="main-left">
          <Tabs v-model:value="storage.leftTab" :items="tabItems">
            <template v-slot:folder>
              <TreePanel
                ref="tree"
                @on-active="onTreeActive"
                :active="storage.activeTree"
              ></TreePanel
            ></template>
            <template v-slot:bookmark
              ><BookmarkList ref="bookmarks" @bookmarksClick="toBookmark"></BookmarkList
            ></template>

            <template v-slot:collect>
              <CollectList ref="collect" @collectClick="collectOpen"></CollectList
            ></template>
            <template #tags><TagList ref="tag"></TagList></template>
          </Tabs>
        </div>
      </template>
      <template v-slot:center>
        <div class="loading-mask" v-if="imageLoading">
          <Spin fix>
            <Icon type="ios-loading" size="18" class="spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
        </div>

        <div class="image-list-header" v-if="activeListDictory">
          <Icon
            v-if="showCheck"
            @click="check(activeListDictory.path)"
            :class="{
              uncheck: !isCheck(activeListDictory.path),
              'thumbnail-check': true
            }"
            type="md-checkmark-circle"
          />

          <Icon class="icon-fold" type="md-folder" />
          <span @click="onDictoryClick(activeListDictory)" class="image-list-header-name">
            {{ activeListDictory.name || activeListDictory.path }}
          </span>
        </div>
        <component
          :is="viewComponent"
          ref="imageList"
          class="main-image-list"
          :height="listHeight"
          :loadFinish="listLoadFinish"
          :loadingMore="imageLoadingMore"
          @scroll="onListScroll"
          @dictoryChange="onDictoryChange"
          @activeImageChange="onActiveImageChange"
          @dictoryClick="onDictoryClick"
          @imageDbClick="onImageDbClick"
          @loadMore="onListLoadMore"
        ></component>
      </template>
      <template v-slot:right>
        <component v-if="rightComponent" :is="rightComponent"></component>
        <template v-else>
          <FileViewer
            :key="storage.active"
            v-if="storage.active"
            class="main-image-viewer"
            :data="storage.active"
          ></FileViewer>
          <div v-else>空</div></template
        >
      </template>
    </Layout>
  </div>
</template>

<script>
import { Dropdown, DropdownMenu, Button, Icon } from "view-ui-plus"

import ImageList from "render/components/big-image-list/index.vue"
import ImageScroll from "render/components/big-image-list/scroll.vue"
import PageViewer from "render/components/page-viewer/index.vue"
import Layout from "render/layout/index.vue"
import FileViewer from "render/components/file-viewer/index.vue"
import BookmarkList from "render/components/bookmark-list/index.vue"
import Tabs from "render/components/tabs/index.vue"
import BoardView from "render/views/board/index.vue"

import CheckMixins from "./main/check"
import KeyListener from "./main/key-listener"
import Header from "./header/index.vue"

import { functionDebounce, mergeObject } from "render/util"

import CollectList from "./panel/collect-list.vue"
import TagList from "./panel/tag-list.vue"
import TreePanel from "./panel/tree-panel.vue"

import "./style.less"

const ViewType = {
  scroll: ImageScroll,
  grid: ImageList,
  page: PageViewer
}
export default {
  mixins: [CheckMixins, KeyListener],
  provide() {
    return {
      $main: this,
      $config: this.config
    }
  },
  components: {
    ImageList,
    Icon,
    Header,
    Layout,
    Button,
    Dropdown,
    DropdownMenu,
    FileViewer,
    BookmarkList,
    TagList,
    CollectList,
    TreePanel,
    Tabs
  },
  data() {
    return {
      tags: [],
      tabItems: [
        {
          value: "folder",
          icon: "md-folder"
        },
        {
          value: "bookmark",
          icon: "md-bookmark"
        },
        {
          value: "collect",
          icon: "ios-archive"
        },
        {
          value: "tags",
          icon: "md-pricetags"
        },
        {
          value: "book",
          icon: "ios-book"
        }
      ],
      pageInit: false,
      config: {},
      showCheck: true,
      listLoadFinish: false,
      storage: {
        viewType: "grid",
        formatFilter: ["image", "video"],
        tabIndex: 0,
        active: null
      },
      configShow: false,
      imageLoading: false,
      imageLoadingMore: false,
      listHeight: 300,

      dictory: [],
      activeListDictory: null,
      images: [],
      tree: [],
      cartData: [],
      fileInfo: {}
    }
  },
  computed: {
    viewComponent() {
      return ViewType["grid"]
    },
    rightComponent() {
      if (this.storage.viewType === "board") {
        return BoardView
      } else {
        return null
      }
    },
    tagMap() {
      return this.tags.reduce((res, item) => {
        res[item.name] = item
        return res
      }, {})
    }
  },
  methods: {
    filterSelect(v) {
      if (!this.storage.formatFilter) {
        this.$set(this.storage, "formatFilter", [])
      }
      let index = this.storage.formatFilter.indexOf(v)
      if (index >= 0) {
        this.storage.formatFilter.splice(index, 1)
      } else {
        this.storage.formatFilter.push(v)
      }
      this.refreshListData()
    },
    toBookmark({ dictory, scrollTop }) {
      this.updateListData(dictory).then(() => {
        setTimeout(() => {
          this.$refs.tree.setActive(dictory)
          if (scrollTop) {
            this.$refs.imageList.setScroll(scrollTop)
          }
        })
      })
    },
    addBookmark() {
      this.$connect.addData("bookmark", {
        dictory: this.storage.activeTree,
        scrollTop: this.$refs.imageList && this.$refs.imageList.scrollTop,
        createTime: +new Date()
      })
      this.$refs.bookmarks.update()
    },
    cartAdd(data) {
      this.cartData.push(data)
    },

    onImageDbClick(v) {
      shell.openPath(v)
    },
    onActiveImageChange(v) {
      this.$set(this.storage, "active", v)
    },
    onDictoryClick(v) {
      window.ConnectRun("openDictory", v)
    },
    onTreeActive({ data, cache }) {
      this.updateListData(data, cache)
    },
    collectOpen(data) {
      this.listLoadFinish = true
      this.imageLoadingMore = false
      this.imageLoading = false
      this.$refs.imageList.setData(data.files)
    },
    refreshListData() {
      this.updateListData(this.storage.activeTree)
    },
    async updateFileInfo() {
      this.fileInfo = null
      if (this.storage.activeTree) {
        let data = await window.ConnectRun("getInfo", {
          path: this.storage.activeTree.path
        })
        this.fileInfo = this.getInfoMap(this.storage.activeTree.path, data || {}, {})
      }
    },
    getInfoMap(path, data = {}, res) {
      if (data.data) {
        res[path] = data.data
      }
      if (data.sub) {
        for (let name in data.sub) {
          this.getInfoMap(path + "/" + name, data.sub[name], res)
        }
      }
      return res
    },
    async updateListData(e, cache) {
      if (e.type === "set") {
        return
      }
      this.$set(this.storage, "activeTree", e)
      this.imageLoading = true
      this.updateFileInfo()
      await window.ConnectRun("cleanIterator")
      let m = 0
      if (m) {
        return window.ConnectRun("allFileList", e).then((res) => {
          this.activeListDictory = e
          this.$refs.imageList.setData(res)
          this.allList = res
          this.imageLoading = false
        })
      } else if (this.config.image.readStep) {
        this.setFileStream(e, cache)
        this.imageLoadingMore = true
        return this.fileStream
          .next()
          .then((res) => {
            this.$refs.imageList.setData([])
            this.$refs.imageList.appendData(res)
          })
          .finally(() => {
            this.imageLoading = false
            this.imageLoadingMore = false
          })
      } else {
        return window
          .ConnectRun("getTreeFiles", {
            ...e,
            formatFilter: this.storage.formatFilter || ["image", "video"]
          })
          .then((res) => {
            this.activeListDictory = e
            let list = this.floaFileTree(
              res,
              null,
              this.config.image && this.config.image.showEmptyFolder
            )
            console.log(this.$refs.imageList)
            this.$refs.imageList.setData(list)
            this.imageLoading = false
          })
      }
    },
    setFileStream(e, cache) {
      if (this.fileStream) {
        this.fileStream.stop()
      }
      this.listLoadFinish = false
      cache = false
      this.fileStream = Connect.stream("fileListStream", {
        path: e.path,
        formatFilter: this.storage.formatFilter || ["image", "video"],
        step: Number(this.config.image.readStep),
        cache
      })
      this.fileStream.onFinish((ctx) => {
        this.imageLoadingMore = false
        if (ctx === this.fileStream) {
          this.listLoadFinish = true
        }
      })
    },
    onListLoadMore() {
      if (
        this.fileStream &&
        !this.imageLoadingMore &&
        !this.listLoadFinish &&
        !this.fileStream.finish &&
        !this.fileStream.loading
      ) {
        this.imageLoadingMore = true
        this.fileStream.next().then((res) => {
          this.imageLoadingMore = false
          if (res) {
            this.$refs.imageList.appendData(res)
          }
        })
      }
    },
    floaFileTree(data, path, showEmptyFolder) {
      let list = [
        {
          path: path || data.path,
          name: data.path.split(/\\|\//).pop()
        }
      ]
      list = list.concat(data.files.map((p) => (path || data.path) + "/" + p))
      if (data.sub && data.sub.length) {
        let totalList = []
        let subCount = 0
        data.sub.forEach((item) => {
          let subPath = (path || data.path) + "/" + item.path
          // 临时处理
          subPath = item.name
          let subList = this.floaFileTree(item, subPath, showEmptyFolder)
          if (subList.length || showEmptyFolder) {
            subCount++
            totalList = totalList.concat(subList)
          }
        })
        if ((!data.files || !data.files.length) && subCount === 1 && totalList.length) {
          totalList[0].name = `${list[0].name}/${totalList[0].name}`
          list = []
        }
        list = list.concat(totalList)
      }
      if (list.length <= 1 && !showEmptyFolder) {
        list = []
      }
      return list
    },
    onResize() {
      this.$nextTick(() => {
        this.listHeight = this.$refs.layout && this.$refs.layout.$el.clientHeight
      })
    },
    onDictoryChange(e) {
      this.activeListDictory = e
    },
    onListScroll(v) {
      this.$set(this.storage, "listScroll", v)
    },
    waitNextTick() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          resolve()
        })
      })
    },
    async afterInit() {
      if (this.storage.activeTree) {
        await this.waitNextTick()
        await this.updateListData(this.storage.activeTree)
        await this.waitNextTick()
        if (this.storage.listScroll) {
          this.$refs.imageList.setScroll(this.storage.listScroll)
        }
      }
    },
    getTags(path) {
      return this.fileInfo && this.fileInfo[path] && this.fileInfo[path].tags
    },
    async init() {
      this.config = (await window.ConnectRun("getConfig")) || {}
      this.tags = await Connect.getData("tags")
      this.storage = (await window.ConnectRun("getStorage")) || {}
      this.storage = mergeObject(this.storage, {
        viewType: "grid",
        leftTab: "folder",
        checkIndex: 0
      })
      this.pageInit = true
      let setStorage = functionDebounce((e) => window.ConnectRun("setStorage", e))
      let setConfig = functionDebounce((e) => window.ConnectRun("setConfig", e))
      this.$watch("config", {
        deep: true,
        handler(v) {
          setConfig({ data: v })
        }
      })
      this.$watch("storage", {
        deep: true,
        handler(v) {
          setStorage({ data: v })
        }
      })
      setTimeout(() => {
        this.onResize()
      })
      window.addEventListener("resize", () => {
        this.onResize()
      })
      this.afterInit()
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener("keyup", (e) => {
      if (this.storage.active && this.tags[e.key - 1]) {
        let tag = this.tags[e.key - 1]
        let info = this.fileInfo && this.fileInfo[this.storage.active]
        let tags = (info && info.tags) || []
        let index = tags.indexOf(tag.name)
        if (index >= 0) {
          tags.splice(index, 1)
        } else {
          tags.push(tag.name)
        }
        if (!info) {
          this.fileInfo = this.fileInfo || {}
          this.$set(this.fileInfo, this.storage.active, {
            tags: tags
          })
        }
        window.ConnectRun("setInfo", {
          path: this.storage.active,
          value: tags,
          code: "tags"
        })
      }
    })
  },
  beforeMount() {
    this.init()
  }
}
</script>
