import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
// import VuexPersist from 'vuex-persist';
import { api, defaultOpt } from "../../config/";
import { isInHawaii } from "../functions/map";
import { filterByMeta, filterByType, filterIsOpen, filterTypeSelection, filterById } from "../functions/filters";

Vue.use(Vuex);

// const vuexPersist = new VuexPersist({
//   key: 'branch-finder',
//   storage: window.localStorage,
//   // reducer: (state) => ({ locations: state.locations, userSearch: state.userSearch })
// })

export default new Vuex.Store({
  state: {
    // Users Current Location
    userLocation: {},
    // Search Text
    userSearch: {},
    // Selected Marker
    selectedLocation: null, 
    // Filters
    filters: {
      type: ["ATM", "Branch"],
      meta: {
        isOpen: false,
        atm: [],
        branch: [],
        specialty: []
      }
    },
    // Markers
    locations: [],
    // is Loading
    isLoading: true
  },
  getters: {
    userLocation(state) {
      return state.userLocation;
    },
    userSearch(state) {
      return state.userSearch;
    },
    selectedLocation(state) {
      return state.selectedLocation;
    },
    filters(state) {
      return state.filters;
    },
    locations(state) {
      return state.locations;
    },
    filteredLocations(state) {
      return filterIsOpen(
        filterByType(
          filterByMeta(state.locations, state.filters),
          state.filters.type
        ),
        state.filters.meta.isOpen, state.filters.type
      );
    },
    filteredLocationMobile(state) {
      if(state.filteredLocations) 
        return filterById(state.filteredLocations, state.selectedLocation);
      return filterById(state.locations, state.selectedLocation);
    },
    isLoading(state) {
      return state.isLoading;
    }
  },
  mutations: {
    SET_USER_LOCATION(state, location) {
      state.userLocation = location;
    },
    SET_USER_SEARCH(state, location) {
      state.userSearch = location;
    },
    SET_SELECTED_LOCATION(state, location) {
      state.selectedLocation = location;
    },
    SET_FILTERS(state, filters) {
      state.filters.meta = { ...state.filters.meta, ...filters };
    },
    EDIT_FILTERS(state, payload) {
      state.filters.meta[payload.key] = payload.val;
    },
    SET_FILTERS_TYPES(state, types) {
      state.filters.type = types;
    },
    SET_FILTERS_OPEN(state, open) {
      state.filters.meta.isOpen = open;
    },
    SET_LOCATIONS(state, locations) {
      state.locations = locations;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {
    getUserLocation({ commit, dispatch }) {
      if (navigator.geolocation) {
        commit("SET_LOADING", true);
        navigator.geolocation.getCurrentPosition(
          position => {
            let payload = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            let radius = defaultOpt.radius;

            if (!isInHawaii(payload)) {
              payload = defaultOpt.pos;
              radius = 1000;
            }

            commit("SET_USER_LOCATION", payload);
            commit("SET_USER_SEARCH", payload);
            dispatch("updateLocations", {
              ...payload,
              radius: radius
            });
          },
          err => {
            commit("SET_USER_LOCATION", defaultOpt.pos);
            commit("SET_USER_SEARCH", defaultOpt.pos);
            dispatch("updateLocations", {
              ...defaultOpt.pos,
              radius: defaultOpt.radius
            });
            console.log(err);
          }
        );
      }
    },
    updateUserSearch({ commit, dispatch }, payload) {
      const location = {
        lat: payload.geometry.location.lat(),
        lng: payload.geometry.location.lng(),
        radius: defaultOpt.radius
      };

      commit("SET_USER_SEARCH", location);
      dispatch("updateLocations", location);
    },
    updateSelectedLocation({ commit }, payload) {
      commit("SET_SELECTED_LOCATION", payload);
    },
    updateFilters({ commit, dispatch }, payload) {
      
      const types = filterTypeSelection(payload);
      dispatch("updateFilterTypes",types);

      delete payload.type;

      commit("SET_FILTERS", payload);
    },
    removeFromFilters({ commit, state }, payload) {
      const update = state.filters.meta[payload.key].filter(
        arr => arr !== payload.val
      );
      const keyval = {
        key: payload.key,
        val: update
      };
      commit("EDIT_FILTERS", keyval);
    },
    updateFilterTypes({ commit }, payload) {
      
      commit("SET_FILTERS_TYPES", payload);
    },
    updateIsOpen({ commit }, payload) {
      commit("SET_FILTERS_OPEN", payload);
    },
    updateLocations: async ({ commit }, payload) => {
      commit("SET_LOADING", true);
      try {
        let { data } = await axios.get(
          api.URI,
          {
            params: payload
          },
          api.auth 
        );

        commit("SET_LOCATIONS", data.locations);
        commit("SET_LOADING", false);
      } catch (e) {
        console.log(e.response);
      }
    }
  }
});
