<template>
  <Popper ref="popper" class="contextmenu">
    <template v-if="menu && menu.length">
      <template v-for="(item, index) of menu">
        <div
          v-if="!item.children"
          class="contextmenu-item"
          :key="index"
          :class="{
            disabled: item.disabled
          }"
          @click="onClick(item)"
        >
          <Icon
            class="contextmenu-item-icon"
            v-if="item.icon"
            :type="item.icon"
          ></Icon
          >{{ item.name }}
        </div>
        <div v-else class="contextmenu-item" :key="index">
          <Icon
            class="contextmenu-item-icon"
            v-if="item.icon"
            :type="item.icon"
          ></Icon
          >{{ item.name }}<Icon type="md-arrow-dropright" />
          <div class="contextmenu-item-children">
            <div
              v-for="(child, index) of item.children"
              :class="{
                disabled: item.disabled
              }"
              class="contextmenu-item"
              :key="index"
              @click="onClick(child)"
            >
              <Icon
                class="contextmenu-item-icon"
                v-if="child.icon"
                :type="child.icon"
              ></Icon
              >{{ child.name }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </Popper>
</template>

<script>
import Popper from "../popper";
export default {
  components: { Popper },
  props: {
    menu: Array,
    params: {}
  },
  methods: {
    show(e) {
      this.$refs.popper.setPositionMouse(e);
    },
    close() {
      this.$refs.popper.close();
    },
    onClick(item) {
      if (item.action) {
        item.action(this.params);
        this.close();
      }
    }
  },
  created() {}
};
</script>

<style lang="less">
.contextmenu {
  background: #fafafa;
  position: absolute;
  top: 10px;
  left: 10px;
  min-height: 40px;
  min-width: 120px;
  box-shadow: 0 0 2px #ddd;
  border: 1px solid #ddd;
  border-radius: 2px;
  z-index: 9999;
  user-select: none;
  padding: 4px 0;
  .contextmenu-item-icon {
    margin-right: 4px;
  }
  .contextmenu-item {
    padding: 2px 16px;
    position: relative;
    &:hover {
      background: #735bed;
      color: #fff;
      .contextmenu-item-children {
        display: block;
      }
    }
    &.disabled {
      background: transparent !important;
      color: rgb(190, 192, 198) !important;
    }
    .contextmenu-item-children {
      position: absolute;
      display: none;
      min-width: 120px;
      background: #fafafa;
      top: -4px;
      left: 100%;
      min-height: 40px;
      min-width: 120px;
      box-shadow: 0 0 2px #ddd;
      border: 1px solid #ddd;
      border-radius: 2px;
      z-index: 9999;
      user-select: none;
      margin-left: 0;
      padding: 4px 0;
      .contextmenu-item {
        color: rgb(81, 90, 110);
        &:hover {
          background: #735bed;
          color: #fff;
        }
      }
      &:hover {
        color: rgb(81, 90, 110);
      }
    }
  }
}
</style>
