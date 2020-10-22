export default {
  provide() {
    return {
      $checkList: this
    };
  },
  data() {
    return {
      checkList: []
    };
  },
  methods: {
    check(data) {
      if (this.isCheck(data)) {
        this.checkList.splice(this.checkList.indexOf(data), 1);
      } else {
        this.checkList.push(data);
      }
      this.setCheckStorage();
    },
    clean() {
      this.$set(this, "checkList", []);
      this.setCheckStorage();
    },
    isCheck(data) {
      return this.checkList.indexOf(data) >= 0;
    },
    setCheckStorage() {
      this.$connect.run("setStorageValue", {
        code: "check",
        value: this.checkList
      });
    }
  },
  async created() {
    this.checkList =
      (await this.$connect.run("getStorageValue", { code: "check" })) || [];
  }
};
