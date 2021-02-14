<template>
  <div class="page-view" v-if="pageInit">
    <div class="page-header">
      <div class="page-header-left">
        <Poptip transfer trigger="click">
          <a href="javascript:void(0)">
            <Button size="small" icon="md-settings"></Button>
          </a>
          <div slot="content">
            <Config v-if="config" :data="config"></Config>
          </div>
        </Poptip>
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
          <ButtonGroup
            ><Button
              @click.native.stop="showCheck = !showCheck"
              :type="showCheck ? 'primary' : 'default'"
              :ghost="showCheck"
              icon="md-checkbox-outline"
              size="small"
            />
            <Button icon="md-images" size="small">
              <span v-if="checkList.length" class="badge">{{
                checkList.length
              }}</span>
              <Icon type="md-arrow-dropdown" />
            </Button>
          </ButtonGroup>
          <DropdownMenu slot="list">
            <CheckList :data="checkList"></CheckList>
          </DropdownMenu>
        </Dropdown>
        <Button icon="md-bookmark" size="small" @click="addBookmark" />
        <ButtonGroup>
          <Button icon="ios-funnel" size="small"> </Button>
          <Button
            icon="md-image"
            size="small"
            @click="filterSelect('image')"
            :type="
              storage.formatFilter && storage.formatFilter.includes('image')
                ? 'primary'
                : 'default'
            "
          >
          </Button>
          <Button
            icon="md-videocam"
            size="small"
            @click="filterSelect('video')"
            :type="
              storage.formatFilter && storage.formatFilter.includes('video')
                ? 'primary'
                : 'default'
            "
          >
          </Button>
          <Button
            icon="md-document"
            size="small"
            @click="filterSelect('other')"
            :type="
              storage.formatFilter && storage.formatFilter.includes('other')
                ? 'primary'
                : 'default'
            "
          >
          </Button>
        </ButtonGroup>
        <Button icon="md-pricetags" size="small" />
        <Button size="small">
          <Icon type="ios-apps" /> <Icon type="md-arrow-dropdown" />
        </Button>

        <Button size="small" @click="$connect.run('selectDbPath')">
          <Icon type="ios-apps" />
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
          <Tabs :items="tabItems" v-model="storage.leftTab">
            <template slot="folder">
              <TreePanel
                ref="tree"
                @on-active="onTreeActive"
                :active="storage.activeTree"
              ></TreePanel
            ></template>
            <template slot="bookmark"
              ><BookmarkList
                ref="bookmarks"
                @bookmarksClick="toBookmark"
              ></BookmarkList
            ></template>

            <template slot="collect">
              <CollectList
                ref="collect"
                @collectClick="collectOpen"
              ></CollectList
            ></template>

            <template slot="tags"><TagList ref="tag"></TagList></template>
          </Tabs>
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
          <span class="image-list-header-name">
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
      <template slot="right">
        <FileViewer
          :key="viewImage"
          v-if="viewImage"
          class="main-image-viewer"
          :data="viewImage"
        ></FileViewer>
        <div v-else>空</div>
      </template>
    </Layout>
  </div>
</template>

