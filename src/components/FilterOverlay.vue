<template>
  <div class="filter-overlay" id="filter-options" role="dialog" aria-modal="true" aria-label="Filter Options" tabindex="-1">

    <button v-if="show" @click="hideOverlayFn" class="btn-close btn-naked" aria-label="Close">
       <svg-icon icon="close"></svg-icon>
    </button>
    
    <div v-if="show">
      <app-filters-form :filterOptions="filterOptions" :hideOverlayFn="hideOverlayFn"></app-filters-form>
    </div>
  </div> 
</template>

<script>
import filterOptions from "../../config/filters.js";
import FiltersForm from "./FiltersForm.vue";
import SvgIcon from './el/SvgIcon.vue';

export default { 
  props: {
    hideOverlayFn: Function,
    show: Boolean 
  },
  components: {
    "app-filters-form": FiltersForm,
    "svg-icon": SvgIcon
  },
  data() {
    return {
      filterOptions: filterOptions
    };
  } 
};
</script>

