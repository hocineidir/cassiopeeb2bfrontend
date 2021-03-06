import React, { Component } from 'react';
import axios from "axios/index";
import {NavLink} from 'react-router-dom';
import NewPrestationType from "./new-prestation-type";




const mapStyle = {
    marginLeft: '30%',
    marginRight : '30%',
    width: '50%',
    height: '500px'
};


class PrestationsPartenaire extends Component {

    componentDidMount() {

        const rep = axios.get('http://localhost:8000/partenaire/'
            + this.state.partenaireId+'/prestations')
            .then(response => {
                console.log(response);
                this.setState({prestations: response.data.prestations });
            }).catch(error => {
                console.log(error);
            });

    }
    constructor(props) {
        super(props);
        this.state = {
            partenaireId : props.match.params.partenaireId,
            prestations : [],
        }
        console.log(this.state.partenaireId);
        this.stylePrestation = this.stylePrestation.bind(this);
        this.changer = this.changer.bind(this);
        //this.clients.forEach((client) => (console.log(client)));

    }

    changer = (prestation, action) => {
        axios.get('http://localhost:8000/client/'
            + prestation.evenement.client.id +
            /event/
            + prestation.evenement.id
            +'/liste/'+ prestation.id + '/' + action)
            .then(response => {
                console.log(response);
            }).catch(error => {
            console.log(error);
        });
        window.location.reload();
    };

    stylePrestation = (prestation) => {

        switch(prestation.etatPrestation.titre){
            case 'Acceptee': return {color: 'blue'};
            case 'Refusee' : return {color: 'red'};
            case 'Termine': return {color: 'green'};
            default: return null;
        }
    };
    delete = (prestation) => {
        // var clients = this.state.clients;
        // var index = clients.indexOf(client);
        // if (index !== -1) {
        //     clients.splice(index, 1);
        //     this.setState({clients});
        // }
        axios.delete('http://localhost:8000/prestation/'+prestation.id)
            .then(res => {
                this.setState(previousState => {
                    return {
                        prestations: previousState.prestations.filter(m => m.id !== prestation.id)
                    };
                });
            })
            .catch(err => {
                console.log(err);
            });
        //console.log(index);
    };


    render(){

        const table = [];
        const children = [];
        this.state.prestations.forEach(
            (prestation) => {
                children.push(
                    <tr style={this.stylePrestation(prestation)} >

                        <td> {prestation.evenement.titre} </td>
                        <td> {prestation.dateDebut.date.toString().slice(0, 16)}</td>
                        <td> {prestation.dateFin.date.toString().slice(0, 16)} </td>
                        <td> {prestation.typePrestation.nomType}</td>
                        <td> {prestation.etatPrestation.titre}</td>
                        <td>
                            {prestation.etatPrestation.titre == 'Termine'? <p></p>: <div> <button type="button" class="btn btn-danger" onClick={() => {
                                    if (window.confirm('Confirmer la suppression?')) this.delete(prestation)
                                }}>
                                    Supprimer
                                </button>

                                {prestation.etatPrestation.titre == 'Acceptee' ?
                                    <button type="button" class="btn btn-info" onClick={() => {
                                        if (window.confirm('Confirmer?')) this.changer(prestation, 'termine')
                                    }}>
                                        Marquer comme terminé
                                    </button> : <p></p>
                                }
                            </div>
                            }

                        </td>
                    </tr>
                );
            });

        table.push(
            <table className="table">
                <thead>
                <tr>
                    <th>Evenement</th>
                    <th>Date de début</th>
                    <th>Date de fin</th>
                    <th>Type de prestation </th>
                    <th>Etat de la prestation </th>
                    <th>Actions </th>
                </tr>
                </thead>

                <tbody>
                {children}
                </tbody>
            </table>
        );



        return (
            <div>
                <div class="card">
                    <div class="card-header"> <h1> Vos Prestations </h1></div>
                    <div class="card-body">
                        <h2> Les prestations que vous avez proposé</h2>
                        {table}
                    </div>
                    <div class="card-footer">
                    </div>
                </div>
            </div>
        )
    }

}

export default PrestationsPartenaire;

