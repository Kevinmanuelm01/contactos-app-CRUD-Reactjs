import './estilo.css';
import axios from 'axios';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';  //faKitchenSet
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';





const url="http://localhost:3010/contactos/";

class myApp extends Component{
state={ //para almacenar la data
  mydata:[], modalInsertar:false,modalEliminar:false, myformulario:{ id:'', name:'', email:'', descripcion:''   }, tipoModal:'', 
  
  
}

//mostrar datos GET
peticionGet=()=>
{
  axios.get(url).then(response=>
    {
      this.setState({mydata: response.data});
    })
    .catch(error=>{ console.log(error.message);})
}



//************INSERTAR DATOS

//validar el estado del form modal
modalInsertar=()=>{
this.setState({modalInsertar: !this.state.modalInsertar});

}

//para capturar los datos que el usuario va digitando
handleChange= async  enterdata=>{
  enterdata.persist();
  await this.setState({
    myformulario:{
      ...this.state.myformulario, [enterdata.target.name]: enterdata.target.value
    }

  })
  console.log(this.state.myformulario);

}

///INSERTAR POST


peticionPost=async()=>{
  delete this.state.myformulario.id;
 await axios.post(url,this.state.myformulario).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}


//update data PUT
peticionPut=()=>{

  axios.put(url+this.state.myformulario.id, this.state.myformulario).then(response=>{ this.modalInsertar(); this.peticionGet();})
}

//seleccionar los datos a traves del ID

seleccionarContacto=(contactos)=>{ 
  this.setState({ 
    tipoModal:'actualizar',
    myformulario:{id: contactos.id,
                  name: contactos.name,
                  email: contactos.email, 
                  descripcion: contactos.descripcion            
                 }
                 })
                }



componentDidMount()
{
  this.peticionGet();
}


peticionDelete=()=>{
  axios.delete(url+this.state.myformulario.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

desc(){
  this.setState(this.state.myformulario.sort(function(b,a){ return b-a}))
}



render(){
  const {myformulario}=this.state; 
return( 
  <div className="contenedor">
    <br></br>
    <button className="btn btn-success"  onClick={()=> { this.setState({myformulario:null, tipoModal:'insertar'});    this.modalInsertar()}}>Add Contacts</button>
    <br></br>

    <table className="table">
    <thead>
      <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Email</th>
      <th>Descripcion</th>
      <th>Acciones</th>
      </tr>
    </thead>
    <tbody>

      {  this.state.mydata.map(contactos=>{
             return(
              <tr>
              <td>{contactos.id}</td>
              <td>{contactos.name}</td>
              <td>{contactos.email}</td>
              <td>{contactos.descripcion}</td>
              <td>  
             
        
              <button className="btn btn-primary"  onClick={()=>{this.seleccionarContacto(contactos); this.modalInsertar()}}  ><FontAwesomeIcon icon={faEdit}/></button> 
                {"   "}
                <button className="btn btn-danger"   onClick={()=>{this.seleccionarContacto(contactos); this.setState({modalEliminar:true})  }}   ><FontAwesomeIcon icon={faTrashAlt}/></button>

              </td>
              </tr>
             ) 


      })   }
    </tbody>
    </table>

   



    <Modal isOpen={this.state.modalInsertar}  /*pasamos el estado del modal*/> 
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  
                
                 <h5 class="modal-title">Datos Users</h5>
                  <div className="form-group">
                    <label htmlFor="id">Id User</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange}  value={myformulario?myformulario.id: this.state.mydata.length+1}    /*value={form?form.id: this.state.data.length+1}*//>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange}    value={myformulario?myformulario.name: ''} /*value={form?form.nombre: ''}*//>
                    <br />
                    <label htmlFor="nombre">Email</label>
                    <input className="form-control" type="text" name="email" id="email" onChange={this.handleChange}     value={myformulario?myformulario.email: ''} /*value={form?form.pais: ''}*//>
                    <br />
                    <label htmlFor="descripcion">Descripcion</label>
                    <textarea rows="4" cols="50" className="form-control" type="text" name="descripcion" id="descripcion" onChange={this.handleChange}   value={myformulario?myformulario.descripcion: ''}/*value={form?form.capital_bursatil:''}*//>
                  </div>
                </ModalBody>

                
                <ModalFooter    /*botoenes del modal */    >
                 {this.state.tipoModal ==='insertar'?
                 <button className="btn btn-success" onClick={()=>this.peticionPost()}> Insertar  </button>: 
                 <button className="btn btn-primary"  onClick={()=>this.peticionPut()}   >  Actualizar</button>  } 
                 
                 <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>


                  </Modal>

                    
                 
          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
            Estás seguro que deseas eliminar este contactos? {myformulario && myformulario.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>

  </div>

)
}
}

export default myApp;
