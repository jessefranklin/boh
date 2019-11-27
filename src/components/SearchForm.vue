<template>
  <div class="search-form col-md-10">
    <h1 class="sticky-fade">{{text('title')}}</h1>
    <div class="search-form-inner-container">
      <div class="content-inline-vc">
        <div class="search btn-group">
          <gmap-autocomplete
            ref="place"
            class="form-control form-control-lg search-input"
            :placeholder="placeholder"
            append-icon="search"
            :select-first-on-enter="true"
            @keyup="showClear"
            @place_changed="setPlace" 
            aria-label="Search for:"
            :options="{
              bounds: searchBoundries,
              strictBounds: true
            }"
          />
          <button id="searchclear" class="btn-naked btn-clear" @click="clearSearch" v-if="hasValue" title="Clear search"></button>
          <button @click="geolocation" class="btn-naked btn-current" title="Current Location"></button>
        </div>
        <button @click="showOverlayFn" class="btn-filter btn-naked" id="filter-button">
          <svg-icon icon="filter"></svg-icon>
          <span class="hide-mobile">{{text('filters')}}</span>
        </button>
      </div>
      <div class="sticky-fade search-form-options">
        <input type="checkbox" id="branch" value="Branch" v-model="filters" />
        <label for="branch">{{text('branches')}}</label>

        <input type="checkbox" id="ATM" value="ATM" v-model="filters" />
        <label for="ATM">{{text('atms')}}</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import EventBus from "../eventBus";
import { mapConfigs } from "../../config/index";
import { locText } from "../mixin/useText";
import SvgIcon from './el/SvgIcon.vue';
import * as VueGoogleMaps from "vue2-google-maps";

export default {
  props: {
    showOverlayFn: Function
  },
  components: {
    "gmap-autocomplete": VueGoogleMaps.Autocomplete,
    "svg-icon": SvgIcon
  },
  mixins: [locText],
  data() {
    return {
      hasValue: false,
      current: false
    };
  },
  created() {
    EventBus.$on("clearSearch", () => {
      this.clearSearch();
    });
  },
  computed: {
    searchBoundries() {
      return mapConfigs.AutoCompleteBounrdies;
    },
    filters: {
      get() {
        return this.$store.getters.filters.type;
      },
      set(value) {
        this.updateFilterTypes(value);
      }
    },
    placeholder(){
      return this.current ? this.text('nearme'): this.text('placeholder');
    }
  },

  methods: {
    ...mapActions(["updateUserSearch", "getUserLocation", "updateFilterTypes"]),

    geolocation() {
      this.getUserLocation();
      this.current = true;
      this.$refs.place.$el.value = "";
      EventBus.mapBound(); 
      EventBus.scrollToTop();
    },
    clearSearch() {
      this.current = false;
      this.$refs.place.$el.value = "";
      this.hasValue = false;
    },
    showClear() {
      this.hasValue = this.$refs.place.$el.value.length > 0;
    },

    setPlace(place) {
      // Convert address to lat and lng and save.
      this.place = place;
      // Analytics
      // console.log(place);
      HERO_analytics_data_layer.setAttribute(".filtername", [place.formatted_address]);

      if (place.geometry) {
        this.updateUserSearch(place);
        EventBus.scrollToTop(); 
      }
    }
  },
  mounted() {}
};
</script>