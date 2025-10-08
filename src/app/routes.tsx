import {createBrowserRouter} from "react-router-dom";
import Home from "../pages/Home/Home.tsx";
import App from "./App.tsx";
import Login from "../pages/Login/Login.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
        ],
    },
]);