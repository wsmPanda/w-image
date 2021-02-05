<template>
  <div class="tree-panel">
    <TreeItem
      v-for="(item, index) of data"
      :data="item"
      :index="index"
      :key="key(item) || '_' + index"
      @on-delete="onDelete"
    ></TreeItem>
  </div>
</template>

<script>
import TreeItem from "./tree-item";
export default {
  provide() {
    return {
      $treeRoot: this
    };
  },
  components: { TreeItem },
  props: {
    data: Array,
    edit: Boolean,
    initActive: {},
    childrenGetter: Function,
    itemKey: {
      type: String,
      default: "path"
    },
    getIcon: Function,
    rename: Boolean,
    drag: Boolean,
    multiple: Boolean
  },
  data() {
    return {
      active: this.initActive,
      selected: [],
      activeNode: null,
      needActive: false
    };
  },
  computed: {
    activeKey() {
      return this.key(this.active);
    }
  },
  methods: {
    key(data) {
      return data && data[this.itemKey];
    },
    openAll() {},
    setActive(v) {
      this.active = v;
      this.$emit("on-active-set");
      this.$nextTick(() => {
        this.openActiveNode(this.data);
      });
      this.scrollToActive();
    },
    async openActiveNode(data) {
      if (this.active) {
        let path = this.activeKey;
        let node = data.find((item) => item && path.indexOf(item.path) === 0);
        if (!node) {
          return;
        }
        if (node.path === this.activeKey) {
          this.scrollToActive();
        } else {
          let nodeItem = this.items[node.path];
          if (nodeItem) {
            let sub = await nodeItem.openItem();
            this.$nextTick(() => {
              if (sub && sub.length) {
                this.openActiveNode(sub);
              }
            });
          }
        }
      }
    },
    onItemClick({ data, path }) {
      this.active = data;
      this.$emit("on-active", { data, path });
    },
    onDelete(index) {
      this.data.splice(index, 1);
    },
    onDictoryDelete({ data, path }) {
      this.$emit("on-delete", { data, path });
      this.$connect.run("deleteDictory", data);
    },
    initItem(item) {
      this.items[item.data.path] = item;
      if (item.data.path === this.activeKey) {
        this.scrollToActive();
      }
    },
    cleanItem(item) {
      this.items[item.data.path] = null;
    },
    closeAll() {
      for (let code in this.items) {
        if (this.items[code] && this.items[code].onClose) {
          this.items[code].onClose();
        }
      }
    },
    scrollToActive() {
      if (this.active && this.items[this.activeKey]) {
        setTimeout(() => {
          if (this.items[this.activeKey] && this.items[this.activeKey].$el) {
            this.items[this.activeKey].$el.scrollIntoViewIfNeeded();
          }
        });
      }
    }
  },
  created() {
    this.items = {};
  }
};
</script>

<style></style>
