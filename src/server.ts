import { app } from '.';
import { PORT } from './constants';
import { runDB } from './respositories/db';

try {
    (async () => {
        debugger;
        await runDB();

        app.listen(PORT, async () => {
            console.log(`Example app listening on port ${PORT}`);
        });
    })();
} catch (error) {
    console.error(error);
}
