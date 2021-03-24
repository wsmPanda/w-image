<template>
  <Form class="form" :model="value" size="small" label-position="top">
    <FormItem
      class="form-item"
      :prop="field.key"
      :label="field.label"
      v-for="field of model.fields"
      :key="field.key"
      :style="fieldStyle(field)"
    >
      <component
        v-if="Fields[field.type]"
        :is="Fields[field.type]"
        :code="field.key"
        :field="field"
      ></component>
      <Input
        v-else-if="!field.component"
        :value="value[field.key]"
        :type="field.type"
        size="small"
        @input="$set(value, field.key, $event)"
        v-bind="field.attr"
        v-on="field.on"
      />
      <component
        v-else
        :is="field.component"
        :value="value[field.key]"
        size="small"
        :type="field.type"
        @input="$set(value, field.key, $event)"
        v-bind="field.attr"
        v-on="field.on"
      ></component>
    </FormItem>
  </Form>
</template>

<script>
import { Form, FormItem, Input } from "iview";
import radio from "./radio";
import select from "./select";
import file from "./file";
const Fields = { radio, select, file };
export default {
  provide() {
    return {
      $form: this
    };
  },
  components: { Form, FormItem, Input },
  props: {
    model: Object,
    value: Object,
    column: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      Fields
    };
  },
  methods: {
    fieldStyle(field) {
      return {
        width: ((field.span || 1) / this.column) * 100 + "%"
      };
    }
  },
  created() {
    if (!this.value) {
      this.$emit("input", {});
    }
  }
};
</script>

<style lang="less">
.form {
  display: flex;
  flex-wrap: wrap;
  .form-item {
    margin-bottom: 8px;

    .ivu-input-wrapper {
      width: auto;
    }
    .ivu-form-item-label {
      padding-bottom: 4px;
    }
  }
}
</style>
