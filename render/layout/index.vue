<template>
  <div class="layout">
    <div
      class="layout-slot layout-slot-left"
      :style="{ width: config.leftFold ? '8px' : config.leftWidth + 'px' }"
    >
      <div
        class="layout-width-resizer"
        @mousedown="onWidthResize($event, 1)"
      ></div>
      <div class="layout-fold" @click="config.leftFold = !config.leftFold">
        <Icon
          :type="config.leftFold ? 'md-arrow-dropright' : 'md-arrow-dropleft'"
        />
      </div>
      <div v-show="!config.leftFold" class="layout-slot-content">
        <slot name="left"></slot>
      </div>
    </div>

    <div class="layout-slot layout-center">
      <div class="layout-slot-content"><slot name="center"></slot></div>
    </div>

    <div
      class="layout-slot layout-slot-right"
      :style="{ width: config.rightFold ? '8px' : config.rightWidth + 'px' }"
    >
      <div
        class="layout-width-resizer"
        @mousedown="onWidthResize($event, -1)"
      ></div>
      <div class="layout-fold" @click="config.rightFold = !config.rightFold">
        <Icon
          :type="config.rightFold ? 'md-arrow-dropleft' : 'md-arrow-dropright'"
        />
      </div>
      <div v-show="!config.rightFold" class="layout-slot-content">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "iview";
/*
TODO：寻找合适滚动条样式/插件
*/
export default {
  components: { Icon },
  props: {
    config: {
      type: Object
    }
  },
  data() {
    return { resizeWidthDict: 1, widthOffset: 0 };
  },
  methods: {
    onWidthResize(e, dict) {
      this.resizeWidthDict = dict;
      this.widthOffset = e.pageX;
      window.addEventListener("mousemove", this.onMove);
      window.addEventListener("mouseup", this.onReizeEnd);
    },
    onMove(e) {
      let offset = e.pageX - this.widthOffset;
      this.widthOffset = e.pageX;
      this.config[(this.resizeWidthDict === 1 ? "left" : "right") + "Width"] +=
        offset * this.resizeWidthDict;
    },
    onReizeEnd() {
      window.removeEventListener("mouseup", this.onReizeEnd);
      window.removeEventListener("mousemove", this.onMove);
    }
  }
};
</script>

<style lang="less">
.layout {
  display: flex;
  height: 100%;
  width: 100%;
  .layout-fold {
    cursor: pointer;
    font-size: 12px;
    position: absolute;
    top: 50%;
    bottom: 0;
    left: -2px;
    width: 6px;
    margin-top: -6px;
    &:hover {
      color: #888;
    }
  }
}

.layout-center {
  flex: 1;
  position: relative;
}
.layout-slot {
  height: 100%;
  overflow: hidden;
  position: relative;
  transition: width 0.2s;
}
.layout-slot-content {
  overflow: auto;
  height: 100%;
  box-sizing: border-box;
}
.layout-width-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: col-resize;
}
.layout-slot-left {
  width: 30%;
  position: relative;
  box-shadow: 2px 0 2px #eee;
  .layout-width-resizer {
    right: -2px;
  }
  .layout-fold {
    right: 4px;
    left: auto;
  }
}
.layout-slot-right {
  width: 30%;
  position: relative;
  box-shadow: -2px 0 2px #eee;
  z-index: 1000;
  .layout-width-resizer {
    left: -2px;
  }
}
</style>
