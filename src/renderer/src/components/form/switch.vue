<template>
  <i-Switch :modelValue="value" :disabled="field.disabled" @update:modelValue="input"></i-Switch>
</template>

<script>
import Base from "./field"
export default {
  extends: Base
}
</script>

<style></style>
