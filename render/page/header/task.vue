<template>
  <Dropdown trigger="click" transfer>
    <Button size="small" class="btn-task">
      <div class="btn-task-inner">
        <Icon type="md-flash" />
        <Progress :percent="taskPercent" :stroke-width="3" hide-info />
        <div>0/{{ taskCount }}</div>
        <Icon @click.native.stop="taskModal = true" type="md-add-circle" />
      </div>
    </Button>
    <BatchProcess v-model="taskModal"></BatchProcess>
    <div class="task-list-panel" slot="list">
      <div>
        暂无任务
      </div>
      <div><Button @click="taskModal = true">添加批量处理</Button></div>
    </div>
  </Dropdown>
</template>

<script>
import BatchProcess from "render/components/batch-process";
export default {
  components: { BatchProcess },
  data() {
    return {
      taskModal: false,
      taskPercent: 0,
      taskCount: 0
    };
  }
};
</script>

<style></style>
