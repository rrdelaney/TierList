import React from 'react';
import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';

function TierListApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default TierListApp;
