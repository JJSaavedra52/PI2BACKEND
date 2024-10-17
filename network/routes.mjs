import { router as user } from "../components/user/network.mjs"; 
import { router as anoun } from "../components/anouncements/network.mjs";
import { router as complex } from "../components/complex/network.mjs";
import { router as pqrs } from "../components/pqrs/network.mjs";
// import { router as ai } from "../components/ai/network.mjs";
import { router as ai2 } from "../components/ai2/network.mjs";

const routes = (server) => {
    server.use('/user', user);
    server.use('/anouncements', anoun);
    server.use('/complex', complex);
    server.use('/pqrs', pqrs);
    // server.use('/ai', ai);
    server.use('/ai2', ai2);
}

export default routes;