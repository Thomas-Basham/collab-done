import "../styles/globals.css";
import Layout from "../components/layout";
import { AuthProvider } from "../contexts/auth";

import { MessageProvider } from "../contexts/Store";
import GithubCorner from "react-github-corner";

import ThemeProvider from "react-bootstrap/ThemeProvider";
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MessageProvider>
        <ThemeProvider
          breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
          minBreakpoint="xxs"
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
      </MessageProvider>
    </AuthProvider>
  );
}

export default MyApp;
