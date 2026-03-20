import React from 'react';

export default function Todoist(): React.ReactNode {
    return (
        <iframe src="https://todoist.com/showProject?id=220474322" frameBorder="0" title="Todoist" className="h-full w-full"></iframe>
        // just to bypass the headers 🙃
    );
}

export const displayTodoist = (): React.ReactNode => {
    return <Todoist />;
};
