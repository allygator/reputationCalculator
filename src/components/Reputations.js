import React, {Component} from 'react';
import RepLayout from './RepLayout';
import '../reputation.css'
import LinearProgress from '@material-ui/core/LinearProgress';
const bestFriends = [
    1273,
    1275,
    1276,
    1277,
    1278,
    1279,
    1280,
    1281,
    1282,
    1283,
    1975,
    1358
]; //IDs for NPCs that have "Friend" levels rather than reputations

class Reputation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            reps: [],
            max: false,
            completedCounter: 0
        }
        this.isCompletedRep = this.isCompletedRep.bind(this);
        this.countCompleted = this.countCompleted.bind(this);
        //this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    componentDidMount() {
        this.getReputations();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name || prevProps.realm !== this.props.realm || prevProps.completed !== this.props.completed) {
            this.getReputations();
        }
    }

    getReputations = () => {
        const region = this.props.region.toLowerCase();
        let lang;
        if (region === "us") {
            lang = "en_US";
        } else {
            lang = "en_GB";
        }
        this.setState({reps: [], error: null, completedCounter: 0});
        if (this.props.realm && this.props.name) {
            fetch('https://' + region + '.api.blizzard.com/profile/wow/character/' + this.props.realm + '/' + this.props.name + '/reputations?namespace=profile-' + region + '&locale=' + lang + '&access_token=' + this.props.token).then(function(response) {
                if (response.ok) {
                    return response.json()
                } else
                    throw new Error(response.statusText)
            }).then((character) => {
                this.setState({isLoaded: true});
                this.setState({faction: character.faction});
                let url = 'https://render-'+this.props.region+'.worldofwarcraft.com/character/'+character.character.realm.slug+'/'+character.character.id%256+'/'+character.character.id+'-avatar.jpg';
                this.props.setThumbnail(url);
                this.props.setName(character.character.name);
                this.props.setRealm(character.character.realm.name);
                if (this.props.completed) {
                    character.reputation.sort((a, b) => a.id - b.id);
                    this.setState({
                        reps: character.reputations.filter(this.isCompletedRep)
                    });
                    this.props.setCompletedCount(this.state.completedCounter);
                } else {
                    character.reputations.sort((a, b) => a.id - b.id);
                    character.reputations.forEach((rep) => {
                        if (rep.standing.tier === 7) {
                            this.countCompleted();
                        }
                    })
                    this.setState({reps: character.reputations})
                    this.props.setCompletedCount(this.state.completedCounter);
                }
            }, (error) => {
                this.setState({isLoaded: true, error: error.message});
            });
        } else {
            this.setState({error: "Please input a realm and character name"});
        }
    }

    isCompletedRep(rep) {
        if (bestFriends.includes(rep.id) && rep.standing.tier === 5) {
            return false;
        } else if (rep.standing.tier === 7) {
            this.countCompleted();
            return false;
        } else {
            return true;
        }
    }

    countCompleted() {
        this.setState(prevState => ({
            completedCounter: prevState.completedCounter + 1
        }))
    }

    render() {
        const {error, isLoaded, reps} = this.state;
        if (error) {
            return <div>Error: {error}</div>;
        } else if (!isLoaded) {
            return <LinearProgress className="loading"/>;
        } else {
            return (<div className="reputations" key="reputationPanel">
                {reps.length > 1 && <RepLayout reps={reps} isHorde={Boolean(this.state.faction)} hideProgress={this.props.completed}/>}
            </div>)
        }
    }
}

export default Reputation;
