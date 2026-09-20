import Head from 'next/head'
import { SITE_URL, SITE_NAME, OG_IMAGE_PATH, OG_IMAGE_ALT } from '../lib/site'

export default function Seo({ title, description, path = '/', noindex = false }) {
    const url = new URL(path, SITE_URL).toString()
    const imageUrl = new URL(OG_IMAGE_PATH, SITE_URL).toString()

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            {noindex && <meta name="robots" content="noindex" />}
            <link rel="canonical" href={url} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={OG_IMAGE_ALT} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </Head>
    )
}
