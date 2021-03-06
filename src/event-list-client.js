import React, { Component } from 'react';
import axios from "axios/index";
import Cookies from "js-cookie";
import EventCreate from "./event-create";
import {NavLink} from "react-router-dom";


class EventListClient extends Component {


    constructor(props) {
        super(props);
        console.log(props.match.params.clientId);
        console.log(props);
        this.state = {
            evenements: [],
            clientId : props.match.params.clientId || -1,
            createNewEventBool: false,
        }
        if(this.state.clientId == Cookies.get('userId') || Cookies.get('userId') == 0)
            axios.get('http://localhost:8000/client/'+this.state.clientId+'/event')
                .then(response => {
                    this.setState({ evenements : response.data.evenements });
                    console.log(response);
                }).catch(error => {
                console.log(error);
            });
        //this.clients.forEach((client) => (console.log(client)));
        this.createNewEvent = this.createNewEvent.bind(this);
    }


    createNewEvent = () => {
        this.setState({createNewEventBool: !this.state.createNewEventBool  });
        console.log("here " + this.state.createNewEventBool);
    }



    showEventParams = evenement => {
        let params =  {
            eventId: evenement.id,
            clientId: evenement.client.id
        };
        console.log(params);
        return params;
    }


    delete = (evenement) => {
        // var clients = this.state.clients;
        // var index = clients.indexOf(client);
        // if (index !== -1) {
        //     clients.splice(index, 1);
        //     this.setState({clients});
        // }
        axios.delete('http://localhost:8000/client/'+evenement.id)
            .then(res => {
                this.setState(previousState => {
                    return {
                        evenements: previousState.evenements.filter(m => m.id !== evenement.id)
                    };
                });
            })
            .catch(err => {
                console.log(err);
            });
        //console.log(index);
    };



    render(){

        //console.log(this.state.evenements);
        const table = [];
        const children = [];


        if(this.state.clientId !== Cookies.get('userId') && Cookies.get('userId') != 0)
            return <h1> Vous n'avez pas l'accès </h1>;

        const boutonCreate = [];
        boutonCreate.push(<button className="btn btn-success" onClick={this.createNewEvent}>
            Créer un nouvel evenement
        </button>
        );

        const boutonCancel =[];

        boutonCancel.push(
            <div>
                <h2> Creation d'un nouvel evenement </h2>
            <button className="btn btn-danger" onClick={this.createNewEvent}>
            Annuler
        </button>
                <br/><br/>
            <EventCreate clientId={this.state.clientId}/>
            </div>
        );
        this.state.evenements.forEach(
            (evenement) => (children.push(<tr>
                <td> {evenement.id }</td>
                <td> { evenement.titre }</td>
                <td>{ evenement.date.date.toString().slice(0,16)}</td>
                <td> {evenement.type.nom }</td>
                <td>
                    <NavLink to={'/client/'+ evenement.client.id + '/event/' + evenement.id}
                             params={this.showEventParams(evenement)}
                             className="btn btn-info">Show</NavLink>
                    <button className='btn btn-danger' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.delete(evenement) } } >
                        Supprimer
                    </button>

                </td>
            </tr>)));

        table.push(
            <div>
                { this.state.createNewEventBool?  boutonCancel : boutonCreate }
                <table className="table">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Titre</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {children}
                    </tbody>
                </table>
            </div>
        );



        return (
            <div className="card">
                <div className="card-header">
                <h1> Evenement(s) du client {this.state.clientId} </h1>
                </div>
                <div className="card-body">
                {table}
                </div>
                <div className="card-footer"> Retour </div>
            </div>
        );
    }

}

export default EventListClient;