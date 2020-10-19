<template>
  <div>
    <TreeItem
      v-for="(item, index) of data"
      :data="item"
      :index="index"
      :key="item.path"
      :path="item.path"
      @on-delete="onDelete"
    ></TreeItem>
  </div>
</template>

<script>
import TreeItem from "./dictory-item";
export default {
  provide() {
    return {
      $treeRoot: this
    };
  },
  components: { TreeItem },
  props: {
    data: Array,
    edit: Boolean
  },
  data() {
    return {
      active: null,
      selected: []
    };
  },
  methods: {
    setActive(v) {
      this.active = v;
      this.$emit("on-active-set");
      this.scrollToActive();
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
      this.scrollToActive();
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
      if (this.active && this.items[this.active.path]) {
        this.$nextTick(() => {
          if (
            this.items[this.active.path] &&
            this.items[this.active.path].$el
          ) {
            this.items[this.active.path].$el.scrollIntoViewIfNeeded();
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
