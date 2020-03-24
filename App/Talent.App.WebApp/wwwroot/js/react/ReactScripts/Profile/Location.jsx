/// <reference path="../form/singleinput.jsx" />
import React from 'react'
import Cookies from 'js-cookie'
import { default as countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
//import { countries } from '../Employer/common.js';

export class Address extends React.Component {
    constructor(props) {
        super(props)
        /*
        const AddressData = props.addressData ?
            Object.assign({}, props.addressData)
            : {
                Number: "",
                Street: "",
                Suburb:"",
                City: "",
                Country: "",
                PostCode:"",


            }
         */   
        this.state = {
            showEditSection: false,
            Address: {
                Number: "",
                Street: "",
                Suburb: "",
                City: "",
                Country: "",
                PostCode: "",
            },
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("submit ok")
        this.props.saveProfileData(this.state.Address);
        this.setState({
            showEditSection:false
        })
    }

    openEdit() {
        //const AddressData = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        });
        window.location.href = "http://localhost:61771/TalentProfile";
    }

    handleChange(event) {
        event.preventDefault();
        var data = Object.assign({}, this.state.Address);
        const { name, value } = event.target;
        data[name] = value;
        if (name == "Country") { data["City"] = "" };
        this.setState({ Address: data });      
        console.log(this.state.Address);


    }



    saveContact() {
        
        console.log(this.state.newAddress);
        const data = Object.assign({}, this.state.Address);
        let newData = { address: data };
        this.props.saveProfileData(newData);
        this.closeEdit();
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        let countriesOptions = [];
        const selectedCountry = this.state.Address.Country;

        countriesOptions = Object.keys(countries).map((x) => <option key={x} className={x} value={x}>{x}</option>);
        if (selectedCountry != "" && selectedCountry != null) {

            var popCities = countries[selectedCountry].map((x,index) => <option key={index} className={x} value={x}> {x}</option>);

        }


        return (
            <form class="ui form segment" onSubmit={this.handleSubmit} >
                <div className='ui sixteen wide column'>

                    <div className="ui form">
                        <div className="field">
                            <label>Number</label>
                            <input
                                type="text"
                                name="Number"
                                value={this.state.Address.Number}
                                placeholder={this.props.addressData.number}
                                onChange={this.handleChange}

                            >
                            </input>
                        </div>
                    </div>
                    <label>Number</label>

                    
                    <label>Street</label>
                    <input
                        type="text"
                        name="Street"
                        value={this.state.Address.Street}
                        placeholder={this.props.addressData.street}
                        onChange={this.handleChange}
                    >
                    </input>
                    <label>Suburb</label>
                    <input
                        type="text"
                        name="Suburb"
                        value={this.state.Address.Suburb}
                        placeholder={this.props.addressData.suburb}
                        onChange={this.handleChange}
                    >
                    </input>

                    <div className="ui form">
                        <div className="field">
                            <label>Country</label>
                                <select className="ui right labeled dropdown"
                                    placeholder={this.props.addressData.country}
                                    //value={selectedCountry}
                                    value={this.state.Address.Country}
                                    onChange={this.handleChange}
                                    name="Country">

                                <option placeholder="Select a Country">{this.props.addressData.country}</option>
                                    {countriesOptions}
                                </select>
                        </div>
                    </div>

                    <div className="ui form">
                        <div className="field">
                            <label>City</label>
                            <select className="ui right labeled dropdown"
                                placeholder={this.props.addressData.city}
                                //value={selectedCountry}
                                value={this.state.Address.City}
                                onChange={this.handleChange}
                                name="City">

                                <option placeholder="Select a City">{this.props.addressData.city}</option>
                                {popCities}
                            </select>
                        </div>
                    </div>

                    <label>PostCode</label>
                    <input
                        type="text"
                        name="PostCode"
                        value={this.state.Address.PostCode}
                        placeholder={this.props.addressData.postCode}
                        onChange={this.handleChange}
                    >
                    </input>

                    <button type="submit" className="ui teal button" onClick={this.saveContact}>Save</button>
                    <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                    </div>
            </form>
        )
    }

    renderDisplay() {

        let FullAddress = this.props.addressData ? `${this.props.addressData.number} ${this.props.addressData.street}${this.props.addressData.suburb}${this.props.addressData.postCode}` : ""
        let City = this.props.addressData ? this.props.addressData.city : ""
        let Country = this.props.addressData ? this.props.addressData.country : ""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {FullAddress}</p>
                        <p>City: {City}</p>
                        <p>Country: {Country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            nationality: {
                Nationality:"",
            },
          
        }

        this.handleChange = this.handleChange.bind(this);
        this.shipdata = this.shipdata.bind(this);
    }

   handleChange(event) {
        event.preventDefault();
        console.log("nationality is ok");
        let Newdata = Object.assign({}, this.state.nationality);
        const { name, value } = event.target;
        Newdata[name] = value;
        this.setState({
            nationality: Newdata,
        },this.shipdata);
    }

    shipdata() {
        console.log(this.state.nationality);
        const data = Object.assign({}, this.props.nationalityData);
        //let newpData = { nationality: data };
        data.nationality = this.state.nationality.Nationality;
        this.props.saveProfileData(data);
    }

   
    
    render() {

        //let countriesOptions = [];
        //const currentCountry = this.props.locatoin.Countries;

        //countriesOptions = Object.keys(countries).map(x => <option key={x} value={x}>{x}</option>);

        return(
            <div>
                <select className="ui right labeled dropdown"
                    //placeholder={this.props.nationalityData.nationality}
                    //value={this.props.nationalityData? this.props.nationalityData.nationality:this.state.nationality.Nationality }
                    value={this.state.nationality.Nationality}
                    onChange={this.handleChange}
                    name="Nationality">

                    <option value="">{this.props.nationalityData}</option>
                    <option value="Chinese">Chinese</option>
                    <option value="japanese">japanese</option>
                    <option value="American">American</option>
                    <option value="German">German</option>
                </select>
            </div>
        )
    }
}