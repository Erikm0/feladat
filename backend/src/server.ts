import app from "./app";
import "./session-user";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend fut: http://localhost:${PORT}`);
});
