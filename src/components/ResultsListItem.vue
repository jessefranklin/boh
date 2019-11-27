
<template>
  <!-- List iten tempate -->
  <div
    class="results-list-item"
    :class="[{selected: selected == location.id}, {mobileSelected: mobileSelected}]"
    v-on:click.stop="selectLocationClick(location.id)" 
    :aria-labelledby="location.id+'name '+location.id+'type'"
  >
    <div class="flex title-container">
      <div class="marker bg-blue">{{mobileSelected ? selectedIndex : num}}</div>
      <div>
        <h2 :id="location.id+'name'">{{location.displayName}}</h2>
        <h5 :id="location.id+'type'">{{location.type.join(' & ')}}</h5>
      </div>
    </div>
    <div class="flex address-container">
      <div>
        <address v-html="address"></address>
        <!-- Link to google maps --->
        <a :href="directions" target="_blank" title="Get directions from google">{{text('directions')}}</a>
      </div>
      <div>{{distance}}{{text('miles')}}</div>
    </div>
    <div class="meta-container flex-end">
      <div>
        <!-- Phone on click -->
        <a class="phone" :href="'tel:'+location.phone" v-if="location.phone">{{ location.phone}}</a>
        <div :class="{ textOrange: closingSoonFlag || exceptionToday != undefined}" v-if="operationalStatus">{{ operationalStatus }}</div>
        <div v-if="location.type[0] === 'ATM' && location.operationalHours.open24Hours == true && exceptionToday === undefined">{{text('open24hours')}}</div>
        <div>{{ exceptionToday }}</div>
        <div v-if="isMobile && !mobileSelected"><button class="btn-naked btn-link" v-on:click="centerAndClose(location)">{{text('showonmap')}}</button></div>
      </div>
      <div class="flex-br"> 
        <button
          class="btn-naked btn-arrow-down"
          :class="{active: show}"
          @click="show = !show"
        >{{moreless}}</button>
      </div>
       
    </div>

    <transition name="slideDown">
      <div v-if="show" class="meta-data-container">
        <results-list-item-details
          :type="location.type" 
          :operationalHours="location.operationalHours"
          :meta="location.meta"
        ></results-list-item-details>
      </div>
    </transition>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import { exclude } from "../../config";
import moment from "moment";
import ResultsListItemDetails from "./ResultsListItemDetails.vue";
import { locText } from "../mixin/useText";
import { hoursConditions, exceptions } from "../functions/hours";

export default {
  props: {
    location: Object,
    index: Number,
    selected: Number,
    selectLocationClick: Function,
    mobileSelected: Boolean,
    selectedIndex: Number,
    centerAndClose: Function
  },
  data() {
    return {
      show: false
    };
  },
  components: {
    "results-list-item-details": ResultsListItemDetails
  },
  mixins: [locText],
  created() {
    EventBus.$on("recenterMapLocation", () => {
      this.show = false;
    });
  },
  computed: {
    num() {
      return this.index + 1;
    },
    address() {
      const addressFormatted =
        this.location.address.address1 +
        "<br />" +
        this.location.address.city +
        ", " +
        this.location.address.state +
        ", " +
        this.location.address.zip;
      return addressFormatted;
    },
    distance() {
      return parseFloat(this.location.distance).toFixed(2);
    },
    directions() {
      const user = this.$store.state.userLocation;
      return `https://www.google.com/maps/dir/?api=1&origin=${user.lat},${user.lng}&destination=${this.location.address.address1},${this.location.address.city}&travelmode=driving`;
    },
    moreless() {
      return !this.show ? this.text('more') : this.text('less');
    },
    closingSoonFlag(){
      const flag = hoursConditions(this.location.operationalHours);
      
      if(flag) {
        return flag.indexOf('Closing') !== -1;
      }
      return false;
    },
    operationalStatus() {
      return hoursConditions(this.location.operationalHours);
    },
    exceptionToday(){
      const locationExceptions = this.location.operationalHours.exceptions;
      return exceptions(locationExceptions);
    },
    isMobile() {
      return this.$mq != 'desktop';
    }
  }
};
</script>

