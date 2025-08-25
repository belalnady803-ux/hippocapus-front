import { WistiaPlayer } from "@wistia/wistia-player-react"; 
export default function WistiaPlayerFunction({wistiaId}) {
    return(
        <WistiaPlayer mediaId={wistiaId} />
    )
}