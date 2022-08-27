import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPenToSquare, faCircleCheck, faHourglassStart } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faPenToSquare, faCircleCheck, faHourglassStart);

const pinia = createPinia();

createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(router).use(pinia).mount("#app");
