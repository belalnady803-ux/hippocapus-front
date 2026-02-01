const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
    const siteTitle = "Hippocampus";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            {url && <meta property="og:url" content={url} />}
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            {image && <meta property="og:image" content={image} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            {url && <meta property="twitter:url" content={url} />}
            <meta property="twitter:title" content={fullTitle} />
            {description && <meta property="twitter:description" content={description} />}
            {image && <meta property="twitter:image" content={image} />}
        </>
    );
};

export default SEO;
