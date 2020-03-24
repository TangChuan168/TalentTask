import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

       
    }
    
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