<template>
  <div class="bookmark-list">
    <div
      v-for="(item, index) of data"
      :key="index"
      class="bookmark-item"
      :class="{ active: active === item.createTime }"
      @click="onBookmarkActive(item)"
    >
      <Icon class="bookmark-icon" type="md-bookmark"></Icon>
      <span class="bookmark-name">{{ item.dictory && item.dictory.path }}</span>
      <Icon type="md-close" @click.native.stop="onDelete(data, index)"></Icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    edit: Boolean
  },
  data() {
    return {
      active: null,
      data: []
    };
  },
  methods: {
    async update() {
      this.data = await this.$connect.getData("bookmark");
    },
    onDelete(data, index) {
      this.data.splice(index, 1);
      this.$connect.deleteData("bookmark", {
        code: "createTime",
        value: data.createTime
      });
    },
    onBookmarkActive(data) {
      this.$emit("bookmarksClick", data);
      this.active = data.createTime;
    }
  },
  beforeMount() {
    this.update();
  }
};
</script>

<style lang="less">
.bookmark-list {
  padding: 16px 8px;
}
.bookmark-item {
  display: flex;
  cursor: pointer;
  .ivu-icon {
    line-height: 18px;
    margin: 0 2px;
  }
  &.active {
    background: #ebf1fa;
  }
  &:hover {
    background: #ebf1fa;
  }
}
.bookmark-name {
  flex: 1;
  direction: rtl;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.bookmark-icon {
  color: #e67979;
}
</style>
