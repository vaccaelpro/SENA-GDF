import Sidebar_admin from "./sidebar_admin";
import Header_admin from "./header_admin";
import "../css/layout_admin.css"
import { Outlet } from "react-router-dom";

const Layout_admin = () =>{
    return(
        <>
            <Sidebar_admin />
            <Header_admin />
            {}
            <main className="main-contente">
                <Outlet />
            </main>
        </>
    );
};

export default Layout_admin;