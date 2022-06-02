import * as _ from 'lodash'

export const dataStore = {
    ideen: null as any,
    influencer: null as any,
    orte: null as any,
    religionen: null as any,
    kategorien: null as any
}

export const info_popUp =
{
    para1: "Die YouBeOn Map nimmt Sie mit in die Lebenswelten religiöser, junger Menschen aus Wien. Auf drei Ebenen können Sie Orte und Instagram-Accounts, die den Jugendlichen wichtig sind, und die damit verbundenen Ideen erkunden.",
    para2: " Die Daten stammen aus 41 Interviews mit Menschen aus sieben religiösen Traditionen. Die YouBeOn Map zeigt, was den Teilnehmenden zum Zeitpunkt der Interviews on- und offline wichtig war, welche Ideen sie teilen und was spezifisch für ihre Religionstraditionen ist. Probieren Sie die YouBeOn Map einfach aus! Nähere Infos zu den Funktionen finden Sie außerdem hier."
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