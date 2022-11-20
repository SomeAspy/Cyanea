export const dbLocation = "./db/db.json"
import { writeFileSync, readFile } from "fs";

export function writeDB(data, __filename = "db.json") {
    new Promise((resolve, reject) => {
        writeFileSync('./db/' + __filename, JSON.stringify(data, null, 4), (err) => {
            if (err) reject(err);
            resolve();
        });
    }).catch(err => console.log(err));
}

export async function readDB() {
    return new Promise((resolve, reject) => {
        readFile(dbLocation, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        }
        );
    }).catch(err => console.log(err));
}

export function verifyServerKey(serverID, key) {
    let db = readDB();
    if (db[serverID] && db[serverID][key]) {
        return true;
    }
    else {
        return false;
    }
}

export async function getServerSettings(id) {
    return new Promise((resolve, reject) => {
        readFile(dbLocation, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data).servers[id]);
            }
        }
        );
    }).catch(err => console.log(err));
}

export async function getTopLevel(key) {
    return new Promise((resolve, reject) => {
        readFile(dbLocation, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data)[key]);
            }
        }
        );
    }).catch(err => console.log(err));
}

export async function isUserBlocked(userID, serverID) {
    await getServerSettings(serverID).then((server) => {
        if (server.userFilter.blacklist.includes(userID)) {
            return true;
        } else if (server.userFilter.whitelistEnabled) {
            if (server.userFilter.whitelist.includes(userID)) {
                return false;
            } else {
                return true;

            }
        }
    }).catch(err => console.log(err));
}

export async function setTopLevel(key, value) {
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
    }).catch(err => console.log(err));
}


export async function newServerKey(id, key, newKeyName, value) {
    return new Promise((resolve, reject) => {
        readFile(dbLocation, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const db = JSON.parse(data);
                db.servers[id][key][newKeyName] = value;
                writeDB(db);
                if (verifyServerKey(id, key)) {
                    resolve();
                } else {
                    reject("Failed to write new key");
                }
            }
        }
        );
    }).catch(err => console.log(err));
}

export async function delServerKey(id, key, delKeyName) {
    return new Promise((resolve, reject) => {
        readFile(dbLocation, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const db = JSON.parse(data);
                delete db.servers[id][key][delKeyName];
                writeDB(db);
                if (!verifyServerKey(id, key)) {
                    resolve();
                } else {
                    reject("Failed to delete key");
                }
            }
        }
        );
    }).catch(err => console.log(err));
}

export async function getServerSetting(id, key) {
    return new Promise((resolve, reject) => {
        getServerSettings(id).then((server) => {
            resolve(server[key]);
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}