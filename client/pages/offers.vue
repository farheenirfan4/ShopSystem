<template>
  <div>
    <V-btn @click="playerService.fetchFilteredDataForOffer">Fetch Player Data</V-btn>
    <!---<V-btn @click="playerService.fetchCount">Get Total Users</V-btn>-->

   

  </div>
</template>

<script setup>
import { usePlayerService } from '../composables/usePlayerService';

const playerService = usePlayerService();
</script>