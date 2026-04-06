import React, { Component } from 'react';
import $ from 'jquery';

interface TrashProps {
    changeTrashIcon?: (empty: boolean) => void;
    trash_empty?: boolean;
}

interface TrashState {
    empty: boolean;
}

interface TrashItem {
    name: string;
    icon: string;
}

export class Trash extends Component<TrashProps, TrashState> {
    private trashItems: TrashItem[];

    constructor(props: TrashProps) {
        super(props);
        this.trashItems = [
            { name: 'my social life', icon: './themes/Yaru/system/folder.png' },
            { name: 'diet plan.zip', icon: './themes/filetypes/zip.png' },
            { name: 'sleep schedule', icon: './themes/Yaru/system/folder.png' },
            { name: 'node_modules', icon: './themes/Yaru/system/folder.png' },
            { name: "ex's number.php", icon: './themes/filetypes/php.png' },
            { name: 'project_FINAL_v2_ACTUAL_FINAL_fixed', icon: './themes/Yaru/system/folder.png' },
            { name: 'my will to live.js', icon: './themes/filetypes/js.png' },
            { name: 'homework', icon: './themes/Yaru/system/folder.png' },
            { name: 'gym_motivation.zip', icon: './themes/filetypes/zip.png' },
            { name: 'free time', icon: './themes/Yaru/system/folder.png' },
        ];
        this.state = {
            empty: false,
        };
    }

    componentDidMount(): void {
        const wasEmpty = localStorage.getItem('trash-empty');
        if (wasEmpty === 'true') this.setState({ empty: true });
    }

    focusFile = (e: React.FocusEvent<HTMLDivElement>): void => {
        // icon
        $(e.target).children().get(0)?.classList.toggle('opacity-60');
        // file name
        $(e.target).children().get(1)?.classList.toggle('bg-ub-orange');
    };

    emptyTrash = (): void => {
        this.setState({ empty: true });
        localStorage.setItem('trash-empty', 'true');
        if (this.props.changeTrashIcon) this.props.changeTrashIcon(true);
    };

    restoreTrash = (): void => {
        this.setState({ empty: false });
        localStorage.removeItem('trash-empty');
        if (this.props.changeTrashIcon) this.props.changeTrashIcon(false);
    };

    emptyScreen = (): React.ReactNode => {
        return (
            <div className="flex-grow flex flex-col justify-center items-center cursor-default">
                <img className=" w-24" src="./themes/Yaru/status/user-trash-symbolic.svg" alt="Ubuntu Trash" />
                <span className="font-bold mt-4 text-xl px-1 text-gray-400">Trash is Empty</span>
            </div>
        );
    };

    showTrashItems = (): React.ReactNode => {
        return (
            <div className="flex-grow p-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-2 md:gap-x-4 items-start content-start overflow-y-auto windowMainScreen cursor-default">
                {
                    this.trashItems.map((item, index) => {
                        return (
                            <div key={index} tabIndex={1} onFocus={this.focusFile} onBlur={this.focusFile} className="flex flex-col items-center text-sm outline-none w-full px-1 cursor-default">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={item.icon} alt="Ubuntu File Icons" />
                                </div>
                                <span className="text-center rounded px-0.5 w-full break-all">{item.name}</span>
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    render(): React.ReactNode {
        return (
            <div className="relative z-20 w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
                <div className="flex items-center justify-between w-full bg-ub-warm-grey bg-opacity-40 text-sm">
                    <span className="font-bold ml-2">Trash</span>
                    <div className="flex">
                        <div onClick={this.restoreTrash} className="border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded hover:bg-opacity-80 cursor-pointer" style={{ cursor: 'pointer' }}>Restore</div>
                        <div onClick={this.emptyTrash} className="border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded hover:bg-opacity-80 cursor-pointer" style={{ cursor: 'pointer' }}>Empty</div>
                    </div>
                </div>
                {
                    this.state.empty
                        ? this.emptyScreen()
                        : this.showTrashItems()
                }
            </div>
        );
    }
}

export default Trash;

export const displayTrash = (): React.ReactNode => {
    return <Trash />;
};
