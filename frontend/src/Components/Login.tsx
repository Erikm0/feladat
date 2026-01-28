import {useState} from "react"

type StatusResponse = { user: null | { id: number; login: string; admin: boolean } };

export default function Login({onLoggedIn}: { onLoggedIn: () => void }) {
    const [login, setLogin] = useState("admin");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState<string | null>(null);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({login, password}),
            });

            if (!response.ok) throw new Error("Sikertelen Bejelentkezés");

            const statusFetch = await fetch("http://localhost:3000/api/auth/status", {
                credentials: "include",
            });

            const status: StatusResponse = await statusFetch.json();
            if (status.user) onLoggedIn();
        } catch (e) {
            setError("Hibás belépés");
        }
    }

    return (
        <form onSubmit={submit} className={"AuthForm"}>
            <h2 className={"Login"}>Login</h2>

            <div>
                <label>Login: </label>
                <br></br>
                <input className={"LoginInput"} type={"text"} onChange={(e) => setLogin(e.target.value)}/>
            </div>

            <div>
                <label>Password: </label>
                <br></br>
                <input className={"LoginInput"} type="password" onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <button className={"LoginButton"} type="submit">Belépés</button>

            {error && <p style={{color: "red"}}>{error}</p>}
        </form>
    );
}
