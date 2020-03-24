
import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';





export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);
        
        let loader = loaderData;
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
       

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loaderData,
            loadingFeedData: false,
            companyDetails: null,

            EPdata: null,
            EMdata:null,
        }

        this.init = this.init.bind(this);
        this.loadEmp = this.loadEmp.bind(this);
        this.loadData = this.loadData.bind(this);

    };
    
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        this.loadData();
        this.loadEmp();
    }
    
    componentDidMount() {
        //window.addEventListener('scroll', this.handleScroll);
        this.init()
    };
    loadData() {
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalent',
            headers: {
                'Authorization': 'Bearer ' + cookies,
            },
            type: "GET",

            success: function (EPres) {
                console.log('from======> getTalent',EPres);              
                this.setState({
                    EPdata: EPres.data,
                })
            }.bind(this)
        })
    }
    loadEmp() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
            },
            type: "GET",
            success: function(EMres) {
                console.log('from employer1',EMres.employer);
                this.setState({
                    EMdata: EMres.employer.companyContact,
                })
            }.bind(this)
           
        })
        
    }


    //reload={this.init} loaderData={this.state.loaderData}
    render() {

        return (
            <BodyWrapper reload={this.init}  loaderData={this.state.loaderData} >
                <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile employerData={this.state.EMdata} />
                    </div>
                    <div className="eight wide column">
                        <TalentCard data={this.state.EPdata} />

                        <p id="load-more-loading">
                            <img src="/images/rolling.gif" alt="Loading…" />
                        </p>
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}