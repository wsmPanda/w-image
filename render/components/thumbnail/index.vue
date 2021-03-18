<template>
  <div class="thumbnail" @mousedown="onDragstart">
    <img
      v-if="isImage && loaded"
      @error="loaded = false"
      class="thumbnail-img"
      :src="'file://' + src"
    />
    <div class="thumbnail-icon" v-else>
      <FileIcon :type="suffix"></FileIcon>
    </div>
    <!-- <video
      v-else
      class="thumbnail-img"
      controls="controls"
      preload="metadata"
      muted
    >
      <source :src="'file://' + src" />
    </video> -->
    <div v-if="showName" class="thumbnail-name" :title="name">{{ name }}</div>
    <div class="thumbnail-tags" v-if="showTags && tags && tags.length">
      <div
        class="thumbnail-tag"
        v-for="tag of tags"
        :key="tag"
        :style="{
          background: $main.tagMap[tag] && $main.tagMap[tag].color
        }"
      >
        {{ tag }}
      </div>
    </div>
    <Icon
      v-show="showCheck"
      @click.native.stop="onCheck"
      @dblclick.native.stop
      class="thumbnail-check"
      :class="{ uncheck: !this.check }"
      :type="'md-checkmark-circle'"
    />
    <Icon
      v-show="showDelete"
      @click.native.stop="onDelete"
      @dblclick.native.stop
      class="thumbnail-delete"
      type="md-close-circle"
    />
  </div>
</template>

<script>
import { isImage, getSuffix } from "render/util";
import FileIcon from "../file-icon";
export default {
  inject: ["$main"],
  components: { FileIcon },
  props: {
    src: String,
    showCheck: { type: Boolean, default: true },
    check: Boolean,
    showName: { type: Boolean, default: true },
    showTags: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false }
  },
  data() {
    return {
      v: false,
      loaded: true
    };
  },
  watch: {
    active(v) {
      if (v) {
        this.$nextTick(() => {
          this.$el && this.$el.scrollIntoViewIfNeeded();
        });
      }
    }
  },
  computed: {
    name() {
      return this.src && this.src.split("/").pop();
    },
    isImage() {
      return isImage(this.src);
    },
    suffix() {
      return getSuffix(this.src);
    },
    tags() {
      return this.$main.getTags(this.src);
    }
  },
  methods: {
    onDragstart() {
      setTimeout(() => {
        this.$connect.run("fileDrag", {
          path: this.src
        });
      }, 300);
    },
    onCheck() {
      this.$emit("check", this.check);
    },
    onDelete() {
      this.$emit("delete", this.data);
    }
  }
};
</script>

<style lang="less">
.thumbnail {
  padding: 4px;
  padding-bottom: 30px;
  box-sizing: border-box;
  position: relative;
  user-select: none;
  .thumbnail-icon {
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin-bottom: 30px;
  }
  .thumbnail-tags {
    position: absolute;
    right: 4px;
    top: 4px;
    text-align: center;
  }
  .thumbnail-tag {
    font-size: 10px;
    background: #4654b1af;
    color: #fff;
    padding: 1px 4px;
    line-height: 12px;
    border-radius: 2px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.05);
    margin-bottom: 0;
  }
  video {
    pointer-events: none;
  }
  video::-webkit-media-controls-panel {
    display: none;
  }
}
.thumbnail-check {
  position: absolute;
  font-size: 18px;
  left: 4px;
  top: 4px;
  color: #2b85e4;
  cursor: pointer;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.4);
  &.uncheck {
    color: transparent;
    border: 1px solid #2b85e4;
    border-radius: 100%;
    height: 16px;
    box-sizing: border-box;
    width: 16px;
    margin: 2px;
  }
}
.thumbnail-delete {
  position: absolute;
  font-size: 18px;
  right: 8px;
  top: 8px;
  cursor: pointer;
  opacity: 0.8;
}
.thumbnail-suffix {
  height: 100%;
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  font-family: sans-serif;
  color: #4654b1;
}
.thumbnail-img {
  object-fit: contain;
  height: 100%;
  //user-select: none;
  width: 100%;
  margin-bottom: 30px;
  -webkit-user-drag: none;
}
.thumbnail-name {
  margin-top: -30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: center;
}
</style>
