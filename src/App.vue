<template>
  <section v-if="appReady" class="min-h-full box-border">
    <Navigation />
    <router-view class="app-main" />
  </section>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "./supabase";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useUserStore } from "./store/user.js";
import Navigation from "./components/Navigation.vue";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const appReady = ref(null);

onMounted(async () => {
  try {
    await userStore.fetchUser(); // here we call fetch user
    if (!user.value) {
      // redirect them to logout if the user is not there
      router.push({ path: "/login" });
      appReady.value = true;
    } else {
      // continue to dashboard
      router.push({ path: "/" });
    }
  } catch (e) {
    console.log(e);
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  userStore.setUser(session);
  appReady.value = true;
});
</script>
