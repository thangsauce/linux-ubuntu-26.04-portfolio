import React from 'react';
import $ from 'jquery';
import WALLPAPERS from '../../wallpapers.config';

interface SettingsProps {
    changeBackgroundImage: (path: string) => void;
    currBgImgName: string;
}

export function Settings(props: SettingsProps): React.ReactNode {
    const wallpapers = WALLPAPERS;

    const changeBackgroundImage = (e: React.FocusEvent<HTMLDivElement>): void => {
        props.changeBackgroundImage($(e.target).data('path') as string);
    };

    return (
        <div className={'w-full flex-col flex-grow z-20 max-h-full overflow-y-auto windowMainScreen select-none bg-ub-cool-grey'}>
            <div
                className=" md:w-2/5 w-2/3 h-1/3 m-auto my-4"
                style={{
                    backgroundImage: `url(${wallpapers[props.currBgImgName]})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                }}
            ></div>
            <div className="flex flex-wrap justify-center items-center border-t border-gray-900">
                {
                    Object.keys(wallpapers).map((name, index) => {
                        return (
                            <div
                                key={index}
                                tabIndex={1}
                                onFocus={changeBackgroundImage}
                                data-path={name}
                                className={((name === props.currBgImgName) ? ' border-yellow-700 ' : ' border-transparent ') + ' md:px-28 md:py-20 md:m-4 m-2 px-14 py-10 outline-none border-4 border-opacity-80'}
                                style={{
                                    backgroundImage: `url(${wallpapers[name]})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center center',
                                }}
                            ></div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Settings;

export const displaySettings = (): React.ReactNode => {
    return <Settings changeBackgroundImage={() => {}} currBgImgName="wall-1" />;
};
