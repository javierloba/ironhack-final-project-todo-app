// /store/task.js

import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: null,
  }),
  actions: {
    async fetchTasks() {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .order("id", { ascending: false });
      this.tasks = tasks;
    },
    // Hacer POST
    async insertTodo(title, is_complete, user_id) {
      console.log("hi")
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
    // Hacer el delete
    // Hacer el PUT (cambiar entre completada y pendiente)
  },
});
