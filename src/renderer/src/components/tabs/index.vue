<template>
  <div class="tabs">
    <div class="tabs-header">
      <div
        class="tab-item"
        v-for="(item, index) of items"
        :key="index"
        @click="$emit('update:value', item.value)"
        :class="{ active: value === item.value }"
      >
        <Icon v-if="item.icon" :type="item.icon" />
        <div class="tab-item-name">{{ item.name }}</div>
      </div>
    </div>
    <div class="tabs-body">
      <div
        class="tabs-content"
        v-for="(item, index) of items"
        v-show="item.value === value"
        :key="index"
      >
        <slot :name="item.value"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    items: {}
  }
};
</script>

<style lang="less">
.tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .tabs-header {
    background: #eee;
    display: flex;
    .tab-item {
      font-size: 14px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .tab-item-name {
        margin-left: 8px;
      }
      &:hover {
        color: #555;
      }
      &.active {
        background: #fff;
      }
    }
  }
  .tabs-body {
    flex: 1;
    overflow: hidden;
  }
  .tabs-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
}
</style>
