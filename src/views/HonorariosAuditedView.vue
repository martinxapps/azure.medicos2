<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import ModalBox from "../components/ModalBox.vue";
import { useAuthStore } from "../stores/auth";
import { useMyAuditedFeesStore } from "../stores/myAuditedFees";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { misHonorariosAuditadosAtencion, misHonorariosAuditadosDetalle } from "../services/fees";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const myAuditedFeesStore = useMyAuditedFeesStore();
const audited_fees = computed(() => myAuditedFeesStore.audited_fees);
const search_type = computed(() => myAuditedFeesStore.search_type);
const searchTerm = ref("");
const startDate = ref(null);
const endDate = ref(null);
const searchType = ref(4);
const showDetailModal = ref(false);
const activeTab = ref(0);
const isLoadingDetail = ref(false);
const details = ref([]);
const successDetail = ref(false);
const isLoadingAttention = ref(false);
const attentions = ref([]);
const successAttention = ref(false);
const selectedItem = ref(null);
let isLoading = ref(false);
const router = useRouter();

const search = async () => {
  isLoading.value = true;
  let payload = {
    searchField: searchTerm.value
  };
  await myAuditedFeesStore.searchAuditedFeesByDate(3, 0, 1000, startDate.value, endDate.value, payload);
  isLoading.value = false;
};

const goBack = async () => {
  await myAuditedFeesStore.clearAuditedFees();
  await router.back();
};

const openDetailModal = async (item) => {
  console.log("item", item);
  showDetailModal.value = true;
  selectedItem.value = item;
  getDetail(item);
  getAttention(item);

};

const getDetail = async (item) => {
  // get the detail
  isLoadingDetail.value = true;
  let payload = {
    hcl: item.HCL,
    adm: item.ADM,
    cargo: item.CARGO
  };
  console.log("payload", payload);

  let response = await misHonorariosAuditadosDetalle(payload);
  console.log("response", response);
  successDetail.value = response.status;
  details.value = response.data;
  isLoadingDetail.value = false;
}

const getAttention = async (item) => {
  // get the detail
  isLoadingAttention.value = true;
  let payload = {
    hcl: item.HCL,
    adm: item.ADM,
    cargo: item.CARGO
  };
  console.log("payload", payload);

  let response = await misHonorariosAuditadosAtencion(payload);
  console.log("response", response);
  successAttention.value = response.status;
  attentions.value = response.data;
  isLoadingAttention.value = false;
}

