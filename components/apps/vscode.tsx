import React from 'react';

export default function VsCode(): React.ReactNode {
    return (
        <iframe src="https://github1s.com/thangsauce/portfolio/blob/HEAD/" frameBorder="0" title="VsCode" className="h-full w-full bg-ub-cool-grey"></iframe>
    );
}

export const displayVsCode = (): React.ReactNode => {
    return <VsCode />;
};
