import {useEffect, useState} from "react";
import Login from "./Components/Login";
import Persons from "./Components/Persons";
import Users from "./Components/Users";
import "./app.css"

type StatusResponse = { user: null | { id: number; login: string; admin: boolean } };

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [admin, setAdmin] = useState<boolean>(false);

    async function check() {
        const response = await fetch("http://localhost:3000/api/auth/status", {
            credentials: "include",
        });

        const status: StatusResponse = await response.json();

        if (status.user) {
            setLoggedIn(true);
            setAdmin(status.user.admin);
        } else {
            setLoggedIn(false);
            setAdmin(false);
        }
    }


    useEffect(() => {
        check();
    }, []);

    async function logout() {
        await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        setLoggedIn(false);
    }

    return (
        <>
            <h1>Mohanet feladat</h1>

            {loggedIn ? (
                <div className="App">
                    <div className={"LogOut"}>
                        <button onClick={logout}>Logout</button>
                    </div>
                    <div className={"AppForms"}>
                        <Persons/>

                        {admin && <Users/>}
                    </div>
                </div>
            ) : (
                <div className={"AuthDiv"}>
                    <Login onLoggedIn={check}/>
                </div>
            )}
        </>
    );
}
