import Head from 'next/head';

export default function Meta(): React.ReactNode {
    return (
        <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Thang&apos;s Desktop</title>
            <meta name="description" content="Thang's interactive Linux desktop portfolio" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}
