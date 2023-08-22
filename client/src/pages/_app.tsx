import { type AppType } from "next/app";
import "~/styles/globals.css";
import Layout from "~/components/UI/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};


export default MyApp

