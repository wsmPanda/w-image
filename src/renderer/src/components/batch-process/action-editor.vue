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
                v-if="selectorMap[item.type].form"
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
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Form from "../form/index.vue"
import Icon from "render/components/icon.vue"
export default {
  components: { Form, Icon },
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
          name: "序号处理",
          code: "aNumber",
          icon: "ri-barcode-line",
          show: true
        },
        {
          name: "统一后缀名",
          code: "uniformSuffix",
          icon: "ri-file-reduce-line",
          form: {
            fields: [
              {
                key: "suffix",
                type: "text"
              }
            ]
          },
          show: true
        },
        {
          name: "清理空目录",
          code: "cleanEmpty",
          icon: "ri-file-close-line",
          show: true
        },
        {
          name: "序号比较",
          code: "aNumberCompare",
          show: true
        },
        {
          name: "排重",
          code: "resort"
        },
        {
          name: "删除",
          code: "delete",
          icon: "md-trash",
          form: {
            fields: [
              {
                key: "collection",
                type: "select"
              }
            ]
          },
          show: true
        },
        {
          name: "批量重命名",
          code: "rename",
          icon: "md-pricetags",
          form: {
            fields: [
              {
                key: "match",
                type: "select"
              },
              {
                key: "result",
                type: "select"
              }
            ]
          }
        },
        {
          name: "重命名",
          code: "clear",
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
          name: "后缀替换",
          code: "format",
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
          name: "退壳",
          code: "hull",
          icon: "md-folder",
          form: {
            column: 2,
            fields: [
              {
                key: "path",
                type: "file"
              }
            ]
          }
        },
        {
          name: "移动",
          code: "move",
          icon: "ri-folder-shared-line",
          form: {
            column: 1,
            fields: [
              {
                key: "path",
                type: "file"
              }
            ]
          },
          show: true
        },
        {
          name: "复制",
          code: "cpoy",
          icon: "ri-folders-line",
          form: {
            column: 2,
            fields: [
              {
                key: "path",
                type: "file"
              }
            ]
          },
          show: true
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
