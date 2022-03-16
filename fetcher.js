const request = require("request");
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const url = process.argv[2];
const path = process.argv[3];


const checkExist = (path) => {

  try {
    if (fs.existsSync(path)) {

      rl.question(`${path} already exists. Would you like to override its contents? (y/n) `, (answer) => {
        if (answer.toLowerCase() === 'n' || answer.toLowerCase() === "no") {
          console.log("Will NOT override existing file. Exiting program...");
          rl.close();
          return;
        }

        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === "yes") {

          request(url, (error, response, body) => {

            if (error) {
              console.log("Not a valid URL. Exiting program....");
              rl.close();
              return;
            }

            writeToFile(body, printCompletionMessage, path);

          });

          return;
        }

        console.log(`${answer} is not a valid response. Exiting program...`);
        rl.close();
        return;
      });
    } else {
      console.log("File path is invalid. Exiting program...");
      rl.close();
      return;
    }

  } catch (error) {
    console.log("File does not exist. Exiting program...");
    rl.close();
    return;
  }

}

const writeToFile = (body, f, path) => {
  fs.writeFile(path, body, err => {
    if (err) {
      console.log(err);
      return;
    }

    f(path);
  })
}

const printCompletionMessage = (path) => {
  fs.stat(path, (err, stats) => {
    if (err) {
      console.log("File doesn't exist");
      return;
    }

    console.log(`Downloaded and saved ${stats.size} bytes to ${path}`);
    rl.close();
  })
}

rl.on("close", () => {
  process.exit();
})

checkExist(path);