import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)


        this.state = {

            visadata: {
                visatype: '',
                expiryDate: '',
            },
            visamode: "none",
        }
        
        this.Mode = this.Mode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
    }

    componentDidmount() {

        const data = this.props.visaStatus;
        if (data == "WorkVisa" || data == "StudentVisa") {
            setState({
                visamode:"block",
                visadata: {
                    visatype: this.props.visaStatus,
                    expiryDate: this.props.visaExpiryDate,

                }
            });
        } else {
            setState({
                visamode: "none",
                visadata: {
                    visatype: this.props.visaStatus,
                    expiryDate: this.props.visaExpiryDate,
                }
            });
        }


    }

    handleChange(event) {
        event.preventDefault();
        let data = Object.assign({}, this.state.visadata);
        const { name, value } = event.target;
        data[name] = value;
        if (value == "WorkVisa" || value == "StudentVisa") {
            this.setState({
                visadata: data,
                visamode:"block",
            });
            console.log(this.state.visadata);
        } else {
            this.setState({
                visadata: data,
                visamode: "none",
            });
            console.log(this.state.visadata);
        }                       
    }

    handleChange2(event) {
        event.preventDefault();
        let data2 = Object.assign({}, this.state.visadata);
        const { name, value } = event.target;
        data2[name] = value;
        this.setState({
            visadata:data2
        });
        console.log(this.state.visadata);
        }
  
    handleClick() {
        const data = Object.assign({}, this.props.profileData);
        data.visaStatus = this.state.visadata.visatype;
        data.visaExpiryDate = this.state.visadata.expiryDate;
        this.props.saveProfileData(data);
    }


    Mode() {
        let visatype = this.props.visaStatus;
        let expiryDate = this.props.visaExpiryDate;

        return (
            <div style={{ height: "180px" }}>
                <div>
                        Visa type
                        <select className="ui right labeled dropdown"
                            value={this.state.visatype}
                            onChange={this.handleChange}
                            name="visatype">

                            <option value="">{visatype}</option>
                            <option value="Citizen">Citizen</option>
                            <option value="PermanentResident">Permanent Resident</option>
                            <option value="WorkVisa">Work Visa</option>
                            <option value="StudentVisa">Student Visa</option>
                        </select>
                </div>
                <div className="ui input" style={{ display: this.state.visamode }} >
                    Expiry Date
                <input
                        type="text"
                        name="expiryDate"
                        onChange={this.handleChange2}
                        placeholder="enter expirydate..."
                        value={expiryDate}                       
                    >
                    </input>
                </div>
                <div>
                    <button
                        className="ui secondary button"
                        onClick={this.handleClick}
                    >Save</button>
                </div>
           </div>
        )
    }
    /*
    StudentMode() {
        return (
            <div className="ui input">
                Expiry Date
                <input
                    type="text"
                    onChange={this.handleChange}
                    placeholder="enter expirydate..."
                    value={this.state.expiryDate}
                    style={{display: this.state.visamode}}
                >
                </input>
            </div>
            )
    }*/
    

    render() {



        return (
            <div >
                {this.Mode()}
            </div>
        )
    }
}