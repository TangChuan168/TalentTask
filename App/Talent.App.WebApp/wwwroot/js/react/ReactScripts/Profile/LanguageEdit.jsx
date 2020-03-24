import React, { Component } from 'react';


export default class LanguageEdit extends Component {
    constructor(props) {
        super(props)

        const LanguageData = this.props.match.params.result;
        const data = JSON.parse(LanguageData);
        this.state = {
            Id: data.id,
            UserId: data.UserId,
            Language: data.Language,
            LanguageLevel: data.LanguageLevel,
        }
        this.handleChanges = this.handleChanges.bind(this);
        this.ONSubmit = this.ONSubmit.bind(this);
    }
        handleChanges(event) {
            event.preventDefault();
            let CN = event.target.name === "Name" ? event.target.value : this.state.name;
            let CA = event.target.name === "Address" ? event.target.value : this.state.address;
            this.setState({
                name: CN,
                address: CA,
            });
        }

       async ONSubmit(Id) {

            const URL = 'https://localhost:44369/api/Customers/PutCustomer/' + Id;
            let Customers = JSON.stringify({
                CustomerId: this.state.customerId,
                Name: this.state.name,
                Address: this.state.address,
            });
            await fetch(URL, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: Customers })

            window.location.href = 'https://localhost:44369/CustomerAPP';
        }


    render() {
        return (
            <div>

            </div>
            )
    }

    
}