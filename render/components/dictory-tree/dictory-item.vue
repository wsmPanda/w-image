<template>
  <div
    class="tree-item"
    v-if="data"
    :class="{
      active: $treeRoot.active && data.path === $treeRoot.active.path,
      single: !loading && hasLoad && (!subList || !subList.length)
    }"
  >
    <div @click="onClick" class="tree-item-name">
      <span class="tree-item-name-text" :title="data.name || data.path"
        ><i
          v-if="loading"
          class="ivu-load-loop ivu-icon ivu-icon-ios-loading"
        ></i>
        <Icon
          v-else-if="!hasLoad || (subList && subList.length)"
          @click.native.stop="onOpen"
          :type="data.open ? 'ios-arrow-up' : 'ios-arrow-forward'"
        ></Icon
        ><Icon
          class="icon-fold"
          :class="{ 'icon-dictory': isDictory }"
          type="md-folder"
        />{{ data.name || data.path }}</span
      >
      <div class="tree-item-name-edit" v-if="$treeRoot.edit" @click="onDelete">
        <Icon type="md-close"></Icon>
      </div>
    </div>
    <div
      v-if="subList && subList.length"
      v-show="data.open"
      class="tree-item-sub"
    >
      <TreeDictoryItem
        v-for="(item, index) of subList"
        :data="item"
        :key="item.path"
        :index="index"
        @on-delete="onDelete"
      ></TreeDictoryItem>
    </div>
  </div>
</template>

<script>
//import TreeItem from "./item.vue";
import { Icon } from "iview";
export default {
  name: "TreeDictoryItem",
  inject: ["$treeRoot"],
  components: { Icon },
  props: { data: {}, path: {}, isDictory: Boolean, index: Number },
  data() {
    return {
      open: false,
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
        this.getSubData().then(() => {
          this.$set(this.data, "open", true);
        });
      } else {
        this.$set(this.data, "open", !this.data.open);
      }
    },
    onClose() {
      if (this.data.open) {
        this.$set(this.data, "open", false);
      }
    },
    async getSubData() {
      this.loading = true;
      try {
        this.subData = [];
        let data = await this.$connect.getDictoryFolder(this.data);
        this.subData = data.sub || [];
        this.$set(this.data, "sub", this.subData);
      } finally {
        this.loading = false;
        this.hasLoad = true;
      }
    },
    onClick() {
      this.$emit("on-click", this.index);
      this.$treeRoot.onItemClick({ data: this.data, path: this.data.path });
    },
    onDelete() {
      this.$emit("on-delete", this.index);
      this.$treeRoot.onDictoryDelete({
        data: this.data,
        path: this.data.path,
        index: this.index
      });
    }
  },
  created() {
    this.$treeRoot.initItem(this);
  },
  beforeDestroy() {
    this.$treeRoot.cleanItem(this);
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
    word-break: break-all;
    display: flex;
    padding: 2px 4px;
    &:hover {
      background: #ebf1fa;
    }
  }
  .tree-item-name-text {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
