import React from 'react';
import { AppConfig } from '../../apps.config';
import WALLPAPERS from '../../wallpapers.config';

interface AllApplicationsProps {
    apps: AppConfig[];
    recentApps?: string[];
    openApp: (id: string) => void;
    bg_image_name: string;
}

interface AllApplicationsState {
    query: string;
    apps: AppConfig[];
}

export class AllApplications extends React.Component<AllApplicationsProps, AllApplicationsState> {
    constructor(props: AllApplicationsProps) {
        super(props);
        this.state = {
            query: '',
            apps: [],
        };
    }

    componentDidMount() {
        this.setState({ apps: this.props.apps });
    }

    componentDidUpdate(prevProps: AllApplicationsProps) {
        if (prevProps.apps !== this.props.apps) {
            this.setState({ apps: this.props.apps });
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        this.setState({
            query: q,
            apps: q === '' ? this.props.apps
                : this.props.apps.filter(a => a.title.toLowerCase().includes(q.toLowerCase())),
        });
    };

    getRecentApps(): AppConfig[] {
        const { recentApps = [], apps } = this.props;
        return recentApps
            .map(id => apps.find(a => a.id === id))
            .filter((a): a is AppConfig => Boolean(a))
            .slice(0, 4);
    }

    render() {
        const recentApps = this.state.query ? [] : this.getRecentApps();

        return (
            <div className="absolute h-full top-7 left-16 right-0 z-40 flex flex-col items-center overflow-y-auto pb-10" style={{ backgroundColor: '#1e1e1e' }}>

                {/* Search bar */}
                <div className="flex items-center mt-8 mb-6 w-full max-w-sm px-4">
                    <div className="flex w-full items-center px-4 py-2 rounded-full" style={{ backgroundColor: '#2e2e2e', border: '1px solid #3a3a3a' }}>
                        <svg className="w-4 h-4 flex-shrink-0 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        <input
                            className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
                            placeholder="Type to search"
                            value={this.state.query}
                            onChange={this.handleChange}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Desktop preview */}
                {!this.state.query && (
                    <div className="flex justify-center mb-8 px-4 mt-5">
                        <div style={{ width: 260, height: 163 }}>
                            <img
                                src={WALLPAPERS[this.props.bg_image_name] || WALLPAPERS['wall-1']}
                                alt="Desktop preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}


                {/* All apps grid */}
                <div className="w-full max-w-4xl px-4 mt-16 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {this.state.apps.map((app, index) => {
                        const handleOpen = () => {
                            if (app.isExternalApp && app.url) {
                                window.open(app.url, '_blank');
                            } else {
                                this.props.openApp(app.id);
                            }
                        };
                        return (
                        <div
                            key={index}
                            onClick={handleOpen}
                            className="flex flex-col items-center justify-start p-2 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors select-none"
                            data-context="desktop-app"
                            data-app-id={app.id}
                        >
                            <img
                                src={app.icon}
                                className="w-14 h-14 mb-1 object-contain"
                                alt={app.title}
                            />
                            <span className="text-white text-xs text-center leading-tight line-clamp-2 max-w-full">{app.title}</span>
                        </div>
                        );
                    })}
                </div>

            </div>
        );
    }
}

export default AllApplications;