const closeModal = () => {
  showDetailModal.value = false;
  details.value = [];
  selectedItem.value = null;
  successDetail.value = false;
  attentions.value = [];
  successAttention.value = false;
  activeTab.value = 0;
};
const getWord = (key) => {
  switch (key) {
    case null:
      return 'Pendiente de Gestión HM';
    case 'N':
      return 'Pendiente de Gestión HM';
    case 'S':
      return 'Pendiente de Factura de Médico';
    case 'F':
      return 'Facturado por Médico';
  }
}
onMounted(async () => {
  searchType.value = search_type.value;
  isLoading.value = true;
  let payload = {
    searchField: searchTerm.value
  };
  await myAuditedFeesStore.searchAuditedFees(searchType.value, 0, 1000, payload);
  isLoading.value = false;
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Honorarios auditados - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row mb-2  mt-2 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-3">
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
                  <img class="img-header-icon ml-3" src="@/assets/audited.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-3"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Honorarios auditados
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalBox :showing="showDetailModal" @close="closeModal">
        <div class="p-4">
          <div class="d-flex justify-content-between ">
            <p class="title-results p-2 m-0">
              <b>Prefactura: {{ selectedItem?.PREFACTURA }} </b>
            </p>
            <div aria-label="close" class="p-2 cursor-pointer"
                 @click="closeModal">
              <font-awesome-icon :icon="['fas', 'close']" size="2x"
                                 class="icon-device" />
            </div>
          </div>
          <ul class="nav nav-tabs" id="invoiceTab" role="tablist">
            <li class="nav-item tab-hm" role="presentation">
              <button class="nav-link nav-hm px-3" id="detail-tab" data-toggle="tab"
                      :class="{'active': activeTab === 0}" @click="activeTab = 0"
                      data-target="#detail" type="button" role="tab" aria-controls="detail"
                      aria-selected="true">
                Detalle
              </button>
            </li>
            <li class="nav-item tab-hm" role="presentation">
              <button class="nav-link nav-hm px-3" id="attention-tab" data-toggle="tab"
                      :class="{'active': activeTab === 1}" @click="activeTab = 1"
                      data-target="#attention" type="button" role="tab" aria-controls="attention"
                      aria-selected="false">
                Atención
              </button>
            </li>

          </ul>
          <div class="tab-content" id="invoiceTabContent">
            <div class="tab-pane fade" id="detail" role="tabpanel"
                 :class="{'active': activeTab === 0, 'show': activeTab === 0}"
                 aria-labelledby="detail-tab">
              <template v-if="isLoadingDetail">
                <div class="my-1 p-3 text-center">
                  <img class="img-fluid" src="@/assets/loading.gif"
                       alt="Loading Hm">
                </div>
              </template>
              <template v-else>
                <div class="my-1">
                  <template v-if="successDetail">
                    <template v-if="details.length > 0">
                      <div class="table-responsive m-2">
                        <table class="table table-bordered table-striped table-hover">
                          <thead>
                          <tr>
                            <th scope="col">Cargo</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">CPT</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Valor Descuento</th>
                            <th scope="col">Porcentaje cálculo</th>
                            <th scope="col">Valor Honorario</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(detail, detailKey) in details" :key="detailKey">
                            <th scope="row">{{detail.CARGO}}</th>
                            <td>{{detail.FECHA}}</td>
                            <td>{{detail.CPT}}</td>
                            <td>{{detail.DESCRIPCION}}</td>
                            <td>{{detail.CANTIDAD}}</td>
                            <td>{{detail.VALOR_DESCUENTO}}</td>
                            <td>{{detail.PORCENTAJE_CALCULO}} %</td>
                            <td>$ {{detail.VALOR_HONORARIO}}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>

                    </template>
                    <template v-else>
                      <p class="text-results">No hay detalles</p>
                    </template>

                  </template>
                  <template v-else>
                    <p class="title-results">
                      <b>Detalle no disponible </b>
                    </p>
                  </template>
                </div>
              </template>
            </div>
            <div class="tab-pane fade" id="attention" role="tabpanel"
                 :class="{'active': activeTab === 1, 'show': activeTab === 1}"
                 aria-labelledby="attention-tab">
              <template v-if="isLoadingAttention">
                <div class="my-1 p-3 text-center">
                  <img class="img-fluid" src="@/assets/loading.gif"
                       alt="Loading Hm">
                </div>
              </template>
              <template v-else>
                <div class="my-1">
                  <template v-if="successAttention">
                    <template v-if="attentions.length > 0">
                      <div class="table-responsive m-2">
                        <table class="table table-bordered table-striped table-hover">
                          <thead>
                          <tr>
                            <th scope="col">Cargo</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">CPT</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Valor Descuento</th>
                            <th scope="col">Porcentaje cálculo</th>
                            <th scope="col">Valor Honorario</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(attention, attentionKey) in attentions" :key="attentionKey">
                            <th scope="row">{{attention.CARGO}}</th>
                            <td>{{attention.FECHA}}</td>
                            <td>{{attention.CPT}}</td>
                            <td>{{attention.DESCRIPCION}}</td>
                            <td>{{attention.CANTIDAD}}</td>
                            <td>{{attention.VALOR_DESCUENTO}}</td>
                            <td>{{attention.PORCENTAJE_CALCULO}} %</td>
                            <td>$ {{attention.VALOR_HONORARIO}}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>

                    </template>
                    <template v-else>
                      <p class="text-results">No hay atenciones</p>
                    </template>

                  </template>
                  <template v-else>
                    <p class="title-results">
                      <b>Detalle no disponible </b>
                    </p>
                  </template>
                </div>
              </template>
            </div>

          </div>

        </div>
      </ModalBox>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block" style="background: #f8f9fc;">
        <div class="row justify-content-center">
          <div class="my-2 col-12">
            <div class=" d-flex flex-column flex-md-row justify-content-center">
              <div class="col-12 col-md-9 mt-3">
                <div class="row">
                  <div class="col-12 col-md-6">
                    <label class="text-label mb-1" style="margin-top: -30px; display: block;">Desde:</label>
                    <input type="date" v-model="startDate" style="border-radius: 50px;"
                           class="special special-mobile form-control"
                           required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="text-label mb-1" style="margin-top: -30px; display: block;">Hasta:</label>
                    <input type="date" v-model="endDate"
                           class="special special-mobile form-control"
                           required>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-3 mt-3">
                <button class="text-center cursor-pointer pt-2 btn-loginv2 btn-loginv2mobile"
                        @click="search()">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <template v-if="isLoading">
              <div class="my-1 p-3 text-center">
                <img class="img-fluid" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="audited_fees.length > 0">
                <div class=" m-1 p-3 row text-left border-result hover-list-element cursor-pointer"
                     v-for="(auditedFee, auditedFeeKey) in audited_fees"
                     :key="auditedFeeKey" @click="openDetailModal(auditedFee)"
                     :title="`Ver detalles`"
                >
                  <div class="col-9 my-3">
                    <p class="title-results ">
                      <b>N° de Prefactura: {{ auditedFee?.PREFACTURA }}
                        <span class="p-2 mx-2 pill" :class="{'gray':auditedFee.AUDITADO === 'S', 'orange':auditedFee.AUDITADO === null || auditedFee.AUDITADO === 'N', 'green':auditedFee.AUDITADO === 'F'}">{{ getWord(auditedFee.AUDITADO) }}</span>
                      </b>
                    </p>
                    <p class="text-results"><b>Fecha de Admisión:</b> {{ auditedFee?.FECHA }}</p>
                    <p class="text-results"><b>NHC:</b> {{ auditedFee?.HCL }} <b>ADM:</b> {{ auditedFee?.ADM }}</p>
                    <p class="text-results"><b>Paciente:</b> {{ auditedFee?.NOMBRES }}</p>
                    <p class="text-results"><b>Plan:</b> {{ auditedFee?.DCTO }}</p>
                    <p class="text-results"><b>Valor:</b> $ {{ auditedFee?.VALOR }}</p>
                    <p class="text-results"><b>Origen de la Atención:</b> {{ auditedFee?.ORIGEN }}</p>
                  </div>
<!--                  <div class="col-3 d-flex justify-content-center">-->
<!--                    <div class="p-0 p-md-4 py-md-6">-->
<!--                      <font-awesome-icon :icon="['fas', 'eye']" size="2x"-->
<!--                                         class="icon-device" />-->
<!--                    </div>-->
<!--                  </div>-->
                </div>
              </template>
              <template v-else>
                <div class=" my-1 p-3  text-center">
                  <h4 class="center text-search">
                    No tienes honorarios auditados
                  </h4>
                </div>
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
.pill {
  border-radius: 15px;
  font-weight: 500;
  color: white;
}
.orange{
  background-color: #ff8201;
}
.gray{
  background-color: #a39b9b;
}
.green{
  background-color: #16c119;
}
</style>
