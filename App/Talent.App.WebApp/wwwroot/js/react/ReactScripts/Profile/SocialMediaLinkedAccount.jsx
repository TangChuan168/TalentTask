/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show:"block",
            showbar: "none",
            linkedAccounts: {
                linkedIn: '',
                github: '',
            },
        }

        this.btnclick = this.btnclick.bind(this);
        this.handlecan = this.handlecan.bind(this);
        this.handlesave = this.handlesave.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
    }

    
    /*
    componentDidMount() {
        const link = this.props.socialaccount.linkedin;
        const git = this.props.socialaccount.git;
        this.setState({
            linkedAccounts: {
                linkedIn: link,
                github:git,
            }
        })
    }
    */
    btnclick(event) {
        event.preventDefault();
        this.setState({
            show: "none",
            showbar:"block",
        })
    }
    handlecan(event) {
        event.preventDefault();
        this.setState({
            show: "block",
            showbar: "none",
        })
    }

    handleOnchange(event) {
        event.preventDefault();
        var data = Object.assign({}, this.state.linkedAccounts);
        const { name, value } = event.target;
        data[name] = value;
        this.setState({
            linkedAccounts:data
        });
        console.log(this.state.linkedAccounts);
    }

    handlesave(event) {
        event.preventDefault();
        event.stopPropagation()
        console.log('this is handle save');
        //debugger;
        
        const data = Object.assign({}, this.state.linkedAccounts);
        let newData = { linkedAccounts: data };
        this.props.saveProfileData(newData);
        this.handlecan();
        window.location.href = "http://localhost:61771/TalentProfile";
        
    }

    
    render() {
        const inputBar = <form style={{ display: this.state.showbar }} onSubmit={this.handlesave}>
            <div className="field">
                <label>Linkedin </label>
                <input type="text" value={this.props.linkedAccounts ? this.props.linkedAccounts:this.state.linkedAccounts.linkedIn} onChange={this.handleOnchange} name="linkedIn" /> 
            </div>
            <div>
                <label>Github </label>
                <input type="text" value={this.props.gitAccounts ? this.props.gitAccounts:this.state.linkedAccounts.github} onChange={this.handleOnchange} name="github" /> 
            </div>
            <button className="ui secondary button" type='submit'>SAVE</button>
            <button className="ui button" onClick={this.handlecan}>Cancel</button>
           </form>




     

        return (
                <div>           
                    <div class="ui container" style={{ display: this.state.show }}>
                        <button class="ui linkedin button" >
                            <i class="linkedin icon"></i>
                            LinkedIn
                    </button>

                        <button class="ui facebook button">
                            <i class="facebook icon"></i>
                            Facebook
                    </button>

                        <button class="ui red button right attached ui button" onClick={this.btnclick}>Edit</button>
                    </div>

                    {inputBar}
                </div>
            )
        
    }

}