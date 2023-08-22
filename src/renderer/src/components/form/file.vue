<template>
  <i-input size="small" :modelValue="value" @update:modelValue="input">
    <template #append>
      <i-Button @click="onSelect" size="small" icon="md-folder"></i-Button>
    </template>
  </i-input>
</template>

<script>
import Base from "./field"
export default {
  extends: Base,
  methods: {
    onSelect() {
      window.ConnectRun("selectDictory").then((v) => {
        this.input(v)
      })
    }
  }
}
</script>

<style></style>
