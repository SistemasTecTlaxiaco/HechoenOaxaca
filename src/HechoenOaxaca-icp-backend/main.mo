import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Random "mo:base/Random";

// Actor principal para gestionar productos
actor HechoenOaxacaBackend {

    // Definición del tipo Producto
    type Producto = {
        id: Principal;
        nombre: Text;
        precio: Float;
        descripcion: Text;
        artesano: Text;
        tipo: Text;
        imagenes: [Blob];  // Ahora es un array de imágenes (máximo 3)
    };

    // Definición del tipo AplicationError
    type AplicationError = {
        #ProductoNoExiste: Text;
        #ImagenLimiteExcedido: Text;
    };

    // Tabla de productos usando HashMap
    var productos_table: HashMap.HashMap<Principal, Producto> = 
        HashMap.HashMap<Principal, Producto>(10, Principal.equal, Principal.hash);

    // Función para generar un ID aleatorio
    private func generateId(): async Principal {
        let randomBlob = await Random.blob();
        let randomBytes = Array.subArray(Blob.toArray(randomBlob), 0, 29);
        return Principal.fromBlob(Blob.fromArray(randomBytes));
    };

    // Crear un producto con o sin imágenes
    public shared({caller = _ }) func createProducto(
        nombre: Text,
        precio: Float,
        descripcion: Text,
        artesano: Text,
        tipo: Text,
        imagenes: [Blob]  // Se permite crear un producto con imágenes
    ): async Producto {
        let id = await generateId();
        let producto: Producto = {
            id = id;
            nombre = nombre;
            precio = precio;
            descripcion = descripcion;
            artesano = artesano;
            tipo = tipo;
            imagenes = imagenes;  // Guardar las imágenes
        };
        productos_table.put(id, producto);
        return producto;
    };

    // Leer todos los productos
    public query func readProductos(): async [Producto] {
        return Iter.toArray(productos_table.vals());
    };

    // Leer un producto por ID
    public query func readProductoById(id: Principal): async ?Producto {
        return productos_table.get(id);
    };

    // Eliminar un producto por ID
    public shared({caller = _ }) func deleteProducto(
        id: Principal
    ): async Result.Result<Producto, AplicationError> {
        switch (productos_table.remove(id)) {
            case (?producto) { return #ok(producto); };
            case null { return #err(#ProductoNoExiste(Principal.toText(id))); };
        }
    };

    // Actualizar un producto existente
    public shared({caller = _ }) func updateProducto(
        id: Principal,
        nombre: Text,
        precio: Float,
        descripcion: Text,
        artesano: Text,
        tipo: Text,
        imagenes: [Blob]
    ): async Result.Result<Producto, AplicationError> {
        switch (productos_table.get(id)) {
            case (?productoExistente) {
                let updatedProducto: Producto = {
                    id = id;
                    nombre = nombre;
                    precio = precio;
                    descripcion = descripcion;
                    artesano = artesano;
                    tipo = tipo;
                    imagenes = imagenes;   // Mantener las imágenes actuales
                };
                productos_table.put(id, updatedProducto);
                return #ok(updatedProducto);
            };
            case null { return #err(#ProductoNoExiste(Principal.toText(id))); };
        }
    };
    

      // Saludo simple para probar NFID
  public shared query({caller}) func greet(name: Text): async Text {
    return "Hola, " # name # "! Tu PrincipalId es: " # Principal.toText(caller);
  };


  
    // Subir imágenes a un producto
    public shared({caller = _}) func uploadImagen(
        id: Principal,
        nuevasImagenes: [Blob]  // Se permite subir múltiples imágenes
    ): async Result.Result<Producto, AplicationError> {
        switch (productos_table.get(id)) {
            case (?productoExistente) {
                let imagenesActuales = productoExistente.imagenes;
                let totalImagenes = Array.append<Blob>(imagenesActuales, nuevasImagenes);

                if (totalImagenes.size() > 3) {
                    return #err(#ImagenLimiteExcedido("No se pueden agregar más de 3 imágenes."));
                };

                let updatedProducto: Producto = {
                    id = id;
                    nombre = productoExistente.nombre;
                    precio = productoExistente.precio;
                    descripcion = productoExistente.descripcion;
                    artesano = productoExistente.artesano;
                    tipo = productoExistente.tipo;
                    imagenes = totalImagenes;  // Actualizar con las nuevas imágenes
                };
                productos_table.put(id, updatedProducto);
                return #ok(updatedProducto);
            };
            case null { return #err(#ProductoNoExiste(Principal.toText(id))); };
        }
    };
}