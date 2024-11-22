import {useEffect, useState} from "react";
import {AiOutlineArrowDown, AiOutlineArrowUp} from 'react-icons/ai'
import Clip from "./Clip";
import { ClipProp } from "./Clip";

export interface ClipProps {
    clips: ClipProp[]
}

/**
 * A component which navigates through Clips using the arrow buttons using an "active clip index",
 * which is the index from the JSON array of the currently rendered clip.
 */
export default function ClipFeed(props : ClipProps) {
    const [activeClipIdx, setActiveClipIdx] = useState(0);

    const handleClipChange = (clipIndex: number) => {
        if(clipIndex >= 0) setActiveClipIdx(clipIndex);
    }

    const [activeClip, setActiveClip] = useState(<Clip url={""} sortOrder={-1} likeCount={0} shareCount={0}/>)

    useEffect(() => {
        if(props.clips.length > 0) {
            const newClip = props.clips[activeClipIdx]
            const newActiveClip = <Clip key={newClip.sortOrder} 
                                        url={newClip.url} 
                                        sortOrder={newClip.sortOrder} 
                                        likeCount={newClip.likeCount} 
                                        shareCount={newClip.shareCount}/>
            setActiveClip(newActiveClip)
        }
    }, [activeClipIdx, props.clips])

    return (
        <div className="flex flex-col items-center space-y-2">
            <AiOutlineArrowUp className="text-4xl border rounded-full border-black hover:cursor-pointer" onClick={(e) => handleClipChange(activeClipIdx - 1)}/>
            <div className="relative aspect-vertical-video rounded shadow">
                {activeClip}
            </div>
            <AiOutlineArrowDown className=" text-4xl border rounded-full border-black hover:cursor-pointer" onClick={(e) => handleClipChange(activeClipIdx + 1)}/>
        </div>
    )
}