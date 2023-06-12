<template>
  <div class="name-input" :style="styles">
    <input
      ref="input"
      v-model="currentValue"
      @change="$emit('blur', currentValue)"
      @blur="$emit('blur', currentValue)"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {}
  },
  data() {
    return {
      currentValue: this.value || "",
      top: null,
      left: null,
      width: null
    }
  },
  computed: {
    styles() {
      return {
        top: this.top + "px",
        left: this.left + "px",
        width: this.width + "px"
      }
    }
  },
  methods: {
    setLink(el) {
      this.top = el.offsetTop
      this.left = el.offsetLeft
      this.width = el.offsetWidth
      this.currentValue = this.value
      this.$nextTick(() => {
        this.$refs.input.select()
      })
    }
  }
}
</script>

<style lang="less">
.name-input {
  position: absolute;
  input {
    width: 100%;
    border: none;
  }
}
</style>
