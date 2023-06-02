<template>
  <Teleport to="body">
    <Transition name="modal-outer">
      <div
        v-show="modalActive"
        class="absolute w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center px-8"
      >
        <Transition name="modal-inner">
          <div
            v-if="modalActive"
            class="bg-white self-start mt-32 max-w-screen-lg"
          >
            <div class="border-b-[1px] border-gray-200 p-4">
              <h2><slot name="title" /></h2>
            </div>
            <div class="p-4">
              <slot />
            </div>
            
            <div class="p-4 text-right bg-gray-100">
                <Button
                  theme="outline"
                  class="bg-white border-theme-700 border-[1px] mr-2"
                  :label="trans('global.buttons.close')"
                  @click="$emit('close-modal')"
                />

                <Button
                  :label="trans('global.buttons.save')"
                  @click="$emit('save-modal')"
                />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {trans} from "@/helpers/i18n";
import Button from "@/views/components/input/Button";

defineEmits(["close-modal", "save-modal"]);
defineProps({
  modalActive: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}

.modal-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-inner-leave-to {
  transform: scale(0.8);
}
</style>
