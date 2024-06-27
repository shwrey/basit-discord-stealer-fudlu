const { exec } = require('child_process');

exec('javascript-obfuscator fetch-info.js --output fetch-info-obfuscated.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error: ${err.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
