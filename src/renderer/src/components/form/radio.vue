<template>
  <RadioGroup
    :modelValue="value"
    size="small"
    :disabled="field.disabled"
    @update:modelValue="input"
    :v-bind="field.attr"
    :v-on="field.on"
  >
    <Radio v-for="item of field.data" :key="item.value" :label="item.value"
      ><Icon v-if="item.icon" :type="item.icon" />{{ item.name }}</Radio
    >
  </RadioGroup>
</template>

<script>
import Base from "./field";
export default {
  extends: Base
};
</script>

<style></style>
