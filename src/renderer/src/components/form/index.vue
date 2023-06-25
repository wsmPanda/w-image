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
        :modelValue="(value[field.key] || '').toString()"
        :type="field.type"
        size="small"
        @update:modelValue="$set(value, field.key, $event)"
        v-bind="field.attr"
        v-on="field.on || {}"
      />
      <component
        v-else
        :is="field.component"
        :modelValue="value[field.key]"
        size="small"
        :type="field.type"
        @update:modelValue="$set(value, field.key, $event)"
        v-bind="field.attr"
        v-on="field.on || {}"
      ></component>
    </FormItem>
  </Form>
</template>

<script>
import { Form, FormItem, Input } from "view-ui-plus"
import radio from "./radio.vue"
import select from "./select.vue"
import file from "./file.vue"
import color from "./color.vue"
import Switch from "./switch.vue"
import checkbox from "./checkbox.vue"
import { markRaw } from "vue"

const Fields = markRaw({ radio, select, file, color, switch: Switch, checkbox })
export default {
  provide() {
    return {
      $form: this
    }
  },
  components: { Form, FormItem, Input },
  props: {
    model: Object,
    value: Object,
    size: {
      type: String,
      default: "small"
    },
    column: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      Fields
    }
  },
  methods: {
    fieldStyle(field) {
      return {
        width: ((field.span || 1) / this.column) * 100 + "%"
      }
    }
  },
  beforeMount() {
    if (!this.value) {
      this.$emit("update:value", {})
    }
  }
}
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
