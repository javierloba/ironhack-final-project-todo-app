<template>
  <div>Soy la home</div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user.js";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const token = localStorage.getItem('supabase.auth.token')
console.log(JSON.parse(token))


onMounted(async () => {
  try {
    await userStore.fetchUser(); // here we call fetch user
    if (!user.value) {
      // redirect them to logout if the user is not there
      console.log("hola home")
      router.push({ path: "/login" });
    } else {
      // continue to dashboard
      router.push({ path: "/" });
    }
  } catch (e) {
    console.log(e);
  }
});
</script>
