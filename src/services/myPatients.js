
import { mande, defaults } from 'mande';
const baseURL = 'https://api.hospitalmetropolitano.org/v2/medicos';
const mainSearch = mande(baseURL);


export function getMyPatients(start, length) {
  const patients = mande(  baseURL);
  return patients.get(`mis-pacientes?start=${start}&length=${length}`);
}
export function searchMyPatients(start, length, search) {
    const patients = mande(  baseURL);
    return patients.get(`mis-pacientes?start=${start}&length=${length}&searchField=${search}`);
}

