import Principal "mo:base/Principal";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Char "mo:base/Char";
import Debug "mo:base/Debug";

actor HechoenOaxacaBackend {
    // Definición del usuario
    type Usuario = {
        nombreCompleto: Text;
        lugarOrigen: Text;
        telefono: Text;
        rol: Rol;
    };

    // Definición de roles disponibles
    type Rol = {
        #Artesano;
        #Intermediario;
        #Cliente;
    };

    // Tipos de errores para operaciones
    type AplicationError = {
        #UsuarioNoExiste: Text;
        #UsuarioYaExiste: Text;
        #RolNoValido: Text;
        #SaldoInsuficiente: Text;
    };

    // Tablas hash para usuarios, roles y balances
    var usuarios_table: HashMap.HashMap<Principal, Usuario> =
        HashMap.HashMap<Principal, Usuario>(10, Principal.equal, Principal.hash);

    var roles_table: HashMap.HashMap<Principal, Rol> =
        HashMap.HashMap<Principal, Rol>(10, Principal.equal, Principal.hash);

    var balances: HashMap.HashMap<Principal, Nat> =
        HashMap.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);

    // Registrar Usuario
    public shared({caller}) func registrarUsuario(
        nombreCompleto: Text,
        lugarOrigen: Text,
        telefono: Text,
        rol: Text
    ): async Result.Result<Usuario, Text> {
        Debug.print("Inicio del registro de usuario");
        Debug.print("Nombre completo: " # nombreCompleto);
        Debug.print("Lugar de origen: " # lugarOrigen);
        Debug.print("Teléfono: " # telefono);
        Debug.print("Rol recibido: " # rol);
        Debug.print("Caller ID: " # Principal.toText(caller));

        let lowerRol = toLower(rol);

        // Validar el rol recibido
        let parsedRol = switch (lowerRol) {
            case "artesano" #Artesano;
            case "intermediario" #Intermediario;
            case "cliente" #Cliente;
            case _ {
                Debug.print("Rol no válido: " # lowerRol);
                return #err("El rol proporcionado no es válido: " # rol);
            }
        };

        // Verificar si el usuario ya existe
        if (usuarios_table.get(caller) != null) {
            return #err("El usuario ya está registrado con el ID: " # Principal.toText(caller));
        };

        // Crear y registrar el usuario
        let usuario: Usuario = {
            nombreCompleto = nombreCompleto;
            lugarOrigen = lugarOrigen;
            telefono = telefono;
            rol = parsedRol;
        };

        usuarios_table.put(caller, usuario);
        roles_table.put(caller, parsedRol);
        balances.put(caller, 0); // Inicializa el saldo en 0
        return #ok(usuario);
    };

    // Obtener el saldo de un usuario
    public query func getBalance(principal: Principal): async Nat {
        return switch (balances.get(principal)) {
            case (?b) b;
            case null 0;
        };
    };

    // Incrementar saldo
    public shared({caller =_}) func incrementarSaldo(
        principal: Principal,
        monto: Nat
    ): async Result.Result<Nat, Text> {
        if (monto <= 0) {
            return #err("El monto debe ser mayor a 0.");
        };
        let nuevoSaldo = switch (balances.get(principal)) {
            case (?b) b + monto;
            case null monto;
        };
        balances.put(principal, nuevoSaldo);
        return #ok(nuevoSaldo);
    };

    // Reducir saldo
    public shared({caller =_}) func reducirSaldo(
        principal: Principal,
        monto: Nat
    ): async Result.Result<Nat, AplicationError> {
        let saldoActual = switch (balances.get(principal)) {
            case (?b) b;
            case null 0;
        };
        if (monto > saldoActual) {
            return #err(#SaldoInsuficiente("El saldo no es suficiente para completar la operación."));
        };
        let nuevoSaldo = saldoActual - monto;
        balances.put(principal, nuevoSaldo);
        return #ok(nuevoSaldo);
    };

    // Transferir saldo entre usuarios
    public shared({caller}) func transferirSaldo(
        destino: Principal,
        monto: Nat
    ): async Result.Result<Text, AplicationError> {
        if (caller == destino) {
            return #err(#UsuarioNoExiste("No se puede transferir saldo a sí mismo."));
        };
        let resultadoReduccion = await reducirSaldo(caller, monto);
        switch (resultadoReduccion) {
            case (#err(e)) return #err(e);
            case (#ok(_)) {
                let resultadoIncremento = await incrementarSaldo(destino, monto);
                switch (resultadoIncremento) {
                    case (#err(e)) return #err(#UsuarioNoExiste(e));
                    case (#ok(_)) return #ok("Transferencia realizada con éxito.");
                };
            };
        };
    };

    // Obtener el rol del usuario
    public query func getUserRole(id: Text): async ?Text {
        let principal = Principal.fromText(id); // Convierte el texto a Principal
        let rol = roles_table.get(principal);
        return switch (rol) {
            case (?r) switch (r) {
                case (#Artesano) ?("artesano");
                case (#Intermediario) ?("intermediario");
                case (#Cliente) ?("cliente");
            };
            case null null;
        };
    };

    // Función auxiliar para convertir un texto a minúsculas
    private func toLower(text: Text): Text {
        let chars = Text.toIter(text);
        let lowerChars = Iter.map<Char, Char>(chars, func(c: Char): Char {
            if (c >= 'A' and c <= 'Z') {
                return Char.fromNat32(Char.toNat32(c) + 32);
            } else {
                return c;
            }
        });
        return Text.fromIter(lowerChars);
    };
};
