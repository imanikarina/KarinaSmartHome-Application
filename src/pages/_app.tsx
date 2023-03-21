import React from 'react';
import 'tailwindcss/tailwind.css';
import {GlobalStyles} from 'twin.macro';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}
