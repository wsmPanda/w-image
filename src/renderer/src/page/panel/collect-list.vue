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

    <CommonTree class="tree-body" ref="commonTree" :data="data">
      <template v-slot:name="{ data, open }">
        <Icon
          class="icon-fold"
          :class="{
            'collect-icon': true
          }"
          :type="open ? 'ios-folder-open' : 'md-folder'"
        />
        {{
          data.name || (data.path && data.path.split(/\/|\\/).pop())
        }}</template
      >
    </CommonTree>

    <NameInput
      ref="nameInput"
      v-if="nameEditing && data && data[editIndex]"
      :value="data[editIndex].name"
      @blur="saveName"
    ></NameInput>
  </div>
</template>

<script>
import CommonTree from "render/components/tree/index.vue";
import NameInput from "../../components/name-input/index.vue";
export default {
  inject: ["$config", "$main"],
  components: { NameInput, CommonTree },
  props: {
    edit: Boolean
  },
  data() {
    return {
      nameEditing: false,
      active: null,
      editIndex: null,
      data: [],
      foldMenu: [
        {
          name: "删除",
          icon: "md-open"
        },
        {
          name: "重命名",
          icon: "md-open"
        },
        {
          name: "添加刀片",
          icon: "md-open"
        }
      ]
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
        this.nameEditing = false;
      });
    },
    editName() {
      this.nameEditing = true;
      this.editIndex = this.data.findIndex(
        item => item.createTime === this.active
      );
      this.$nextTick(() => {
        this.$refs.nameInput.setLink(this.$refs.name[this.editIndex]);
      });
    },
    async update() {
      this.data = (await this.$connect.getData("collect")) || {};
      this.data.forEach(item => {
        if (!item.path) {
          item.path = item.createTime;
        }
        if (!item.sub) {
          item.sub = item.files || [];
        }
      });
    },
    isFile() {},
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
  beforeMount() {
    this.update();
    this.$main.$on("collectChange", () => {
      this.update();
    });
    this.$main.addListenerKeyup(this, e => {
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
  padding: 8px 0;
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
  direction: ltr;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.icon-fold.collect-icon {
  color: #79bee6 !important;
}
</style>
