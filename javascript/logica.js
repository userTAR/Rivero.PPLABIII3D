import {Anuncio_Auto} from "./clasesAuto.js";

// cuando la página recién carga
window.onload = function(){
    //eventos
    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener("click", EventGuardar);
    btnGuardar.addEventListener("click", EventRefrescarListado);

    document.getElementById("btnEliminar").addEventListener("click", EventEliminar);
    document.getElementById("btnCancelar").addEventListener("click", LimpiarForm);
    document.addEventListener("click", EventClickFilas);
    //inicio
    setTimeout(()=>document.getElementById("spinner").src = "../resources/spinner.gif",500);
    setTimeout(function(){
        const array = TraerListado();
        if(array.length != 0)
        {
            Crear_InsertarTablaDinamica(array, "divTabla");
            document.getElementById("spinner").src = "";
            
        }
        else
        {
            document.getElementById("spinner").src = "";
            document.getElementById("divTabla").innerHTML = "No hay elementos guardados";
        }
        
    },3000);
    document.getElementById("txtTitulo").focus();

};

//-------------------------------------------------------------------------------------------------

//eventos
function EventGuardar()
{
    if(AdministrarValidaciones())
        document.getElementById("formulario").preventDefault();
        else
        {
            const array = TraerListado();
            const nombre = document.getElementById("txtTitulo").value;

            array.forEach(element => {
                if(element.titulo == nombre)
                    EliminarJSONLocalStorage(element.titulo);
            });
            GuardarJSONLocalStorage();
            LimpiarForm();
        }
}

function EventEliminar()
{
    EliminarJSONLocalStorage(document.getElementById("txtId").value);
    console.log("JSON eliminado");
    EventRefrescarListado();
    LimpiarForm();
}

function EventClickFilas(e)
{
    if(!e.target.matches("td")) return; 
    RellenarForm(e.target.parentNode.firstChild.textContent);
    document.getElementById("btnEliminar").style.display = "inline-block";
    document.getElementById("btnCancelar").style.display = "inline-block";
    console.log("Se ha hecho click y se ha rellenado el formulario con los datos");
}

function EventRefrescarListado()
{
    const array = TraerListado();
    document.getElementById("divTabla").innerHTML = "";
    Crear_InsertarTablaDinamica(array,"divTabla");
    console.log("Listado Actualizado");
}


// funciones
function RellenarForm(match)
{
    const array = TraerListado();
    
    array.forEach(element => {
        if(element.id == match)
        {
            document.getElementById("txtId").value = element.id;
            document.getElementById("txtId").style.display = "inline";
            document.getElementById("txtTitulo").value = element.titulo;
            document.querySelector('input[name="cboVenta"]:checked').value = element.transaccion;
            document.getElementById("txtDescripcion").value = element.descripcion;
            document.getElementById("txtPrecio").value = element.precio;
            document.getElementById("txtPuertas").value = element.puertas;
            document.getElementById("txtKm").value = element.km;
            document.getElementById("txtPotencia").value = element.potencia;
        }
    });
}


