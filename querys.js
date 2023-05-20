const obtieneDatosRut= "SELECT p.rut  ,p.dv_rut  ,p.primer_nombre  ,p.ape_pat  ,p.ape_mat  ,date_format(p.fecha_nac,'%d/%m/%Y') 'Fecha Nac'  ,p.sexo  ,p.celular  ,p.direccion  ,p.correo  ,r.nombre 'Region'  ,c.nombre 'Ciudad'  ,co.nombre 'Comuna'  FROM   persona p  ,Regiones r  ,Ciudades c  ,Provincias pr  ,Comunas co  where   r.id = p.cod_region  and r.id = pr.id_region   and pr.id = c.id_provincia  and p.cod_provincia = pr.id  and p.cod_ciudad = c.id  and p.cod_comuna = co.id  and co.id_ciudad = c.id  and rut = ?";

// Exportar variables
module.exports = {
    obtieneDatosRut
  };