const zmq = require('zeromq')
const MongoClient = require('mongodb').MongoClient;
var sock = '';
var inventario = '';
// var clienteDB = '';

function cliente(puerto){
    console.log('Conectando al servidor')
    sock = new zmq.Request()
    sock.connect('tcp://localhost:'+puerto)
}

function conectarBD(password){
    const uri = "mongodb+srv://admin:" + password + "@cluster0.mgzh4.mongodb.net/modulo_compras?retryWrites=true&w=majority";
    const clienteDB = new MongoClient(uri, { useNewUrlParser: true });
    clienteDB.connect(err => {
         inventario = clienteDB.db("modulo_compras").collection("inventario");
        // inventario.find({"codigo":"I0001"}).toArray(function(e, resultado){
        inventario.find({}).toArray(function(e, resultado){
            if(e) throw e
            console.log(resultado)
        })
    });    
    clienteDB.close()
}

async function main(){
    try{
        pedido = {
            "nombre": "Renzo Macalupu",
            "documento": "74742441",
            "codigo":["I0001","I0002","I0003"],
            "cantidad":["10","20","300000"],
            "precio": ["10", "20", "30"]
        }
        pedido = JSON.stringify(pedido)
        cliente('5555')
        // conectarBD('bbddproyectosisdib')
    
        sock.send(pedido)
        var respuesta = await sock.receive()
        respuesta = JSON.parse(respuesta)
        // console.log(respuesta)
    
        if(respuesta.posible) console.log('Respuesta: ' + respuesta.mensaje)
        else{
            console.log('El pedido no es posible')
            for(i = 0; i < respuesta.estado.length; i++){
                if(respuesta.estado[i] == "NO_HAY_STOCK") console.log(respuesta.mensaje[i])
            }
        }
    }catch(e){
        console.log('Error: ' + e)
    }    
}

main();