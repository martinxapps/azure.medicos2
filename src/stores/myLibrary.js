import {defineStore} from 'pinia';
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
            this.total = 0;
            for (let i = 0; i < this.folders.length; i++) {
                let data = {
                    path: `${year}/${userName}/${this.folders[i].name}`
                };
                console.log('data' + i, data);
                this.folders[i].isLoading = true;
                let response = await getFolders(data);
                console.log('response' + i, response);
                if (response.status) {
                    this.folders[i].data = response.data;
                    this.total += this.folders[i].data.length;
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
                        label: 'BLS',
                        data: [],
                        isLoading: true,
                    },
                    {
                        name: 'Cursos-Certificados',
                        label: 'Cursos/Certificados',
                        data: [],
                        isLoading: true,
                    },

                    {
                        name: 'Credenciales',
                        label: 'Credenciales',
                        data: [],
                        isLoading: true,
                    },
                    {
                        name: 'Poliza-Responsabilidad-Civil',
                        label: 'Póliza de Responsabilidad Civil',
                        data: [],
                        isLoading: true,
                    },
                    {
                        name: 'Publicaciones',
                        label: 'Publicaciones',
                        data: [],
                        isLoading: true,
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
                label: 'BLS',
                data: [],
                isLoading: true,
            },
            {
                name: 'Cursos-Certificados',
                label: 'Cursos/Certificados',
                data: [],
                isLoading: true,
            },

            {
                name: 'Credenciales',
                label: 'Credenciales',
                data: [],
                isLoading: true,
            },
            {
                name: 'Poliza-Responsabilidad-Civil',
                label: 'Póliza de Responsabilidad Civil',
                data: [],
                isLoading: true,
            },
            {
                name: 'Publicaciones',
                label: 'Publicaciones',
                data: [],
                isLoading: true,
            },
        ],
        total: 0,
        activeTab: 0,
        isLoading: false,
    }),
});
