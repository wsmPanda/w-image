export default {
  provide() {
    return {
      $checkList: this,
    };
  },
  data() {
    return {
      checkList: [],
    };
  },
  methods: {
    check(data) {
      if (this.isCheck(data)) {
        this.checkList.splice(this.checkList.indexOf(data), 1);
      } else {
        this.checkList.push(data);
      }
      this.setCheckData();
    },
    cleanCheck() {
      this.$set(this, "checkList", []);
      this.setCheckData();
    },
    isCheck(data) {
      return this.checkList.indexOf(data) >= 0;
    },
    setCheckData() {
      this.$connect.setData("check_list", this.checkList);
    },
  },
  async created() {
    this.checkList = (await this.$connect.getData("check_list")) || [];
  },
};
