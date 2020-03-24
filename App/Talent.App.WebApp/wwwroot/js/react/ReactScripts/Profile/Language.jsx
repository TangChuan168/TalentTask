/* Language section */
import React from 'react';
import Cookies from 'js-cookie';



/*
const formValid = formErrors => {
    let valid = true;

    Object.values(formErrors).forEach(val => { val.lenght > 0 && (valid = false) });
    return valid;
};
*/

class Language extends React.Component {
    constructor(props) {
        super(props);     
        this.state = {
            Language: "",
            Level: "",
            show: "none", 
            upShow:"none",
            style: {
                align: "center",
                float: "left",
                width: "200px",
            },
            style2:{
            float: "right",
                background: "red",
                    textalign: "center",
                        position: "fixed",
                            right: "0px",
                                width: "150px",
                                    height: "50px",
                                                    
                                                },            
            data: [],
            languagefind: "",
            levelfind: "",
            id:"",
            
        }
        this.handleclick = this.handleclick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCan = this.handleCan.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);
        this.validate = this.validate.bind(this);
        this.loadData = this.loadData.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.handleCan2 = this.handleCan2.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
        
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getLanguage',
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            success: function (res) {
                //console.log(res.data);
                this.setState({
                    data:res.data
                });
            }.bind(this)
        })      
    }

    validate() {
        if (this.state.Language.length === 0) {
            return false;
        }
        if (this.state.Level === "") {
            return false;
        }
        return true;
    }

    handleEdit(id) {
        event.preventDefault();
        this.setState({ upShow: "block" });
        var cookies = Cookies.get('talentAuthToken');
        //debugger;
        let data = JSON.stringify({
            Id: id,
        });
        $.ajax({
            url: 'http://localhost:60290//profile/profile/FindLanguages',
            type: "POST",
            data: data,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json; charset=utf-8'
            },
            success: function (res) {
                if (res.data) {
                    console.log(res.data); 

                    this.setState({
                        languagefind: res.data[0].language,
                        levelfind: res.data[0].languageLevel,
                        id: res.data[0].id,
                    });
                    console.log(this.state.languagefind);
                    console.log(this.state.levelfind);
                    console.log(this.state.id);
                }
                else {
                    console.log("data not exist");
                }
            }.bind(this),
        });
    }

    handleDel(id) {       
        console.log(id);
        var cookies = Cookies.get('talentAuthToken');
        //debugger;
        let data = JSON.stringify({
            Id: id,
        });
        $.ajax({
            url: 'http://localhost:60290//profile/profile/DeleteLanguage',
            type: "POST",
            data: data,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json; charset=utf-8'
            },
            success: function (res) {
                if (res.message) {
                    console.log(res.message);
                }
                else {
                    console.log("data insert failed");
                }
            }.bind(this),
        });
    }

    handleclick(event) {
        event.preventDefault();
        this.setState({ show: "block" });
            
    }

    handleOnchange(event) {
        event.preventDefault();
        let { name, value } = event.target;
        this.setState({ [name]: value }, () => console.log(this.state));

    }




    handleCan(event) {
        event.preventDefault();
        this.setState({show:"none"})
    }
    handleCan2(event) {
        event.preventDefault();
        this.setState({ upShow: "none" })
    }

    handleSubmit2(event) {
        event.preventDefault();
        //console.log(this.props.userinfo);
        var cookies = Cookies.get('talentAuthToken');       
                   
        let data = JSON.stringify({
            Name: this.state.languagefind,
            Level: this.state.levelfind,
            Id:this.state.id,
        });
        console.log("########################")
        console.log(data);
        $.ajax({
            url: 'http://localhost:60290//profile/profile/updateLanguage',
            type: "POST",
            data: data,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json; charset=utf-8'
            },
            success: function (res) {
                if (res.message) {
                    console.log(res.message);
                    window.location.href = "http://localhost:61771/TalentProfile";
                }
                else {
                    console.log("data update failed");
                }
            }.bind(this),
            error: function (res) {
                console.log(res);
                TalentUtil.notification.show("Error while saving data", "error");
            }
        });
        
    }

    handleSubmit(event) {
        event.preventDefault();
        //console.log(this.props.userinfo);
        var cookies = Cookies.get('talentAuthToken');
        const isValid = this.validate();
        if (isValid) {
            console.log("this data is valid");
            let data = JSON.stringify({
                Name: this.state.Language,
                Level: this.state.Level,
                //CurrentUserId: this.props.userinfo,

            });
            $.ajax({
                url: 'http://localhost:60290//profile/profile/addLanguage',
                type: "POST",
                data: data,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                success: function (res) {
                    if (res.message) {
                        console.log(res.message);
                        window.location.href = "http://localhost:61771/TalentProfile";
                    }
                    else {
                        console.log("data insert failed");
                    }
                }.bind(this),
                error: function (res) {
                    console.log(res);
                    TalentUtil.notification.show("Error while saving data", "error");
                }
            });
        }

    }


    render() {

        const LanguageAdd = <div style={{ display: this.state.show }} >

                <form class="ui form segment" onSubmit={this.handleSubmit} >
            
                    <input
                    style={this.state.style}
                    type="text" name="Language"
                    placeholder="Add Language"
                    onChange={this.handleOnchange}
                    value={this.state.Language}   
                        >
                     </input>   

                    <select
                        style={this.state.style}
                        value={this.state.Level}
                        name="Level"
                        class="ui dropdown"
                        onChange={this.handleOnchange}
                        >


                        <option value="">Select Language Level</option>
                        <option value="Basic">Basic</option>
                        <option value="Conversational">Conversational</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Native">Native</option>
                    </select>
                    <button style={{ float: "right" }} onClick={this.handleCan} class="ui teal button">Cancel</button>
                    <button type="submit" style={{ float: "right" }}  class="ui red button">Add</button>
            </form>
            {this.state.Language.length =="" ? (<div style={this.state.style2}>Please Input Your Language</div>) : null}
            {this.state.Level ==="" ? (<div style={this.state.style2}>Please Select Language lvl</div>) : null}
        </div>

        const LanguageUpdate = <div style={{ display: this.state.upShow }} >

            <form class="ui form segment" onSubmit={this.handleSubmit2} >

                <input
                    style={this.state.style}
                    type="text" name="languagefind"
                    
                    onChange={this.handleOnchange}
                    value={this.state.languagefind}
                >
                </input>

                <select
                    style={this.state.style}
                    value={this.state.Level}
                    name="levelfind"
                    class="ui dropdown"
                    onChange={this.handleOnchange}
                >


                    <option value="">{this.state.levelfind}</option>
                    <option value="Basic">Basic</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                </select>
                <button style={{ float: "right" }} onClick={this.handleCan2} class="ui teal button">Cancel</button>
                <button type="submit" style={{ float: "right" }} class="ui red button">UPdate</button>
            </form>

        </div>


        return (
            <div style={{ height: "280px" }}>
                
                {LanguageAdd}
                {LanguageUpdate}
                
                <div>
                <table class="ui compact celled definition table">
                    <thead>
                        <tr>
                            <th>Language</th>
                            <th>Level</th>
                            <th></th>
                            <th ><button class="ui secondary button"  onClick={this.handleclick}>+ Add New</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map(
                                x => {
                                    return (
                                        <tr key={x.id}>
                                            <td>{x.language}</td>
                                            <td>{x.languageLevel}</td>
                                            <td><button onClick={this.handleEdit.bind(this,x.id)} className="ui yellow button"><i className="edit icon">Edit</i></button></td>
                                            <td><button onClick={this.handleDel.bind(this,x.id)} className="ui red button" ><i className="trash alternate icon">Del</i></button></td>
                                        </tr>
                                    );
                                }
                            )
                        }
                    </tbody>
                    </table>
                    </div>
           </div>
        )
    }
}
export default Language;