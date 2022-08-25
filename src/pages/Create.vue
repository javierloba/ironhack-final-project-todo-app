<template>
  <div
    class="body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0"
    style="font-family: 'Lato', sans-serif"
  >
    <div
      class="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl"
    >
      <section>
        <h3 class="font-bold text-2xl">Create To-Do</h3>
      </section>

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

      <section class="mt-10">
        <form @submit.prevent="createTodo" class="flex flex-col">
          <!-- Name -->
          <div class="mb-6 pt-3 rounded bg-gray-200">
            <label
              class="block text-gray-700 text-sm font-bold mb-2 ml-3"
              for="todo-name"
              >Title</label
            >
            <input
              required
              type="text"
              id="todo-name"
              v-model="title"
              class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
            />
          </div>

          <!-- State -->
          <div class="mb-6 pt-3 rounded bg-gray-200">
            <label
              class="block text-gray-700 text-sm font-bold mb-2 ml-3"
              for="todo-text"
              >State</label
            >
            <select
              required
              id="todo-state"
              v-model="is_complete"
              class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3"
            >
              <option value="select-state" disabled selected hidden>
                Select state
              </option>
              <option value="false">In progress</option>
              <option value="true">Completed</option>
            </select>
          </div>

          <button
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
            type="submit"
          >
            Create
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTaskStore } from "../store/task";

const router = useRouter();
const taskStore = useTaskStore();
const { task } = storeToRefs(taskStore);

const title = ref("");
const is_complete = ref("select-state");
const statusMsg = ref(null);
const errorMsg = ref(null);
const token = JSON.parse(localStorage.getItem('supabase.auth.token'))
console.log(token.currentSession.user.id)
const user_id = ref(token.currentSession.user.id)

const createTodo = async () => {
  try {
    await taskStore.insertTodo(title.value, is_complete.value, user_id.value);
    statusMsg.value = "Succes: To-do created!";
    title.value = "";
    is_complete.value = "select-state";
    setTimeout(() => {
      statusMsg.value = false;
    }, 5000);
    setTimeout(() => {
      router.push({ name: "Home" });
    }, 1000);
  } catch (error) {
    errorMsg.value = `Error: ${error.message}`;
    setTimeout(() => {
      errorMsg.value = false;
    }, 5000);
  }
};
</script>

<style></style>
