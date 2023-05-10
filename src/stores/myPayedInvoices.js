import {defineStore} from 'pinia';
import {misFacturasPagadas, misFacturasPagadasPorFecha} from '@/services/fees';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyPayedInvoicesStore;
useMyPayedInvoicesStore = defineStore({
    id: 'MyPayedInvoices',
    getters: {},
    actions: {
        async searchPayedInvoices(filter, start, length, payload) {
            //get data from backend
            try {
                this.search_type = filter;
                const response = await misFacturasPagadas(filter, start, length, payload );
                console.log('response payedInvoices', response);
                if (response.status) {
                    this.payed_invoices = response.data;
                } else {
                    this.payed_invoices = [];
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
        async searchPayedInvoicesByDate(filter, start, length,  dateStart, dateEnd, payload) {
            //get data from backend
            try {
                this.search_type = filter;
                const response = await misFacturasPagadasPorFecha(filter, start, length, dateStart, dateEnd, payload);
                console.log('response payedInvoicesByDate', response);
                if (response.status) {
                    this.payed_invoices = response.data;
                } else {
                    this.payed_invoices = [];
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
        clearPayedInvoices() {
            //get data from backend
            try {
                this.payed_invoices = [];
                this.search_type = 4;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        payed_invoices: [],
        search_type: 4,
    }),
});
