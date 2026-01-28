import { useEffect, useState } from "react";

type PersonRow = {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    comment: string | null;
    company_id: number;
    company_name: string;
};

export default function Persons() {
    const [persons, setPersons] = useState<PersonRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [companyRef, setCompanyRef] = useState(1);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");

    async function load() {
        setError(null);
        try {
            const response = await fetch("http://localhost:3000/api/persons", {
                credentials: "include",
            });

            if (!response.ok) throw new Error("Nem felhatalmazott");

            const data = await response.json();
            setPersons(data);
        } catch (e) {
            setError("Nem sikerült lekérni a személyeket (be vagy jelentkezve?)");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function addPerson(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            const r = await fetch("http://localhost:3000/api/persons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    company_ref: companyRef,
                    phone: phone,
                    email: email,
                    comment:comment
                }),
            });

            if (!r.ok) throw new Error("Sikertelen");

            setName("");
            setPhone("");
            setEmail("");
            setComment("");
            await load();
        } catch (e) {
            setError("Nem sikerült felvenni (ellenőrizd a mezőket)");
        }
    }

    return (
        <div className={"AppForm"}>



            <h2>Persons</h2>
            <form onSubmit={addPerson}>
                <div>
                    <label>Név: </label>
                    <br></br>
                    <input value={name} onChange={(e) => setName(e.target.value)}/>
                </div>

                <div>
                    <label>Cég ID: </label>
                    <br></br>
                    <input
                        type="number"
                        value={companyRef}
                        onChange={(e) => setCompanyRef(Number(e.target.value))}
                        min={1}
                    />
                </div>

                <div>
                    <label>Telefon: </label>
                    <br></br>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>

                <div>
                    <label>Email: </label>
                    <br></br>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label>Comment: </label>
                    <br></br>
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}/>
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
                    <th>Cég</th>
                    <th>Telefon</th>
                    <th>Email</th>
                    <th>Comment</th>
                </tr>
                </thead>
                <tbody>
                {persons.map((person) => (
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.name}</td>
                        <td>
                            {person.company_name} (#{person.company_id})
                        </td>
                        <td>{person.phone ?? ""}</td>
                        <td>{person.email ?? ""}</td>
                        <td>{person.comment ?? ""}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
