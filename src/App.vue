<template>
  <div id="app" class="branch-finder">
    <Layout title="Branch & ATM Finder" />
  </div>
</template>

<script>
import Layout from "./components/Layout.vue";
import { debounce } from './functions/utils';

export default {
  name: "branch-finder",
  components: {
    Layout
  },
  created() {
    this.$store.dispatch("getUserLocation");
    this.mobileVisible();
  },
  methods: {
    mobileVisible(){
      // variable viewport height for all mobile.
      let vh = window.innerHeight * 0.01;
      var h = document.documentElement;
      h.style.setProperty('--vh', `${vh}px`);
      if(this.$mq !== 'desktop') { 
        Object.assign(h.style,{height: '100vh',overflow: 'hidden', height: (vh * 100)+'px' });
        
        window.addEventListener("resize", debounce(event => {
          let vh = window.innerHeight * 0.01;
          h.style.setProperty('--vh', `${vh}px`);
          Object.assign(h.style,{height: '100vh',overflow: 'hidden', height: (vh * 100)+'px' });
        }, 600));

      }
    }
  },
};
</script>

