import * as _ from 'lodash'

export const dataStore = {
    ideen: null as any,
    influencer: null as any,
    orte: null as any,
    religionen: null as any,
    kategorien: null as any
}

async function init() {
    const headers = { "Content-Type": "application/json" };

    dataStore.kategorien = await fetch("https://db.youbeon.eu/kategorie/", { headers })
        .then((response) => response.json())
        .then((data) => {
            return data;
        });

    dataStore.orte = await fetch("https://db.youbeon.eu/ort/", { headers })
        .then((response) => response.json())
        .then((data) => {
            return data;
        });

    dataStore.ideen = await fetch("https://db.youbeon.eu/idee", { headers })
        .then((response) => response.json())
        .then((data) => {
            data.forEach(idea => {
                idea._color = "#f4e2a3"
            });
            return data
        });

    dataStore.religionen = await fetch("https://db.youbeon.eu/religion/", { headers })
        .then((response) => response.json())
        .then((data) => {
            return data
        });

    dataStore.influencer = await fetch("https://db.youbeon.eu/influencer/", { headers })
        .then((response) => response.json())
        .then((data) => {
            data.forEach(idea => {
                idea._color = "#daeee8"
            });
            return data;
        });
}

export const initialize = _.once(init)