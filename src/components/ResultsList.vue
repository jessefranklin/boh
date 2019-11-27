<template>
  <ul class="results-list col-md-12 col-lg-10" :class="{noResults: !filteredLocations.length && !isLoading}">
    <li v-if="mobileSelected">
      <app-results-list-item
        :location="filteredLocationMobile[0]"
        :selected="selectedLocation"
        :selectLocationClick="selectLocationClickFn"
        :mobileSelected="true" 
        :selectedIndex="selectedIndex"
        :centerAndClose="centerMapAndCloseFn" 
      ></app-results-list-item>
      <button class="btn-primary btn-see" @click="removeSelected">{{text('seeallresults')}}</button>
    </li>
    <template v-if="!mobileSelected">
    <li v-for="(location, index) in filteredLocations" :key="location.id" >
      <app-results-list-item
        :location="location"
        :index="index" 
        :selected="selectedLocation"
        :selectLocationClick="selectLocationClickFn" 
        :selectedIndex="selectedIndex" 
        :centerAndClose="centerMapAndCloseFn" 
      ></app-results-list-item>
    </li>
    </template>
    <li v-if="!filteredLocations.length && !isLoading" class="no-results">
      <h2>
        {{text('noresults')}}
      </h2>
      <div class="noresultstarget"></div>
    </li>
  </ul>
</template>

<script>
import { mapActions } from "vuex";
import ResultsListItem from "./ResultsListItem.vue";
import EventBus from "../eventBus.js";
import { locText } from "../mixin/useText";
import { scrollTo } from "../functions/scroll.js";

export default {
  props: {
    scrollForNoResultsFn: Function
  },
  components: {
    "app-results-list-item": ResultsListItem
  },
  data() {
    return {
      selectedIndex: null
    };
  },
  mixins: [locText],
  computed: {
    selectedLocation: {
      get() {
        return this.$store.getters.selectedLocation;
      },
      set(value) {
        this.updateSelectedLocation(value);
      }
    },
    filteredLocations: {
      get() {
        return this.$store.getters.filteredLocations;
      }
    },
    isLoading: {
      get() {
        return this.$store.getters.isLoading;
      }
    },
    mobileSelected() {
      return this.$mq != 'desktop' && this.selectedLocation;
    },
    filteredLocationMobile: {
      get() {
        return this.$store.getters.filteredLocationMobile;
      }
    }
  },
  methods: {
    ...mapActions(["updateSelectedLocation"]),

    scrollToSelected() {
      var el = document.getElementsByClassName("selected")[0];
      if(this.$mq === 'desktop') {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    },
    selectLocationClickFn(locationId, intend) {
      if(this.$mq === 'desktop' || intend) {
        this.selectedLocation = locationId;
      }
    },
    removeSelected(){
      this.selectedLocation = null;
    },
    centerMapAndCloseFn(location) {
      const loc = {
        id: location.id,
        center: {
          lat: location.geocode.latitude,
          lng: location.geocode.longitude
        }
      }
      EventBus.centerOnMap(loc);
      EventBus.scrollToTopMobile();
    },
    scrollToTop() {
      var target = document.getElementsByClassName("sidebar-wrapper")[0];
      if(this.$mq === 'desktop') {
        scrollTo(target, 0, 300);
      }
    }
  },
  created() {
    EventBus.$on("scrollToTop", () => {
      this.scrollToTop();
    });
    EventBus.$on("selectedIndex", (val) => {
      this.selectedIndex = val;
    });
  },
  watch: {
    selectedLocation(newValue, oldValue) {
      setTimeout(() => {
        this.scrollToSelected();
      }, 50);
    },
    filteredLocations(newValue) {
      if(!newValue.length && !this.isLoading){
        this.scrollForNoResultsFn();
      } else {
        EventBus.scrollToTopMobile();
      }
    }
  }
};
</script>
