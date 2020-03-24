/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showedit: "none",
            showtext:"block",

            summary: {
                shortSummary: '',
                notes:'',
            },
            text: "this is the text ",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleONclick = this.handleONclick.bind(this);
        this.handlecan = this.handlecan.bind(this);
    };

    handleOnchange(event) {
        event.preventDefault();
        const data = Object.assign({}, this.state.summary);
        data[event.target.name] = event.target.value;
        this.setState({
            summary: data
        })
    }

    handleONclick(event) {
        event.preventDefault();
        this.setState({
            showedit: "block",
            showtext: "none",
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();


    }
    handlecan(event) {
        event.preventDefault();
        event.stopPropagation()
        console.log("event ok");
        this.setState({
            showedit: "none",
            showtext: "block",
        })
    }

    render() {

        const summarytext = <div class="ui form" style={{dispaly: this.state.showtext}}>
            <div class="ui message">
                {this.state.text}
            </div>
            <button class="ui red button right attached ui button" onClick={this.handleONclick}>Edit Summary</button>
        </div>

        const editmode = <div class="ui form" onSubmit={this.handleSubmit} style={{ dispaly: this.state.showedit } } >
            <div class="field">
                <label>Short Summary</label>
                <input name="shortSummary" rows="2" onChange={this.handleOnchange} placeholder="Please provide a short summary about yourself"></input>
                Summary must be no more than 150 characers.
                </div>
            <div class="field">
                <label>Summary</label>
                <textarea name="notes" onChange={this.handleOnchange} placeholder="Please tell us about any hobbies,additional expertise"></textarea>
                Description must be between 150-600 characters.
                </div>
            <button className="ui secondary button" type='submit'>SAVE</button>
            <button className="ui button" onlick={this.handlecan}>Cancel</button>
            </div >

            if (this.state.showedit == "block") {
                return <div>{editmode}</div> 
            } else {
                return <div>{summarytext}</div> 
            }
    }
}



