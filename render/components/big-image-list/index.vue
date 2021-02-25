<script>
import Thumbnail from "../thumbnail";
import { Icon } from "iview";
import "./style.less";
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
              height: Math.min(this.height, this.listHeight) + "px"
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
                  let isRoot = false;
                  let rowIndex = this.startIndex + index;
                  if (
                    rowIndex <= 1 ||
                    !this.viewData[rowIndex - 1].path ||
                    row.path.indexOf(this.viewData[rowIndex - 1].path) !== 0
                  ) {
                    isRoot = true;
                  }
                  return (
                    <div
                      class={{
                        "dictory-list-item": true,
                        "dictory-list-item-root": isRoot
                        // start: index === 0,
                        // current: index + this.startIndex === this.currentIndex,
                        // end: index === this.viewData.length - 1
                      }}
                      key={index + this.startIndex}
                    >
                      <Icon
                        class="icon-arrow"
                        type={
                          row.open === false
                            ? "ios-arrow-forward"
                            : "ios-arrow-up"
                        }
                        nativeOn={{
                          click: () =>
                            this.onDictoryOpen(row, this.startIndex + index)
                        }}
                      ></Icon>
                      {this.$main.showCheck && (
                        <Icon
                          on={{
                            click: () => this.onCheck({ data: row.path })
                          }}
                          class={{
                            uncheck: !this.$checkList.isCheck(row.path),
                            "thumbnail-check": true
                          }}
                          type="md-checkmark-circle"
                        />
                      )}
                      <Icon class="icon-fold" type="md-folder" />
                      <a
                        on={{
                          click: () => this.onDictoryClick(row)
                        }}
                      >
                        {this.dictoryName(row)}
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <Thumbnail
                      class={{
                        "image-list-item": true,
                        active: this.activeImage === row
                        // start: index === 0,
                        // current: index + this.startIndex === this.currentIndex,
                        // end: index === this.viewData.length - 1
                      }}
                      nativeOn={{
                        click: () => this.onClick(row),
                        dblclick: () => this.onDbClick(row)
                      }}
                      on={{
                        check: (e) => this.onCheck({ data: row, e })
                      }}
                      showCheck={this.$main.showCheck}
                      check={this.$checkList.isCheck(row)}
                      showName={this.imageSetting.showFileName}
                      //key={index + this.startIndex}
                      key={row}
                      src={row}
                      style={this.thumbnailStyle}
                    ></Thumbnail>
                  );
                }
              })}
            </div>
          </div>
        </div>
        {this.loadingMore && (
          <div class="image-bigtable-list-loading">
            <i class="ivu-load-loop ivu-icon ivu-icon-ios-loading"></i>
          </div>
        )}
      </div>
    );
  },
  inject: ["$main", "$checkList"],
  props: {
    dictorySetting: {
      type: Object,
      default() {
        return {
          height: 34
        };
      }
    },
    loadFinish: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 600
    },
    loadingMore: { type: Boolean, default: false },
    preloadPage: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      activeImage: null,
      scrollTarget: null
    };
  },
  computed: {
    showCheck() {
      return true;
    },
    imageSetting() {
      return this.$main.config.image;
    },
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
      console.log(this.dictorySetting.height);
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
    onDictCheck(row) {
      console.log(row);
    },
    isDictCheck(row) {
      console.log(row);
    },
    dictoryName(data) {
      let name = data.name || data.path;
      if (this.data[0].path) {
        name = name.replace(this.data[0].path + "/", "");
      }
      return name;
    },
    onDictoryClick(v) {
      this.$emit("dictoryClick", v);
    },
    onCheck(e) {
      this.$checkList.check(e.data);
    },
    onClick(v) {
      this.activeImage = v;
      this.$emit("activeImageChange", v);
    },
    onDbClick(v) {
      this.$emit("imageDbClick", v);
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
    onDictoryOpen(row, index) {
      if (row.open !== false) {
        row.open = false;
      } else {
        row.open = true;
      }
      if (row.open) {
        this.openDictory(index);
      } else {
        this.closeDictory(index);
      }
      this.$forceUpdate();
      this.$nextTick(() => {
        this.updateList();
        this.$nextTick(() => {
          this.checkPosition();
        });
      });
    },
    closeDictory(index) {
      let row = this.data[index];
      if (row.length === undefined) {
        row.length = 0;
        for (let i = index + 1; i < this.data.length; i++) {
          let item = this.data[i];
          let path = (item && item.path) || item;
          if (path && path.indexOf(row.path) === 0) {
            row.length++;
          } else {
            break;
          }
        }
      }
      row.sub = this.data.splice(index + 1, row.length);
      // 高度变化值
      let dHeight =
        this.heightList[index + row.length] - this.heightList[index];
      this.heightList.splice(index + 1, row.length);
      for (let i = index + 1; i < this.heightList.length; i++) {
        this.heightList[i] = this.heightList[i] - dHeight;
      }
      this.listHeight = this.heightList[this.heightList.length - 1];
    },
    openDictory(index) {
      let row = this.data[index];
      if (!row.sub) {
        return;
      }
      this.data.splice(index + 1, 0, ...row.sub);
      // 高度变化值
      let heightList = this.getHeightList(row.sub).list.map(
        (item) => item + this.heightList[index]
      );
      let dHeight = heightList[heightList.length - 1] - this.heightList[index];
      this.heightList.splice(index + 1, 0, ...heightList);
      for (let i = index + row.length + 1; i < this.heightList.length; i++) {
        this.heightList[i] = this.heightList[i] + dHeight;
      }
      this.listHeight = this.heightList[this.heightList.length - 1];
      row.sub = null;
    },
    insertSubData() {},
    setData(data) {
      this.closeState = {};
      this.data = data || [];
      if (this.$refs.listWrapper) {
        this.$refs.listWrapper.scrollTop = 0;
      }
      this.updateHeightList();
      this.updateList();
      this.autoClick();
    },
    autoClick() {
      setTimeout(() => {
        for (let item of this.data) {
          if (typeof item === "string") {
            this.onClick(item);
            break;
          }
        }
      });
    },
    appendData(data) {
      this.appendHeightList(data);
      if (!this.data || !this.data.length) {
        this.autoClick();
      }
      this.data = this.data.concat(data);
      this.updateList();
      // 检测页面不满的情况
      setTimeout(() => {
        if (
          !this.loadFinish &&
          (this.fullPageCheck() ||
            this.bottomPageCheck() ||
            (this.scrollTarget && this.listHeight < this.scrollTarget))
        ) {
          this.onLoadMore();
        }
      });
    },
    onLoadMore() {
      if (!this.loadingMore) {
        this.$emit("loadMore");
      }
    },
    fullPageCheck() {
      let res = true;
      if (this.$refs.listWrapper) {
        res = this.$refs.listWrapper.scrollHeight >= this.$refs.height;
      }
      return res;
    },
    bottomPageCheck() {
      let res = false;
      if (this.$refs.listWrapper) {
        this.scrollTop = this.$refs.listWrapper.scrollTop || 0;
        this.scrollBottom =
          this.$refs.listWrapper.scrollHeight -
          this.$refs.listWrapper.clientHeight -
          this.$refs.listWrapper.scrollTop;
        res = this.scrollBottom <= (this.imageSetting.turnHeight || 100);
      }
      return res;
    },
    appendHeightList(data) {
      let count = this.heightList[this.data.length - 1] || 0;
      data.forEach((row) => {
        this.columnCount++;
        if (row && row.path) {
          count += this.dictoryHeight;
          // 目录元素清空行元素计数
          this.columnCount = 0;
        } else if (this.columnCount === 1) {
          // 对于图片元素只有首行才增加高度
          count += this.imageHeight;
        }
        // 清空行元素计数
        if (this.columnCount === Number(this.imageSetting.column)) {
          this.columnCount = 0;
        }
        this.heightList.push(count);
      });
      this.listHeight = this.heightList[this.heightList.length - 1];
    },
    updateHeightList() {
      this.heightList = [];
      // 生成元素高度位置的单向数列
      this.columnCount = 0;
      let res = this.getHeightList(this.data, this.columnCount);
      this.heightList = res.list;
      this.columnCount = res.columnCount;
      this.listHeight = this.heightList[this.heightList.length - 1];
    },
    getHeightList(data, columnCount = 0) {
      let list = [];
      let count = 0;
      console.log(data);
      data.forEach((row) => {
        columnCount++;
        if (row && row.path) {
          count += this.dictoryHeight;
          // 目录元素清空行元素计数
          columnCount = 0;
        } else if (columnCount === 1 || count === 0) {
          // 对于图片元素只有首行才增加高度
          count += this.imageHeight;
        }
        // 清空行元素计数
        if (columnCount === Number(this.imageSetting.column)) {
          columnCount = 0;
        }
        list.push(count);
      });
      console.log(list);

      return { list, columnCount };
    },
    async updateList() {
      this.listHeight = this.heightList[this.heightList.length - 1];
      await this.pageChange();
      this.$forceUpdate();
      setTimeout(() => {
        if (
          this.scrollTarget &&
          this.scrollTarget <= this.listHeight &&
          this.$refs.listWrapper
        ) {
          this.$refs.listWrapper.scrollTop = this.scrollTarget;
          this.scrollTarget = null;
        }
      });
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
      let topHeight = Math.max(
        this.scrollTop - this.height * this.preloadPage,
        0
      );
      if (topHeight <= 0) {
        this.startIndex = this.findIndex(topHeight, 0, this.currentIndex);
      } else {
        this.startIndex = 0;
      }
      // 向前找到同行的首个元素
      while (
        this.startIndex > 0 &&
        this.heightList[this.startIndex - 1] ===
          this.heightList[this.startIndex]
      ) {
        this.startIndex = this.startIndex - 1;
      }
      let bottomHeight = Math.min(
        this.scrollTop + this.height * (this.preloadPage + 1),
        this.listHeight
      );
      if (bottomHeight >= this.listHeight) {
        this.endIndex = this.data.length;
      } else {
        this.endIndex = this.findIndex(bottomHeight, this.currentIndex);
      }
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
    // 检查当前高度更新视图数据
    async checkPosition() {
      this.scrollTop = this.$refs.listWrapper.scrollTop || 0;
      if (this.scrollTop >= this.scrollTarget) {
        this.scrollTarget = null;
      }
      if (this.bottomPageCheck() || this.scrollTarget) {
        this.onLoadMore();
      }
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
      this.scrollTarget = v;
      this.scrollTop = v;
      this.$forceUpdate();
      this.$nextTick(() => {
        this.checkPosition();
      });
    },
    pageUp() {
      let scrollTop = this.scrollTop || 0;
      scrollTop = scrollTop - (this.height - this.imageHeight);
      if (scrollTop) {
        this.$refs.listWrapper &&
          this.$refs.listWrapper.scrollTo({
            top: scrollTop,
            behavior: "smooth"
          });
      }
    },
    pageDown() {
      let scrollTop = this.scrollTop || 0;
      scrollTop = scrollTop + (this.height - this.imageHeight);
      if (scrollTop) {
        this.$refs.listWrapper &&
          this.$refs.listWrapper.scrollTo({
            top: scrollTop,
            behavior: "smooth"
          });
      }
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
    window.addEventListener("keyup", (e) => {
      let code = e.keyCode;
      if (code === 37) {
        this.pageUp();
      } else if (code === 39) {
        this.pageDown();
      }
      if (e.key === "x") {
        this.$checkList.check(this.data[0].path);
      }
      if (e.key === "v" && this.activeImage) {
        this.$checkList.check(this.activeImage);
      }
      return true;
    });
    this.updateList();
  }
};
</script>
