<template>
  <div class="page-view" v-if="config">
    <div class="page-header">
      <div class="page-header-left">
        <Dropdown trigger="click" transfer>
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

        <Dropdown trigger="click" transfer>
          <a href="javascript:void(0)">
            <Button icon="md-images" size="small">
              <Icon type="md-arrow-dropdown" />
            </Button>
          </a>
          <DropdownMenu slot="list">
            <CheckList :data="checkList"></CheckList>
          </DropdownMenu>
        </Dropdown>
        <Button
          @click.native.stop="showCheck = !showCheck"
          :type="showCheck ? 'primary' : 'default'"
          :ghost="showCheck"
          icon="md-checkbox-outline"
          size="small"
        />
        <Button icon="md-bookmark" size="small" @click="addBookmark" />
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
        <div class="main-left">
          <div class="main-left-header">
            <Icon
              class="panel-item"
              type="md-folder"
              :class="{ active: storage.leftTab === 'folder' }"
              @click.native="storage.leftTab = 'folder'"
            /><Icon
              class="panel-item"
              type="md-bookmarks"
              :class="{ active: storage.leftTab === 'bookmark' }"
              @click.native="storage.leftTab = 'bookmark'"
            />
            <Icon
              class="panel-item"
              type="ios-archive"
              :class="{ active: storage.leftTab === 'collect' }"
              @click.native="storage.leftTab = 'collect'"
            />
            <Icon
              class="panel-item"
              type="md-pricetags"
              :class="{ active: storage.leftTab === 'tags' }"
              @click.native="storage.leftTab = 'tags'"
            />
          </div>
          <div class="main-left-body">
            <div
              class="main-left-content"
              v-show="storage.leftTab === 'folder'"
            >
              <div class="tree-header">
                <Button
                  @click="onClick"
                  icon="md-add-circle"
                  size="small"
                ></Button>
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
                @on-fresh="onTreeFersh"
                :data="dictory"
                :edit="treeEditing"
              ></Tree>
            </div>
            <div
              class="main-left-content"
              v-show="storage.leftTab === 'bookmark'"
            >
              <BookmarkList
                ref="bookmarks"
                @bookmarksClick="toBookmark"
              ></BookmarkList>
            </div>
            <div
              class="main-left-content"
              v-show="storage.leftTab === 'collect'"
            >
              <CollectList
                ref="collect"
                @collectClick="collectOpen"
              ></CollectList>
            </div>
            <div class="main-left-content" v-show="storage.leftTab === 'tags'">
              <TagList ref="tag"></TagList>
            </div>
          </div>
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
          :loadingMore="imageLoadingMore"
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
import CheckMixins from "./check";
import ImageViewer from "render/components/image-viewer";
import BookmarkList from "render/components/bookmark-list";
import { Dropdown, DropdownMenu, Button, Icon } from "iview";
import Config from "../config";
import { functionDebounce } from "render/util";
import CollectList from "./collect-list";
import CheckList from "./check-list";
import TagList from "./tag-list";

import "./style.less";
let isMac = (function() {
  return /macintosh|mac os x/i.test(navigator.userAgent);
})();
const { shell } = window.require("electron").remote;
const ViewType = {
  scroll: ImageScroll,
  grid: ImageList,
  page: PageViewer
};
import KeyListener from "./key-listener";
export default {
  mixins: [CheckMixins, KeyListener],
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
    ImageViewer,
    CheckList,
    BookmarkList,
    TagList,
    CollectList
  },
  data() {
    return {
      showCheck: true,
      listLoadFinish: false,
      viewImage: null,
      storage: {
        viewType: "grid"
      },
      configShow: false,
      imageLoading: false,
      imageLoadingMore: false,
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
    toBookmark({ dictory, scrollTop }) {
      this.onTreeActive(dictory).then(() => {
        setTimeout(() => {
          this.$refs.tree.setActive(dictory);
          if (scrollTop) {
            this.$refs.imageList.setScroll(scrollTop);
          }
        });
      });
    },
    addBookmark() {
      this.$connect.addData("bookmark", {
        dictory: this.storage.activeTree,
        scrollTop: this.$refs.imageList && this.$refs.imageList.scrollTop,
        createTime: +new Date()
      });
      this.$refs.bookmarks.update();
    },
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
        if (isMac) {
          pathText = "/";
        }
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
    onTreeFersh(data) {
      this.onTreeActive(data, false);
    },
    collectOpen(data) {
      this.listLoadFinish = true;
      this.imageLoadingMore = false;
      this.imageLoading = false;
      this.$refs.imageList.setData(data.files);
    },
    async onTreeActive(e, cache) {
      if (e.type === "set") {
        return;
      }
      this.$set(this.storage, "activeTree", e);
      this.imageLoading = true;
      this.imageLoadingMore = true;
      await Connect.run("cleanIterator");
      if (this.config.image.readStep) {
        this.setFileStream(e, cache);
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
    setFileStream(e, cache) {
      if (this.fileStream) {
        this.fileStream.stop();
      }
      this.listLoadFinish = false;
      this.fileStream = Connect.stream("fileListStream", {
        path: e.path,
        step: Number(this.config.image.readStep),
        cache
      });
      this.fileStream.onFinish((ctx) => {
        this.imageLoadingMore = false;
        if (ctx === this.fileStream) {
          this.listLoadFinish = true;
        }
      });
    },
    onListLoadMore() {
      if (
        this.fileStream &&
        !this.imageLoadingMore &&
        !this.fileStream.finish &&
        !this.fileStream.loading
      ) {
        this.imageLoadingMore = true;
        this.fileStream.next().then((res) => {
          this.imageLoadingMore = false;
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
