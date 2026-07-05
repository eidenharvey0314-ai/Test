import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());

app.use(express.static("."));

const client = new OpenAI({

apiKey:"YOUR_API_KEY"

});

app.post("/ask", async(req,res)=>{

const response = await client.responses.create({

model:"gpt-5",

input:req.body.message

});

res.json({

reply:response.output_text

});

});

app.listen(3000);
