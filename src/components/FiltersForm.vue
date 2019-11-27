<template>
  <div class="filter-form-wrapper">
    <div class="filter-container">
      <div class="col-md-9">
        <ul :class="{showItems: showItems }">
          <template v-for="(filterOption, key, index) in  filterOptions" >
            <li :key="key"> 
              <h2 :class="{ upper : key == 'atm'}" :id="key" tab-index="-1">{{key}}</h2>
            </li>

            <template v-if="key == 'atm'" >
              <li class="form-group form-check" :key="key+index+index">
                <input type="checkbox" id="allatm" value="ATM" v-model="allatm" />
                <label for="allatm">{{text('all')}}</label>
              </li>
            </template>

            <template v-if="key == 'branch'" >
              <li class="form-group form-check" :key="key+index+index">
                <input type="checkbox" id="allbranch" value="Branch" v-model="allbranch" />
                <label for="allbranch">{{text('all')}}</label>
              </li> 
              <li class="form-group form-check" :key="key+index">
                <input type="checkbox" class id="hours" value="Open now" v-model="meta.isOpen" />
                <label for="hours">{{text('opennow')}}</label>
              </li> 
            </template>

            <template v-for="(item, index) in filterOption">
              <li :key="item+index" class="form-group form-check">
                <input type="checkbox" :id="item" :value="item" v-model="meta[key]" />
                <label :for="item">{{item}}</label>
              </li> 
            </template> 
          </template>
        </ul>
        <div class="btm"></div>
      </div>
    </div>
    <div class="sticky-footer" :class="{ show: showApply}">
      <div class="col-md-9">
        <Button class="btn-primary" @click="applyFilters">Apply</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import EventBus from "../eventBus.js";
import { locText } from "../mixin/useText";

export default {
  props: {
    hideOverlayFn: Function,
    filterOptions: Object
  },
  data() {
    return {
      showApply: false,
      type: [...this.$store.state.filters.type],
      meta: {
        isOpen: this.$store.state.filters.meta.isOpen,
        atm: this.$store.state.filters.meta.atm,
        branch: this.$store.state.filters.meta.branch,
        specialty: this.$store.state.filters.meta.specialty
      },
      showItems: false
    };
  },
  mixins: [locText],
  computed: {
    allatm: {
      get() {
        let allatm = this.type.indexOf("ATM") !== -1;
        if(this.meta.atm.length) {
          allatm = false;
        }
        return allatm;
      },
      set(val) {
        if(val){
          this.meta.atm = []
        }
        this.handleTypes(val, "ATM");
      }
    },
    allbranch: {
      get() {
        let allbranch = this.type.indexOf("Branch") !== -1;
        if(this.meta.isOpen == true || this.meta.branch.length > 0 || this.meta.specialty.length > 0) {
          allbranch = false;
        }
        return allbranch;
      },
      set(val) {
        if(val){
          this.meta.isOpen = false;
          this.meta.branch = [];
          this.meta.specialty = []
        }
        this.handleTypes(val, "Branch");
      }
    }
  },
  methods: {
    ...mapActions(["updateFilters", "updateFilterTypes"]),

    handleTypes(val, type) {
      let a = this.type
      let b = a.indexOf(type);
      if(val){
        if(b == -1){
          a.push(type);
        }
      } else {
        if(b != -1){
          a.splice(b,1)
        }
      }
      this.type = a;
    },

    applyFilters() {
      // Save filters
      const payload = {
        type: this.type,
        ...this.meta,
      }
      this.hideOverlayFn();
      // HERO_analytics_data_layer.setAttribute(".filtername", [payload]); 
      this.updateFilters(payload);
      EventBus.scrollToTop();
    }
  },
  mounted() {
    setTimeout(()=> {
      this.showItems = true;
    },400) 
   
    // variable viewport height for all mobile.
    let vh = window.innerHeight * 0.01;
    var elem = document.querySelector('.filter-form-wrapper');
    elem.style.setProperty('--vh', `${vh}px`);
  
  }
};
</script>
