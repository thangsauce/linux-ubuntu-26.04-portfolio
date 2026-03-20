import React, { Component, KeyboardEvent, ChangeEvent } from 'react';

interface FirefoxState {
    url: string;
    display_url: string;
}

export class Firefox extends Component<Record<string, never>, FirefoxState> {
    private home_url: string;

    constructor(props: Record<string, never>) {
        super(props);
        this.home_url = './duckduckgo.html';
        this.state = {
            url: './duckduckgo.html',
            display_url: './duckduckgo.html',
        };
    }

    componentDidMount(): void {
        const lastVisitedUrl = localStorage.getItem('firefox-url');
        const lastDisplayedUrl = localStorage.getItem('firefox-display-url');
        if (lastVisitedUrl !== null && lastVisitedUrl !== undefined) {
            this.setState({ url: lastVisitedUrl, display_url: lastDisplayedUrl ?? lastVisitedUrl }, this.refreshFirefox);
        }
    }

    storeVisitedUrl = (url: string, display_url: string): void => {
        localStorage.setItem('firefox-url', url);
        localStorage.setItem('firefox-display-url', display_url);
    };

    refreshFirefox = (): void => {
        const screen = document.getElementById('firefox-screen') as HTMLIFrameElement | null;
        if (screen) screen.src += '';
    };

    goToHome = (): void => {
        this.setState({ url: this.home_url, display_url: './duckduckgo.html' });
        this.refreshFirefox();
    };

    checkKey = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            let url = (e.target as HTMLInputElement).value;
            let display_url = '';

            url = url.trim();
            if (url.length === 0) return;

            if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                url = 'https://' + url;
            }

            url = encodeURI(url);
            display_url = url;
            this.setState({ url, display_url: url });
            this.storeVisitedUrl(url, display_url);
            (document.getElementById('firefox-url-bar') as HTMLInputElement | null)?.blur();
        }
    };

    handleDisplayUrl = (e: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ display_url: e.target.value });
    };

    displayUrlBar = (): React.JSX.Element => {
        return (
            <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900">
                <div onClick={this.refreshFirefox} className=" ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
                    <img className="w-5" src="./themes/Yaru/status/chrome_refresh.svg" alt="Firefox Refresh" />
                </div>
                <div onClick={this.goToHome} className=" mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
                    <img className="w-5" src="./themes/Yaru/status/chrome_home.svg" alt="Firefox Home" />
                </div>
                <input
                    onKeyDown={this.checkKey}
                    onChange={this.handleDisplayUrl}
                    value={this.state.display_url}
                    id="firefox-url-bar"
                    className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 w-5/6 text-gray-300 focus:text-white"
                    type="url"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
        );
    };

    render(): React.JSX.Element {
        return (
            <div className="h-full w-full flex flex-col bg-ub-cool-grey">
                {this.displayUrlBar()}
                <iframe src={this.state.url} className="flex-grow" id="firefox-screen" frameBorder="0" title="Firefox"></iframe>
            </div>
        );
    }
}

export default Firefox;

export const displayFirefox = (): React.JSX.Element => {
    return <Firefox />;
};
