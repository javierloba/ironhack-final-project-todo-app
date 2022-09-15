<template>
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
      @click="deleteData()"
    />
  </div>
  <!-- Edit task -->
  <div
    v-if="isOpen"
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-10"
  >
    <form
      @submit.prevent="editData()"
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
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTaskStore } from "../store/task.js";

const props = defineProps(["todo", "index", "data", "getData"]);
console.log(props.data[0])

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);
const statusMsg = ref(null);
const errorMsg = ref(null);
const is_complete = ref("select-state");
const openTask = ref("");
const isOpen = ref(false);

const deleteData = async () => {
  try {
    await taskStore.deleteTodo(props.data[props.index].id);
    // getData();
  } catch (error) {
    console.log(error.message);
  }
};

const editData = async () => {
  try {
    await taskStore.editTodo(
      props.data[props.index].title,
      props.data[props.index].is_complete,
      props.data[props.index].id
    );
    statusMsg.value = "Succes: Task edited!";
    setTimeout(() => {
      statusMsg.value = false;
      openTask.value = false;
      isOpen.value = false;
    }, 2000);
    // getData();
  } catch (error) {
    errorMsg.value = `Error: ${error.message}`;
    setTimeout(() => {
      errorMsg.value = false;
    }, 2000);
  }
};

</script>

<style></style>
