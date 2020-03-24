/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            skill: "",
            level: "",
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
            data: [],
            skillfind: "",
            levelfind: "",
            id: "",

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
            url: 'http://localhost:60290/profile/profile/getSkill',
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                this.setState({
                    data: res.data
                });
            }.bind(this)
        })
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
            url: 'http://localhost:60290//profile/profile/findSkills',
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
                        skillfind: res.data[0].skill,
                        levelfind: res.data[0].experienceLevel,
                        id: res.data[0].id,
                    });
                    console.log(this.state.skillfind);
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
            url: 'http://localhost:60290//profile/profile/deleteSkill',
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
            Name: this.state.skillfind,
            Level: this.state.levelfind,
            Id: this.state.id,
        });
        console.log("########################")
        console.log(data);
        $.ajax({
            url: 'http://localhost:60290//profile/profile/updateSkill',
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
                Name: this.state.skill,
                Level: this.state.level,
            });
            $.ajax({
                url: 'http://localhost:60290//profile/profile/addSkill',
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

        const SkillAdd = <div style={{ display: this.state.show }} >

            <form class="ui form segment" onSubmit={this.handleSubmit} >

                <input
                    style={this.state.style}
                    type="text" name="skill"
                    placeholder="Add skill"
                    onChange={this.handleOnchange}
                    value={this.state.Skill}
                >
                </input>

                <select
                    style={this.state.style}
                    value={this.state.Level}
                    name="level"
                    class="ui dropdown"
                    onChange={this.handleOnchange}
                >
                    <option value="">Select Skill Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>

                </select>
                <button style={{ float: "right" }} onClick={this.handleCan} class="ui teal button">Cancel</button>
                <button type="submit" style={{ float: "right" }} class="ui red button">Add</button>
            </form>

        </div>

        const SkillUpdate = <div style={{ display: this.state.upShow }} >

            <form class="ui form segment" onSubmit={this.handleSubmit2} >

                <input
                    style={this.state.style}
                    type="text" name="skillfind"

                    onChange={this.handleOnchange}
                    value={this.state.skillfind}
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
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                </select>
                <button style={{ float: "right" }} onClick={this.handleCan2} class="ui teal button">Cancel</button>
                <button type="submit" style={{ float: "right" }} class="ui red button">UPdate</button>
            </form>

        </div>

        return (
            <div style={{ height: "280px" }}> 

                {SkillAdd}
                {SkillUpdate}

                <div>
                    <table class="ui compact celled definition table">
                        <thead>
                            <tr>
                                <th>Skill</th>
                                <th>Level</th>
                                <th></th>
                                <th><button class="ui secondary button" onClick={this.handleclick}>+ Add New</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            { 
                                this.state.data.map(
                                    x => {
                                        return (
                                            <tr key={x.id}>
                                                <td>{x.skill}</td>
                                                <td>{x.experienceLevel}</td>
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


    