<script>
import ImageList from "render/components/big-image-list";
import ImageScroll from "render/components/big-image-list/scroll";
import PageViewer from "render/components/page-viewer";
import Layout from "render/layout";
import Connect from "render/connect";
import CheckMixins from "./check";
import FileViewer from "render/components/image-viewer";
import BookmarkList from "render/components/bookmark-list";
import { Dropdown, DropdownMenu, Button, Icon } from "iview";
import Config from "../config";
import { functionDebounce, mergeObject } from "render/util";
import CollectList from "./collect-list";
import CheckList from "./check-list";
import TagList from "./tag-list";
import TreePanel from "./tree-panel";
import Tabs from "render/components/tabs";
import "./style.less";
const { shell } = window.require("electron").remote;
const ViewType = {
  scroll: ImageScroll,
  grid: ImageList,
  page: PageViewer,
};
import KeyListener from "./key-listener";
export default {
  mixins: [CheckMixins, KeyListener],
  provide() {
    return {
      $main: this,
      $config: this.config,
    };
  },
  components: {
    ImageList,
    Icon,
    Layout,
    Button,
    Dropdown,
    Config,
    DropdownMenu,
    FileViewer,
    CheckList,
    BookmarkList,
    TagList,
    CollectList,
    TreePanel,
    Tabs,
  },
  data() {
    return {
      tabItems: [
        {
          value: "folder",
          icon: "md-folder",
        },
        {
          value: "bookmark",
          icon: "md-bookmark",
        },
        {
          value: "collect",
          icon: "ios-archive",
        },
        {
          value: "tags",
          icon: "md-pricetags",
        },
        {
          value: "book",
          icon: "ios-book",
        },
      ],
      pageInit: false,
      config: {},
      showCheck: true,
      listLoadFinish: false,
      viewImage: null,
      storage: {
        viewType: "grid",
        formatFilter: ["image", "video"],
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
    };
  },
  computed: {
    viewComponent() {
      return ViewType[this.storage.viewType || "grid"];
    },
  },
  watch: {
    "storage.formatFilter"() {
      this.refreshListData();
    },
  },
  methods: {
    filterSelect(v) {
      let index = this.storage.formatFilter.indexOf(v);
      if (index >= 0) {
        this.storage.formatFilter.splice(index, 1);
      } else {
        this.storage.formatFilter.push(v);
      }
    },
    toBookmark({ dictory, scrollTop }) {
      this.updateListData(dictory).then(() => {
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
        createTime: +new Date(),
      });
      this.$refs.bookmarks.update();
    },
    cartAdd(data) {
      this.cartData.push(data);
    },

    onImageDbClick(v) {
      shell.openPath(v);
    },
    onActiveImageChange(v) {
      this.viewImage = v;
    },
    onDictoryClick(v) {
      Connect.run("openDictory", v);
    },
    onTreeActive({ data, cache }) {
      this.updateListData(data, cache);
    },
    collectOpen(data) {
      this.listLoadFinish = true;
      this.imageLoadingMore = false;
      this.imageLoading = false;
      this.$refs.imageList.setData(data.files);
    },
    refreshListData() {
      this.updateListData(this.storage.activeTree);
    },
    async updateListData(e, cache) {
      if (e.type === "set") {
        return;
      }
      this.$set(this.storage, "activeTree", e);
      this.imageLoading = true;
      await Connect.run("cleanIterator");
      let m = 0;
      if (m) {
        return Connect.run("allFileList", e).then((res) => {
          this.activeListDictory = e;
          this.$refs.imageList.setData(res);
          this.allList = res;
          console.log(res.length);
          this.imageLoading = false;
        });
      } else if (this.config.image.readStep) {
        this.setFileStream(e, cache);
        this.imageLoadingMore = true;
        return this.fileStream
          .next()
          .then((res) => {
            this.$refs.imageList.setData([]);
            this.$refs.imageList.appendData(res);
          })
          .finally(() => {
            this.imageLoading = false;
            this.imageLoadingMore = false;
          });
      } else {
        return Connect.run("getTreeFiles", {
          ...e,
          formatFilter: this.storage.formatFilter || ["image", "video"],
        }).then((res) => {
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
      cache = false;
      this.fileStream = Connect.stream("fileListStream", {
        path: e.path,
        formatFilter: this.storage.formatFilter || ["image", "video"],
        step: Number(this.config.image.readStep),
        cache,
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
        !this.listLoadFinish &&
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
          name: data.path.split(/\\|\//).pop(),
        },
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
    },
    waitNextTick() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          resolve();
        });
      });
    },
    async afterInit() {
      if (this.storage.activeTree) {
        await this.waitNextTick();
        await this.updateListData(this.storage.activeTree);
        await this.waitNextTick();
        if (this.storage.listScroll) {
          this.$refs.imageList.setScroll(this.storage.listScroll);
        }
      }
    },
  },
  mounted() {
    this.onResize();
  },
  async created() {
    this.config = (await Connect.run("getConfig")) || {};
    this.storage = (await Connect.run("getStorage")) || {};
    this.storage = mergeObject(this.storage, {
      viewType: "grid",
      leftTab: "folder",
    });
    this.pageInit = true;
    let setStorage = functionDebounce((e) => Connect.run("setStorage", e));
    let setConfig = functionDebounce((e) => Connect.run("setConfig", e));
    this.$watch("config", {
      deep: true,
      handler(v) {
        setConfig({ data: v });
      },
    });
    this.$watch("storage", {
      deep: true,
      handler(v) {
        setStorage({ data: v });
      },
    });
    setTimeout(() => {
      this.onResize();
    });
    window.addEventListener("resize", () => {
      this.onResize();
    });
    this.afterInit();
  },
};
</script>
