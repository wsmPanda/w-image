<script>
import Thumbnail from "../thumbnail";
import { Icon } from "iview";
export default {
  render() {
    this.transformTop = Math.max(0, this.heightList[this.startIndex - 1]) || 0;
    if (this.startIndex === 0) {
      this.transformTop = 0;
    }
    return (
      <div class="image-bigtable">
        <div
          ref="listWrapper"
          class="image-bigtable-list-wrapper"
          style={{ height: this.height + "px" }}
          on={{ scroll: (e) => this.onScroll(e) }}
        >
          <div
            class="image-bigtable-list"
            style={{
              height: this.listHeight + "px"
            }}
          >
            <div
              class="image-bigtable-list-inner"
              style={{
                transform: `translateY(${this.transformTop}px)`
              }}
            >
              {this.viewData.map((row, index) => {
                if (row && row.path) {
                  return (
                    <div
                      class={{
                        "dictory-list-item": true
                        // start: index === 0,
                        // current: index + this.startIndex === this.currentIndex,
                        // end: index === this.viewData.length - 1
                      }}
                      key={index + this.startIndex}
                    >
                      <Icon
                        type={!this.open ? "ios-arrow-up" : "ios-arrow-forward"}
                      ></Icon>
                      <Icon class="icon-fold" type="md-folder" />
                      <a
                        on={{
                          click: () => this.onDictoryClick(row)
                        }}
                      >
                        {row.name || row.path}
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <Thumbnail
                      class={{
                        "image-list-item": true,
                        active: this.activeImage === row,
                        // start: index === 0,
                        // current: index + this.startIndex === this.currentIndex,
                        // end: index === this.viewData.length - 1
                      }}
                      nativeOn={{
                        click: () => this.onClick(row)
                      }}
                      showName={this.imageSetting.showFileName}
                      key={index + this.startIndex}
                      src={row}
                      style={this.thumbnailStyle}
                    ></Thumbnail>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
  props: {
    imageSetting: {
      type: Object,
      default() {
        return {
          padding: 4,
          margin: 4,
          column: 3,
          height: 80
        };
      }
    },
    dictorySetting: {
      type: Object,
      default() {
        return {
          height: 34
        };
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 600
    },
    preloadPage: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      activeImage: null
    };
  },
  computed: {
    thumbnailStyle() {
      return {
        paddingTop: `${this.imageSetting.padding}px`,
        paddingLeft: `${this.imageSetting.padding}px`,
        paddingRight: `${this.imageSetting.padding}px`,
        marginBottom: `${this.imageSetting.margin}px`,
        height: `${this.imageSetting.height}px`,
        minHeight: `${this.imageSetting.height}px`,
        width: `${100 / this.imageSetting.column}%`
      };
    },
    dictoryHeight() {
      return Number(this.dictorySetting.height);
    },
    imageHeight() {
      return (
        Number(this.imageSetting.height) + Number(this.imageSetting.margin)
      );
    }
  },
  watch: {
    imageSetting() {
      this.updateHeightList();
    }
  },
  methods: {
    onDictoryClick(v) {
      this.$emit("dictoryClick", v);
    },
    onClick(v) {
      this.activeImage = v;
      this.$emit("activeImageChange", v);
    },
    // 二分法查找当前的目标元素
    findIndex(height, start = 0, end) {
      if (!end || end > this.data.length - 1) {
        end = this.data.length - 1;
      }
      while (start < end) {
        let mid = Math.floor((start + end) / 2);
        if (mid === start || mid === 0 || mid === end) {
          break;
        } else if (this.heightList[mid] > height) {
          end = mid;
        } else if (this.heightList[mid] < height) {
          start = mid + 1;
        } else {
          start = mid;
          break;
        }
      }
      return start;
    },
    setData(data) {
      this.data = data;
      if (this.$refs.listWrapper) {
        this.$refs.listWrapper.scrollTop = 0;
      }
      this.updateHeightList();
      this.updateList();
    },
    updateHeightList() {
      this.heightList = [];
      // 生成元素高度位置的单向数列
      let count = 0;
      let columnCount = 0;
      this.data.forEach((row) => {
        columnCount++;
        if (row && row.path) {
          count += this.dictoryHeight;
          // 目录元素清空行元素计数
          columnCount = 0;
        } else if (columnCount === 1) {
          // 对于图片元素只有首行才增加高度
          count += this.imageHeight;
        }
        // 清空行元素计数
        if (columnCount === Number(this.imageSetting.column)) {
          columnCount = 0;
        }
        this.heightList.push(count);
      });
      this.listHeight = this.heightList[this.heightList.length - 1];
    },
    async updateList() {
      this.listHeight = this.heightList[this.heightList.length - 1];
      await this.pageChange();
      this.$forceUpdate();
    },
    async pageChange() {
      this.currentIndex = this.findIndex(this.scrollTop);
      let dictoryIndex = this.currentIndex;
      while (dictoryIndex > 0 && typeof this.data[dictoryIndex] === "string") {
        dictoryIndex = dictoryIndex - 1;
      }
      if (dictoryIndex !== this.dictoryIndex) {
        this.dictoryIndex = dictoryIndex;
        this.$emit("dictoryChange", this.data[dictoryIndex]);
      }
      this.startIndex = this.findIndex(
        Math.max(this.scrollTop - this.height * this.preloadPage, 0),
        0,
        this.currentIndex
      );
      // 向前找到同行的首个元素
      while (
        this.startIndex > 0 &&
        this.heightList[this.startIndex - 1] ===
          this.heightList[this.startIndex]
      ) {
        this.startIndex = this.startIndex - 1;
      }
      this.endIndex = this.findIndex(
        Math.min(
          Math.max(this.scrollTop + this.height * (this.preloadPage + 1)),
          this.listHeight
        ),
        this.currentIndex
      );
      // 向前找到同行的首个元素
      while (
        this.endIndex < this.data.length + 1 &&
        this.heightList[this.endIndex + 1] === this.heightList[this.endIndex]
      ) {
        this.endIndex = this.endIndex + 1;
      }
      this.endIndex = this.endIndex + 1;
      this.viewData = this.data.slice(this.startIndex, this.endIndex);
    },
    onScroll() {
      if (this.$refs.listWrapper) {
        if (this.scrollTimer) {
          clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(async () => {
          this.$emit("scroll", this.$refs.listWrapper.scrollTop || 0);
          this.checkPosition();
        }, 30);
      }
    },
    async checkPosition() {
      this.scrollTop = this.$refs.listWrapper.scrollTop || 0;
      // 当前位置与错位位置大于一个视图位时进行视图更新
      if (
        Math.abs(
          Math.max(0, this.transformTop - this.height * this.preloadPage) -
            this.scrollTop
        ) > this.height
      ) {
        await this.pageChange();
        this.$forceUpdate();
      }
    },
    setScroll(v) {
      this.$refs.listWrapper && (this.$refs.listWrapper.scrollTop = v);
      this.scrollTop = v;
      this.checkPosition();
      this.$forceUpdate();
    }
  },
  created() {
    this.heightList = [];
    this.viewData = [];
    this.data = [];
    this.transformTo = 0;
    this.startIndex = 0;
    this.currentIndex = 0;
    this.scrollTop = 0;
    this.updateList();
  }
};
</script>

<style lang="less">
.image-bigtable-list-wrapper {
  overflow: auto;
  position: relative;
}
.image-bigtable-list {
  position: relative;
  z-index: 10;
  overflow: hidden;
}
.image-bigtable-row {
  border: 1px solid #eee;
}
.image-bigtable-list-inner {
  display: flex;
  flex-wrap: wrap;
  .start {
    background: red;
  }
  .current {
    background: green;
  }
  .end {
    background: blue;
  }
  .image-list-item {
    &:hover {
      box-shadow: 0 0 2px #666;
    }
    &.active {
      //outline: 1px solid #2955c6;
      background: #eff5ff;
    }
  }
  .dictory-list-item {
    padding: 2px 0;
    margin: 4px 0;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    a {
      margin-left: 4px;
    }
  }
}
</style>
