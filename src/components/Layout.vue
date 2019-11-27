<template>
  <div class="row parent-container" :class="{isLoading: isLoading}">
    <div class="col-lg-6 col-md-12 no-padding sb-container">
      <app-sidebar></app-sidebar>
    </div>
    
      <app-mapview></app-mapview>
    
  </div> 
</template>

<script>
import MapView from "./MapView.vue";
import Sidebar from "./Sidebar.vue";

export default {
  computed: {
    isLoading: {
      get() {
        return this.$store.getters.isLoading;
      }
    }
  },
  components: {
    "app-sidebar": Sidebar,
    "app-mapview": MapView
  }
};
</script>

