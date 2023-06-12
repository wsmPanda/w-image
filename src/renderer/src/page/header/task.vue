<template>
  <Dropdown trigger="click" transfer>
    <Button size="small" class="btn-task">
      <div class="btn-task-inner">
        <Icon type="md-flash" />
        <Progress :percent="taskPercent" :stroke-width="3" hide-info />
        <div>0/{{ taskCount }}</div>
        <Icon class="icon-add" @click.native.stop="taskModal = true" type="md-add-circle" />
      </div>
    </Button>
    <BatchProcess v-model:value="taskModal"></BatchProcess>
    <template v-slot:list>
      <div class="task-list-panel">
        <div>暂无任务</div>
        <div><Button @click="taskModal = true">添加批量处理</Button></div>
      </div></template
    >
  </Dropdown>
</template>

<script>
import BatchProcess from "render/components/batch-process/index.vue"
export default {
  components: { BatchProcess },
  data() {
    return {
      taskModal: false,
      taskPercent: 0,
      taskCount: 0
    }
  }
}
</script>

<style></style>
