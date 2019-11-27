<template>
  <div class="col-lg-6 col-md-12 fixed-right map-container" :class="{ expand: mobileExpandMap }">
    <div class="map-container-inside">
      <button class="btn-contract" @click="contractMap" aria-label="Contract map"></button>
      <button class="btn-search" @click="searchThisArea" v-if="showSearch">{{text('searchthisarea')}}</button>
      <google-map
        ref="map"
        :center="center"
        :zoom="zoom"
        class="map"
        @dragend="showSearchArea"
        @click="expandMap"
        :options="{
          styles: mapStyles,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false, 
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          disableDefaultUi: false,
        }"
      >
        <gmap-cluster
          ref="cluster"
          :minimumClusterSize="clusterSize"
          :styles="clusterStyles"
          :maxZoom="13"
          :zoomOnClick="true"
        >
          <google-marker
            ref="myMarker"
            v-for="marker in mapMarkers"
            :key="marker.id"
            :title="marker.title"
            :position="marker.position"
            :icon="marker.icon"
            :label="{
              color: 'white',
              fontWeight: '400',
              fontSize: '16px',
              text: String(marker.index)
            }"
            @click="onMapMarkerClick(marker.id,marker.index)"
          ></google-marker>
        </gmap-cluster>
      </google-map>
    </div>
  </div> 
</template>

<script>
import { mapActions } from "vuex";
import EventBus from "../eventBus.js";
import * as VueGoogleMaps from "vue2-google-maps";
import GmapCluster from "vue2-google-maps/dist/components/cluster";
import { defaultOpt } from "../../config/";
import { useText } from "../functions/text";
import {mapStyles} from "../../config/map-styles";


// Map Styles
const MAP_MARKER = "/Static/assets/images/pin.svg";
const CLUSTER_ICON_SML = "/Static/assets/images/cluster-icon-small.svg";
const CLUSTER_ICON_MED = "/Static/assets/images/cluster-icon-medium.svg";
const CLUSTER_ICON_LRG = "/Static/assets/images/cluster-icon-large.svg";
const CLUSTER_STYLES = [
  {
    textColor: "#fff",
    url: CLUSTER_ICON_SML,
    alt: "Cluster",
    height: 60,
    width: 60
  },
  {
    textColor: "#fff",
    url: CLUSTER_ICON_MED,
    alt: "Cluster",
    height:75,
    width: 75
  },
  {
    textColor: "#fff",
    url: CLUSTER_ICON_LRG,
    alt: "Cluster",
    height: 90,
    width: 90
  }
];

