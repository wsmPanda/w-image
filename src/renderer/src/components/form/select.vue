<template>
  <Select
    transfer
    :modelValue="value"
    @update:modelValue="input"
    :v-bind="field.attr"
    :v-on="field.on"
    :size="size"
    :disabled="field.disabled"
  >
    <Option
      v-for="item of field.data || []"
      :key="item.value"
      :value="item.value"
      ><Icon v-if="item.icon" :type="item.icon" />{{ item.name }}</Option
    >
  </Select>
</template>

<script>
import Base from "./field";
export default {
  extends: Base,
  computed: {}
};
</script>

<style></style>
