// /store/task.js

import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: null,
  }),
  actions: {
    async fetchTasks() {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .order("id", { ascending: false });
      this.tasks = tasks;
      if (error) throw error;
    },
    // Hacer POST
    async insertTodo(title, is_complete, user_id) {
      const { data, error } = await supabase.from("tasks").insert([
        {
          title: title,
          is_complete: is_complete,
          user_id: user_id,
        },
      ]);
      if (error) throw error;
    },
    // Hacer el PUT (edit)
    async editTodo(title, is_complete, taskId) {
      const { data, error } = await supabase
      .from('tasks')
      .update({ title: title, is_complete: is_complete })
      .match({id: taskId})
      this.fetchTasks()
    },
    // Hacer el delete
    async deleteTodo(taskId) {
      const { data, error } = await supabase
      .from('tasks')
      .delete()
      .match({id: taskId})
      this.fetchTasks()
    },
  },
});
