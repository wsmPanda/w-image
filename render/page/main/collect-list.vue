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
  methods: {
    async update() {
      this.data = (await this.$connect.getData("collect")) || {};
    }
  },
  created() {
    this.update();
  }
};
</script>

<style></style>
