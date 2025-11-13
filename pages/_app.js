import '@/styles/globals.css';
import { BrandProvider } from '@/context/BrandContext';

function MyApp({ Component, pageProps }) {
  return (
    <BrandProvider>
      <Component {...pageProps} />
    </BrandProvider>
  );
}

export default MyApp;
