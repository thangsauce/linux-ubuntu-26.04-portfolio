import React from 'react';

export default function YoutubeMusic(): React.ReactNode {
    return (
        <iframe
            src="https://www.youtube.com/embed/videoseries?list=PL4fGSI1pDJn6O1LS0XSdF3RyO0Rq_LDeI"
            frameBorder="0"
            title="YouTube Music"
            className="h-full w-full bg-ub-cool-grey"
            allow="autoplay; encrypted-media"
            allowFullScreen
        ></iframe>
    );
}

export const displayYoutubeMusic = (): React.ReactNode => {
    return <YoutubeMusic />;
};
