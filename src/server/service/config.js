import bodyParser from 'body-parser';
import animalRouter from '../routes/animal.js'

function config(app) {
    
    // Parse JSON bodies and URL-encoded bodies
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api/animals', animalRouter);

    let helloContent = `<!DOCTYPE html><html lang=\"en-us\"><head><title>INFT 2202</title></head><body><main><h1>Hello from Express</h1><p>at ${new Date()}</p></main></body></html>`;
    app.get("/hello", (req, res) => {
        res.send(helloContent);
    }); 
}

export default config;