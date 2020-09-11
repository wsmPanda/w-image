<template>
  <div class="hello">
    <img v-for="(item, index) of images" :key="index" :src="'file://' + item" />
    <button @click="onClick">select dir</button>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      images: []
    };
  },
  methods: {
    async onClick() {
      ipcRenderer.send("open-file-dialog");
    }
  },
  created() {
    ipcRenderer.on("selected-directory", (event, path) => {
      this.images = path;
    });
  }
};
</script>
