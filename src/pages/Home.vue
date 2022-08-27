<template>
  <div
    v-if="dataLoaded"
    class="min-h-screen max-w-[1200px] mx-auto pt-12 md:pt-20 pb-6 px-12"
  >
    <!-- No Data -->
    <div v-if="data.length === 0" class="w-full flex flex-col items-center">
      <h1 class="text-2xl">Looks empty here...</h1>
      <router-link
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
        :to="{ name: 'Create' }"
        >Create Task</router-link
      >
    </div>

    <!-- Data -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        class="flex flex-col items-center bg-yellow-50 p-8 shadow-md"
        v-for="(todo, index) in data"
        :key="index"
      >
        <p v-if="!todo.is_complete" class="self-end text-xs text-yellow-500">
          <font-awesome-icon icon="fa-solid fa-hourglass-start" />
        </p>
        <p v-if="todo.is_complete" class="self-end text-xs text-green-500">
          <font-awesome-icon icon="fa-solid fa-circle-check" />
        </p>
        <h1 class="mt-8 mb-2 h-[70px] text-center text-xl">
          {{ todo.title }}
        </h1>
        <div class="flex justify-center gap-12 text-purple-600">
          <font-awesome-icon icon="fa-solid fa-pen-to-square" class="cursor-pointer" />
          <font-awesome-icon icon="fa-solid fa-trash" class="cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user.js";
import { useTaskStore } from "../store/task.js";

const router = useRouter();
const userStore = useUserStore();
const taskStore = useTaskStore();
const { user } = storeToRefs(userStore);
const { tasks } = storeToRefs(taskStore);
const data = ref([]);
const dataLoaded = ref(null);
const isOpen = ref(false);

const getData = async () => {
  try {
    await taskStore.fetchTasks();
    data.value = tasks.value;
    dataLoaded.value = true;
  } catch (error) {
    console.log(error.message);
  }
};
getData();

onMounted(async () => {
  try {
    await userStore.fetchUser(); // here we call fetch user
    if (!user.value) {
      // redirect them to logout if the user is not there
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
