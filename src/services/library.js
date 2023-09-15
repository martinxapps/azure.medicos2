
import { mande, defaults } from 'mande';
const baseURL = 'https://api.hospitalmetropolitano.org/t/v1/buscar-paciente';


export function getFolders(data) {
    const patients = mande( 'https://prod-89.westus.logic.azure.com:443/workflows/611ae6a995844f42acf74be852069645/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=rFK4mV--XUjwILaW6bNhhtC-XMxxBK_XNmgIEBjT9iE');
    return patients.post(data);
}
export function createFolder(data) {
    const patients = mande( 'https://prod-72.westus.logic.azure.com:443/workflows/46a2c355c06d4189a8ada7c6ceb9df4c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=uSC5edvRj7Z14K25A4j3SMdvHJsqH1x-SgjpQbj8RcU');
    return patients.post(data);
}
export function uploadFile(data) {
    const patients = mande( 'https://prod-141.westus.logic.azure.com:443/workflows/312d31bcbcb5429289a77e8e1267354a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=a16VWWAtRYMpzQNrhe0QaxGCZGMW9t_npYNWrSFHrw0');
    return patients.post(data);
}

