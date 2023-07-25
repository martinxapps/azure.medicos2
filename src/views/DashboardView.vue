<script setup>

import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";

//const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const type = computed(() => authStore.type);

const goTo = async (name) => {
  await router.push({ name: name });

};
const hashCode = (string) => {
  let hash = 0,
    i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
const hash = computed(() => hashCode(user.value?.name ? user.value?.name : "123456"));
</script>
<template>
  <div class="justify-content-center py-1"
       style="background-color: #f8f9fc;">
    <teleport to="#page-title">
      <title>MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="container m-auto d-block">
      <div class="row mb-2 mb-md-2 mt-2 ml-3">
        <!--columna de text-->
        <div class=" col-12 col-md-12">
          <div class="row mt-4">
            <img class="img-metrovirtuald" src="@/assets/metrovirtual_logo.svg" alt="Mundometro icon"
                 width="100%" height="auto ">
          </div>
          <div class="row mt-4">
            <h5 style=" color: #44bdf0; font-size: 18px; font-weight: 500;">Bienvenido/a</h5><br>
          </div>
        </div>
        <div class=" col-12 col-md-12">
          <div class="row">
            <p class="title-user" style=" color: #05305d; font-size: 24px; font-weight: 600;">
              {{ type === "patient" ? "Sr." : "Dr." }} {{ user?.name }}</p><br>
          </div>
        </div>
        <div class=" col-12 col-md-12">
          <div class="row mb-5">
            <!--                        <p class="black-colorv2" v-if="type === 'patient'">¿En que podemos ayudarte hoy?</p>-->
            <p class="black-colorv2">!Hoy será un gran día!</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container m-auto d-block">
      <div class="row my-1 my-md-5 justify-content-center">
        <!--columna de iconos-->
        <div class=" col-6 col-md-3 d-block pb-5 "
             v-if="authStore.hasRole('PERFIL_MEDICO_PACIENTES') || authStore.hasRole('PERFIL_MEDICO_RESIDENTES')">
          <div class="icon-img cursor-pointer" @click="goTo('mis-pacientes')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/mis-pacientes-blanco.png"
                   alt=" icon">
              <img class="img-icon-color" src="@/assets/mis-pacientes.png" style="margin-top: -105px" alt=" icon">
              <br>
            </div>
            <p class="d-block text-icon-color mt-3">Mis Pacientes
            </p>
          </div>
        </div>
        <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_RESULTADOS')">
          <div class="icon-img cursor-pointer" @click="goTo('resultados-imagen-y-laboratorio-medicos')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/resultados-blancos.png"
                   alt=" icon">
              <img class="img-icon-color" src="@/assets/resultados.png" style="margin-top: -105px" alt=" icon">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Resultados de <br>
              Imagen & <br>
              Laboratorio
            </p>
          </div>
        </div>
        <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_BDOCU')">
          <a class="icon-img" style="text-decoration: none"
             :href="`https://appdocumentosdirmed.azurewebsites.net/app/access/${user?.username.split('@')[0]}/a29bcf0f-e889-4181-b2d5-62d630d502ee`"
             target="_blank">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/biblioteca-blancov2.png"
                   alt=" icon">
              <img class="img-icon-color" src="@/assets/bibliotecav2.png" style="margin-top: -105px" alt=" icon">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Biblioteca de <br>Credenciales
            </p>
          </a>
        </div>
        <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_HONORARIOS')">
          <div class="icon-img cursor-pointer" @click="goTo('honorarios')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/honorarios-blancos.png"
                   alt=" icon">
              <img class="img-icon-color" src="@/assets/honorarios.png" style="margin-top: -105px" alt=" icon">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Mis Honorarios
            </p>
          </div>
        </div>
      </div>
      <div class="row mb-4 mb-md-2 justify-content-center  pb-5 mt-5 my-5">
        <!--columna de text-->
        <div class=" col-12 col-md-4">
          <div class="row mt-2 mt-md-5 justify-content-center">
            <a href="https://www.hospitalmetropolitano.org/es/terminos-condiciones-y-uso-de-medios" target="_blank">
              <h5 class="title-terminos">
                Términos y Condiciones
              </h5>
            </a>
          </div>
        </div>
        <div class=" col-12 col-md-4">
          <div class="row mt-2 mt-md-5 justify-content-center">
            <a href="https://www.hospitalmetropolitano.org/es/politicas-de-privacidad" target="_blank">
              <h5 class="title-terminos">
                Políticas de Privacidad
              </h5>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
