import { RouterProvider } from "react-router";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import Root from "./components/Root";
import { ErrorPage } from "./components/error-components";
import LandingPage from "./components/LandingPage";
function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index element={<LandingPage />} />
      </Route>
    )
  );

  return <RouterProvider router={routes} />;
}

export default App;
