import Script from "next/script";

const Analytics = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-3QGZ3QJF0E"
        strategy="afterInteractive"
      />
      <Script id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3QGZ3QJF0E');
          `}
      </Script>
    </>
  );
};

export default Analytics;
