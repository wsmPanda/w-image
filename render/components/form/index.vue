<template>
  <Form :model="value" size="small" :label-width="80">
    <FormItem
      :prop="field.key"
      :label="field.label || field.key"
      v-for="field of model.fields"
      :key="field.key"
    >
      <Input
        v-if="!field.component"
        :value="value[field.key]"
        :type="field.type"
        @input="$set(value, field.key, $event)"
        :v-bind="field.attr"
        :v-on="field.on"
      />
      <component
        v-else
        :is="field.component"
        :value="value[field.key]"
        :type="field.type"
        @input="$set(value, field.key, $event)"
        :v-bind="field.attr"
        :v-on="field.on"
      ></component> </FormItem
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
