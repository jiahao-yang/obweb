const config = require('config');
const fs = require('fs');
const path = require('path')
var exec = require('child_process').exec;
const { resolve } = require('path');

const ROOTPATH = path.dirname(require.main.filename);
const OBPATH = resolve(config.get("ob"));
const DBPATH = resolve(config.get("db"));

function safeRead(file_path) {
    let msg = `Invalid file path: ${file_path}`;
    console.log("file_path: ", file_path)
        /* poison Null Bytes Attack */
    if (file_path.indexOf('\0') !== -1) {
        throw msg;
    }
    /* normalize user input */
    let safe_path = path.normalize(file_path).replace(/^(\.\.(\/|\\|$))+/, '');
    let p = resolve(safe_path);
    let parent = path.dirname(p);
    if (!parent.startsWith(ROOTPATH)) {
        throw msg;
    }
    return fs.readFileSync(p, 'utf-8');
}

function get_or(value, def) {
    return (value === null || value === undefined) ? def : value;
}

function strip_ob(path) {
    return path.replace(OBPATH + "/", "");
}

function gen_path(page, date) {
    let path = page == "" ? `${OBPATH}/Daily/${date}.md` : `${OBPATH}/Unsort/${page}.md`;
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, "", 'utf-8');
    }
    return path;
}

function runShell(command) {
    if (process.env.NODE_ENV == "test") {
        return;
    }
    let backup = process.cwd();
    try {
        process.chdir(OBPATH);
        let dir = exec(command, function(err, stdout, stderr) {
            if (err) {
                console.log(err);
            }
            console.log(stdout);
        });

        dir.on('exit', function(code) {
            // exit code is code
            if (code != 0) {
                console.log("exit code is " + code);
            }
        });
    } finally {
        process.chdir(backup);
    }
}

function gitPull() {
    runShell("git pull");
}

function gitSync() {
    runShell("git add . && git commit -m \"update\" && git push");
}

module.exports = {
    get_or,
    safeRead,
    strip_ob,
    gitPull,
    gitSync,
    gen_path
}