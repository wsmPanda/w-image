<template>
  <Icon
    class="contextmenu-item-icon"
    v-if="type?.indexOf('md-') === 0"
    :type="type"
    :v-bind="$attrs"
  ></Icon>
  <i v-else-if="type" :class="[type]" />
</template>
<script>
export default {
  props: {
    type: String
  }
}
</script>
