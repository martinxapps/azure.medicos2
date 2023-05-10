<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// const authStore = useAuthStore();
// const user = computed(() => authStore.user);

const goTo = async (name) => {
  await router.replace({ name: name });
};

</script>
<template>
  <div>
    <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center py-1"
         style="background-color: #f8f9fc;">
      <!--login section-->
      <div class="container m-auto ml-2">
        <div class="row mb-4 mb-md-2 justify-content-center">

          <!--columna de iframe-->
          <div class="col-12 ">
            <div class="px-2 mt-5 pt-8">
              <h2 style="text-align: center;">No encontrado</h2>
              <button @click="goTo('ingreso')">Ir a login medicos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>


</style>
