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
      <span ref="name" class="collect-name">{{ item.name }}</span>
      <Icon type="md-close" @click.native.stop="onDelete(item, index)"></Icon>
    </div>
    <NameInput
      ref="nameInput"
      v-if="nameEditing && data && data[editIndex]"
      :value="data[editIndex].name"
      @blur="saveName"
    ></NameInput>
  </div>
</template>

<script>
import NameInput from "../../components/name-input";
export default {
  inject: ["$config", "$main"],
  components: { NameInput },
  props: {
    edit: Boolean
  },
  data() {
    return {
      nameEditing: false,
      active: null,
      editIndex: null,
      data: []
    };
  },
  methods: {
    saveName(name) {
      let data = this.data[this.editIndex];
      data.name = name;
      this.$connect.editData("collect", {
        code: "createTime",
        value: data.createTime,
        data
      });
      setTimeout(() => {
        console.log("nameEditing!");
        this.nameEditing = false;
      });
    },
    editName() {
      console.log("???");
      this.nameEditing = true;
      this.editIndex = this.data.findIndex(
        (item) => item.createTime === this.active
      );
      this.$nextTick(() => {
        this.$refs.nameInput.setLink(this.$refs.name[this.editIndex]);
      });
    },
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
      this.$emit("keyListenerFocus");
      this.$emit("collectClick", data);
      this.active = data.createTime;
    }
  },
  destroyed() {
    this.$main.removeListenerKeyup(this);
  },
  created() {
    this.update();
    this.$main.$on("collectChange", () => {
      this.update();
    });
    this.$main.addListenerKeyup(this, (e) => {
      if (e.key === "F2" || e.key === "Enter") {
        if (this.active && !this.nameEditing) {
          this.editName();
        }
      }
    });
  }
};
</script>

<style lang="less">
.hidden-input {
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  border: 0;
}
.collect-list {
  padding: 8px 8px;
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
