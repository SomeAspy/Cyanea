const dbLocation = "./db/db.json"

import { writeFileSync, readFile } from "fs";

export function writeDB(data) {
    try {
        new Promise((resolve, reject) => {
            writeFileSync(dbLocation, JSON.stringify(data, null, 4), (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
    catch (err) {
        console.log(err);
    }
}



export function readDB() {
    try {
        return new Promise((resolve, reject) => {
            readFile(dbLocation, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            }
            );
        });
    }
    catch (err) {
        console.log(err);
    }
}

export function getServer(id) {
    try {
        return new Promise((resolve, reject) => {
            readFile(dbLocation, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data).servers[id]);
                }
            }
            );
        });
    }
    catch (err) {
        console.log(err);
    }
}

export function getTopLevel(key) {
    try {
        return new Promise((resolve, reject) => {
            readFile(dbLocation, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data)[key]);
                }
            }
            );
        });
    }
    catch (err) {
        console.log(err);
    }
}

export function isUserBlocked(userID, serverID) {
    try {
        getServer(serverID).then((server) => {
            if (server.userFilter.blacklist.includes(userID)) {
                return true;
            } else if (server.userFilter.whitelistEnabled) {
                if (server.userFilter.whitelist.includes(userID)) {
                    return false;
                } else {
                    return true;
                }
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

export function setTopLevel(key, value) {
    try {
        return new Promise((resolve, reject) => {
            readFile(dbLocation, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const db = JSON.parse(data);
                    db[key] = value;
                    resolve(db);
                }
            }
            );
        });
    }
    catch (err) {
        console.log(err);
    }

}

export function setServerKey(id, key, value) {
    try {
        return new Promise((resolve, reject) => {
            readFile(dbLocation, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const db = JSON.parse(data);
                    db.servers[id][key] = value;
                    resolve(db);
                }
            }
            );
        });
    }
    catch (err) {
        console.log(err);
    }
}

export function newServerKey(id, key, newKeyName, value) {
    try {
        return new Promise((resolve, reject) => {
            readFile(dbLocation, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const db = JSON.parse(data);
                    db.servers[id][key][newKeyName] = value;
                    writeDB(db);
                    if (db.servers[id][key][newKeyName] == value) {
                        resolve();
                    } else {
                        reject("Failed to write new key");
                    }
                }
            }
            );
        });
    }
    catch (err) {
        console.log(err);
    }
}