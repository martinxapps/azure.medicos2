<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {useMyPatientsStore} from "../stores/myPatients";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {event, screenview} from 'vue-gtag';
import {useMyLibraryStore} from "../stores/myLibrary";
import DropZone from "../components/DropZone.vue";
import {checkFolder, createFolder, uploadFile} from "../services/library";
import dayjs from "dayjs";
import {useNotification} from "@kyvg/vue3-notification";
const authStore = useAuthStore();
const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const myLibraryStore = useMyLibraryStore();
const folders = computed(() => myLibraryStore.folders);
const total_documents = computed(() => myLibraryStore.total);
const searchTerm = ref("");
let isLoading = ref(false);
const router = useRouter();
const selectedYear = ref(null);
const year = ref(null);
const folder = ref(null);
const date = ref(null);
const dirty = ref(false);
const fileInput = ref(null);
const years = ref([]);
const file = ref(null);
const {notify} = useNotification();


const goBack = async () => {
  await myLibraryStore.clearFolders();
  if (window.history.state.back === null) {
    await router.replace({name: "dashboard"});
  } else {
    router.back();
  }
};

const addFile = (newFile) => {
  console.log('newFile', newFile);
  file.value = new UploadableFile(newFile);


  console.log('files', file.value);
};

const dropFiles = (newFiles) => {
  addFile(newFiles[0]);
  console.log('files', file.value);
};


const onInputChange = (e) => {
  console.log('event, ', e);
  addFile(e.target.files[0]);
  e.target.value = null;
  // reset so that selecting the same file again will still cause it to fire this change
};
const openSelector = () => {
  fileInput.value.click();
}
const upload = async () => {
  try{
    dirty.value = true;
    if (year.value === null || folder.value === null || date.value === null) return;
    dirty.value = false;
    isLoading.value = true;
    //check if folder exist
    console.log('user', user.value);
    let userName = user.value.username.split('@')[0];
    let dataCheck = {
      path: `${year.value}/${userName}/${folder.value}`
    };
    const responseCheck = await checkFolder(dataCheck);
    console.log('responseCheck', responseCheck);
    if (responseCheck.status) {
      // si existe
      //upload
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64String = e.target.result.split(',')[1]; // Extract the Base64 string
        console.log(base64String);
        let dataUpload = {
          path: `${year.value}/${userName}/${folder.value}`,
          fileName: file.value.name,
          fileContent: base64String,
          user: userName,
          fileType: file.value.type,
          expireDate: date.value
        };
        console.log('data upload', dataUpload);
        const responseUpload = await uploadFile(dataUpload);
        console.log('responseUpload', responseUpload);
        if(responseUpload.status){
          console.log('se subio');
        }else{
          notify({
            title: "Hubo un error",
            text: 'no se pudo subir el archivo',
            type: "error"
          });
        }
      };

      reader.readAsDataURL(file.value.file);

    } else {
      // no existe
      // crea
      let dataCreate = {
        path: `${year.value}/${userName}/${folder.value}`
      };
      const responseCreate = await createFolder(dataCreate);
      console.log('responseCreate', responseCreate);
      if(responseCreate.status){
        //upload
        const reader = new FileReader();

        reader.onload = async (e) => {
          const base64String = e.target.result.split(',')[1]; // Extract the Base64 string
          console.log(base64String);
          let dataUpload = {
            path: `${year.value}/${userName}/${folder.value}`,
            fileName: file.value.name,
            fileContent: base64String,
            user: userName,
            fileType: file.value.type,
            expireDate: date.value
          };
          console.log('data upload', dataUpload);
          const responseUpload = await uploadFile(dataUpload);
          console.log('responseUpload', responseUpload);
          if(responseUpload.status){
            console.log('se subio');
          }else{
            notify({
              title: "Hubo un error",
              text: 'no se pudo subir el archivo',
              type: "error"
            });
          }
        };

        reader.readAsDataURL(file.value.file);
      }else{
        //hubo un error
        notify({
          title: "Hubo un error",
          text: 'no se pudo subir el archivo',
          type: "error"
        });
      }
    }
    isLoading.value = false;
  }catch (e) {
    console.log('error', e);
    isLoading.value = false;
  }
};

const getFolders = () => {
  let userName = user.value.username.split('@')[0];
  myLibraryStore.getFolders(selectedYear.value, userName);
}

onMounted(async () => {
  screenview('Biblioteca de credenciales');
  // Obtén el año actual
  const actual = new Date().getFullYear();
  selectedYear.value = actual;
// Crea un array de años desde 2020 hasta el año actual
  for (let i = 2020; i <= actual; i++) {
    years.value.push(i);
  }
  getFolders();
});

