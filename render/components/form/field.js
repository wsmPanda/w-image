export default {
  props: {
    code: String,
    field: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  inject: ["$form"],
  computed: {
    value() {
      return this.$form.value[this.code];
    },
    size() {
      return this.$form.size;
    }
  },
  methods: {
    input(v) {
      this.$form.$set(this.$form.value, this.code, v);
    }
  }
};
