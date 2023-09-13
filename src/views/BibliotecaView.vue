<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {useMyPatientsStore} from "../stores/myPatients";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {event, screenview} from 'vue-gtag';
import {useMyLibraryStore} from "../stores/myLibrary";
import DropZone from "../components/DropZone.vue";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const myLibraryStore = useMyLibraryStore();
const documents = computed(() => myLibraryStore.documents);
const total_documents = computed(() => myLibraryStore.total_documents);
const searchTerm = ref("");
let isLoading = ref(false);
const router = useRouter();
const files = ref([]);


const goBack = async () => {
  await myLibraryStore.clearPatients();
  if (window.history.state.back === null) {
    await router.replace({name: "dashboard"});
  } else {
    router.back();
  }
};

const addFiles = (newFiles) => {
  const newUploadableFiles = [...newFiles]
      .map((file) => new UploadableFile(file)).filter((file) => !fileExists(file.id));
  files.value = files.value.concat(newUploadableFiles);
  console.log('files', files.value);
};

const fileExists = (otherId) => {
  return files.value.some(({ id }) => id === otherId);
};

const onInputChange = (e) => {
  console.log('event, ', e);
  addFiles(e.target.files);
  e.target.value = null;
  // reset so that selecting the same file again will still cause it to fire this change
};

