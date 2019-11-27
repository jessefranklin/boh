import Vue from "vue";

export default new Vue({
  methods: {
    recenterMapLocation() {
      this.$emit("recenterMapLocation");
    },
    scrollToTop() {
      this.$emit("scrollToTop");
    },
    mapBound() {
      this.$emit("mapBound");
    },
    clearSearch() {
      this.$emit("clearSearch");
    },
    expandMap(val) {
      this.$emit("expandMap",val);
    },
    scrollToTopMobile(val) {
      this.$emit("scrollToTopMobile",val);
    },
    centerOnMap(val){
      this.$emit("centerOnMap",val);
    },
    selectedIndex(val){
      this.$emit("selectedIndex",val);
    }
  }
});
