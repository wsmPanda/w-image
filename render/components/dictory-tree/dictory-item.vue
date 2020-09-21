<template>
  <div
    class="tree-item"
    v-if="data"
    :class="{
      active: data === $treeRoot.active,
      single: !loading && hasLoad && (!subList || !subList.length)
    }"
  >
    <div @click="onClick" class="tree-item-name">
      <i v-if="loading" class="ivu-load-loop ivu-icon ivu-icon-ios-loading"></i>
      <Icon
        v-else-if="!hasLoad || (subList && subList.length)"
        @click.native="onOpen"
        :type="open ? 'ios-arrow-up' : 'ios-arrow-forward'"
      ></Icon
      ><span
        ><Icon class="icon-fold icon-dictory" type="md-folder" />{{
          data.path
        }}</span
      >
    </div>
    <div v-if="subList && subList.length" v-show="open" class="tree-item-sub">
      <TreeItem
        v-for="(item, index) of subList"
        :data="item"
        :key="index"
      ></TreeItem>
    </div>
  </div>
</template>

<script>
import TreeItem from "./item.vue";
import { Icon } from "iview";
export default {
  name: "TreeDictoryItem",
  inject: ["$treeRoot"],
  components: { Icon, TreeItem },
  props: { data: {}, path: {} },
  data() {
    return {
      open: true,
      subData: null,
      hasLoad: false,
      loading: false
    };
  },
  computed: {
    subList() {
      if (this.subData) {
        return this.subData;
      } else {
        return (this.data && this.data.sub) || [];
      }
    }
  },
  methods: {
    onOpen() {
      if (!this.hasLoad) {
        this.getSubData();
      } else {
        this.open = !this.open;
      }
    },
    async getSubData() {
      this.loading = true;
      try {
        this.subData = [];
        let data = await this.$connect.getDictoryFolder(this.data);
        this.subData = data.sub || [];
      } finally {
        this.loading = false;
        this.hasLoad = true;
      }
    },
    onClick() {
      // this.$emit("on-click");
      // this.$treeRoot.onItemClick({ data: this.data, path: this.path });
    }
  }
};
</script>

<style lang="less">
.tree-item {
  font-size: 12px;
  margin: 0 4px;
  user-select: none;
  .tree-item-sub {
    padding-left: 12px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      border-left: 1px solid #eee;
      top: 0;
      left: 10px;
      bottom: 8px;
    }
    &::after {
      content: "";
      position: absolute;
      border-bottom: 1px solid #eee;
      left: 10px;
      width: 10px;
      bottom: 8px;
    }
  }
  .tree-item-name {
    padding: 2px 4px;
    &:hover {
      background: #ebf1fa;
    }
  }
  .ivu-icon {
    cursor: pointer;
    margin-right: 2px;
  }
  .icon-fold {
    color: #fbc776;
  }
  .icon-dictory {
    color: #76a4fb;
  }
  &.single {
    > .tree-item-name {
      padding-left: 16px;
    }
  }
  &.active {
    > .tree-item-name {
      background: #ebf1fa;
    }
  }
}
</style>
