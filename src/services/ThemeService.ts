import { reactive } from "vue";

export const store = reactive({
  setItem(value: string) {
    localStorage.setItem("themeSet", value);
  },
});