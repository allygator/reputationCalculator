import React, { Component } from 'react';
import Expac from './Expac';
const bestFriends = [1273, 1275, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1975, 1358]; //IDs for NPCs that have "Friend" levels rather than reputations
const friendLevels = ["Stranger","Acquantaince", "Buddy", "Friend", "Good Friend", "Best Friend"];
const repTitles = ["Hated", "Hostile", "Unfriendly", "Neutral", "Friendly", "Honored", "Revered", "Exalted"]; // Reputation levels
const alli = [47,54,69,72,930,1134];
const horde = [];
/*  Vanilla: 21-910
    BC: 930-1038 except 1037
    Wrath: 1050-1126
    Cata: 1134-1204 except 1168 (guild)
    Mop: 1269-1435
    Wod: 1445-1731 except 1691 (Brawlers Guild Season 2)
    Legion: 1828-2045,2165,2170 except 2011 (Brawlers Guild)
    Bfa: 2103-2159 except 2135
*/

class RepLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            max: false,
            vanilla: [],
            bc: [],
            wrath: [],
            cata: [],
            mop: [],
            wod: [],
            legion: [],
            bfa: [],
            alliance: [],
            horde: [],
            guild: []
        }
        //this.isMaxRep = this.isMaxRep.bind(this);
        this.isCompletedRep = this.isCompletedRep.bind(this);
        this.repLevel = this.repLevel.bind(this);
        this.findExpac = this.findExpac.bind(this);
    }

    componentDidMount() {
        this.findExpac(this.props.reps)
    }

    /*isMaxRep(rep) {
        if (bestFriends.includes(rep.id) && rep.standing === 5)
            this.setState({max: true});
        if (rep.standing === 7)
            this.setState({max: true});
    }*/

    isCompletedRep(rep) {
        if(bestFriends.includes(rep.id) && rep.standing === 5) {
          return false;
        } else if (rep.standing === 7) {
          return false;
        } else {
          return true;
        }
    }

    repLevel(rep) {
        if(bestFriends.includes(rep.id)) {
            return friendLevels[rep.standing];
        } else {
            return repTitles[rep.standing];
        }
    }

    findExpac(reps) {
        /*  Vanilla: 21-910
            BC: 930-1038 except 1037
            Wrath: 1050-1126
            Cata: 1134-1204 except 1168 (guild)
            Mop: 1269-1435
            Wod: 1445-1731 except 1691 (Brawlers Guild Season 2)
            Legion: 1828-2045,2165,2170 except 2011 (Brawlers Guild)
            Bfa: 2103-2159 except 2135
        */
        for(let rep of reps) {
            var tempRep;
            if(alli.includes(rep.id)) { // Alliance reps
                tempRep = this.state.alliance;
                tempRep.push(rep);
                this.setState({alliance: tempRep});
            } else if (horde.includes(rep.id)) { // Horde Reps
                tempRep = this.state.horde;
                tempRep.push(rep);
                this.setState({horde: tempRep});
            } else if (rep.id === 1168) { // Guild Rep
                this.setState({guild: rep})
            } else if (rep.id < 929 && rep.id !== 469) { // Vanilla Reps
                tempRep = this.state.vanilla;
                tempRep.push(rep);
                this.setState({vanilla: tempRep});
            } else if (rep.id < 1036 || rep.id === 1038) { // BC Reps
                tempRep = this.state.bc;
                tempRep.push(rep);
                this.setState({bc: tempRep});
            } else if (rep.id < 1126) { // Wrath Reps
                tempRep = this.state.wrath;
                tempRep.push(rep);
                this.setState({wrath: tempRep});
            } else if (rep.id < 1204) { // Cata Reps
                tempRep = this.state.cata;
                tempRep.push(rep);
                this.setState({cata: tempRep});
            } else if (rep.id < 1435) { // Mop Reps
                tempRep = this.state.mop;
                tempRep.push(rep);
                this.setState({mop: tempRep});
            } else if (rep.id < 1731 && rep.id !== 1691) { // Wod Reps
                tempRep = this.state.wod;
                tempRep.push(rep);
                this.setState({wod: tempRep});
            } else if ((rep.id < 2045 || rep.id === 2165 || 2170) && rep.id !== 2011) { // Legion Reps
                tempRep = this.state.legion;
                tempRep.push(rep);
                this.setState({legion: tempRep});
            } else if (rep.id > 2103 && rep.id !== 2135) { // Bfa Reps
                tempRep = this.state.bfa;
                tempRep.push(rep);
                this.setState({bfa: tempRep});
            }
        }
    }

    render() {
        const {vanilla,bc,wrath,cata,mop,wod,legion,alliance,horde} = this.state;
        return [
            <Expac name="Alliance" reps={alliance} key={"one"} />,
            <Expac name="Horde" reps={horde} key={"two"} />,
            <Expac name="Vanilla" reps={vanilla} key={"three"} />,
            <Expac name="Burning Crusade" reps={bc} key={"four"} />,
            <Expac name="Wrath of the Lich King" reps={wrath} key={"five"} />,
            <Expac name="Cataclysm" reps={cata} key={"six"} />,
            <Expac name="Mists of Pandaria" reps={mop} key={"seven"} />,
            <Expac name="Warlords of Draenor" reps={wod} key={"eight"} />,
            <Expac name="Legion" reps={legion}  key={"nine"} />
        ]
    }
}

/*function Expac({name,reps}) {
    return (
        <div className={[name,"expac"].join(' ')}>
        <h2>{name[0].toUpperCase() + name.slice(1)}</h2>
        <div className={"child hidden"}>
        {reps.map((rep) => (
            <div key={rep.name} className="rep">
            <h3>{rep.name}</h3>
            <p>{repLevel(rep)}</p>
            <p>{rep.value}/{rep.max}</p>
            </div>
        ))}
        </div>
        </div>
    )
}*/

export default RepLayout;