function Crear_InsertarTablaDinamica(listado, DOMInsert)
{
    const tabla = document.createElement("table");
    tabla.setAttribute("id","tablaListado");
    //seccion thead
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    for(const key in listado[0])
    {
        const th = document.createElement("th");
        th.textContent = key;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    tabla.appendChild(thead);
    //seccion tbody
    const tbody = document.createElement("tbody");
    
    listado.forEach(element => {
        const trBody = document.createElement("tr");
        for(const key in element)
        {
            const td = document.createElement("td");
            td.textContent = element[key];
            trBody.appendChild(td);
        }
        tbody.appendChild(trBody);
        tabla.appendChild(tbody);
    });
    document.getElementById(DOMInsert).appendChild(tabla);
}

function TraerListado()
{
    let array = new Array();
    for(let i = 0; i < localStorage.length; i++)
    {
        array.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
    if(array.length == 0)
    return array;
    else
    return array;
}

function GuardarJSONLocalStorage()
{
    let id = CrearID();
    let titulo = document.getElementById("txtTitulo").value;
    let transaccion = document.querySelector('input[name="cboVenta"]:checked').value
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = document.getElementById("txtPrecio").value;
    let puertas = document.getElementById("txtPuertas").value;
    let km = document.getElementById("txtKm").value;
    let potencia = document.getElementById("txtPotencia").value;
    
    let Auto  = new Anuncio_Auto(id,titulo,transaccion,descripcion,precio,puertas,km,potencia);
    
    /* arrayJSON["Titulo"] = document.getElementById("txtTitulo").value;
    arrayJSON["Transaccion"] = document.querySelector('input[name="cboVenta"]:checked').value
    arrayJSON["Descripcion"] = document.getElementById("txtDescripcion").value;
    arrayJSON["Precio"] = document.getElementById("txtPrecio").value;
    arrayJSON["Puertas"] = document.getElementById("txtPuertas").value;
    arrayJSON["Km"] = document.getElementById("txtKm").value;
    arrayJSON["Potencia"] = document.getElementById("txtPotencia").value; */
    
    console.log(JSON.stringify(Auto));
    localStorage.setItem(Auto.id,JSON.stringify(Auto));
    console.log("JSONguardado");
}

function EliminarJSONLocalStorage(key)
{
    localStorage.removeItem(key);
}

function LimpiarForm()
{
    document.getElementById("formulario").reset();
    document.getElementById("txtTitulo").removeAttribute("readonly");
    document.getElementById("btnCancelar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";

}
function CrearID()
{
    let flag = true;
    let ref;
    let id;
    const array = TraerListado();
    if(array == 0)
        id = 0;
    else
    {
        array.forEach(element => {
            element.id
            if(flag == true || element.id>ref)
            {
                ref = element.id;
                flag = false;
            } 
                
        });
        id = ref + 1;
    }
    return id;
}
//---------------------------------------------------------------------------------------------------
//validaciones de formulario
function ValidarCamposVacios(id) {
    var retorno = false;
    if (document.getElementById(id).value == "")
        retorno = true;
    return retorno;
}

function AdministrarSpanError(id, accion) {
    if (accion) {
        document.getElementById(id).style.display = "inline-block";
    }
    else {
        document.getElementById(id).style.display = "none";
    }
}

function VerificarSpans(){
    var retorno = false;
    var titulo = document.getElementById("spanTitulo").style.display;
    var descripcion = document.getElementById("spanDescripcion").style.display;
    var precio = document.getElementById("spanPrecio").style.display;
    var Puertas = document.getElementById("spanPuertas").style.display;
    var Km = document.getElementById("spanKm").style.display;
    var Potencia = document.getElementById("spanPotencia").style.display;
    if (titulo != "none" || descripcion != "none" || precio != "none" || Puertas != "none" || Km != "none" || Potencia != "none") {
        retorno = true;
    }
    return retorno;
}

function AdministrarValidaciones() {
    if (ValidarCamposVacios("txtTitulo"))
        AdministrarSpanError("spanTitulo", true);
    else
        AdministrarSpanError("spanTitulo", false);
    if (ValidarCamposVacios("txtDescripcion"))
        AdministrarSpanError("spanDescripcion", true);
    else
        AdministrarSpanError("spanDescripcion", false);
    if (ValidarCamposVacios("txtPrecio"))
        AdministrarSpanError("spanPrecio", true);
    else
        AdministrarSpanError("spanPrecio", false);
    if (ValidarCamposVacios("txtPuertas"))
        AdministrarSpanError("spanPuertas", true);
    else
        AdministrarSpanError("spanPuertas", false);
    if (ValidarCamposVacios("txtKm"))
        AdministrarSpanError("spanKm", true);
    else
        AdministrarSpanError("spanKm", false);
    if (ValidarCamposVacios("txtPotencia"))
        AdministrarSpanError("spanPotencia", true);
    else
        AdministrarSpanError("spanPotencia", false);
    if (VerificarSpans())
        return true;
    else
        return false;
}
//----------------------------------------------------------------------------------------------------