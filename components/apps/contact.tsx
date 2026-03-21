import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

type SendState = 'idle' | 'sending' | 'success' | 'error';

function ContactApp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sendState, setSendState] = useState<SendState>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendState('sending');
        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                { from_name: name, from_email: email, subject, message },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );
            setSendState('success');
            setName(''); setEmail(''); setSubject(''); setMessage('');
        } catch {
            setSendState('error');
        }
    };

    const inputClass =
        'w-full bg-ub-grey text-ubt-grey text-sm px-3 py-2 rounded-md border border-white border-opacity-10 outline-none focus:border-ub-orange focus:border-opacity-80 transition-colors placeholder-gray-600';

    return (
        <div className="w-full h-full flex flex-col bg-ub-cool-grey text-ubt-grey overflow-auto">
            {/* App header bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white border-opacity-5 bg-ub-window-title">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-ub-orange flex-shrink-0" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <div>
                    <div className="text-white text-sm font-semibold">Contact Thang</div>
                    <div className="text-gray-400 text-xs">thangle.me &mdash; Open to opportunities</div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 flex-grow">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your name"
                            className={inputClass}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Subject</label>
                    <input
                        type="text"
                        required
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="Write your subject here"
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1.5 flex-grow">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">Message</label>
                    <textarea
                        required
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        rows={6}
                        className={inputClass + ' resize-none flex-grow'}
                        style={{ minHeight: '120px' }}
                    />
                </div>

                {/* Feedback */}
                {sendState === 'success' && (
                    <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400 bg-opacity-10 rounded-md px-3 py-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Message sent! I&apos;ll get back to you soon.
                    </div>
                )}
                {sendState === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400 bg-opacity-10 rounded-md px-3 py-2">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        Something went wrong. Please try again or email me directly.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={sendState === 'sending'}
                    className="self-end bg-ub-orange hover:bg-opacity-90 disabled:bg-opacity-50 text-white text-sm font-medium px-6 py-2 rounded-full transition-all duration-150 flex items-center gap-2"
                >
                    {sendState === 'sending' ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                            </svg>
                            Sending...
                        </>
                    ) : 'Send Message'}
                </button>
            </form>
        </div>
    );
}

export function displayContact() {
    return <ContactApp />;
}

export default ContactApp;
