
  import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "./App";
import { DropFormControl } from "./components/messages/drop.form";
import { GrabFormControl } from "./components/messages/grap.form";
import { ErrorNotFound } from "./error-not-found";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App><DropFormControl/></App>,
        errorElement: <App><ErrorNotFound/></App>
    },
    {
        path: "/grab/:receiptId",
        element: <App><GrabFormControl/></App>,
        errorElement: <App><ErrorNotFound/></App>
    },
]);