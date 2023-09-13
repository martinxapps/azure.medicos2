import {defineStore} from 'pinia';
import {getMyPatients, searchMyPatients} from '@/services/myPatients';
import {useNotification} from '@kyvg/vue3-notification';

const {notify} = useNotification();
// searchPage
export let useMyLibraryStore;
useMyLibraryStore = defineStore({
    id: 'myLibrary',
    getters: {},
    actions: {
        clearDocuments() {
            //get data from backend
            try {
                this.documents = [];
                this.total_documents = 0;
                this.activeTab = 0;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        documents: [
            {
                name: 'BLS',
                data: [{
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                },
                    {
                    name: 'doc 1'
                }
                ]
            },
            {
                name: 'Credenciales',
                data: [{
                    name: 'doc 1'
                }, {
                    name: 'doc 1'
                }]
            },
            {
                name: 'Poliza',
                data: [{
                    name: 'doc 1'
                }, {
                    name: 'doc 1'
                }]
            },
            {
                name: 'publicaciones',
                data: [{
                    name: 'doc 1'
                }, {
                    name: 'doc 1'
                }]
            },
        ],
        total_documents: 0,
        activeTab: 0,
    }),
});
