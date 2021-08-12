<template>
  <div
    class="tree-item"
    v-if="data"
    :data-key="dataKey"
    :class="{
      active: dataKey === $treeRoot.active,
      context: dataKey === $treeRoot.contextKey,
      single: !subData || !subData.length
    }"
  >
    <div @click="onClick" class="tree-item-name">
      <Checkbox
        v-if="$treeRoot.multipleSelect"
        :value="$treeRoot.selected.indexOf(dataKey) >= 0"
        @input="$treeRoot.onItemCheck(data)"
        @click.stop
      ></Checkbox>
      <i v-if="loading" class="ivu-load-loop ivu-icon ivu-icon-ios-loading"></i>
      <Icon
        v-else-if="hasSubData"
        @click.native.stop="onOpen"
        :type="open ? 'ios-arrow-up' : 'ios-arrow-forward'"
      ></Icon>
      <span>
        <!-- <Icon class="icon-fold" type="md-folder" /> -->
        <slot name="name" :data="data"></slot>
      </span>
    </div>
    <div
      v-if="data && subData && subData.length"
      v-show="open"
      class="tree-item-sub"
    >
      <TreeItem
        v-for="(item, index) of subData"
        :data="item"
        :key="index"
        @remove="removeChildren(index)"
        ><template v-slot:name="{ data }">
          <slot name="name" :data="data"></slot></template
      ></TreeItem>
    </div>
  </div>
</template>

<script>
import { Icon } from "iview";
export default {
  name: "TreeItem",
  inject: ["$treeRoot"],
  components: { Icon },
  props: { data: {} },
  data() {
    return {
      open:
        this.data.open === undefined
          ? this.$treeRoot.defaultOpen
          : this.data.open,
      loading: false
    };
  },
  computed: {
    subData() {
      return this.data && this.data[this.subKey];
    },
    subKey() {
      return this.$treeRoot.subKey;
    },
    dataKey() {
      return this.data[this.$treeRoot.idKey];
    },
    hasSubData() {
      if (!this.$treeRoot.subGetter) {
        return this.subData && this.subData.length;
      } else {
        return !this.data.hasRead || (this.subData && this.subData.length);
      }
    },
    hasRead() {
      return this.data.hasRead || (this.subData && this.subData.length > 0);
    }
  },
  methods: {
    onClick() {
      this.$emit("on-click");
      this.$treeRoot.onItemClick(this.data);
    },
    async onRefresh() {
      let open = this.data.open;
      this.$set(this.data, "hasRead", false);
      await this.getSubData();
      this.data.open = open;
      if (this.dataKey === this.$treeRoot.active) {
        this.$treeRoot.$emit("on-fresh", this.data);
      }
    },
    async onOpen() {
      if (!this.hasRead && this.$treeRoot.subGetter) {
        await this.getSubData();
        this.$set(this.data, "open", true);
        this.open = true;
      } else {
        this.$set(this.data, "open", !this.data.open);
        this.open = this.data.open;
      }
    },
    async getSubData() {
      this.loading = true;
      try {
        this.currentSubData = [];
        let data = await this.$treeRoot.subGetter(this.data);
        this.currentSubData = data || [];
        if (data.error) {
          this.$set(this.data, "error", true);
        } else {
          data.error = false;
        }
        this.$set(this.data, this.subKey, this.currentSubData);
      } finally {
        this.loading = false;
        this.data.hasRead = true;
      }
    },
    removeNode() {
      console.log(this.data, this.index);
      this.$emit("remove", { index: this.index, data: this.data });
    },
    removeChildren(index) {
      this.data[this.subKey] && this.data[this.subKey].splice(index, 1);
    }
  },
  destroyed() {
    this.$treeRoot.node[this.dataKey] = null;
  },
  created() {
    this.$treeRoot.node[this.dataKey] = this;
  }
};
</script>

<style lang="less">
.tree-common {
  .ivu-checkbox-wrapper {
    margin-right: 2px;
  }
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
      &.icon-error {
        color: #d9dadc;
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
      white-space: nowrap;
      display: flex;
      padding: 2px 0 2px 4px;
      align-items: center;
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
    &.context {
      > .tree-item-name {
        margin: -2px;
        border: 2px solid #ebf1fa;
      }
    }
  }
}
</style>
