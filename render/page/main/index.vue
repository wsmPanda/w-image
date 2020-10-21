<template>
  <div class="page-view" v-if="config">
    <div class="page-header">
      <div class="page-header-left">
        <Dropdown trigger="click">
          <a href="javascript:void(0)">
            <Button size="small" icon="md-settings"></Button>
          </a>
          <DropdownMenu slot="list">
            <Config v-if="config" :data="config"></Config>
          </DropdownMenu>
        </Dropdown>
        <Input
          v-if="config.image"
          icon="md-barcode"
          size="small"
          style="width: 60px"
          v-model="config.image.column"
        />
        <Input
          v-if="config.image"
          icon="md-resize"
          size="small"
          style="width: 70px"
          v-model="config.image.height"
        />

        <Dropdown trigger="click">
          <a href="javascript:void(0)">
            <Button icon="md-cart" size="small">
              <Icon type="md-arrow-dropdown" />
            </Button>
          </a>
          <DropdownMenu slot="list">
            <Config v-if="config" :data="config"></Config>
          </DropdownMenu>
        </Dropdown>

        <Button icon="md-bookmark" size="small" />
        <Button icon="md-pricetags" size="small" />
        <Button size="small">
          <Icon type="ios-apps" /> <Icon type="md-arrow-dropdown" />
        </Button>
      </div>
      <RadioGroup v-model="storage.viewType" type="button" size="small">
        <Radio label="book"> <Icon type="md-book" /> </Radio>
        <Radio label="grid"><Icon type="md-grid"/></Radio>
        <Radio label="scroll"><Icon type="md-more"/></Radio>
      </RadioGroup>
    </div>
    <Layout class="page-content" ref="layout" :config="config.mainLayout || {}">
      <template slot="left">
        <div class="main-tree">
          <div class="tree-header">
            <Button @click="onClick" icon="md-add-circle" size="small"></Button>
            <Button
              @click="onTreeEdit"
              icon="md-create"
              :type="treeEditing ? 'primary' : 'default'"
              :ghost="treeEditing"
              size="small"
            ></Button>
            <Button
              @click="updateDictory"
              icon="md-refresh"
              size="small"
            ></Button>
          </div>
          <Tree
            ref="tree"
            class="tree-body"
            @on-active="onTreeActive"
            :data="dictory"
            :edit="treeEditing"
          ></Tree>
        </div>
      </template>
      <template slot="center">
        <div class="loading-mask" v-if="imageLoading">
          <Spin fix>
            <Icon type="ios-loading" size="18" class="spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
        </div>

        <div
          class="image-list-header"
          v-if="activeListDictory"
          @click="onDictoryClick(activeListDictory)"
        >
          <Icon class="icon-fold" type="md-folder" />
          {{ activeListDictory.name || activeListDictory.path }}
        </div>
        <component
          :is="viewComponent"
          ref="imageList"
          class="main-image-list"
          :height="listHeight"
          :loadFinish="listLoadFinish"
          @scroll="onListScroll"
          @dictoryChange="onDictoryChange"
          @activeImageChange="onActiveImageChange"
          @dictoryClick="onDictoryClick"
          @imageDbClick="onImageDbClick"
          @loadMore="onListLoadMore"
        ></component>
      </template>
      <template slot="right">
        <ImageViewer
          :key="viewImage"
          v-if="viewImage"
          class="main-image-viewer"
          :data="viewImage"
        ></ImageViewer>
        <div v-else>空</div>
      </template>
    </Layout>
  </div>
</template>

