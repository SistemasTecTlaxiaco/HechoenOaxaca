import {
    Canister,
    Err,
    Ok,
    Opt,
    Principal,
    query,
    Record,
    Result,
    StableBTreeMap,
    text,
    update,
    Variant,
    Vec
} from 'azle';

// Definición de la clase Producto
const Producto = Record({
    id: Principal,
    nombre: text,
    precio: text, // Puede ser number si prefieres manejarlo así
    descripcion: text
});
type Producto = typeof Producto.tsType;

// Definición de la clase Artesano
const Artesano = Record({
    id: Principal,
    nombre: text,
    alias: text,
    productos: Vec(Producto) // Relación con productos
});
type Artesano = typeof Artesano.tsType;

// Definición de la clase Pedido
const Pedido = Record({
    id: Principal,
    producto: Producto, // Relación con producto
    comprador: text,
    fecha: text
});
type Pedido = typeof Pedido.tsType;

// Mapa de almacenamiento para cada clase
let productos = StableBTreeMap<Principal, Producto>(0);
let artesanos = StableBTreeMap<Principal, Artesano>(1);
let pedidos = StableBTreeMap<Principal, Pedido>(2);

// Errores de la aplicación
const AplicationError = Variant({
    EntityDoesNotExist: text
});
type AplicationError = typeof AplicationError.tsType;

// Función para generar un ID único
function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

// Canister con las funciones para gestionar productos, artesanos y pedidos
export default Canister({
    // Crear un nuevo producto
    createProducto: update([text, text, text], Producto, (nombre, precio, descripcion) => {
        const id = generateId();
        const producto: Producto = {
            id: id,
            nombre: nombre,
            precio: precio,
            descripcion: descripcion
        };

        productos.insert(producto.id, producto);
        return producto;
    }),

    // Leer todos los productos
    readProductos: query([], Vec(Producto), () => {
        return productos.values();
    }),

    // Crear un nuevo artesano
    createArtesano: update([text, text], Artesano, (nombre, alias) => {
        const id = generateId();
        const artesano: Artesano = {
            id: id,
            nombre: nombre,
            alias: alias,
            productos: [] // Inicialmente sin productos
        };

        artesanos.insert(artesano.id, artesano);
        return artesano;
    }),

    // Leer todos los artesanos
    readArtesanos: query([], Vec(Artesano), () => {
        return artesanos.values();
    }),

    // Crear un nuevo pedido
    createPedido: update([Principal, text], Pedido, (productoId, comprador) => {
        const id = generateId();
        const productoOpt = productos.get(productoId);

        if ('None' in productoOpt) {
            return Err({
                EntityDoesNotExist: 'El producto no existe'
            });
        }

        const pedido: Pedido = {
            id: id,
            producto: productoOpt.Some,
            comprador: comprador,
            fecha: new Date().toISOString()
        };

        pedidos.insert(pedido.id, pedido);
        return Ok(pedido);
    }),

    // Leer todos los pedidos
    readPedidos: query([], Vec(Pedido), () => {
        return pedidos.values();
    }),

    // Leer pedidos por ID de artesano
    readPedidosByArtesano: query([Principal], Vec(Pedido), (artesanoId) => {
        const artesanoOpt = artesanos.get(artesanoId);
        if ('None' in artesanoOpt) {
            return [];
        }

        const artesano = artesanoOpt.Some;
        return pedidos.values().filter(pedido => pedido.producto.id === artesano.id);
    }),

    // Actualizar un producto
    updateProducto: update([text, text, text, text], Result(Producto, AplicationError), (productoId, nombre, precio, descripcion) => {
        const productoOpt = productos.get(Principal.fromText(productoId));

        if ('None' in productoOpt) {
            return Err({
                EntityDoesNotExist: 'El producto no existe'
            });
        }

        const productoActualizado: Producto = {
            id: Principal.fromText(productoId),
            nombre: nombre,
            precio: precio,
            descripcion: descripcion
        };

        productos.remove(Principal.fromText(productoId));
        productos.insert(Principal.fromText(productoId), productoActualizado);

        return Ok(productoActualizado);
    }),

    // Eliminar un producto
    deleteProducto: update([text], Result(Producto, AplicationError), (productoId) => {
        const productoOpt = productos.get(Principal.fromText(productoId));

        if ('None' in productoOpt) {
            return Err({
                EntityDoesNotExist: 'El producto no existe'
            });
        }

        const producto = productoOpt.Some;
        productos.remove(producto.id);
        return Ok(producto);
    })
});
