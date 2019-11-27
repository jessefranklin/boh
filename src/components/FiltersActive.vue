<template>
  <div class="filters-active">
    <div class="filters-active-container col-md-10" :class="{show:count > 0}">
      <div class="label">Filters: </div>
      <ul class="filter-list" id="activeFilterList">
          <!-- <button class="btn-filter-item btn-naked" @click="removeHours">Open Now</button> -->
        <li v-if="open">
          <div class="btn-filter-item">
            <button class="btn-close-icon btn-naked" @click="removeHours">
                <svg-icon icon="close"></svg-icon>
                </button>
              {{text('opennow')}}
            </div>
        </li>
        <template v-for="(types,key) in meta">
          <template v-for="(filtered,index) in types"  >
          <li v-if="filtered !== 'all'" :key="key+index">
            <!-- <button class="btn-filter-item btn-naked" @click="removeItem(key,filtered)">{{filtered}}</button> -->
            <div class="btn-filter-item">
              <button class="btn-close-icon btn-naked" @click="removeItem(key,filtered)">
                <svg-icon icon="close"></svg-icon>
                </button>
              {{filtered}}
            </div>
          </li> 
           </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SvgIcon from './el/SvgIcon.vue';
import { locText } from "../mixin/useText";

export default {
  data() {
    return {
      count: 0
    }
  },
  components: {
    "svg-icon": SvgIcon
  },
  mixins: [locText],
  computed: {
    meta() {
      return this.$store.getters.filters.meta;
    },
    open: {
      get() {
        return this.$store.getters.filters.meta.isOpen;
      }
    }
    
  },
  watch: {
    meta(){
      this.listCount();
    }
  },
  methods: {
    ...mapActions(["removeFromFilters", "updateIsOpen"]),
    removeItem(key, val) {
      const payload = {
        key,
        val
      };

      if(this.count == 1){
        this.count = 0;
        return setTimeout(()=> {
          this.removeFromFilters(payload);
        },1000);
      }
      this.removeFromFilters(payload);
      this.listCount();
    },
    listCount(){
      var list = document.getElementById('activeFilterList');
      setTimeout(()=>{ return this.count = list.childElementCount;},0);
    },
    removeHours() {
      if(this.count == 1){
        this.count = 0;
        return setTimeout(()=> {
            this.updateIsOpen(false);
          },1000);
      }
      this.updateIsOpen(false);
    }
  }
  
};
</script>
