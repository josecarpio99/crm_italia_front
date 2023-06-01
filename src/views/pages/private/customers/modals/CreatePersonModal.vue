<template>
  <BaseModal @close-modal="$emit('close-modal')">
    <h1>Hi...</h1>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/views/components/BaseModal'

defineEmits(["close-modal"]);
</script>