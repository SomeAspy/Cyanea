import { readFile } from "fs";

export function readDB() {
    return new Promise((resolve, reject) => {
        readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        }
        );
    });
}

export function getServer(id) {
    return new Promise((resolve, reject) => {
        readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data).servers[id]);
            }
        }
        );
    });
}

export function getTopLevel(key) {
    return new Promise((resolve, reject) => {
        readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data)[key]);
            }
        }
        );
    });
}