<template>
  <div class="task-file-table">
    <div>已选择{{ selected.length }}项</div>
    <CommonTree
      v-if="value"
      :data="value"
      :defaultOpen="true"
      :selected="selected"
      multipleSelect
    >
      <template v-slot:name="{ data }">
        <Icon
          class="icon-fold"
          :type="
            data.type === 'dictory'
              ? data.open
                ? 'ios-folder-open'
                : 'md-folder'
              : 'md-document'
          "
        />
        {{ (data.path || data).split(/\/|\\/).pop() }}
        <div
          v-if="data.action"
          class="tree-action"
          :class="{ error: data.action.error }"
        >
          {{ data.action.message }}
        </div>
      </template>
    </CommonTree>
  </div>
</template>

<script>
import CommonTree from "render/components/tree";
export default {
  components: { CommonTree },
  inject: ["$main"],
  props: {
    value: {}
  },
  data() {
    return {
      selected: [],
      oparations: [
        {
          name: "删除",
          color: "#ff9900"
        },
        {
          name: "移动",
          color: "#19be6b"
        },
        {
          name: "复制",
          color: "#2db7f5"
        },
        {
          name: "重命名",
          color: "#2d8cf0"
        }
      ]
    };
  },
  methods: {},
  created() {}
};
</script>

<style lang="less">
.task-file-table {
  .tree-item-name span {
    display: flex;
  }
  .tree-common .tree-item .tree-item-name {
    font-size: 12px;
    padding-top: 0;
    padding-bottom: 0;
    .ivu-icon-md-document {
      color: rgb(196, 209, 252);
    }
  }
}
.tree-action {
  font-size: 11px;
  margin-left: 8px;
  color: rgb(89, 103, 255);
  &.error {
    color: rgb(255, 82, 94);
  }
}
</style>
