const fs = require('fs');

function single_fn(dest) {
    if (dest === "") {
        dest = "tmp";
    }

    return function(req, _res, next, name){
        // if the destination directory does not exist, create it
        if (!fs.existsSync(dest)){
            fs.mkdirSync(dest, {recursive: true});
        }

        if (req === null || req.body === undefined || req.body === null){
            next();
            return;
        }

        let file = req.body.file;
        if (file === undefined){
            next();
            return;
        }

        // Check if file has a File constructor
        if (file.constructor.name !== 'File') {
            next();
            return;
        }

        file.arrayBuffer().then((buffer) => {
            // Create a Uint8Array from the buffer
            const uint8Array = new Uint8Array(buffer);
          
            // Write the file to the destination directory
            const filePath = `${dest}/${file.name}`;
            fs.writeFileSync(filePath, uint8Array);
          
            // Set the file to the request body
            req.file = file;
          
            // Continue to the next middleware/handler
            next();
          });
    }
}

function array_fn(dest){
    if (dest === "") {
        dest = "tmp";
    }

    return function(req, _res, next, name){
        if (!fs.existsSync(dest)){
            fs.mkdirSync(dest, {recursive: true});
        }

        if (req.body === undefined || req.body === null){
            next();
            return;
        }

        let files = body.getAll(name);
        if (files === undefined){
            next();
            return;
        }

        let fileArray = [];
        for (let file of files){
            if (file.constructor.name !== 'File') {
                continue;
            }

            file.arrayBuffer().then((buffer) => {
                const uint8Array = new Uint8Array(buffer);
                const filePath = `${dest}/${file.name}`;
                fs.writeFileSync(filePath, uint8Array);
                fileArray.push(file);
            });
        }

        req.set('files', fileArray);
        next();
    };
}

module.exports = { single_fn, array_fn };