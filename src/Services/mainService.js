import { DailyRequest } from "../../config.json";
import http from "./httpService";


export async function getTestServer() { 
    return await http.get(DailyRequest);
}



  
  