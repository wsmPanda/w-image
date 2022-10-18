<template>
  <Modal :value="value" @input="$emit('input', $event)" width="90%">
    <div class="batch-process">
      <div class="batch-process-config">
        <div class="batch-process-block batch-process-selector">
          <SelectorEditor v-model="selectors"></SelectorEditor>
        </div>
        <div class="batch-process-block batch-process-filter">
          <FilterEditor v-model="filters"></FilterEditor>
        </div>
        <div class="batch-process-block batch-process-action">
          <ActionEditor v-model="actions"></ActionEditor>
        </div>
      </div>
      <div class="batch-process-result">
        <div class="batch-process-tool">
          <Button @click="onPreview" icon="md-eye">预览</Button>
          <Button @click="onSave" icon="md-archive">保存</Button>
          <Button @click="onExecute" icon="md-play">执行</Button>
        </div>
        <div class="batch-process-progress">
          <Progress
            :percent="(progressCount / progressTotal) * 100"
            hide-info
          ></Progress>
          <div>
            {{ progressCount }}/{{ progressTotal }}
            <span v-if="progressError"
              ><Icon type="md-alert" />{{ progressError }}</span
            >
          </div>
        </div>
        <FileTable ref="table" v-model="fileList"></FileTable>
      </div></div
  ></Modal>
</template>
<script>
import ActionEditor from "./action-editor";
import SelectorEditor from "./selector-editor";
import FilterEditor from "./filter-editor";
import FileTable from "./file-table";
import "./style.less";
export default {
  inject: ["$main"],
  components: {
    ActionEditor,
    SelectorEditor,
    FilterEditor,
    FileTable
  },
  props: { value: Boolean },
  data() {
    return {
      progressCount: 0,
      progressTotal: 0,
      selectors: [],
      filters: [],
      actions: [],
      fileList: [],
      previewLoading: false,
      progressError: false
    };
  },
  watch: {
    value(v) {
      if (v) {
        this.initData();
      }
    }
  },
  methods: {
    initData() {
      Object.assign(this.$data, this.$options.data());
      if (this.$main.storage.activeTree.path) {
        this.selectors.push({
          type: "dictory",
          options: {
            path: this.$main.storage.activeTree.path,
            deep: 2
          }
        });
        this.actions.push({
          type: "resort"
        });
        this.filters.push({
          type: "format",
          options: {
            type: "video"
          }
        });
      }
    },
    async onPreview() {
      this.hasPreview = true;
      this.previewLoading = true;
      let data = await this.$connect.run("taskPreview", {
        selectors: this.selectors,
        filters: this.filters,
        actions: this.actions
      });
      this.fileList = [data];
      this.previewLoading = false;
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.resetSelect();
      });
    },
    onSave() {},
    async onExecute() {
      if (!this.hasPreview) {
        await this.onPreview();
      }
      console.log(this.$refs.table && this.$refs.table.getSelected());
      let result = await this.$connect.task(
        "taskExecute",
        {
          data: this.fileList[0],
          selected: this.$refs.table && this.$refs.table.getSelected()
        },
        this.onExecuteProgress
      );
      console.log(result);
    },
    onExecuteProgress(data) {
      this.fileList = [data.data];
      this.progressCount = data.done;
      this.progressError = data.error;
      this.progressTotal = data.total;
    }
  },
  created() {}
};
</script>
