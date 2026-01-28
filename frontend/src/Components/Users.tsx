import { useEffect, useState } from "react";

type UserRow = {
    id: number;
    person_id: number;
    person_name: string;
    login: string;
    password: string | null;
    admin: boolean;
};


export default function Users(){
    const [users, setUsers] = useState<UserRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [personRef, setPersonRef] = useState(1);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setAdmin] = useState(false);

    async function load() {
        setError(null);
        try {
            const response = await fetch("http://localhost:3000/api/users", {
                credentials: "include",
            });

            if (!response.ok) throw new Error("Nem felhatalmazott");

            const data = await response.json();
            setUsers(data);
        } catch (e) {
            setError("Nem sikerült lekérni a személyeket (be vagy jelentkezve?)");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function addUser(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            const r = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    person_ref: personRef,
                    login: login,
                    password: password,
                    admin: admin,
                }),
            });

            if (!r.ok) throw new Error("Sikertelen");

            setLogin("");
            setPassword("");
            setAdmin(false);

            await load();
        } catch (e) {
            setError("Nem sikerült felvenni (ellenőrizd a mezőket)");
        }
    }

    return (
        <div className={"AppForm"}>



            <h2>Users</h2>
            <form onSubmit={addUser}>
                <div>
                    <label>Személy ID: </label>
                    <br></br>
                    <input type="number" value={personRef} onChange={(e) => setPersonRef(Number(e.target.value))} min={1}/>
                </div>

                <div>
                    <label>Felhasználó név: </label>
                    <br></br>
                    <input value={login} onChange={(e) => setLogin(e.target.value)}/>
                </div>

                <div>
                    <label>Jelszó: </label>
                    <br></br>
                    <input type={"password"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div>
                    <label>Admin: </label>
                    <br></br>
                    <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)}/>
                </div>
                <button type="submit">Hozzáadás</button>
            </form>

            {error && <p style={{color: "red"}}>{error}</p>}

            <h3>Lista</h3>
            <table border={1} cellPadding={8}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Név</th>
                    <th>Felhasználó név</th>
                    <th>Admin</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.person_name} (#{u.person_id})</td>
                        <td>{u.login}</td>
                        <td>{u.admin ? "igen" : "nem"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}