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
    edit: Boolean,
    initActive: {}
  },
  data() {
    return {
      active: this.initActive,
      selected: [],
      activeNode: null,
      needActive:false
    };
  },
  methods: {
    setActive(v) {
      this.active = v;
      this.$emit("on-active-set");
      this.$nextTick(() => {
        this.openActiveNode(this.data);
      });
      this.scrollToActive();
    },
    async openActiveNode(data) {
      console.log('!')
      if (this.active) {
        let path = this.active.path;
        let node = data.find((item) => item && path.indexOf(item.path) === 0);
        if (!node) {
          return;
        }
        if (node.path === this.active.path) {
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
      if(item.data.path === this.active.path){
        console.log('???????')
       this.scrollToActive();}
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
      console.error('s')
      if (this.active && this.items[this.active.path]) {
        setTimeout(() => {
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
