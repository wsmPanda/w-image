<template>
  <div class="collect-list">
    <div
      v-for="(item, index) of data"
      :key="index"
      class="collect-item"
      :class="{ active: active === item.createTime }"
      @click="onCollectActive(item)"
    >
      <Icon class="collect-icon" type="md-folder"></Icon>
      <span class="collect-name">{{ item.name }}</span>
      <Icon type="md-close" @click.native.stop="onDelete(data, index)"></Icon>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["$config", "$main"],
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
      this.data = (await this.$connect.getData("collect")) || {};
    },
    async onDelete(data, index) {
      this.data.splice(index, 1);
      this.$connect.deleteData("collect", {
        code: "createTime",
        value: data.createTime
      });
    },
    async onCollectActive(data) {
      this.$emit("collectClick", data);
      this.active = data.createTime;
    }
  },
  created() {
    this.update();
    this.$main.$on("collectChange", () => {
      this.update();
    });
  }
};
</script>

<style lang="less">
.collect-list {
  padding: 16px 8px;
}
.collect-item {
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
.collect-name {
  flex: 1;
  direction: rtl;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.collect-icon {
  color: #79bee6;
}
</style>
