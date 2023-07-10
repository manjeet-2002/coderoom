const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath,{recursive:true});
}
const executeCpp = (filepath) =>{

    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath,`${jobId}.exe`);

    return new Promise((resolve,reject) => {

        exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe`,
        (err,stdout,stderr) =>{
            err && reject({err,stderr});
            stderr && reject(stderr);
            resolve(stdout);
            
            try {
                fs.unlinkSync(outPath);
              
                console.log("Deleted output File successfully.");
              } catch (error) {
                console.log(error);
              }
              try {
                fs.unlinkSync(filepath);
              
                console.log("Deleted cpp File successfully.");
              } catch (error) {
                console.log(error);
              }
            
        });
    });
};

module.exports = {
    executeCpp,
}