<script>
import Tree from "render/components/dictory-tree";
import ImageList from "render/components/big-image-list";
import ImageScroll from "render/components/big-image-list/scroll";
import PageViewer from "render/components/page-viewer";
import Layout from "render/layout";
import Connect from "render/connect";
import ImageViewer from "render/components/image-viewer";
import { Dropdown, DropdownMenu, Button, Icon } from "iview";
import Config from "../config";
import { functionDebounce } from "render/util";
const { shell } = window.require("electron").remote;
const ViewType = {
  scroll: ImageScroll,
  grid: ImageList,
  page: PageViewer
};
export default {
  provide() {
    return {
      $main: this,
      $config: this.config
    };
  },
  components: {
    ImageList,
    Icon,
    Layout,
    Tree,
    Button,
    Dropdown,
    Config,
    DropdownMenu,
    ImageViewer
  },
  data() {
    return {
      listLoadFinish: false,
      viewImage: null,
      storage: {
        viewType: "grid"
      },
      configShow: false,
      imageLoading: false,
      listHeight: 300,
      config: {},
      dictory: [],
      activeListDictory: null,
      treeEditing: false,
      images: [],
      tree: [],
      cartData: []
    };
  },
  computed: {
    viewComponent() {
      return ViewType[this.storage.viewType || "grid"];
    }
  },
  watch: {},
  methods: {
    cartAdd(data) {
      this.cartData.push(data);
    },
    dictoryParse(data) {
      let list = [];
      for (let dictory of data) {
        let path = dictory.path.split(/\\|\//);
        if (path[0] === "") {
          path.splice(0, 1);
        }
        let node = list;
        let pathText = "";
        path.forEach((item, index) => {
          let folder = node.find((i) => i.name === item);
          pathText += (pathText ? "/" : "") + item;
          if (!folder) {
            folder = {
              open: index !== path.length - 1,
              name: item,
              path: pathText,
              type: index !== path.length - 1 ? "set" : "dictory",
              sub: []
            };
            node.push(folder);
          }
          node = folder.sub;
        });
      }
      return this.mergeDictoryList(list);
    },
    mergeDictoryList(list) {
      let res = [];
      if (list.length) {
        for (let item of list) {
          let sub = this.mergeDictoryList(item.sub);
          if (sub.length === 1) {
            res.push({ ...sub[0], name: `${item.name}/${sub[0].name}` });
          } else {
            res.push({ ...item, sub });
          }
        }
      }
      return res;
    },
    onImageDbClick(v) {
      shell.openPath(v);
    },
    onTreeEdit() {
      this.treeEditing = !this.treeEditing;
    },
    onActiveImageChange(v) {
      this.viewImage = v;
    },
    onDictoryClick(v) {
      Connect.run("openDictory", v);
    },
    async updateDictoryCache() {
      try {
        this.dictory = await this.$connect.run("getDictoryCache");
      } catch (ex) {
        console.error(ex);
      }
      if (!this.dictory || !this.dictory.length) {
        this.updateDictory();
      }
    },
    async onClick() {
      let path = await Connect.run("selectDictory");
      await Connect.run("addDictory", { path });
      this.dictory.push({ path });
    },
    async updateDictory() {
      let dictoryList = await Connect.run("getDictory");
      this.dictory = this.dictoryParse(dictoryList);
    },
    async onTreeActive(e) {
      if (e.type === "set") {
        return;
      }
      this.$set(this.storage, "activeTree", e);
      this.imageLoading = true;
      await Connect.run("cleanIterator");
      if (this.config.image.readStep) {
        this.setFileStream(e);
        return this.fileStream.next().then((res) => {
          this.$refs.imageList.setData([]);
          this.$refs.imageList.appendData(res);
          this.imageLoading = false;
        });
      } else {
        return Connect.run("getTreeFiles", e).then((res) => {
          this.activeListDictory = e;
          let list = this.floaFileTree(
            res,
            null,
            this.config.image && this.config.image.showEmptyFolder
          );
          this.$refs.imageList.setData(list);
          this.imageLoading = false;
        });
      }
    },
    setFileStream(e) {
      if (this.fileStream) {
        this.fileStream.stop();
      }
      this.listLoadFinish = false;
      this.fileStream = Connect.stream("fileListStream", {
        path: e.path,
        step: Number(this.config.image.readStep)
      });
      this.fileStream.onFinish((ctx) => {
        if (ctx === this.fileStream) {
          this.listLoadFinish = true;
        }
      });
    },
    onListLoadMore() {
      if (
        this.fileStream &&
        !this.fileStream.finish &&
        !this.fileStream.loading
      ) {
        this.fileStream.next().then((res) => {
          if (res) {
            this.$refs.imageList.appendData(res);
          }
        });
      }
    },
    floaFileTree(data, path, showEmptyFolder) {
      let list = [
        {
          path: path || data.path,
          name: data.path.split(/\\|\//).pop()
        }
      ];
      list = list.concat(data.files.map((p) => (path || data.path) + "/" + p));
      if (data.sub && data.sub.length) {
        let totalList = [];
        let subCount = 0;
        data.sub.forEach((item) => {
          let subPath = (path || data.path) + "/" + item.path;
          // 临时处理
          subPath = item.name;
          let subList = this.floaFileTree(item, subPath, showEmptyFolder);
          if (subList.length || showEmptyFolder) {
            subCount++;
            totalList = totalList.concat(subList);
          }
        });
        if (
          (!data.files || !data.files.length) &&
          subCount === 1 &&
          totalList.length
        ) {
          totalList[0].name = `${list[0].name}/${totalList[0].name}`;
          list = [];
        }
        list = list.concat(totalList);
      }
      if (list.length <= 1 && !showEmptyFolder) {
        list = [];
      }
      return list;
    },
    onResize() {
      this.listHeight = this.$refs.layout && this.$refs.layout.$el.clientHeight;
    },
    onDictoryChange(e) {
      this.activeListDictory = e;
    },
    onListScroll(v) {
      this.$set(this.storage, "listScroll", v);
    }
  },
  mounted() {
    this.onResize();
  },
  async created() {
    this.onTreeChange = functionDebounce(() => {
      this.$connect.run("saveDictoryCache", { data: this.dictory });
    });
    this.config = await Connect.run("getConfig");
    let setConfig = functionDebounce((e) => Connect.run("setConfig", e));
    this.$watch("config", {
      deep: true,
      handler(v) {
        setConfig({ data: v });
      }
    });
    this.storage = await Connect.run("getStorage");

    this.$watch("storage", {
      deep: true,
      handler(v) {
        Connect.run("setStorage", { data: v });
      }
    });
    setTimeout(() => {
      this.onResize();
    });
    window.addEventListener("resize", () => {
      this.onResize();
    });

    await this.updateDictoryCache();
    setTimeout(() => {
      this.$watch("dictory", {
        deep: true,
        handler() {
          this.onTreeChange();
        }
      });
    });

    if (this.storage.activeTree) {
      this.onTreeActive(this.storage.activeTree).then(() => {
        setTimeout(() => {
          this.$refs.tree.setActive(this.storage.activeTree);
          if (this.storage.listScroll) {
            this.$refs.imageList.setScroll(this.storage.listScroll);
          }
        });
      });
    }
  }
};
</script>
<style lang="less">
.page-view {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  .spin-icon-load {
    animation: icon-load-spin 1s linear infinite;
  }
  .ivu-spin {
    z-index: 100;
    background: rgba(255, 255, 255, 0.6);
  }
  @keyframes icon-load-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .icon-fold {
    color: #fbc776;
  }
  .ivu-btn {
    margin-right: 4px;
  }
  flex-direction: column;
  .page-header {
    padding: 8px;
    display: flex;
  }

  .main-image-viewer {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .page-content {
    flex: 1;
    overflow: hidden;
    background: #fafafa;
  }

  .main-tree {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .tree-header {
      padding: 8px;
    }
    .tree-body {
      flex: 1;
      overflow: auto;
    }
  }
  .image-list-header {
    position: absolute;
    z-index: 100;
    background: #fff;
    border-bottom: 1px solid #eee;
    left: 0;
    top: 0;
    right: 15px;
    padding: 4px 8px;
    font-size: 14px;
  }
  .main-image-list {
    height: 100%;
    overflow: hidden;
  }
  .layout-center {
    height: 100%;
    overflow: hidden;
  }
}
.page-header-left {
  flex: 1;
  .ivu-input-wrapper {
    display: inline-block;
    width: 60px;
    margin-left: 4px;
  }
  .ivu-input {
  }
}
</style>
