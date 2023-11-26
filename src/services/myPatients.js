
import { mande, defaults } from 'mande';
const baseURL = 'https://api.hospitalmetropolitano.org/v2/medicos';
const mainSearch = mande(baseURL);


export function getMyPatients(start, length, isResident) {
  const patients = mande(  baseURL);
    let url;
  if(isResident){
      url = `mis-pacientes-residentes?start=${start}&length=${length}`
  }else{
      url = `mis-pacientes?start=${start}&length=${length}`;
  }

  return patients.get(url);
}
export function searchMyPatients(start, length, search, isResident) {
    const patients = mande(  baseURL);
    let url;
    if(isResident){
        url = `mis-pacientes-residentes?start=${start}&length=${length}&searchField=${search}`
    }else{
        url = `mis-pacientes?start=${start}&length=${length}&searchField=${search}`;
    }
    return patients.get(url);
}

