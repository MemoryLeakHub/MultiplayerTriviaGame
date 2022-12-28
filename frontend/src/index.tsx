import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css"
import App from "./App";
import { SnackbarProvider} from 'notistack'
const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
    <SnackbarProvider>
    <App />
    </SnackbarProvider>
);