export default {
  provide() {
    return {
      $checkList: this
    }
  },
  data() {
    return {
      checkList: [[]]
    }
  },
  methods: {
    getActiveCheckList(index) {
      if (!index && index !== 0) {
        index = this.storage.checkIndex
      }
      console.warn(index)
      let list = this.checkList[index]
      if (!list) {
        list = []
        this.checkList.push(list)
      }
      return list
    },
    check(data, index) {
      let list = this.getActiveCheckList(index)
      if (this.isCheck(data)) {
        list.splice(list.indexOf(data), 1)
      } else {
        list.push(data)
      }
      this.setCheckData()
    },
    cleanCheck() {
      this.$set(this.checkList, this.storage.checkIndex || [], [])
      this.setCheckData()
    },
    getIndex(index) {
      if (!index && index !== 0) {
        index = this.storage.checkIndex || 0
      }
      if (index < 0) {
        index = 0
      }
      return index
    },
    isCheck(data, index) {
      let list = this.checkList[this.getIndex(index)] || []
      return list.indexOf(data) >= 0
    },
    setCheckData() {
      this.$connect.setData("check_list", this.checkList)
    },
    resetData(data) {
      this.$set(this.checkList, this.storage.checkIndex, data)
      this.setCheckData()
    }
  },
  async beforeMount() {
    this.checkList = (await this.$connect.getData("check_list")) || [[]]
    if (!this.storage.checkIndex) {
      this.storage.checkIndex = 0
    }
  }
}