class UploadableFile {
  constructor(file) {
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.file = file;
    this.name = file.name;
    this.size = file.size;
    this.lastModified = file.lastModified;
    this.type = file.type;
    this.url = URL.createObjectURL(file);

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
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <div class="row">
              <div class="col-9">
                <ul class="nav nav-tabs" id="ResultsTab" role="tablist">
                  <li class="nav-item tab-hm" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="lab-tab" data-toggle="tab"
                            :class="{'active': myLibraryStore.activeTab === 0}" @click="myLibraryStore.activeTab = 0"
                            data-target="#lab" type="button" role="tab" aria-controls="lab"
                            aria-selected="true">Mis Documentos <span class="bg-number">{{ total_documents }}</span>
                    </button>
                  </li>
                  <li class="nav-item tab-hm" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="image-tab" data-toggle="tab"
                            :class="{'active': myLibraryStore.activeTab === 1}" @click="myLibraryStore.activeTab = 1"
                            data-target="#image" type="button" role="tab" aria-controls="image"
                            aria-selected="false">
                      Cargar Documentos
                    </button>
                  </li>

                </ul>
              </div>

              <div class="col-3 d-flex justify-content-end">
                <select class="p-2 my-2" v-model="selectedYear" @change="getFolders">
                  <option :value="null">Seleccionar año</option>
                  <option v-for="(year, yearKey) in years"
                          :key="yearKey" :value="year">
                    {{ year }}
                  </option>
                </select>
                <h5 class="cursor-pointer p-3" style=" color: #0f4470; font-size: 16px;" @click="getFolders()">
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
                        <template v-if="folders.length > 0">
                          <div class="accordion accordion-flush" id="accordionFlush">
                            <template
                                v-for="(file, documentKey) in folders"
                                :key="documentKey">
                              <div class="accordion-item p-3">
                                <h2 class="accordion-header" :id="'flush-heading'+documentKey">
                                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                          :data-bs-target="'#flush-collapseOne'+documentKey" aria-expanded="false"
                                          :aria-controls="'#flush-collapseOne'+documentKey">
                                    {{ file.name }}
                                  </button>
                                </h2>
                                <div :id="'flush-collapseOne'+documentKey" class="accordion-collapse collapse"
                                     :aria-labelledby="'flush-heading'+documentKey" data-bs-parent="#accordionFlush">
                                  <div class="accordion-body">
                                    <template v-if="file.isLoading">
                                      <div class="d-flex justify-content-center">
                                        <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                                      </div>
                                    </template>
                                    <template v-else>
                                      <template v-if="file.data.length>0">
                                        <div v-for="(archive, archiveKey) in file.data"
                                             :key="archiveKey" >
                                          <a target="_blank" :href="archive.Uri" class="row" style="color: #818181 !important">
                                            <h6 class="col-8">{{ archive.Name }}</h6>
                                            <h6 class="col-2">{{ archive.Size }} kb</h6>
                                            <h6 class="col-2">{{ dayjs(archive.TimeCreated).format('DD/MM/YYYY')  }}</h6>
                                          </a>

                                        </div>
                                      </template>
                                      <template v-else>
                                        <p>No tienes archivos en {{file.name}}</p>
                                      </template>
                                    </template>

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
                            <select class="form-control p-3 my-2" v-model="year">
                              <option :value="null">Seleccionar año</option>
                              <option v-for="(year, yearKey) in years"
                                      :key="yearKey" :value="year">
                                {{ year }}
                              </option>
                            </select>
                            <p v-if="year === null && dirty" class="mx-1 error-text">El año es requerido</p>
                          </div>
                          <div class="col-12 col-md-4 p-2">
                            <label class="my-2 title-text">Carpeta</label>
                            <select class="form-control p-3 my-2" v-model="folder">
                              <option :value="null">Seleccionar carpeta</option>
                              <option v-for="(folder, folderKey) in folders"
                                      :key="folderKey" :value="folder.name">
                                {{ folder.name }}
                              </option>
                            </select>
                            <p v-if="folder === null && dirty" class="mx-1 error-text">La carpeta es requerida</p>
                          </div>
                          <div class="col-12 col-md-4 p-2">
                            <label class="my-2 title-text">Fecha de Caducidad</label>
                            <input class="form-control p-3 my-2 " type="date" v-model="date">
                            <p v-if="date === null && dirty" class="mx-1 error-text">La fecha de caducidad es
                              requerida</p>
                          </div>
                        </div>
                        <div class=" my-3 py-3  text-center">
                          <template v-if="file">
                            <div class="d-flex">
                              <p class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;"
                                 @click="file = null;">
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                                Volver a seleccionar
                              </p>
                            </div>
                            <div class="files row justify-content-center">
                              <div class="col-12 col-md-6">
                                <div class="p-2 mx-2">
                                  <img src="@/assets/biblioteca.png" alt=" icon" style="width: 50%">
                                </div>
                                <input class="form-control p-3" type="text" v-model="file.name">
                                <div class="d-flex justify-content-center">
                                  <button class="py-2 px-4 mx-2 my-2 upload-button" @click="upload">Subir</button>
                                </div>
                              </div>

                            </div>
                          </template>
                          <template v-else>
                            <DropZone @files-dropped="dropFiles">
                              <div class="rounded-lg m-2 bg-white dropzone">
                                <p class="text-md text-center mt-5">Arrastra, y suelta aquí tu archivo</p>
                              </div>
                              <!--eslint-disable-next-line-->
                              <input ref="fileInput" type="file" id="file-input"
                                     @change="onInputChange" class="d-none"/>
                            </DropZone>
                            <div class="d-flex">
                              <button class="py-2 px-4 mx-2 upload-button" @click="openSelector">Examinar</button>
                            </div>
                          </template>

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

.title-text {
  color: #05305d;
  text-align: left;
  font-weight: 600;
}

.accordion-button:not(.collapsed) {
  background-color: transparent;
}

.accordion-button:focus {
  border-color: transparent;
  box-shadow: transparent;
}

.hidden {
  display: none;
}

.dropzone {
  height: 120px;
  border-radius: 15px;
  border: 1px solid #ced4da;
}

.upload-button {
  border-radius: 10px;
  color: white;
  background-color: #0d2c65;
}

.error-text {
  color: red;
  font-size: 15px;
}
</style>
