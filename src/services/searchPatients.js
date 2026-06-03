
import { mande, defaults } from 'mande';
const baseURL = 'https://hospitalmetropolitano.org/api/v1/medicos/buscar-paciente';


export function searchPatients(data) {
    const patients = mande( baseURL);
    return patients.post(data);
}

