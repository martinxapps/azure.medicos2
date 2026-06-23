//
// import { mande, defaults } from 'mande';
// const baseURL = 'https://api.hospitalmetropolitano.org/v2/medicos/bdm';
// const baseURL2 = 'https://api.hospitalmetropolitano.org/v2/medicos';
//
// export function getFolders(data) {
//     const patients = mande( `${baseURL}/list`);
//     return patients.post(data);
// }
// export function checkFolder(data) {
//     const patients = mande( `${baseURL}/folder`);
//     return patients.post(data);
// }
// export function checkMedic() {
//     const patients = mande( `${baseURL2}/check-point`);
//     return patients.post({});
// }
// export function deleteFile(url) {
//     const patients = mande( `${url}`);
//     return patients.post({});
// }
// export function createFolder(data) {
//     const patients = mande( `${baseURL}/addfolder`);
//     return patients.post(data);
// }
// export function uploadFile(data) {
//     const patients = mande( `${baseURL}/upload`);
//     return patients.post(data);
// }

import { mande } from 'mande';

const baseURLV1 = 'https://hospitalmetropolitano.org/api/v1';

export function getFolders(data) {
  const patients = mande(`${baseURLV1}/medicos/bdm/list`);
  return patients.post(data);
}

export function checkFolder(data) {
  const patients = mande(`${baseURLV1}/medicos/bdm/folder`);
  return patients.post(data);
}

export function checkMedic() {
  const patients = mande(`${baseURLV1}/medicos/check-point`);
  return patients.post({});
}

export function deleteFile(query) {
  const patients = mande(`${baseURLV1}/medicos/bdm/delete${query}`);
  return patients.post({});
}
export function downloadFile(query) {
  const patients = mande(`${baseURLV1}/medicos/bdm/download${query}`);
  return patients.get();
}


export function createFolder(data) {
  const patients = mande(`${baseURLV1}/medicos/bdm/addfolder`);
  return patients.post(data);
}

export function uploadFile(data) {
  const patients = mande(`${baseURLV1}/medicos/bdm/upload`);
  return patients.post(data);
}