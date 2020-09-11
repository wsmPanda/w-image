<template>
  <div class="hello">
    <img alt="Vue logo" src="file:///Users/wangsongmao/Downloads/1%20(4).png" />
    <button @click="onClick">select dir</button>
  </div>
</template>

<script>
//import { remote } from "electron";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  methods: {
    async onClick() {}
  }
};
</script>
