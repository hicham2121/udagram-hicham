import express, { NextFunction, Router, Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";


(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get(
    "/filteredimage",
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("============= default 1============== ");

      //get the url from the query
      let image_url: string = (await req.query.image_url) as string;

      // 1. validate the image_url query
      if (!image_url) {
        return res.status(422).send({ message: "no valide image url, " });
      }
      console.log("======== image_url ==========");
      console.log(image_url);

      let absolutePath: string;
      // 2. call filterImageFromURL(image_url) to filter the image
      try {
        absolutePath = await filterImageFromURL(image_url);
        console.log("======= resultFiltredmagePath =======");
        console.log(absolutePath);
        // 3. send the resulting file in the response
        return await res.status(200).sendFile(absolutePath, (error: Error) => {
          deleteLocalFiles([absolutePath]);
          if (error) {
            //no such file or directory,

            return res.status(400).send(error.message);
          }
        });
      } catch (error) {
        return next(error);
      }
    }
  );

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
