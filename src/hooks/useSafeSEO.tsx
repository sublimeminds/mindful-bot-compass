
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const useSafeSEO = ({ title, description, keywords, image, url }: SEOProps) => {
  useEffect(() => {
    console.log('SEO meta tags applied:', { title, description, keywords });
  }, [title, description, keywords]);

  return {
    title,
    description,
    keywords,
    image,
    url
  };
};

export const SEOHelmet = ({ title, description, keywords, image, url }: SEOProps) => {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
    </Helmet>
  );
};
