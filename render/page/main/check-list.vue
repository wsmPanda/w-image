<template>
  <div class="checklist">
    <div class="checklist-box">
      {{ data }}
    </div>
    <div class="checklist-tool">
      <Button icon="md-bookmarks" @click="onCollect"></Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {}
  },
  methods: {
    onCollect() {}
  },
  created() {}
};
</script>

<style lang="less">
.checklist {
}
</style>
