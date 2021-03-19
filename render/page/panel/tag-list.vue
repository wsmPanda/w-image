<template>
  <div class="collect-list">
    <div
      v-for="(item, index) of $main.tags"
      :key="index"
      class="collect-item"
      :class="{ _active: active === item.createTime }"
      @click="$main.onCollectActive(item)"
    >
      <Icon
        class="collect-icon"
        type="md-pricetag"
        :style="{
          color: item.color
        }"
      ></Icon>
      <span ref="name" class="collect-name">{{ item.name }}</span>
      <Icon type="md-close" @click.native.stop="onDelete(item, index)"></Icon>
    </div>
  </div>
</template>

<script>
// import ImageList from "render/components/big-image-list";
export default {
  inject: ["$config", "$main"],
  data() {
    return { active: null };
  }
};
</script>

<style></style>