onMounted(async () => {
  screenview('Biblioteca de credenciales');

});
class UploadableFile {
  constructor(file) {
    this.file = file;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
  }
}
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Biblioteca de Credenciales - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row my-1 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-2">
              <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                Regresar
              </h5>
            </div>
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div">
                  <img class="img-header-icon ml-3 mx-1" src="@/assets/biblioteca.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="
                            color: #05305d;
                            text-align:left;
                            font-weight: 600;">
                  Biblioteca de Credenciales
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <!--                <div class="row mt-3 mb-3">-->
        <!--                    <div class="d-flex justify-content-end">-->
        <!--                        <div class="img-div">-->
        <!--                            <img class="img-header-icon ml-3" src="@/assets/mis-pacientes.png" alt=" icon">-->
        <!--                        </div>-->
        <!--                        <br>-->
        <!--                        <h4 class="d-flex text-headerv2 mt-3"-->
        <!--                            style="-->
        <!--                            color: #05305d;-->
        <!--                            text-align:left;-->
        <!--                            font-weight: 600;">-->
        <!--                            Mis pacientes-->
        <!--                        </h4>-->
        <!--                    </div>-->
        <!--                </div>-->

        <!--        <div class="my-5">-->
        <!--          <div class="d-flex justify-content-center">-->
        <!--            <div class="col-9 col-md-7 col-lg-6 ">-->
        <!--              <input type="text" v-model="searchTerm"-->
        <!--                     class=" special form-control"-->
        <!--                     required-->
        <!--                     placeholder="Busca por apellidos y nombres"-->
        <!--                     @keyup.enter="search()"-->
        <!--                     @input="searchTerm = $event.target.value.toUpperCase()">-->
        <!--            </div>-->
        <!--            <div class="col-3 col-md-5 col-lg-2 ">-->
        <!--              <button class="text-center cursor-pointer pt-2 btn-loginv2"-->
        <!--                      @click="search()">-->
        <!--                Buscar-->
        <!--              </button>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <div class="row">
              <div class="col-10">
                <ul class="nav nav-tabs" id="ResultsTab" role="tablist">
                  <li class="nav-item tab-hm" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="lab-tab" data-toggle="tab"
                            :class="{'active': myLibraryStore.activeTab === 0}" @click="myLibraryStore.activeTab = 0"
                            data-target="#lab" type="button" role="tab" aria-controls="lab"
                            aria-selected="true">Mis documentos <span class="bg-number">{{ total_documents }}</span>
                    </button>
                  </li>
                  <li class="nav-item tab-hm" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="image-tab" data-toggle="tab"
                            :class="{'active': myLibraryStore.activeTab === 1}" @click="myLibraryStore.activeTab = 1"
                            data-target="#image" type="button" role="tab" aria-controls="image"
                            aria-selected="false">
                      Cargar documentos
                    </button>
                  </li>

                </ul>
              </div>
              <div class="col-2 d-flex justify-content-end">
                <h5 class="cursor-pointer p-3" style=" color: #0f4470; font-size: 16px;" @click="getDocuments()">
                  <font-awesome-icon :icon="['fas', 'refresh']" class="mx-1"/>
                  <span class="m-0 d-none d-md-inline-block">Actualizar</span>
                </h5>
              </div>
            </div>

            <div class="tab-content" id="ResultsTabContent">
              <div class="tab-pane fade" id="lab" role="tabpanel"
                   :class="{'active': myLibraryStore.activeTab === 0, 'show': myLibraryStore.activeTab === 0}"
                   aria-labelledby="lab-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <template v-if="isLoading">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="documents.length > 0">
                          <div class="accordion accordion-flush" id="accordionFlush">
                            <template
                                v-for="(file, documentKey) in documents"
                                :key="documentKey">
                              <div class="accordion-item p-3">
                                <h2 class="accordion-header" :id="'flush-heading'+documentKey">
                                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapseOne'+documentKey" aria-expanded="false" :aria-controls="'#flush-collapseOne'+documentKey">
                                    {{file.name}}
                                  </button>
                                </h2>
                                <div :id="'flush-collapseOne'+documentKey" class="accordion-collapse collapse" :aria-labelledby="'flush-heading'+documentKey" data-bs-parent="#accordionFlush">
                                  <div class="accordion-body">
                                    contenido de {{file.name}}
                                    <div class="row">
                                      <div class="col-12 col-md-2" v-for="(archive, archiveKey) in file.data"
                                           :key="archiveKey">
                                        <div class="p-2 mx-2">
                                          <img src="@/assets/biblioteca.png" alt=" icon" style="width: 100%">
                                        </div>
                                        <h6 class="text-center">{{archive.name}}</h6>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </template>
                          </div>

                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              No tienes documentos
                            </h4>
                          </div>
                        </template>
                      </template>

                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="image" role="tabpanel"
                   :class="{'active': myLibraryStore.activeTab === 1, 'show': myLibraryStore.activeTab === 1}"
                   aria-labelledby="image-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <template v-if="isLoading">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <div class="row">
                          <div class="col-12 col-md-4 p-2">
                            <label class="my-2 title-text">Año</label>
                            <input class="form-control p-2 my-2" type="date">
                          </div>
                          <div class="col-12 col-md-4 p-2">
                            <label class="my-2 title-text">Carpeta</label>
                            <select class="form-control p-2 my-2">
                              <option :value="null">Seleccionar carpeta</option>
                              <option v-for="(file, documentKey) in documents"
                                      :key="documentKey" :value="file">
                                {{file.name}}
                              </option>
                            </select>
                          </div>
                          <div class="col-12 col-md-4 p-2">
                            <label class="my-2 title-text">Fecha de caducidad</label>
                            <input class="form-control p-2 my-2 " type="date">
                          </div>
                        </div>
                        <div class=" my-3 py-3  text-center">
                          <!--bottom actions chat-->
                          <DropZone @files-dropped="addFiles" >
                            <div class="rounded-lg m-2 bg-white dropzone">
                              <p class="text-md text-center">Arrastra, y suelta aquí tu archivo</p>
                            </div>
                            <!--eslint-disable-next-line-->
                            <input ref="fileInput" type="file" id="file-input"
                                   @change="onInputChange" class="d-none"/>
                          </DropZone>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterMedico/>
      </div>

    </div>
  </div>
</template>
<style scoped>
@media screen and (max-width: 600px) {
  .nav-tabs {
    overflow-x: auto;
    overflow-y: hidden;
    flex-wrap: nowrap !important;
  }

  .nav-tabs li {
    white-space: nowrap;
  }

  li.nav-item.tab-hm button {
    font-size: 16px;
  }

  .nav-tabs .nav-link.active {
    font-size: 16px;
  }
}
.title-text{
  color: #05305d;
  text-align: left;
  font-weight: 600;
}
.accordion-button:not(.collapsed){
  background-color: transparent;
}
.accordion-button:focus {
  border-color: transparent;
  box-shadow: transparent;
}
.hidden{
  display: none;
}
</style>
