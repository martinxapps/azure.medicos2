// import {mande} from 'mande';
//
// const baseURLV1 = 'https://api.hospitalmetropolitano.org/t/v1';
// const baseURLV2 = 'https://api.hospitalmetropolitano.org/v2';
// export function misFacturasPendientes(filter) {
//     const patients = mande(`${baseURLV2}/medicos/mis-facturas-pendientes?typeFilter=${filter}`);
//     return patients.post({});
// }
// export function misFacturasPagadas(payload) {
//     let url = `${baseURLV2}/medicos/mis-facturas-pagadas?typeFilter=${payload.type}&start=${payload.start}&length=${payload.end}`;
//     if(payload.startDate && payload.type === 3){
//         url += `&fechaDesde=${payload.startDate}`;
//     }
//     if(payload.endDate && payload.type === 3){
//         url += `&fechaHasta=${payload.endDate}`;
//     }
//     console.log('url', url);
//     const patients = mande(url);
//     return patients.post(payload);
// }
// export function facturaPagada(data) {
//     const patients = mande(  `${baseURLV2}/medicos/honorarios/reportes?idReport=PP`);
//     return patients.post(data);
// }
// export function transaccion(data) {
//     const patients = mande(  `${baseURLV2}/medicos/honorarios/reportes?idReport=PPM`);
//     return patients.post(data);
// }
// export function estadoDeCuenta(data) {
//     const patients = mande(  `${baseURLV2}/medicos/honorarios/reportes?idReport=EC`);
//     return patients.post(data);
// }
//
// export function misTransacciones(filter, start, length, payload) {
//     const patients = mande(`${baseURLV2}/medicos/mis-transferencias?typeFilter=${filter}&start=${start}&length=${length}`);
//     return patients.post(payload);
// }
//
// export function misTransaccionesPorFecha(filter, start, length, dateStart, dateEnd, payload) {
//     const patients = mande(`${baseURLV2}/medicos/mis-transferencias?typeFilter=${filter}&start=${start}&length=${length}&fechaDesde=${dateStart}&fechaHasta=${dateEnd}`);
//     return patients.post(payload);
// }
//
// export function misHonorariosAuditados(payload) {
//     console.log('pauload', payload);
//     let url = `${baseURLV2}/medicos/honorarios/auditados?typeFilter=${payload.typeFilter}&start=${payload.start}&length=${payload.length}`;
//     console.log('url', url);
//     if(payload.startDate){
//         url += `&fechaDesde=${payload.startDate}`
//     }
//     if(payload.endDate){
//         url += `&fechaHasta=${payload.endDate}`
//     }
//     if(payload.searchField){
//         url += `&searchField=${payload.searchField}`
//     }
//     if(payload.searchFilter){
//         url += `&searchFilter=${payload.searchFilter}`
//     }
//     const patients = mande(url);
//     return patients.post(payload);
// }
//
//
//
// export function misHonorariosAuditadosDetalle(payload) {
//     const patients = mande(`${baseURLV2}/medicos/honorarios/detalle-auditados`);
//     return patients.post(payload);
// }
//
// export function misHonorariosAuditadosAtencion(payload) {
//     const patients = mande(`${baseURLV2}/medicos/honorarios/detalle-atencion`);
//     return patients.post(payload);
// }


import { mande } from 'mande';

const baseURLV1 = 'https://hospitalmetropolitano.org/api/v1';

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : '';
}

export function misFacturasPendientes(filter) {
  const patients = mande(`${baseURLV1}/medicos/mis-facturas-pendientes${buildQuery({
    typeFilter: filter,
  })}`);

  return patients.post({});
}

export function misFacturasPagadas(payload) {
  const query = {
    typeFilter: payload.type,
    start: payload.start,
    length: payload.end,
  };

  if (payload.startDate && Number(payload.type) === 3) {
    query.fechaDesde = payload.startDate;
  }

  if (payload.endDate && Number(payload.type) === 3) {
    query.fechaHasta = payload.endDate;
  }

  const patients = mande(`${baseURLV1}/medicos/mis-facturas-pagadas${buildQuery(query)}`);

  return patients.post(payload);
}

export function facturaPagada(data) {
  const patients = mande(`${baseURLV1}/medicos/honorarios/reportes${buildQuery({
    idReport: 'PP',
  })}`);

  return patients.post(data);
}

export function transaccion(data) {
  const patients = mande(`${baseURLV1}/medicos/honorarios/reportes${buildQuery({
    idReport: 'PPM',
  })}`);

  return patients.post(data);
}

export function estadoDeCuenta(data) {
  const patients = mande(`${baseURLV1}/medicos/honorarios/reportes${buildQuery({
    idReport: 'EC',
  })}`);

  return patients.post(data);
}

export function misTransacciones(filter, start, length, payload) {
  const patients = mande(`${baseURLV1}/medicos/mis-transferencias${buildQuery({
    typeFilter: filter,
    start,
    length,
  })}`);

  return patients.post(payload);
}

export function misTransaccionesPorFecha(filter, start, length, dateStart, dateEnd, payload) {
  const patients = mande(`${baseURLV1}/medicos/mis-transferencias${buildQuery({
    typeFilter: filter,
    start,
    length,
    fechaDesde: dateStart,
    fechaHasta: dateEnd,
  })}`);

  return patients.post(payload);
}

export function misHonorariosAuditados(payload) {
  const patients = mande(`${baseURLV1}/medicos/honorarios/auditados${buildQuery({
    typeFilter: payload.typeFilter,
    start: payload.start,
    length: payload.length,
    fechaDesde: payload.startDate,
    fechaHasta: payload.endDate,
    searchField: payload.searchField,
    searchFilter: payload.searchFilter,
  })}`);

  return patients.post(payload);
}

export function misHonorariosAuditadosDetalle(payload) {
  const patients = mande(`${baseURLV1}/medicos/honorarios/detalle-auditados`);

  return patients.post(payload);
}

export function misHonorariosAuditadosAtencion(payload) {
  const patients = mande(`${baseURLV1}/medicos/honorarios/detalle-atencion`);

  return patients.post(payload);
}
