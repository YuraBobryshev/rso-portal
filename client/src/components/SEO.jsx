import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, type = 'website', image, url }) {
  const defaultTitle = 'Студенческие Отряды Севастополя | СевРО РСО';
  const siteTitle = title ? `${title} | СевРО РСО` : defaultTitle;
  
  const siteDescription = description || 'Главное молодежное движение Севастополя. Мы строим города, воспитываем детей, спасаем жизни и путешествуем по всей стране.';
  
  // Дефолтная картинка для репостов (залей красивую обложку в S3 или public и вставь сюда ссылку)
  const siteImage = image || 'https://xn--b1af2ahcd.xn--p1ai/default-og.jpg'; 
  const siteUrl = url ? `https://xn--b1af2ahcd.xn--p1ai${url}` : 'https://xn--b1af2ahcd.xn--p1ai';

  return (
    <Helmet>
      {/* Базовые теги */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />

      {/* Open Graph (VK, Telegram, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content="СевРО РСО" />

      {/* Карточки Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
    </Helmet>
  );
}