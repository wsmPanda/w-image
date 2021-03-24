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
                <Icon :type="selectorMap[item.type].icon"></Icon>
                {{ selectorMap[item.type].name }}
              </td>
              <td>
                <Form
                  :column="1"
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
        <Icon :type="item.icon"></Icon>{{ item.name }}
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
          name: "收藏夹",
          code: "collection",
          icon: "ios-archive",
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
          name: "标签",
          code: "tag",
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
          name: "目录",
          code: "dictory",
          icon: "md-folder",
          form: {
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
