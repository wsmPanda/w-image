<template>
  <CheckboxGroup
    :modelValue="value || []"
    size="small"
    @update:modelValue="input"
    :disabled="field.disabled"
    :v-bind="field.attr"
    :v-on="field.on"
  >
    <Checkbox v-for="item of field.data" :key="item.value" :label="item.value"
      ><Icon v-if="item.icon" :type="item.icon" />{{ item.name }}</Checkbox
    >
  </CheckboxGroup>
</template>

<script>
import Base from "./field"
export default {
  extends: Base
}
</script>

<style></style>
