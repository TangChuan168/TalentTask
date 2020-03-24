/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';

const imagelocation = 'http://localhost:60290/wwwroot/images/';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        
        //const data = this.props.imageId.profilePhoto;
        
        this.state = {
            icon: "block",
            div: "none",
            div2:"none",
            IMG: "",
            selectedPhoto: '',
            image: '',
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.photoUP = this.photoUP.bind(this);
    };

        componentDidMount() {
        const data = this.props.imageData;
        const imagedata = imagelocation + data;
        //debugger;
        this.setState({
            image:imagedata,
        })
        
    }

    handleClick(event) {
        //event.preventDefault();
        event.stopPropagation();
        console.log("ok");
        this.refs.fileUploader.click();
    }

    handleOnchange(event) {
        event.preventDefault();
        event.stopPropagation();
        var selectedPhoto = event.target.files[0];
        let file = URL.createObjectURL(event.target.files[0]);    
        this.setState({
            selectedPhoto: selectedPhoto,
            IMG: file,
            icon: "none",
            div:"block",
        })
    }

    handleUp(event) {
        console.log('ok');
        console.log(this.state.selectedPhoto);
        event.preventDefault();
        event.stopPropagation();

        //const data = Object.assign({}, this.state.IMG);
        this.setState({
            div: "none",
            div2:"block",
        }, this.photoUP)



        //let newData = { profilePhoto: this.state.data };
        //this.props.updateProfileData(newData);

    }

    photoUP() {
        var cookies = Cookies.get('talentAuthToken');
        const formdata = new FormData();
        formdata.append("image", this.state.selectedPhoto, this.state.selectedPhoto.name);

        console.log(formdata);

        const url = 'http://localhost:60290/profile/profile/updateProfilePhoto';
        fetch(url, { method: 'Post', headers: { 'Authorization': 'Bearer ' + cookies}, body: formdata }).then(res=>{
            console.log(res.message);
    })
    //debugger; 
    }
    
    render() {

        const editMode = <form class="ui form">
            <i onClick={this.handleClick} className="massive camera retro icon" style={{ display: this.state.icon }}></i>
            <input type="file" id="file" ref="fileUploader" style={{ display: "none" }} onChange={this.handleOnchange} />
            <div style={{ display: this.state.div }} >
                <img name="IMG" className="ui small circular image" src={this.state.IMG} />
                <button class="ui primary button" onClick={this.handleUp}><i class="small angle double up icon">Upload</i></button>
            </div>
            <div style={{ display: this.state.div2 }}>
                <img name="IMG" onClick={this.handleClick} className="ui large circular image" src={this.props? this.state.image:null} />
            </div>
        </form>

        
        const picMode = <div>           
            <img name="IMG" onClick={this.handleClick} className="ui large circular image" src={imagelocation + `${this.props.imageData}`} />
            
        </div>



        if (this.props.imageData) {
            return picMode;
            
        } else {
            return editMode;
        }

    }

    
}
