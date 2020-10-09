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

        <Button icon="md-cart" size="small" />
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
    <Layout class="page-content" ref="layout" :config="config.mainLayout">
      <template slot="left">
        <div class="tree-header">
          <Button @click="onClick" icon="md-add-circle" size="small"></Button>
          <Button @click="onTreeEdit" icon="md-create" size="small"></Button>
        </div>
        <Tree @on-active="onTreeActive" :data="dictory"></Tree>
      </template>
      <template slot="center">
        <div class="image-list-header" v-if="activeListDictory">
          <Icon class="icon-fold" type="md-folder" />
          {{ activeListDictory.name || activeListDictory.path }}
        </div>
        <component
          :is="viewComponent"
          :imageSetting="(config && config.image) || undefined"
          ref="imageList"
          class="main-image-list"
          :height="listHeight"
          @scroll="onListScroll"
          @dictoryChange="onDictoryChange"
          @activeImageChange="onActiveImageChange"
          @dictoryClick="onDictoryClick"
        ></component>
      </template>
      <template slot="right">
        <ImageViewer
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
const ViewType = {
  scroll: ImageScroll,
  grid: ImageList,
  page: PageViewer
};
export default {
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
      viewImage: null,
      storage: {
        viewType: "grid"
      },
      treeEdit: false,
      configShow: false,
      listHeight: 300,
      config: null,
      dictory: [],
      activeListDictory: null,
      images: [],
      tree: []
    };
  },
  computed: {
    viewComponent() {
      return ViewType[this.storage.viewType || "grid"];
    }
  },
  watch: {},
  methods: {
    onTreeEdit() {
      this.treeEdit = true;
    },
    onActiveImageChange(v) {
      this.viewImage = v;
    },
    onDictoryClick(v) {
      console.log(v);
    },
    async onClick() {
      let path = await Connect.selectDictiry();
      await Connect.addDictiry({ path });
      this.updateDictory();
    },
    async updateDictory() {
      this.dictory = await Connect.getDictory();
    },
    onTreeActive(e) {
      this.$set(this.storage, "activeTree", e);
      return Connect.getTreeFiles(e).then((res) => {
        this.activeListDictory = e;
        let list = this.floaFileTree(
          res,
          null,
          this.config.image && this.config.image.showEmptyFolder
        );
        //list.shift();
        this.$refs.imageList.setData(list);
      });
    },
    floaFileTree(data, path, showEmptyFolder) {
      let list = [
        {
          path: (path || "") + "/" + data.path,
          name: data.path
        }
      ];
      list = list.concat(data.files.map((p) => (path || data.path) + "/" + p));
      if (data.sub && data.sub.length) {
        let totalList = [];
        let subCount = 0;
        data.sub.forEach((item) => {
          let subPath = (path || data.path) + "/" + item.path;
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
    this.config = await Connect.getConfig();
    this.$watch("config", {
      deep: true,
      handler(v) {
        Connect.setConfig({ data: v });
      }
    });
    this.storage = await Connect.getStorage();
    if (this.storage.activeTree) {
      this.onTreeActive(this.storage.activeTree).then(() => {
        setTimeout(() => {
          if (this.storage.listScroll) {
            this.$refs.imageList.setScroll(this.storage.listScroll);
          }
        });
      });
    }
    this.$watch("storage", {
      deep: true,
      handler(v) {
        Connect.setStorage({ data: v });
      }
    });

    this.updateDictory();
    window.addEventListener("resize", () => {
      this.onResize();
    });
  }
};
</script>
<style lang="less">
.page-view {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
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
  .page-header-left {
    flex: 1;
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
  .tree-header {
    padding: 8px;
  }
  .image-list-header {
    position: absolute;
    z-index: 1000;
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
</style>
