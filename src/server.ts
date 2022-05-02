import { app } from ".";
import { PORT } from "./constants";

app.listen(PORT, async () => {
    console.log(`Example app listening on port ${PORT}`);
});
