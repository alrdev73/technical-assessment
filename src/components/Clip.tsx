import {useRef, useState} from "react"
import { AiFillPlayCircle, AiFillHeart, AiOutlineShareAlt } from "react-icons/ai";

export interface ClipProp {
    url: string,
    sortOrder: number,
    clipCategories: ClipCategory[]
    likeCount: number,
    shareCount: number
} 

export interface ClipCategory {
    name: string,
    id: string,
    type: string,
    externalId: string
}

/**
 * The Clip component, which includes controls for playing/pausing, heart and share icons.
 */
export default function Clip(clipProp: ClipProp) {
    const clipRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // plays/pauses the clip
    const handlePlay = () => {
        if(isPaused) {
            clipRef.current.play();
        } else {
            clipRef.current.pause();
        }
        setIsPaused(isPaused => !isPaused);
    }

    return (
        <div className="relative bg-black rounded">
            {/* Like and share buttons */}
            <div className="absolute px-1 right-0 top-1/2 space-y-2 z-10">
                <div className="right-0 text-white">
                    <AiFillHeart className="text-3xl"/>
                    <p className="text-xs text-center">{clipProp.likeCount}</p>
                </div>
                <div className="right-0 text-white">
                    <AiOutlineShareAlt className="text-3xl"/>
                    <p className="text-xs text-center">{clipProp.shareCount}</p>
                </div>
            </div>

            {/* Paused button */}
            {isPaused && <div className="absolute top-1/2 right-1/2 z-10 hover:cursor-pointer" onClick={handlePlay}>
                <AiFillPlayCircle className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl text-white"/>
            </div>}

            <video ref={clipRef} autoPlay loop muted onClick={handlePlay} className="bg-gray-900 opacity-90 max-h-96 rounded hover:cursor-pointer">
                <source src={clipProp.url} type="video/mp4"></source>
            </video>
        </div>
    )
}