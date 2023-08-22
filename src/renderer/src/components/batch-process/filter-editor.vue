<template>
  <div class="selector-panel">
    <div class="selector-content">
      <table class="selector-tale">
        <tbody>
          <colgroup>
            <col />
            <col />
            <col width="30" />
          </colgroup>
          <tr v-for="(item, index) of value" :key="index">
            <td class="cell-name">
              <Icon v-if="selectorMap[item.type].icon" :type="selectorMap[item.type].icon"></Icon>
              {{ selectorMap[item.type].name }}
            </td>
            <td>
              <Form
                :column="selectorMap[item.type].form.column || 1"
                size="small"
                :model="selectorMap[item.type].form"
                v-model:value="item.options"
              ></Form>
            </td>
            <td><Icon type="md-close" @click="value.splice(index, 1)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="selector-editor-add">
      <template v-for="item of selectors">
        <div
          v-if="item.show"
          :key="item.code"
          @click="addSelector(item)"
          class="selector-editor-add-item"
        >
          <Icon v-if="item.icon" :type="item.icon"></Icon>{{ item.name }}
        </div></template
      >
    </div>
  </div>
</template>

<script>
import Form from "../form/index.vue"
export default {
  components: { Form },
  inject: ["$main"],
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectors: [
        {
          name: "格式匹配",
          code: "format",
          icon: "ios-archive",
          show: true,
          form: {
            fields: [
              {
                key: "type",
                type: "select",
                data: [
                  {
                    name: "视频",
                    value: "video",
                    icon: "md-videocam"
                  },
                  {
                    name: "图片",
                    value: "image",
                    icon: "md-image"
                  }
                ]
              }
            ]
          }
        },
        {
          name: "正则匹配",
          code: "regexp",
          icon: "md-pricetags",
          form: {
            fields: [
              {
                key: "tag",
                type: "select"
              }
            ]
          }
        },
        {
          name: "后缀匹配",
          code: "suffix",
          icon: "md-folder",
          show: true,
          form: {
            fields: [
              {
                key: "suffix",
                type: "input"
              }
            ]
          }
        },
        {
          name: "名称匹配",
          code: "name",
          icon: "md-folder",
          form: {
            fields: [
              {
                key: "path",
                type: "file"
              }
            ]
          }
        },
        {
          name: "大小匹配",
          code: "size",
          icon: "md-folder",
          form: {
            column: 2,
            fields: [
              {
                key: "min",
                type: "number",
                attr: {
                  placeholder: "最小值"
                }
              },
              {
                key: "max",
                type: "number",
                attr: {
                  placeholder: "最大值"
                }
              }
            ]
          }
        }
      ]
    }
  },
  computed: {
    selectorMap() {
      return this.selectors.reduce((res, item) => {
        res[item.code] = item
        return res
      }, {})
    }
  },
  methods: {
    addSelector(selector) {
      this.value.push({
        type: selector.code,
        options: {}
      })
    },
    initSelector() {}
  },
  beforeMount() {
    this.initSelector()
  }
}
</script>
