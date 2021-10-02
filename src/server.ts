import express, { response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  
  app.get( "/filteredimage", async ( req, res ) => {
    

      //get the url from the query
      const image_url = req.query.image_url;

      // 1. validate the image_url query
      if (!image_url) {
        return res.status(404).send({message: 'no valide url, '});
      }
      console.log("======== image_url ==========");
      console.log(image_url);


      // 2. call filterImageFromURL(image_url) to filter the image
      const resultFiltredmagePath = await filterImageFromURL(image_url);

      
      console.log("======= resultFiltredmagePath =======");
      console.log(resultFiltredmagePath);

      // 3. send the resulting file in the response
       

      res.sendFile(resultFiltredmagePath,  (err)=> {

        // 4. deletes any files on the server on finish of the response
         deleteLocalFiles([resultFiltredmagePath]);

        if (err) {  

          //no such file or directory,

          return res.status(400).send(err.message);
        }  
    });

    
     
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();