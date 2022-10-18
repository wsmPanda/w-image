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
              <Icon
                v-if="selectorMap[item.type].icon"
                :type="selectorMap[item.type].icon"
              ></Icon>
              {{ selectorMap[item.type].name }}
            </td>
            <td>
              <Form
                v-if="selectorMap[item.type].form"
                :column="selectorMap[item.type].form.column || 1"
                size="small"
                :model="selectorMap[item.type].form"
                v-model="item.options"
              ></Form>
            </td>
            <td><Icon type="md-close" @click="value.splice(index, 1)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="selector-editor-add">
      <div
        v-for="item of selectors"
        :key="item.code"
        @click="addSelector(item)"
        class="selector-editor-add-item"
      >
        <Icon v-if="item.icon" :type="item.icon"></Icon>{{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import Form from "../form";
export default {
  components: { Form },
  inject: ["$main"],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selectors: [
        {
          name: "序号处理",
          code: "aNumber"
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
          }
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
          name: "复制",
          code: "cpoy",
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
        }
      ]
    };
  },
  computed: {
    selectorMap() {
      return this.selectors.reduce((res, item) => {
        res[item.code] = item;
        return res;
      }, {});
    }
  },
  methods: {
    addSelector(selector) {
      this.value.push({
        type: selector.code,
        options: {}
      });
    },
    initSelector() {}
  },
  created() {
    this.initSelector();
  }
};
</script>
