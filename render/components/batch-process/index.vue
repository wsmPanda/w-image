<template>
  <Modal :value="value" @input="$emit('input', $event)">
    <div class="batch-process">
      <div class="batch-process-config">
        <div class="batch-process-selector">
          <SelectorEditor v-model="selectors"></SelectorEditor>
        </div>
        <div class="batch-process-filter">
          <FilterEditor v-model="fitlers"></FilterEditor>
        </div>
        <div class="batch-process-action">
          <ActionEditor v-model="actions"></ActionEditor>
        </div>
      </div>
      <div class="batch-process-result">
        <div class="batch-process-tool">
          <Button icon="md-eye">预览</Button>
          <Button icon="md-archive">保存</Button>
          <Button icon="md-play">执行</Button>
        </div>
        <FileTable v-model="fileList"></FileTable>
      </div></div
  ></Modal>
</template>

<script>
import ActionEditor from "./action-editor";
import SelectorEditor from "./selector-editor";
import FilterEditor from "./filter-editor";
import FileTable from "./file-table";
export default {
  components: {
    ActionEditor,
    SelectorEditor,
    FilterEditor,
    FileTable
  },
  props: { value: Boolean },
  data() {
    return {
      selectors: [],
      fitlers: [],
      actions: [],
      fileList: []
    };
  },
  methods: {}
};
</script>

<style lang="less">
.batch-process {
  .batch-process-config {
    display: flex;
  }
}
</style>
