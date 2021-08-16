export default {
  provide() {
    return {
      $checkList: this
    };
  },
  data() {
    return {
      checkList: [[]]
    };
  },
  methods: {
    getActiveCheckList(index) {
      if (!index && index !== 0) {
        index = this.storage.checkIndex;
      }
      let list = this.checkList[index];
      if (!list) {
        list = [];
        this.checkList.push(list);
      }
      return list;
    },
    check(data, index) {
      let list = this.getActiveCheckList(index);
      if (this.isCheck(data)) {
        list.splice(list.indexOf(data), 1);
      } else {
        list.push(data);
      }
      this.setCheckData();
    },
    cleanCheck() {
      this.$set(this.checkList, this.storage.checkIndex || [], []);
      this.setCheckData();
    },
    isCheck(data, index) {
      if (!index && index !== 0) {
        index = this.storage.checkIndex;
      }
      let list = this.checkList[index] || [];
      return list.indexOf(data) >= 0;
    },
    setCheckData() {
      console.log(this.checkList);
      this.$connect.setData("check_list", this.checkList);
    },
    resetData(data) {
      this.$set(this.checkList, this.storage.checkIndex, data);
      this.setCheckData();
    }
  },
  async created() {
    this.checkList = (await this.$connect.getData("check_list")) || [[]];
  }
};