export default {
  data() {
    return {
      center: defaultOpt.pos,
      zoom: defaultOpt.zoom,
      mapMarkers: null,
      mapMarkerIconSize: null,
      newSearch: false,
      showSearch: false,
      clusterStyles: CLUSTER_STYLES,
      clusterSize: defaultOpt.cluster,
      mapStyles: mapStyles,
      mobileExpandMap: false
    };
  },
  components: {
    "google-map": VueGoogleMaps.Map,
    "google-marker": VueGoogleMaps.Marker,
    "gmap-cluster": GmapCluster
  },
  created() {
    EventBus.$on("recenterMapLocation", () => {
      // this.unSelectMarker();
    });
    EventBus.$on("mapBound", () => {
      this.newSearch = true;
    });
    EventBus.$on("centerOnMap", (val) => {
      this.centerOnMap(val)
    });
  },
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
    userSearch: {
      get() {
        return this.$store.getters.userSearch;
      }
    }
  },
  watch: {
    // Active state for marker
    selectedLocation(newValue, oldValue) {
      this.selectMapMarker(oldValue, false);
      this.selectMapMarker(newValue, true);
    },

    // Fit to bounds of markers on update to markers.
    mapMarkers(markers) {
      // this.boundMarkers(markers);
    },

    filteredLocations(newValue) {
      this.addMarkers();
    },
    userSearch(newValue) {
      // Flag for new search
      this.newSearch = true;
    }
  },
  methods: {
    ...mapActions(["updateSelectedLocation", "updateLocations"]),

    onMapMarkerClick(id, index) {
      this.selectedLocation = id;
      EventBus.selectedIndex(index);
      EventBus.scrollToTopMobile(200); 
    },

    centerOnMap(val){
      this.panTo(val.center);
      this.zoom = 14;
      this.selectJustMapMarker(val.id);
    },

    selectJustMapMarker(id) {
      if (this.mapMarkers && this.mapMarkers[id]) {
        this.prev = id;
        const icon = {
          url: MAP_MARKER,
          scaledSize: this.mapMarkerSelectedSize
        };
        if (!this.mapMarkers[id]) return;
        this.mapMarkers[id].icon = icon; 
      }
    },

    expandMap(){
      if(this.$mq !== 'desktop') {
        if(this.selectedLocation){
          EventBus.scrollToTopMobile(0);
          return this.unSelectMarker();
        }
        this.mobileExpandMap = true;
        EventBus.expandMap(true);
        EventBus.scrollToTopMobile(0);
      }
    },

    contractMap(){
      if(this.$mq !== 'desktop') {
        this.mobileExpandMap = false;
        EventBus.expandMap(false);
        setTimeout(()=> {  
          EventBus.scrollToTopMobile();
        },600)
      }
    },

    onClusterClick() {
      // Zoom in on locations.
      // Reindex/ populate locations
    },

    // Get map center dispatch request with lat and lng
    searchThisArea() {
      const payload = {
        lat: this.$refs.map.$mapObject.center.lat(),
        lng: this.$refs.map.$mapObject.center.lng(),
        radius: defaultOpt.radius
      };
      this.updateLocations(payload);
      this.showSearch = false;
      EventBus.scrollToTop();
      EventBus.clearSearch();
    },

    showSearchArea() {
      // Show search this area button
      this.showSearch = true;
    },

    recenterMapLocation() {
      if (!this.userSearch) return;
      // this.panTo(this.userSearch);
    },

    // If we want to update view to include all markers
    boundMarkers() {
      const propOwn = Object.getOwnPropertyNames(this.mapMarkers);
      if (propOwn.length > 2) {
        const bounds = new google.maps.LatLngBounds();
        for (var m in this.mapMarkers) {
          if (this.mapMarkers.hasOwnProperty(m)) {
            // do stuff
            let lat = parseFloat(this.mapMarkers[m].position.lat);
            let lng = parseFloat(this.mapMarkers[m].position.lng);
            let myLatlng = new google.maps.LatLng(lat, lng);
            bounds.extend(myLatlng);
          }
        }
        this.$refs.map.fitBounds(bounds);
        // Prevent bounding on filtering
        this.newSearch = false;
      } else {
        // No results no map bound, center on requested search
        this.panTo(this.userSearch);
      }
    },

    // If we want an info box on click
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoOptions.content = marker.infoText;

      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },

    addMarkers() {
      // go through the stores list and add a map marker for each
      let markers = {};
      for (let i = 0; i < this.filteredLocations.length; i++) {
        const marker = {};
        marker.id = this.filteredLocations[i].id;
        marker.index = i + 1;
        marker.title =
          this.filteredLocations[i].displayName +
          "\n" +
          this.filteredLocations[i].address.address +
          "\n" +
          this.filteredLocations[i].phone;
        marker.animation = 4;
        marker.icon = {
          url: MAP_MARKER,
          scaledSize: this.mapMarkerIconSize
        };
        marker.infoText = "<strong>Bank</strong>";
        marker.position = {
          lat: this.filteredLocations[i].geocode.latitude,
          lng: this.filteredLocations[i].geocode.longitude
        };

        markers[this.filteredLocations[i].id] = marker;
      }

      this.mapMarkers = markers;
      // Only bound map on new search location
      if (this.newSearch) {
        setTimeout(() => {
          this.boundMarkers();
        }, 0);
      }
    },

    selectMapMarker(id, active) {
      if (this.mapMarkers && this.mapMarkers[id]) {
        this.prev = id;
        const icon = {
          url: MAP_MARKER,
          scaledSize: active
            ? this.mapMarkerSelectedSize
            : this.mapMarkerIconSize
        };
        if (!this.mapMarkers[id]) return;
        this.mapMarkers[id].icon = icon;
        if (active) {
          const storeLocation = Object.assign({}, this.mapMarkers[id].position);
          this.panTo(storeLocation);
        }
      }
    },

    unSelectMarker() {
      if (!this.mapMarkers[this.prev]) return;

      const icon = {
        url: MAP_MARKER,
        scaledSize: this.mapMarkerIconSize
      };
      this.mapMarkers[this.prev].icon = icon;
      this.updateSelectedLocation(null)
    },

    panBack(location) {
      this.$refs.map.panTo(this.center);
    },
    panTo(latlng) {
      if (latlng) {
        this.$refs.map.panTo(latlng);
      }
    },

    text(key, val) {
      return useText(key, val);
    },
  },
  mounted() {
    this.$refs.map.$mapPromise.then(() => {
      this.mapMarkerIconSize = new window.google.maps.Size(30, 40);
      this.mapMarkerSelectedSize = new window.google.maps.Size(50, 50);
    });
  }
};
</script>
