import { en } from "../../config/i18n.en";

export const locText = {
  methods: {
    text(key, val) {
      if (val) return val;
      return en[key];
    }
  }
};
