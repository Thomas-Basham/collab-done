import "../styles/globals.css";
import Layout from "../components/layout";
import { AuthProvider } from "../contexts/auth";

import { RealTimeProvider } from "../contexts/RealTime";
import GithubCorner from "react-github-corner";

import ThemeProvider from "react-bootstrap/ThemeProvider";
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <RealTimeProvider>
        <ThemeProvider
          breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
          minBreakpoint="s"
        >
          <Layout>
            <Component {...pageProps} />

            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
              integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
              crossOrigin="anonymous"
            />
          </Layout>
          <GithubCorner href="https://github.com/Thomas-Basham/collab-done" />
        </ThemeProvider>
      </RealTimeProvider>
    </AuthProvider>
  );
}

export default MyApp;
