<template>
  <div class="container">
    <ServiceModel class="service" :basicData="free_data" :premium-data="[]" :header="$t('free')"></ServiceModel>
    <ServiceModel class="service" :basicData="free_data" :premium-data="premium_data" :header="$t('premium')"></ServiceModel>
  </div>
</template>

<script>

import ServiceModel from "../components/ServiceModel";

export default {
  name: "service.vue",
  components: {
    ServiceModel
  },
  data() {
    return {
      free_data: ["Unlimited Links", "Light & Dark Mode", "Customer Support", "Social Icons"],
      premium_data: ["Custom Designes", "Custom Designes", "Custom Designes"]
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-evenly;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
}

.service {
  justify-content: flex-start;
}
</style>