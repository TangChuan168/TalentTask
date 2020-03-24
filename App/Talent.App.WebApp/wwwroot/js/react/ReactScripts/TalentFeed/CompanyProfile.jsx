import React from 'react';
import { Loader } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(newProps) {
        console.log('New props', newProps)
    }

    render() { 

        return (           
            <div className="fluid ui card">
                <div style={{textAlign:"center"}}>
                    <h4>{this.props.employerData ?  this.props.employerData.name :  null }</h4>
                    <i className="map pin icon" >
                        {this.props.employerData ? this.props.employerData.location.country:null}
                    </i>
                    
                </div>
                <div className="extra content">                   
                    <i className="phone volume icon" >:{this.props.employerData ? this.props.employerData.phone : null}</i> <br />
                    <i className="envelope icon" >:{this.props.employerData ? this.props.employerData.email : null} </i>
                </div> 
            </div>
            )
    }
}