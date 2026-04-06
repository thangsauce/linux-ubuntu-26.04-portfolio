import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Meta(): React.ReactNode {
    const { basePath } = useRouter();

    return (
        <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <base href={`${basePath || ''}/`} />
            <title>Thang&apos;s Ubuntu 26.04 LTS Desktop</title>
            <meta name="description" content="Ubuntu 26.04 LTS 'Resolute Raccoon' — Thang Le's interactive portfolio" />
            <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon-raccoon.svg`} />
        </Head>
    );
}
