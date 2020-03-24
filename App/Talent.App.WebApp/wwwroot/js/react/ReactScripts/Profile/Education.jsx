/* Education section */
import React from 'react';
import Cookies from 'js-cookie';
import { default as Countries } from '../../../../../wwwroot/util/jsonFiles/countries.json';






export default class Education extends React.Component {
    constructor(props) {
        super(props)
    };

    render() {
        
        const imagelocation = 'http://localhost:60290/wwwroot/images/2019_05_01025.jpg';
        return (
            <div >
                <img src={imagelocation} />
            </div>
        )
    }
}
