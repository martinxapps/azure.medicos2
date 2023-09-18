import {defineStore} from 'pinia';
import {getMyPatients, searchMyPatients} from '@/services/myPatients';
import {useNotification} from '@kyvg/vue3-notification';
import {getFolders} from "../services/library";

const {notify} = useNotification();
// searchPage
export let useMyLibraryStore;
useMyLibraryStore = defineStore({
    id: 'myLibrary',
    getters: {},
    actions: {
        async getFolders(year, userName) {
            this.isLoading = true;
            for (let i = 0; i < this.folders.length; i++) {
                let data = {
                    path: `${year}/${userName}/${this.folders[i].name}`
                };
                console.log('data'+i, data);
                this.folders[i].isLoading = true;
                let response = await getFolders(data);
                console.log('response'+i, response);
                if (response.status) {
                    this.folders[i].data = response.data;
                    this.total +=  this.folders[i].data.length;
                } else {
                    // no se pudo
                    notify({
                        title: "Hubo un error",
                        text: `no se pudo cargar datos para ${year}/${userName}/${this.folders[i].name}`,
                        type: "error"
                    });
                }
                this.folders[i].isLoading = false;
            }
            this.isLoading = false;
        },
        clearFolders() {
            //get data from backend
            try {
                this.folders = [
                    {
                        name: 'BLS',
                        data: [],
                        isLoading:false,
                    },
                    {
                        name: 'CURSOS-CERTIFICADOS',
                        data: [],
                        isLoading:false,
                    },
                    {
                        name: 'POLIZA-RESPONZABILIDAD-CIVIL',
                        data: [],
                        isLoading:false,
                    },
                    {
                        name: 'PUBLICACIONES',
                        data: [],
                        isLoading:false,
                    },
                ];
                this.total = 0;
                this.activeTab = 0;
                this.isLoading = false;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        folders: [
            {
                name: 'BLS',
                data: [],
                isLoading:false,
            },
            {
                name: 'CURSOS-CERTIFICADOS',
                data: [],
                isLoading:false,
            },
            {
                name: 'POLIZA-RESPONZABILIDAD-CIVIL',
                data: [],
                isLoading:false,
            },
            {
                name: 'PUBLICACIONES',
                data: [],
                isLoading:false,
            },
        ],
        total: 0,
        activeTab: 0,
        isLoading: false,
    }),
});
