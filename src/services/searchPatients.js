
import { mande, defaults } from 'mande';
const baseURL = 'https://hospitalmetropolitano.org/api/v1/medicos/buscar-paciente';
const baseURL2 = 'https://hospitalmetropolitano.org/api/v1/medicos/buscarpaciente';


export function searchPatients(data) {
    const patients = mande( baseURL);
    return patients.post(data);
}
export function newSearchPatients(data) {
    const patients = mande( baseURL2);
    return patients.post(data);
}

