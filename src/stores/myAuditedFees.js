import {defineStore} from 'pinia';
import {misHonorariosAuditados, misHonorariosAuditadosPorFecha} from '@/services/fees';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyAuditedFeesStore;
useMyAuditedFeesStore = defineStore({
    id: 'MyAuditedFees',
    getters: {},
    actions: {
        async searchAuditedFees(filter, start, length, payload) {
            //get data from backend
            try {
                this.search_type = filter;
                const response = await misHonorariosAuditados(filter, start, length, payload );
                console.log('response transactions', response);
                if (response.status) {
                    this.audited_fees = response.data;
                } else {
                    this.audited_fees = [];
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }

            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        async searchAuditedFeesByDate(filter, start, length,  dateStart, dateEnd, payload) {
            //get data from backend
            try {
                this.search_type = filter;
                const response = await misHonorariosAuditadosPorFecha(filter, start, length, dateStart, dateEnd, payload);
                console.log('response transactions', response);
                if (response.status) {
                    this.audited_fees = response.data;
                } else {
                    this.audited_fees = [];
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }

            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        clearAuditedFees() {
            //get data from backend
            try {
                this.audited_fees = [];
                this.search_type = 4;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        audited_fees: [],
        search_type: 4,
    }),
});
