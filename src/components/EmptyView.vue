<template>
    <div class="container">
      <ion-icon :icon="icon" color="light"></ion-icon>
      <h5 v-html="title"></h5>
      <p v-html="text"></p>
    </div>
</template>
  
  <script lang="ts">
  import { IonIcon } from "@ionic/vue";
  export default {
    name: "EmptyView",
    components: {
      IonIcon,
    },
    props: {
      icon: String,
      title: String,
      text: String,
    },
  };
  </script>
  
<style>

</style>