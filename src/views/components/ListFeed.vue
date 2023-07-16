<template>

  <template v-for="item in feedStore.getFeed">
    <CompletedTaskItem v-if="item.type == 'task'" :task="item" />
    <NoteItem v-else-if="item.type == 'note'" :note="item" />
  </template>  
  
</template>

<script setup>
import {useFeedStore} from "@/stores/feed";
import CompletedTaskItem from "@/views/components/task/CompletedTaskItem";
import NoteItem from "@/views/components/NoteItem";

const feedStore = useFeedStore();

</script>

<style>

</style>