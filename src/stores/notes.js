import {defineStore} from 'pinia';
import NoteService from "@/services/NoteService";

export const useNoteStore = defineStore("notes", {
  state: () => {
    return {
      notes: []
    }
  }  
});
