<template>
  <div class="col-md-12 sidebar-overflow">
    <!-- Filter Overlay -->
    <div class="overlay-container" v-bind:class="{ show: show }">
      <app-filter-overlay :hideOverlayFn="hideOverlayFn" :show="show"></app-filter-overlay>
    </div>
    <div class="col-md-12 sidebar-wrapper" @click="unselectLocation" v-on:scroll="handleScroll">
      <div class="sidebar-container col-md-12" v-bind:class="{ fixed: isFixed }">
        <div class="mobile-header-container"  :class="{ expand: mobileExpandMap }">
          <!-- Search Form -->
          <div class="search-stick-container"> 
            <div class="search-form-container">
              <app-search-form :showOverlayFn="showOverlay"></app-search-form>
            </div>
          </div>

          <!-- Active Filters  -->
          <app-filters-active></app-filters-active>
        </div>
        <!-- Results List  -->
        <div class="results-list-container col-md-12" :class="{ expand: mobileExpandMap }" v-dragscroll>
          <app-results-list :scrollForNoResultsFn="scrollForNoResults"></app-results-list> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import SearchForm from "./SearchForm.vue";
import FiltersActive from "./FiltersActive.vue";
import FilterOverlay from "./FilterOverlay.vue";
import ResultsList from "./ResultsList.vue";
import { scrollTo } from "../functions/scroll.js";


export default {
  data() {
    return {
      show: false,
      check: null,
      isFixed: false,
      offsetHeight: null,
      lastScrollTop: 0,
      mobileExpandMap: false
    };
  },
  components: {
    "app-search-form": SearchForm,
    "app-filters-active": FiltersActive,
    "app-filter-overlay": FilterOverlay,
    "app-results-list": ResultsList
  },
  created() {
    EventBus.$on("expandMap", (val) => {
      this.mobileExpandMap = val;
    });
    EventBus.$on("scrollToTopMobile", (int) => {
      this.scrollToTopMobile(int)
    }); 
  },
  computed: {
    isFilters() {
      const meta = this.$store.state.filters.meta;
      var res = false;
      for (var key in meta) {
        if (!meta.hasOwnProperty(key)) continue;
        if (meta[key].length || meta[key] === true) {
          res = true;
        }
      }

      return res;
    }
  },
  methods: {
    showOverlay() {
      this.show = !this.show;
      // Accessibility focus on overlay
      setTimeout(()=> { 
        let x =  document.getElementById("filter-options");
        x.focus();
      },0);
    },
    hideOverlayFn() {
      this.show = false;
      document.getElementById("filter-button").focus();
    },
    handleScroll: function(evt, el) {
      if (
        this.qs.scrollTop > this.target.offsetTop &&
        this.qs.scrollTop > 120
      ) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    unselectLocation() {
      EventBus.recenterMapLocation();
    },
    scrollForNoResults(){
      if(this.$mq !== 'desktop') {
        setTimeout(()=> {
          
        },0)
      }
    },
    scrollToTopMobile(int=0){
      var target = document.getElementsByClassName("results-list-container")[0];
      scrollTo(target, int, 300);
    }
  },
  mounted() {
    this.qs = this.$el.querySelector(".sidebar-wrapper");
    this.target = this.$el.querySelector(".search-form-container");
  }
};
</script>
