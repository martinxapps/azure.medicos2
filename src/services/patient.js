import { mande } from 'mande';
const baseURLV1 = 'https://api.hospitalmetropolitano.org/t/v1';
const baseURLV2 = 'https://api.hospitalmetropolitano.org/v2';
const baseURL = 'https://hospitalmetropolitano.org/api/v1';

export function statusPacienteEmergencia(nhc) {
    const data = {
        numeroHistoriaClinica: nhc
    };
  const patients = mande(  `${baseURL}/emergencia/status-paciente`);
  return patients.post(data);
}

export function svPacienteEmergencia(nhc) {
    const data = {
        numeroHistoriaClinica: nhc
    };
  const patients = mande(`${baseURL}/emergencia/signos-vitales`);
  return patients.post(data);
}

export function evPacienteEmergencia(nhc) {
    const data = {
        numeroHistoriaClinica: nhc
    };
  const patients = mande(`${baseURL}/emergencia/evolucion`);
  return patients.post(data);
}

export function resultadosLaboratorioPaciente(nhc) {
  const patients = mande(`${baseURL}/pacientes/resultados-laboratorio`);
  return patients.get(`${nhc}`);
}

export function resultadosImagenPaciente(nhc) {
  const patients = mande(`${baseURL}/pacientes/resultados-img`);
  return patients.get(`${nhc}`);
}

export function formularioPaciente(nhc, adm) {
  const patients = mande(  `${baseURL}/medicos`);
  return patients.get(`formulario?nhcl=${nhc}&adm=${adm}`);
}

export function urlDocumento(url) {
  const patients = mande(  url);
  return patients.get('');
}

export function postDocumento(url) {
  const patients = mande(  url);
  return patients.post({});
}
export function urlCurva(data) {
  const patients = mande(  `${baseURLV2}/medicos/reportes`);
  return patients.post(data);
}

