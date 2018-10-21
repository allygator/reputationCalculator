import React, { Component } from 'react';
import RepLayout from './RepLayout';
const bestFriends = [1273, 1275, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1975, 1358]; //IDs for NPCs that have "Friend" levels rather than reputations

class Reputation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            reps: [],
            max: false,
        }
        this.isCompletedRep = this.isCompletedRep.bind(this);
        //this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }

    componentDidMount() {
        this.getReputations();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.name !== this.props.name || prevProps.realm !== this.props.realm || prevProps.isChecked !== this.props.isChecked) {
            this.getReputations();
        }
    }

    getReputations = () => {
        const region = this.props.region.toLowerCase();
        this.setState({reps:[], error:null});
        //console.log(this.props.name + ":Get Reputations");
        if(this.props.realm && this.props.name) {
            fetch('https://'+region+'.api.blizzard.com/wow/character/' + this.props.realm + '/' + this.props.name + '?fields=reputation&access_token=' + this.props.token)
            .then(function(response) {
                if(response.ok) {
                    return response.json()
                } else
                    throw new Error(response.statusText)
            })
            .then((character) => {
                this.setState({
                    isLoaded: true,
                });
                this.setState({faction:character.faction});
                this.props.setThumbnail(character.thumbnail);
                this.props.setName(character.name);
                if(this.props.isChecked) {
                    character.reputation.sort((a,b) => a.id-b.id);
                    this.setState({reps:character.reputation.filter(this.isCompletedRep)});
                } else {
                    character.reputation.sort((a,b) => a.id-b.id);
                    this.setState({reps: character.reputation})
                }
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error.message
                });
            }
            )
        } else {
            this.setState({error: "Please input a realm and character name"});
        }
    }

    isCompletedRep(rep) {
        if(bestFriends.includes(rep.id) && rep.standing === 5) {
          return false;
        } else if (rep.standing === 7) {
          return false;
        } else {
          return true;
        }
    }

    render() {
        const { error, isLoaded, reps } = this.state;
        if (error) {
          return <div>Error: {error}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
            return (
                <div className="reputations" key="reputationPanel">
                {reps.length > 1 && <RepLayout reps={reps} isHorde={Boolean(this.state.faction)} hideProgress={this.props.isChecked}/>}
                </div>
            )
        }
    }
}

export default Reputation;
