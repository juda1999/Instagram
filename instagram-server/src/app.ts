import { initApp } from "./server";
import http from 'http';
import https from 'https';
import fs from 'fs';

const port = process.env.PORT;
initApp().then(
    (app) =>  {
        if(process.env.NODE_ENV !== 'Prod') {
            console.log(process.env.NODE_ENV);
            console.log('This is development mode :)');
        http.createServer(app).listen(port, () => console.log(`App is listening on port: ${port}`));
        } else {
            const options = {
                key: fs.readFileSync('./client-key.pem'),
                cert: fs.readFileSync('./client-cert.pem')
            }
            https.createServer(options, app).listen(port, () => console.log(`App is listening on port: ${port}`));
            console.log('This is production mode :D');
        }
    })