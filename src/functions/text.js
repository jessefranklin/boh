import { en } from "../../config/i18n.en";

// Allow for overright of default labels
export function useText(key, val) {
  if (val) return val;
  return en[key];
}
