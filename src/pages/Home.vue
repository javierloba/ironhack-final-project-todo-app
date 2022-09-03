<template>
  <div
    v-if="dataLoaded"
    class="max-w-[1200px] mx-auto pt-12 md:pt-20 pb-6 px-12"
  >
    <!-- No Data -->
    <div v-if="data.length === 0" class="w-full flex flex-col items-center">
      <h1 class="text-2xl">Looks empty here...</h1>
      <router-link
        class="mt-12 bg-purple-600 hover:bg-purple-700 text-white font-bold p-2 rounded shadow-lg hover:shadow-xl transition duration-200"
        :to="{ name: 'Create' }"
        >Create task</router-link
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
        <div v-if="!todo.is_complete" class="self-end text-xs text-yellow-500">
          <font-awesome-icon icon="fa-solid fa-hourglass-start" />
        </div>
        <div v-if="todo.is_complete" class="self-end text-xs text-green-500">
          <font-awesome-icon icon="fa-solid fa-circle-check" />
        </div>
        <h1 class="mt-8 mb-6 h-[70px] text-center text-xl">
          {{ todo.title }}
        </h1>
        <div class="flex justify-center gap-12 text-purple-600">
          <font-awesome-icon
            icon="fa-solid fa-pen-to-square"
            class="cursor-pointer"
            @click="(isOpen = true), (openTask = index)"
          />
          <font-awesome-icon
            icon="fa-solid fa-trash"
            class="cursor-pointer"
            @click="deleteData(index)"
          />
        </div>
        <!-- Edit task -->
        <div
          v-if="isOpen"
          class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-10"
        >
          <form
            @submit.prevent="editData(index)"
            class="max-w-2xl p-10 bg-white rounded-md shadow-xl"
          >
            <!-- Status Message -->
            <div
              v-if="statusMsg || errorMsg"
              class="mb-10 p-4 bg-light-grey rounded-md shadow-lg"
            >
              <p class="text-green-500">
                {{ statusMsg }}
              </p>
              <p class="text-red-500">{{ errorMsg }}</p>
            </div>
            <div class="flex flex-col items-center justify-between">
              <div class="self-end text-sm">
                <font-awesome-icon
                  icon="fa-solid fa-circle-xmark"
                  class="cursor-pointer"
                  @click="(isOpen = false), (openTask = null)"
                />
              </div>
              <h3 class="text-2xl mb-6">{{ data[openTask].title }}</h3>

              <!-- Edit name -->
              <div class="w-full mb-6 pt-3 rounded bg-gray-200">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  for="edit"
                  >New title</label
                >
                <input
                  type="text"
                  id="edit"
                  v-model="data[openTask].title"
                  maxlength="40"
                  class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                />
              </div>
              <!-- Edit state -->
              <div class="w-full mb-6 pt-3 rounded bg-gray-200">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2 ml-3"
                  for="todo-text"
                  >State</label
                >
                <select
                  required
                  id="todo-state"
                  v-model="data[openTask].is_complete"
                  class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
                >
                  <option value="select-state" disabled selected hidden>
                    Select state
                  </option>
                  <option value="false">In progress</option>
                  <option value="true">Completed</option>
                </select>
              </div>
            </div>
            <button
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
              type="submit"
            >
              Edit
            </button>
          </form>
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
const statusMsg = ref(null);
const errorMsg = ref(null);
const data = ref([]);
const dataLoaded = ref(null);
const isOpen = ref(false);
const openTask = ref("");
const is_complete = ref("select-state");

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

const deleteData = async (index) => {
  try {
    await taskStore.deleteTodo(data.value[index].id);
    getData();
  } catch (error) {
    console.log(error.message);
  }
};

const editData = async (index) => {
  try {
    await taskStore.editTodo(
      data.value[index].title,
      data.value[index].is_complete,
      data.value[index].id
    );
    statusMsg.value = "Succes: Task edited!";
    setTimeout(() => {
      statusMsg.value = false;
      openTask.value = false;
      isOpen.value = false;
    }, 2000);
    getData();
  } catch (error) {
    errorMsg.value = `Error: ${error.message}`;
    setTimeout(() => {
      errorMsg.value = false;
    }, 2000);
  }
};

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
