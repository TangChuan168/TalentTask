/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
//import { Table, Icon, Button, Input, Dropdown, Form, Label } from 'semantic-ui-react';
//import { ChildSingleInput } from "../Form/singleinput.jsx";

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company: "",
            position: "",
            startDate: '',
            endDate: '',
            responsibilities:'',


            show: "none",
            upShow: "none",
            style: {
                align: "center",
                float: "left",
                width: "200px",
            },
            style2: {
                float: "right",
                background: "red",
                textalign: "center",
                position: "fixed",
                right: "0px",
                width: "150px",
                height: "50px",

            },
            expData: [],
            id: "",
            companyfind: "",
            positionfind: "",
            startfind: "",
            endfind: "",
            responfind:"",
            

        }
        this.handleclick = this.handleclick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCan = this.handleCan.bind(this);
        this.handleOnchange = this.handleOnchange.bind(this);

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
            url: 'http://localhost:60290/profile/profile/getExp',
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                this.setState({
                    expData: res.data
                });
            }.bind(this)
        })
    }

    handleEdit(id) {
        event.preventDefault();
        this.setState({ upShow: "block" });
        var cookies = Cookies.get('talentAuthToken');      
        let data = JSON.stringify({ Id:id });
        //debugger;
        $.ajax({
            url: 'http://localhost:60290//profile/profile/findEXP',
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
                        id: res.data[0].id,
                        companyfind: res.data[0].company,
                        positionfind: res.data[0].position,
                        startfind: res.data[0].start,
                        endfind: res.data[0].end,
                        responfind: res.data[0].responsibilities,
                    });
                    console.log(this.state.companyfind);

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
        let data = JSON.stringify({Id:id});
        $.ajax({
            url: 'http://localhost:60290//profile/profile/deleteEPX',
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
        this.setState({ show: "none" })
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
            Id: this.state.id,
            Company: this.state.companyfind,
            Position: this.state.positionfind,
            Start: this.state.startfind,
            End: this.state.endfind,
            Responsibilities: this.state.responfind,
        });
        console.log("########################")
        console.log(data);
        $.ajax({
            url: 'http://localhost:60290//profile/profile/updateEXP',
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

        let data = JSON.stringify({
            Company : this.state.company,
            Position : this.state.position,
            Responsibilities : this.state.responsibilities,
            Start : this.state.startDate,
            End : this.state.endDate,
        });
        $.ajax({
            url: 'http://localhost:60290//profile/profile/addUserEXP',
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

    render() {

        const EXPAdd = <form className="ui form" onSubmit={this.handleSubmit} style={{ display: this.state.show }} >
            <div className="field">
                <label>Company</label>
                <input
                    style={this.state.style}
                    type="text" name="company"
                    onChange={this.handleOnchange}
                    value={this.state.company}
                >
                </input>
            </div>
            <div className="field">
                <label>Position</label>
                <input
                    style={this.state.style}
                    type="text" name="position"
                    onChange={this.handleOnchange}
                    value={this.state.position}
                >
                </input>
            </div>
            <div className="field">
                    <label>Start Date</label>
                    <input
                        style={this.state.style}
                        type="text" name="startDate"
                        onChange={this.handleOnchange}
                        value={this.state.startDate}
                    >
                    </input>
                </div>

            <div className="field">
                    <label>End Date</label>
                    <input
                        style={this.state.style}
                        type="text" name="endDate"
                        onChange={this.handleOnchange}
                        value={this.state.endDate}
                    >
                    </input>
                </div>

            <div className="field">
                    <label>Responsibilities</label>
                    <input
                        style={this.state.style}
                        type="text" name="responsibilities"
                        onChange={this.handleOnchange}
                        value={this.state.responsibilities}
                    >
                    </input>
                </div>

                <button style={{ float: "right" }} onClick={this.handleCan} class="ui teal button">Cancel</button>
                <button type="submit" style={{ float: "right" }} class="ui red button">Add</button>
            </form>

        

        const EXPUpdate = 
<form class="ui form segment" onSubmit={this.handleSubmit2} style={{ display: this.state.upShow }} >

    <div className="fields">
        <label>Company</label>
        <input
        style={this.state.style}
        type="text" name="companyfind"
        onChange={this.handleOnchange}
        value={this.state.companyfind}
        >
        </input>
        </div>
        <div className="fields">
        <label>Position</label>
        <input
        style={this.state.style}
        type="text" name="positionfind"
        onChange={this.handleOnchange}
        value={this.state.positionfind}
        >
        </input>
        </div>


        <div className="fields">
        <label>Start Date</label>
        <input
        style={this.state.style}
        type="text" name="startfind"
        onChange={this.handleOnchange}
        value={this.state.startfind}
        >
        </input>
        </div>
        <div className="fields">
        <label>End Date</label>
        <input
        style={this.state.style}
        type="text" name="endfind"
        onChange={this.handleOnchange}
        value={this.state.endfind}
        >
        </input>
        </div>


        <div className="field">
        <label>Responsibilities</label>
        <input
        style={this.state.style}
        type="text" name="responfind"
        onChange={this.handleOnchange}
        value={this.state.responfind}
        >
        </input>
    </div>

    <button style={{ float: "right" }} onClick={this.handleCan2} class="ui teal button">Cancel</button>
    <button type="submit" style={{ float: "right" }} class="ui red button">UPdate</button>
</form>

        return (
            <div style={{ height: "450px" }}>

                {EXPAdd}
                {EXPUpdate}

                <div>
                    <table class="ui compact celled definition table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Responsibilities</th>
                                <th>Start</th>
                                <th>End</th>
                                <th><button class="ui secondary button" onClick={this.handleclick}>+ Add New</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.expData.map(
                                    x => {
                                        return (
                                            <tr key={x.id}>
                                                <td>{x.company}</td>
                                                <td>{x.position}</td>
                                                <td>{x.responsibilities}</td>
                                                <td>{x.start}</td>
                                                <td>{x.end}</td>
                                                <td><button onClick={this.handleEdit.bind(this, x.id)} className="ui yellow button"><i className="edit icon">Edit</i></button></td>
                                                <td><button onClick={this.handleDel.bind(this, x.id)} className="ui red button" ><i className="trash alternate icon">Del</i></button></td>
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
