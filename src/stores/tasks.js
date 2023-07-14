import {defineStore} from 'pinia';
import TaskService from "@/services/TaskService";

export const useTaskStore = defineStore("tasks", {
  state: () => {
    return {
      tasks: []
    }
  },
  actions: {
    async markAsCompleted(payload) {
      const taskService = new TaskService();
      return taskService.update(payload.id, payload)
        .then(res => {
          // let pos = this.tasks.findIndex(
          //   (task) => task.id === payload.id
          // )
          // if (this.tasks[pos]) {
          //   this.tasks[pos].done = true;       
          //   this.tasks[pos].done_by = payload.done_by;       
          // }

          return res;
        })
    },
    async delete(payload) {
      const taskService = new TaskService();
      this.tasks = this.tasks.filter(
        (task) => task.id !== payload.id
      );     
      
      return taskService.delete(payload.id)
        .then(res => {
          return res;
        })
    }
  },
  getters: {
    completedTasks: (state) => state.tasks.filter(task => task.done),
    inCompletedTasks: (state) => state.tasks.filter(task => !task.done),
  }
 

});