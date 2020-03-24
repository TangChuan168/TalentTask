/* Certificate section */
import React from 'react';
import Cookies from 'js-cookie';

export default class Certificate extends React.Component {

    constructor(props) {
        super(props)
        

    };

    render() {
        return (
            <div className="ui labeled input">
                <div className="ui label">SelfIntroduction</div>
                <input type="text" placeholder="aa" />
                <button class="ui red button right attached ui button" >Edit</button>
            </div>
        )
    }
}

