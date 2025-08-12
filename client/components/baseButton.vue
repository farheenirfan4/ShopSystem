<template>
  <v-btn v-bind="$attrs" class="base-btn">
    <slot />
  </v-btn>
</template>

<style>
.base-btn {
  background-color: #000 !important;
  color: white !important;
  border-radius: 8px !important;
}
</style>
