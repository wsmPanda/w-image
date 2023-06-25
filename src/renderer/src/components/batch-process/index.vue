<template>
  <Modal :modelValue="value" @update:modelValue="$emit('update:value', $event)" width="90%">
    <div class="batch-process">
      <div class="batch-process-config">
        <div class="batch-process-block batch-process-selector">
          <SelectorEditor v-model:value="selectors"></SelectorEditor>
        </div>
        <div class="batch-process-block batch-process-filter">
          <FilterEditor v-model:value="filters"></FilterEditor>
        </div>
        <div class="batch-process-block batch-process-action">
          <ActionEditor v-model:value="actions"></ActionEditor>
        </div>
      </div>
      <div class="batch-process-result">
        <div class="batch-process-tool">
          <Button @click="onPreview" icon="md-eye">预览</Button>
          <Button @click="onSave" icon="md-archive">保存</Button>
          <Button @click="onExecute" icon="md-play" :disabled="!!finish" :loading="executing && !finish"
            >执行</Button
          >
        </div>
        <div class="batch-process-progress">
          <Progress :percent="(progressCount / progressTotal) * 100" hide-info></Progress>
          <div>
            {{ progressCount }}/{{ progressTotal }}
            <span v-if="progressError"><Icon type="md-alert" />{{ progressError }}</span>
          </div>
        </div>
        <FileTable ref="table" v-model:value="fileList"></FileTable>
      </div></div
  ></Modal>
</template>
<script>
import ActionEditor from "./action-editor.vue"
import SelectorEditor from "./selector-editor.vue"
import FilterEditor from "./filter-editor.vue"
import FileTable from "./file-table.vue"
import "./style.less"
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
      progressError: false,
      executing: false
    }
  },
  watch: {
    value(v) {
      if (v) {
        this.initData()
      }
    }
  },
  computed: {
    finish() {
      return this.progressTotal && this.progressTotal === this.progressCount
    }
  },
  methods: {
    initData() {
      Object.assign(this.$data, this.$options.data())
      if (this.$main.storage.activeTree.path) {
        this.selectors.push({
          type: "dictory",
          options: {
            path: this.$main.storage.activeTree.path,
            deep: 2
          }
        })
        this.actions.push({
          type: "aNumber"
        })
        this.filters.push({
          type: "format",
          options: {
            type: "video"
          }
        })
      }
    },
    async onPreview() {
      this.hasPreview = true
      this.previewLoading = true
      let data = await window.ConnectRun("taskPreview", {
        selectors: this.selectors,
        filters: this.filters,
        actions: this.actions
      })
      this.fileList = [data]
      this.previewLoading = false
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.resetSelect()
      })
    },
    onSave() {},
    async onExecute() {
      if (!this.hasPreview) {
        await this.onPreview()
      }
      this.progressCount = 0
      this.executing = false
      console.log(this.$refs.table && this.$refs.table.getSelected())
      let result = await this.$connect.task(
        "taskExecute",
        {
          data: this.fileList[0],
          selected: this.$refs.table && this.$refs.table.getSelected()
        },
        this.onExecuteProgress
      )
    },
    onExecuteProgress(data) {
      this.fileList = [data.data]
      this.progressCount = data.done
      this.progressError = data.error
      this.progressTotal = data.total
      if (this.finish || data.error) {
        this.executing = false
      }
    }
  },
  beforeMount() {}
}
</script>
