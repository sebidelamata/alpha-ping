import App from "./Appcomponent/App";
import ErrorPage from './Appcomponent/components/ErrorPage'
import Home from "./Home/Home";
import Docs from "./Docs/Docs";

const routes = [
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorPage />
  },
  {
    path: "/app",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/docs",
    element: <Docs />,
    errorElement: <ErrorPage />
  },
];

export default routes;