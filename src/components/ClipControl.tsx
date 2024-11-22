import ClipFeed from "./ClipFeed"
import {useState, useEffect} from "react";
import { doGet } from "../api";
import { ClipProp } from "./Clip";

interface CategoryObj {
    name: string,
    externalId: string
    isChecked: boolean
}

/**
 * Removes clip category duplicates from arrays, based on name and externalId only.
 */
function deduplicate(arr: CategoryObj[]) : CategoryObj[] {
    return arr.filter((category, i, self) => 
        i === self.findIndex((t) => (
            t.name === category.name && t.externalId === category.externalId
        ))
    )
}

/**
 * This component is reponsible for managing:
 * - when the ClipFeed reloads
 * - the Favorite Team, Followed Teams/Players form
 * - calling the API to get the Clips data
 */
export default function ClipControl() {
    const [clipFeed, setClipFeed] = useState(<ClipFeed clips={[]}/>)
    const [teams, setTeams] = useState<CategoryObj[]>([])
    const [players, setPlayers] = useState<CategoryObj[]>([])
    const [favoriteTeam, setFavoriteTeam] = useState(-1)
    const [params, setParams] = useState("")

    // is called when a Favorite Item radio button is pressed
    const onCheckedHandlerFavoriteTeam = (idx) => {
        setFavoriteTeam(idx)
    }

    // is called when a Followed Teams checkbox is pressed
    const onCheckedHandlerTeams = (idx) => {
        const updated = teams.map((tag, i) => {
            if(idx === i) tag.isChecked = !tag.isChecked;
            return tag
        })
        setTeams(updated)
    }

    // is called when a Followed Players checkbox is pressed
    const onCheckedHandlerPlayers = (idx) => {
        const updated = players.map((tag, i) => {
            if(idx === i) tag.isChecked = !tag.isChecked;
            return tag
        })
        setPlayers(updated)
    }

    /**
     * Is called when the form is submitted. It creates a query parameters string
     * depending on which boxes/radio buttons were pressed in the checkbox upon submitting.
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // prevents page refresh
        e.preventDefault();

        // the input form data is stored inside e.currentTarget.elements
        const elements = e.currentTarget.elements

        let params = ""

        for(const i in elements) {
            const element = elements[i] as HTMLInputElement
            if(element.checked) {
                const name = element.name
                const value = element.value
                params += "&" + name + "=" + value
            }
        }
        
        // remove last trailing "&" if there is one
        if(params.charAt(params.length - 1) === '&') {
            params = params.substring(0, params.length - 1)
        }

        setParams(params)
    }
    
    // Is called upon the first render, and when the query parameters string is updated. "params" is in the dependency array.
    useEffect(() => {
        let endpoint: string = "REMOVED"

        endpoint += params
        // console.log(endpoint)

        doGet(endpoint)
            .then((data) => {
                // populate the teams and players arrays
                const teamsArr : CategoryObj[] = []
                const playersArr : CategoryObj[] = []
                data?.clips?.map((clip : ClipProp) => {
                    clip.clipCategories?.map((category) => {
                        if(category.type === "team") {
                            teamsArr.push({"name": category.name, "externalId": category.externalId, "isChecked": false})
                        } else if (category.type === "player") {
                            playersArr.push({"name": category.name, "externalId": category.externalId, "isChecked": false})
                        }
                    })
                })
                
                // removes duplicates and sets the states
                setTeams(deduplicate(teamsArr))
                setPlayers(deduplicate(playersArr))

                // This should cause the clip feed to be re-rendered
                const randomKey = Math.random() * 100
                setClipFeed(<ClipFeed key={randomKey} clips={data.clips}/>)
            })
            .catch((err) => console.error(err));
    }, [params])

    return (
        <div className="relative flex flex-row space-x-10">
            <form onSubmit={handleSubmit} className="flex flex-row space-x-10">
                {/* Favorite Team radio buttons */}
                <div className="flex flex-col">
                    Favorite Team
                    {
                        teams.map((team: CategoryObj, idx: number) => 
                            <div>
                                <input
                                type="radio"
                                checked={idx === favoriteTeam}
                                onChange={(e) => onCheckedHandlerFavoriteTeam(idx)}
                                key={idx}
                                name="userAttributes[favoriteTeam]"
                                value={team.externalId}
                                />
                                <label>{team.name}</label>
                            </div>
                        )
                    }
                </div>
                
                {/* Followed Teams checkboxes */}
                <div className="flex flex-col">
                    Followed Teams
                    {
                        teams.map((team: CategoryObj, idx: number) => 
                            <div>
                                <input
                                type="checkbox"
                                checked={team.isChecked}
                                onChange={(e) => onCheckedHandlerTeams(idx)}
                                key={idx}
                                name="userAttributes[followedTeams]"
                                value={team.externalId}
                                />
                                <label>{team.name}</label>
                            </div>
                        )
                    }
                </div>

                {/* Followed Players checkboxes */}
                <div className="flex flex-col">
                    Followed Players
                    {
                        players.map((player: CategoryObj, idx: number) => 
                            <div>
                                <input
                                type="checkbox"
                                checked={player.isChecked}
                                onChange={(e) => onCheckedHandlerPlayers(idx)}
                                key={idx}
                                name="userAttributes[followedPlayers]"
                                value={player.externalId}
                                />
                                <label>{player.name}</label>
                            </div>
                        )
                    }
                </div>

                {/* Submit button */}
                <div className="flex flex-col">
                    <button type="submit" className="px-1 bg-green-200 rounded shadow">Submit filters</button>
                </div>
            </form>
                        
            {clipFeed}
        </div>
    )
}