<template>
  <RadioGroup 
    :value="value"
    size="small"
    @input="input"
    :v-bind="field.attr"
    :v-on="field.on"
  >
    <Radio v-for="item of field.data" :key="item.value" :label="item.value">{{
      item.name
    }}</Radio>
  </RadioGroup>
</template>

<script>
import Base from "./field";
export default {
  extends: Base
};
</script>

<style></style>
