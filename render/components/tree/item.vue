<template>
  <div
    class="tree-item"
    v-if="data && data.sub"
    :class="{
      active: data === $treeRoot.active,
      single: !data.sub || !data.sub.length
    }"
  >
    <div @click="onClick" class="tree-item-name">
      <Icon
        v-if="data && data.sub && data.sub.length"
        @click.native="open = !open"
        :type="open ? 'ios-arrow-up' : 'ios-arrow-forward'"
      ></Icon
      ><span><Icon class="icon-fold" type="md-folder" />{{ data.path }}</span>
    </div>
    <div
      v-if="data && data.sub && data.sub.length"
      v-show="open"
      class="tree-item-sub"
    >
      <TreeItem
        v-for="(item, index) of data.sub"
        :data="item"
        :key="index"
        :path="path + '/' + item.path"
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
  props: { data: {}, path: {} },
  data() {
    return {
      open: true
    };
  },
  methods: {
    onClick() {
      this.$emit("on-click");
      this.$treeRoot.onItemClick({ data: this.data, path: this.path });
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
