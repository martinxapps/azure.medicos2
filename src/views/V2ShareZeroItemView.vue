<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import IframeViewer from "../components/IframeViewer.vue";
import {screenview} from "vue-gtag";
import {urlZfpItem} from "../services/patient";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const props = defineProps(["id"]);
const exam_id = ref(props.id);
const title = ref("Zero FootPrint GE - Metrovirtual - Hospital Metropolitano");
const viewerUrl = ref(null)
const getUrl = async () => {
  isLoading.value = true;
  try {
    const response = await urlZfpItem({
      'id': exam_id.value
    })
    console.log('response', response)
    if (response.url) {
      viewerUrl.value = response.url;
    } else {
    }
    isLoading.value = false;

  } catch (e) {
    console.log('e', e)
    isLoading.value = false;

  }
}
onMounted(() => {
  getUrl();
  screenview(`Compartir ZerofootPrint Imagen ${exam_id.value}`);
});

const goBack = () => {
  window.close();
  // console.log("window.history.state.back", window.history.length);
  // console.log("window.history.state", window.history);
  // if (route.query.prev === "detalle-paciente") {
  //   router.replace({ name: "detalle-paciente", params: { nhc: nhc.value } });
  // } else if (route.query.prev === "resultados") {
  //   router.replace({ name: "resultados-paciente-imagen-y-laboratorio-medicos", params: { nhc: nhc.value } });
  // }else{
  //   router.replace({ name: "dashboard" });
  // }
};

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="d-flex flex-column zeroview">
      <div class="d-flex justify-content-end header-zero">
        <!--columna de text-->
        <div class=" col-12 col-md-6 cursor-pointer" @click="goBack()">
          <div class="d-flex justify-content-end py-2">
            <h5 class=" text-white mx-4" style=" font-size: 16px;">
              Cerrar
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </h5>
          </div>
        </div>
      </div>
      <div class="justify-content-center px-2 flex-grow-1" style="background-color: #f8f9fc; margin-top: 5vh;">
        <template v-if="isLoading">
          <div class="d-flex justify-content-center">
            <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
          </div>
        </template>
        <template v-else>
          <iframe-viewer :key="exam_id"
            :url="viewerUrl" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zeroview {
  height: 97vh;
}

.header-zero {
  background-color: #0d9cde;
  z-index: 99999999999;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
