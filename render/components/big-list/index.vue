<script>
export default {
  render() {
    let transformTop = this.startIndex * this.lineHeight;
    return (
      <div class="svf-bigtable">
        <div>BIG TBALE</div>
        <slot></slot>
        <div
          ref="listWrapper"
          class="svf-bigtable-list-wrapper"
          style={{ height: this.height + "px" }}
          on={{ scroll: (e) => this.onScroll(e) }}
        >
          <div
            class="svf-bigtable-list"
            style={{
              height: this.listHeight + "px"
            }}
          >
            <div
              class="svf-bigtable-list-inner"
              style={{
                height: this.listHeight + "px",
                transform: `translateY(${transformTop}px)`
              }}
            >
              {this.viewData.map((row, index) => {
                if (this.$scopedSlots.default) {
                  return (
                    <div class="svf-bigtable-row" key={index + this.startIndex}>
                      {this.$scopedSlots.default({ row, index })}
                    </div>
                  );
                } else {
                  return (
                    <div class="svf-bigtable-row" key={index + this.startIndex}>
                      <span>#{row.id}</span>
                      <span> {row.value}</span>
                    </div>
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
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 400
    },
    lineHeight: {
      type: Number,
      default: 20
    },
    preloadPage: {
      type: Number,
      default: 2
    },
    // 通过异步方法单独获取每页数据
    pageGetter: {
      type: Function
    },
    // 配合pageGetter使用的数据上限限制
    // TODO: 增加无上限用法
    total: {
      type: Number
    }
  },
  data() {
    return {};
  },
  methods: {
    setData(data) {
      this.data = data;
      this.updateList();
    },
    async updateList() {
      this.listHeight = this.lineHeight * (this.total || this.data.length);
      await this.pageChange();
      this.$forceUpdate();
    },
    async pageChange() {
      this.startIndex = Math.max(
        (this.currentPage - this.preloadPage) * this.pageSize,
        0
      );
      this.endIndex = Math.min(
        (this.currentPage + this.preloadPage) * this.pageSize,
        this.total || this.data.length
      );
      if (this.pageGetter) {
        this.viewData = await this.pageGetter({
          start: this.startIndex,
          end: this.endIndex,
          page: this.currentPage,
          pageSize: this.pageSize
        });
      } else {
        this.viewData = this.data.slice(this.startIndex, this.endIndex);
      }
    },
    onScroll() {
      if (this.$refs.listWrapper) {
        if (this.scrollTimer) {
          clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(async () => {
          let scrollTop = this.$refs.listWrapper.scrollTop || [];
          let page = Math.min(
            Math.floor(scrollTop / (this.lineHeight * this.pageSize)),
            Math.floor((this.total || this.data.length) / this.pageSize)
          );
          if (page !== this.currentPage) {
            this.currentPage = page;
            await this.pageChange();
            this.$forceUpdate();
          }
        }, 30);
      }
    }
  },
  created() {
    this.viewData = [];
    this.data = [];
    this.startIndex = 0;
    this.currentPage = 0;
    this.pageSize = Math.max(Math.floor(this.height / this.lineHeight), 10);
    this.updateList();
  }
};
</script>

<style lang="less">
.svf-bigtable-list-wrapper {
  overflow: auto;
  position: relative;
}
.svf-bigtable-list {
  position: relative;
  z-index: 10;
  overflow: hidden;
}
.svf-bigtable-row {
  border: 1px solid #eee;
}
.svf-bigtable-list-inner {
  margin-left: 2px;
}
</style>
