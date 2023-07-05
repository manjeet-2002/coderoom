const express = require('express');
const app = express();
const {generateFile} = require('./generateFile');
const {executeCpp} = require('./executeCpp');
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.get("/",(req,res)=>{
    return res.json({hello: "hello world"});
});

app.post("/run", async (req,res)=>{

    const {language="cpp",content} = req.body;
    if(content===undefined){
        return res.status(400).json({success:false,error:"Empty code body"});
    }
    try{
    const filepath = await generateFile(language,content);
    const codeOutput = await executeCpp(filepath);
    return res.json({filepath,codeOutput});
    } catch(err){
        res.status(500).json({err});
    }

});

app.listen(3001,()=>{
    console.log(`listening on 3001`);
});