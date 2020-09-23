<template>
  <Form :model="value" size="small" :label-width="80">
    <FormItem
      :prop="field.key"
      :label="field.label || field.key"
      v-for="field of model.fields"
      :key="field.key"
    >
      <Input
        :value="value[field.key]"
        :type="field.type"
        @input="$set(value, field.key, $event)"/></FormItem
  ></Form>
</template>

<script>
import { Form, FormItem, Input } from "iview";
export default {
  components: { Form, FormItem, Input },
  props: {
    model: Object,
    value: Object
  }
};
</script>

<style></style>
