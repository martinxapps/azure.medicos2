<script setup>
import FooterMedico from "../components/FooterMedico.vue";
//import {useAuthStore} from "../stores/auth";decryptId
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { statusPacienteEmergencia, urlCurva } from "../services/patient";
import VuePdfEmbed from "vue-pdf-embed";
import { useNotification } from "@kyvg/vue3-notification";
import {screenview} from "vue-gtag";
import {decryptId} from "../services/security";

// const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const route = useRoute();
const router = useRouter();
const { notify } = useNotification();
const numPagesEvent = (e) => {
  console.log("numPagesEvent", e);
  numPages.value = e;
};
const loadedEvent = (pdf) => {
  console.log("loadedEvent", pdf);
  numPages.value = pdf.numPages;
};
const pageLoadedEvent = (pdf) => {
  console.log("pageLoadedEvent", pdf);
  console.log("currentPage", currentPage.value);
};
const currentPage = ref(1);
const numPages = ref(1);
const isLoading = ref(false);
const isAvailable = ref(false);
const props = defineProps(["type", "na", "nhc"]);
const type = ref(props.type);
const encryptedNHC = ref(props.nhc);
const nhc = ref(null);
const encryptedNa = ref(props.na);
const na = ref(null);
const src = ref(null);
const statusPaciente = ref(null);
const name = ref("");
const title = ref("Resultado  - Metrovirtual / Hospital Metropolitano");


onMounted(async () => {
  switch (type.value) {
    case "TEMP":
      name.value = "Curva de temperatura";
      break;
    case "PSD":
      name.value = "Curva de presión arterial";
      break;
    case "FC":
      name.value = "Curva de frecuencia cardiaca";
      break;
    case "GLUC":
      name.value = "Control de Hemoglucotest";
      break;
  }
  title.value = `${name.value} - Metrovirtual - Hospital Metropolitano`;
  screenview(`Gráfico ${name.value}`);
  na.value = await decryptId(encryptedNa.value);
  nhc.value = await decryptId(encryptedNHC.value);

  getUrl(type.value, na.value);
  getPatientDetails(nhc.value);
});
const getPatientDetails = async (nhc) => {
  try {
    na.value = await decryptId(encryptedNa.value);

    // get patient status
    statusPacienteEmergencia(nhc).then((response) => {
      if (response.status) {
        statusPaciente.value = response.data;
        title.value = `${name.value} ${statusPaciente.value.NOMBRE_PACIENTE} - Metrovirtual - Hospital Metropolitano`;
      }
    }).catch((e) => {
      console.log("error", e);
    });

  } catch (e) {
    console.log("error", e);
  }
};
const goBack = () => {
  console.log("route query", route.query);
  if (window.history.state.back === null) {
    router.replace({ name: "detalle-paciente", params: { nhc: encryptedNHC.value } });
  } else {
    router.back();
  }
};
const previousPage = () => {
  currentPage.value = currentPage.value - 1;
};
const nextPage = () => {
  currentPage.value = currentPage.value + 1;
};

const getUrl = async (type, na) => {
  try {


    if (na) {
      let payload = {
        idReport: type,
        numAtencion: na
      };
      isLoading.value = true;
      let response = await urlCurva(payload);
      if (response.status) {
        src.value = response.data;
        isAvailable.value = true;
      } else {
        isAvailable.value = false;
        notify({
          title: "El archivo no esta disponible",
          text: response.message,
          type: "error"
        });
      }
      isLoading.value = false;
    }
  } catch (e) {
    console.log("error", e);
    isLoading.value = false;
    isAvailable.value = false;
    notify({
      title: "El archivo no esta disponible",
      text: e.message,
      type: "error"
    });
  }
};


</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row my-1 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-2">
              <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
                Regresar
              </h5>
            </div>
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div">
                  <img class="img-header-icon my-3 my-md-2 ml-3" src="@/assets/mis-pacientes.png" alt=" icon">
                </div>
                <h4 class="d-flex text-headerv2 mt-1" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                  {{ name }}<br>
                  {{ statusPaciente?.NOMBRE_PACIENTE }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <!--        <div class="row my-2">-->
        <!--          <div class=" d-flex justify-content-end">-->
        <!--            <div class="img-div">-->
        <!--              <img class="img-header-icon ml-3" src="@/assets/mis-pacientes.png" alt=" icon">-->
        <!--            </div>-->
        <!--            <br>-->
        <!--            <h4 class="d-flex text-headerv2 mt-3" style="text-align:left; color: #05305d;-->
        <!--                                    font-weight: 600;">-->
        <!--              {{ name }}-->
        <!--            </h4>-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="d-flex paginator">
          <button class="prevew p-1 px-4" v-if="currentPage > 1" @click="previousPage()">Atrás</button>
          <p class="text-paginator">{{ currentPage }} / {{ numPages }} Páginas</p>
          <button class="prevew p-1 px-4" v-if="currentPage < numPages" @click="nextPage()">Siguiente</button>
        </div>
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <template v-if="isLoading">
              <div class="d-flex justify-content-center">
                <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="isAvailable">


                <VuePdfEmbed
                  ref="pdfRef"
                  :source="'data:application/pdf;base64,'+src"
                  :page="currentPage"
                  @loaded="loadedEvent"
                  @rendered="pageLoadedEvent"
                />
              </template>
              <template v-else>
                <p class="center text-search">{{ name }} no disponible</p>
              </template>
            </template>
          </div>
        </div>
        <FooterMedico />
      </div>
    </div>
  </div>
</template>

<style scoped>


.col-img {
  width: 60px;
  max-width: 60px;
}

.img-icon-colorv3 {
  width: 26px;
  height: 26px;
  margin: 0 auto;
  display: block;
  margin-top: 1px;
  padding: 0;
}

.img-borderv4 {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  transition: all .30s linear;
  /*padding: 5px 5px;*/
  width: 50px;
  height: 50px;
  border-radius: 100%;
  text-align: center;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

.img-borderv4 > img {
  position: relative;
  top: 8px;
  /*left: 12px;*/
}

.img-borderv4 > img:last-of-type {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
}

/*
 * Hide the last image on hover
*/
.img-borderv4:hover > img:last-of-type {
  opacity: 0;
}

.paginator {
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  -webkit-align-items: center;
}

p.text-paginator {
  margin-bottom: 0px;
  padding: 10px;
}

button.prevew {
  border: none;
  color: #2392da;
}

.row.share {
  text-align: right;
  justify-content: end;
}

.img-borderv4:hover {
  background: #E9EDF8 !important;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

.share button {
  border: none;
  border-right: 1px solid #d0d4d2;
  color: #6b6969;
}

@media screen and (max-width: 600px) {
  .row.share {
    display: none;
  }
}


</style>

