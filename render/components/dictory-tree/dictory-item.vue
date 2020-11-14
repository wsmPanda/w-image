<template>
  <div
    class="tree-item"
    v-if="data"
    :class="{
      active: isActive,
      single: !loading && data.hasRead && (!subList || !subList.length)
    }"
  >
    <div @click="onClick" class="tree-item-name">
      <span class="tree-item-name-text" :title="data.name || data.path"
        ><i
          v-if="loading"
          class="ivu-load-loop ivu-icon ivu-icon-ios-loading"
        ></i>
        <Icon
          v-else-if="!data.hasRead || (subList && subList.length)"
          @click.native.stop="onOpen"
          :type="data.open ? 'ios-arrow-up' : 'ios-arrow-forward'"
        ></Icon
        ><Icon
          class="icon-fold"
          :class="{
            'icon-dictory': data.type === 'dictory',
            'icon-set': data.type === 'set'
          }"
          type="md-folder"
        />
        {{ itemName }}</span
      >
      <div
        class="tree-item-name-edit"
        v-if="$treeRoot.edit"
        @click.stop="onDelete"
      >
        <Icon type="md-close"></Icon>
      </div>
      <div
        class="tree-item-name-edit"
        v-else-if="isActive"
        @click.stop="onRefresh"
      >
        <Icon type="md-refresh"></Icon>
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
  props: { data: {}, path: {}, index: Number },
  data() {
    return {
      open: this.data && this.data.open !== undefined ? this.data.open : false,
      subData: null,
      loading: false
    };
  },
  computed: {
    isActive() {
      return (
        this.$treeRoot.active && this.data.path === this.$treeRoot.active.path
      );
    },
    subList() {
      if (this.subData) {
        return this.subData;
      } else {
        return (this.data && this.data.sub) || [];
      }
    },
    itemName() {
      if (this.data.type) {
        return this.data.name || this.data.path;
      } else {
        return this.data.path.split(/\\|\//).pop();
      }
    }
  },
  methods: {
    async onOpen() {
      if (!this.data.hasRead && this.data.type !== "set") {
        await this.getSubData().then(() => {
          this.$set(this.data, "open", true);
        });
      } else {
        this.$set(this.data, "open", !this.data.open);
      }
    },
    onRefresh() {
      this.data.hasRead = false;
      this.getSubData();
      this.$treeRoot.$emit("on-fresh", this.data);
    },
    onClose() {
      if (this.data.open) {
        this.$set(this.data, "open", false);
      }
    },
    async openItem() {
      if (!this.open && !this.data.open) {
        await this.onOpen();
      }
      if (!this.data.hasRead && this.data.type !== "set") {
        await this.getSubData();
      }
      return this.data.sub;
    },
    async getSubData() {
      this.loading = true;
      try {
        this.subData = [];
        let data = await this.$connect.run("getDictoryFolder", {
          path: this.data.path,
          deep: 1
        });
        this.subData = data.sub || [];
        this.$set(this.data, "sub", this.subData);
      } finally {
        this.loading = false;
        this.data.hasRead = true;
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
    if (this.data.hasRead === undefined) {
      this.$set(this.data, "hasRead", false);
    }
  },
  beforeDestroy() {
    this.$treeRoot.cleanItem(this);
  }
};
</script>

<style lang="less">
.tree-item {
  font-size: 12px;
  margin-left: 4px;
  user-select: none;
  .icon-fold {
    color: #fbc776;
    &.icon-dictory {
      color: #76a4fb;
    }
    &.icon-set {
      color: #cddfff;
    }
  }

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
    padding: 2px 0 2px 4px;
    &:hover {
      background: #ebf1fa;
    }
  }
  .tree-item-name-text {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 80px;
  }
  .ivu-icon {
    cursor: pointer;
    margin-right: 2px;
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
