import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon } from 'semantic-ui-react'

//import TalentDetail from "../TalentFeed/TalentDetail";

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            profileShow: false,
            currentem: null,
            Name: null,
            visa: null,


        }

        this.handleShow = this.handleShow.bind(this);

    }

    handleShow(event) {
        event.preventDefault();
        this.setState({
            show: !this.state.show,
            profileShow:!this.state.profileShow,
        })
    }
    componentWillReceiveProps(newProps) {
        console.log('from card', newProps)
    }
    
    render() {

        const profileData = <div className="fluid ui card">
            <div className="ui grid">
            <div className="eight wide column">
                <img src="https://store.playstation.com/store/api/chihiro/00_09_000/container/NZ/en/999/EP0149-CUSA09988_00-AV00000000000002/1553528383000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000"/>
            </div>
                <div className="eight wide column">
                <ul>
                    <h1>Talent SnapShot</h1>
                    <li>CURRENT IMPLOYER</li>
                        <h3>{this.props.data? this.props.data.currentEmployment:this.state.currentem}</h3> 
                    <li>VISA STATUS</li>
                        <h3>{this.props.data? this.props.data.visa:this.state.visa}</h3>
                    <li>POSITION</li>
                        <h3>Software Deverloper</h3>
                </ul>
                </div>
            </div>
        </div>
        return (
            <div className="fluid ui card">
                <div className="extra content">
                    <h2>{this.props.data? this.props.data.name:this.state.Name}</h2>
                    <i className="right floated large star outline icon"></i>
                </div>
                <div className="image">
                    {this.state.profileShow == true ? profileData:<img src="https://www.esvs.org/wp-content/uploads/2019/10/video.jpg" /> }
                </div>
                <div className="content">
                    {this.state.show == true ? <i name="user" className="large user icon" onClick={this.handleShow}></i> : <i name="video" onClick={this.handleShow} className="large video icon"></i>}
                    <i name="pdf" style={{ paddingLeft: "85px" }} className="large file pdf icon"></i>
                    <i name="linkedin" style={{ paddingLeft: "105px" }} className="large linkedin icon"></i>
                    <i name="github" style={{ paddingLeft: "120px" }} className="large github icon"></i>
                </div>
                <div className="extra content">
                    {this.props.data ? this.props.data.skills.map(x => <span key={x}>{x}/</span>):null}
                </div>
            </div>
     )
    }
}

