<template>
  <div>
    <table class="selector-tale">
      <tbody>
        <colgroup>
          <col />
          <col />
          <col width="30" />
        </colgroup>
        <tr v-for="(item, index) of value" :key="index">
          <td>
            <Icon :type="selectorMap[item.type].icon"></Icon>
            {{ selectorMap[item.type].name }}
          </td>
          <td>
            <Form
              size="small"
              :model="selectorMap[item.type].form"
              v-model="item.options"
            ></Form>
          </td>
          <td><Icon type="md-close" @click="value.splice(index, 1)" /></td>
        </tr>
      </tbody>
    </table>

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

<style lang="less">
.selector-tale {
  width: 100%;
}
.selector-editor-add {
  display: flex;
}

.selector-editor-add-item {
  border: 1px solid #eee;
  margin-right: 2px;
  padding: 2px 8px;
  cursor: pointer;
}
</style>
