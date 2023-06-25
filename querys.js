//Persona
const obtieneDatosRut= "SELECT p.rut  ,p.dv_rut  ,p.primer_nombre  ,p.ape_pat  ,p.ape_mat  ,date_format(p.fecha_nac,'%d/%m/%Y') 'Fecha Nac'  ,p.sexo  ,p.celular  ,p.direccion  ,p.correo  ,r.region ,pr.provincia,co.comuna , rol.rol_descripcion 'Rol' FROM   persona p  ,regiones r  ,provincias pr  ,comunas co, roles rol where   p.REGION_ID = r.id and p.PROVINCIA_ID = pr.id and p.COMUNA_ID = co.id and r.id = pr.region_id and pr.id = co.provincia_id and p.ROL_ID = rol.rol_id and rut = ?";
const obtieneDatos= 'SELECT RUT, DV_RUT, PRIMER_NOMBRE,SEGUNDO_NOMBRE, APE_PAT, APE_MAT, FECHA_NAC, SEXO, CELULAR, DIRECCION, CORREO, REGION_ID, PROVINCIA_ID, COMUNA_ID, ROL_ID, FUNCIONARIO FROM PERSONA';
const actualizaDatosxRut = 'UPDATE persona SET primer_nombre = ?, ape_pat = ?, ape_mat = ?, celular = ?, direccion = ? CORREO = ?, REGION_ID = ?, PROVINCIA_ID = ?, COMUNA_ID = ?, ROL_ID = ?, FUNCIONARIO =? WHERE rut = ?';
const deleteDatos = "DELETE FROM persona WHERE rut = ?";
const insertDatos = 'INSERT INTO PERSONA (RUT, DV_RUT, PRIMER_NOMBRE,SEGUNDO_NOMBRE, APE_PAT, APE_MAT, FECHA_NAC, SEXO, CELULAR, DIRECCION, CORREO, REGION_ID, PROVINCIA_ID, COMUNA_ID, ROL_ID, FUNCIONARIO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
 

//Regiones
const obtieneRegion = "select id, region, abreviatura, capital from regiones";
const obtieneProvincia = "select id, provincia, region_id from provincias where region_id = ?";
const obtieneComuna = "select id, comuna, provincia_id from comunas where provincia_id = ?";

//login
const validaLogin = 'SELECT P.CORREO, U.CLAVE, P.ROL_ID, ROL.ROL_DESCRIPCION, ROL.ABREVIATURA FROM PERSONA P, USUARIOS U, roles rol WHERE P.RUT = U.RUT AND LOWER(P.CORREO) = LOWER(?) AND U.CLAVE = SHA2(?, 256) AND P.ROL_ID = ROL.ROL_ID';



//productos
//const obtieneProductosNombre = "SELECT distinct	P.ID,	P.CODIGO, C.CAT_DESC, P.NOMBRE_PRODUCTO, P.CODIGO_SERIE, P.MODELO, P.S_TOTAL, P.S_MAIPU, P.S_SANTIAGO, P.S_VITACURA, P.S_PROVIDENCIA,	P.PRECIO_COMPRA, P.PRECIO_VENTA, P.DESCRIPCION_PRODUCTO FROM PRODUCTOS P, CATEGORIAS C WHERE P.CATEGORIA = C.CAT_ID AND lower(P.NOMBRE_PRODUCTO) LIKE ?";

const obtieneProductosNombre = "SELECT DISTINCT P.ID , P.CODIGO, C.CAT_DESC, P.NOMBRE_PRODUCTO, P.CODIGO_SERIE, P.MODELO, P.S_TOTAL 'STOCK TOTAL', P.S_MAIPU 'STOCK MAIPU', P.S_SANTIAGO 'STOCK SANTIAGO', P.S_VITACURA 'STOCK VITACURA', P.S_PROVIDENCIA 'STOCK PROVIDENCIA', P.PRECIO_COMPRA, P.PRECIO_VENTA, P.DESCRIPCION_PRODUCTO FROM PRODUCTOS P, CATEGORIAS C WHERE P.CATEGORIA = C.CAT_ID AND LOWER(P.NOMBRE_PRODUCTO) LIKE ?";


// Exportar variables
module.exports = {
    obtieneDatosRut,
    obtieneRegion,
    obtieneProvincia,
    obtieneComuna,
    actualizaDatosxRut,
    deleteDatos,
    obtieneDatos,
    insertDatos,
    validaLogin,
    obtieneProductosNombre
  };