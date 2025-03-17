import { Client, Storage, ID, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67d7bf35002b204c93ae"); // Replace with your Appwrite project ID

const storage = new Storage(client);
const database=new Databases(client)
export {database, storage, ID };