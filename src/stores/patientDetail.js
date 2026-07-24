import { defineStore } from 'pinia'
// searchPage
export let usePatientDetailStore
usePatientDetailStore = defineStore({
  id: 'PatientDetail',
  getters: {},
  actions: {
    clearPatient() {
      this.statusPaciente = null
      this.svPaciente = []
      this.evPaciente = []
      this.formsPaciente = []
      this.lab_results = []
      this.image_results = []
      this.cardiology_results = []
      this.pathology_results = []
      this.activeTabPaciente = 0
      this.seeImages = false
    }
  },
  state: () => ({
    statusPaciente: null,
    svPaciente: [],
    evPaciente: [],
    formsPaciente: [],
    lab_results: [],
    image_results: [],
    cardiology_results: [],
    pathology_results: [],
    activeTabPaciente: 0,
    seeImages: false
  })
})
