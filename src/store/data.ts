import { accounts, ideas, places, interviews, religions } from "@/db";

/**
 * Currently, we store imported data in different shapes than api responses
 * from db.youbeon.eu which the app assumes.
 *
 * `id` fields were changed from number to string, but this should be fine.
 *
 * Also, some unused fields were dropped.
 *
 * Note that "kategorien" are always empty api responses.
 */

interface ApiAccount {
  id: string;
  name: string;
  idee: Array<ApiIdea["id"]>;
  //   trueReligion: boolean
  religion: Array<ApiReligion["id"]>;
  interviews: Array<string>;
  kategorie: [];
  mentions: number;
  link: string;
  _color: string;
}

interface ApiIdea {
  id: string;
  name: string;
  cooccurence: Array<ApiIdea["name"]>;
  interviews: Array<string>;
  zitate: Array<string>;
  _color: string;
}

interface ApiPlace {
  id: string;
  bezeichnung: string;
  koordinate_l: string;
  koordinate_b: string;
  idee: Array<ApiIdea["id"]>;
  religion: Array<ApiReligion["id"]>;
  interview: Array<string>;
}

interface ApiReligion {
  id: string;
  name: string;
}

export const dataStore = {
  ideen: [] as Array<ApiIdea>,
  influencer: [] as Array<ApiAccount>,
  orte: [] as Array<ApiPlace>,
  religionen: [] as Array<ApiReligion>,
  kategorien: [],
};

export const info_popUp = {
  para1:
    "Die YouBeOn Map nimmt Sie mit in die Lebenswelten religiöser, junger Menschen aus Wien. Auf drei Ebenen können Sie Orte und Instagram-Accounts, die den Jugendlichen wichtig sind, und die damit verbundenen Ideen erkunden.",
  para2:
    " Die Daten stammen aus 41 Interviews mit Menschen aus sieben religiösen Traditionen. Die YouBeOn Map zeigt, was den Teilnehmenden zum Zeitpunkt der Interviews on- und offline wichtig war, welche Ideen sie teilen und was spezifisch für ihre Religionstraditionen ist. Probieren Sie die YouBeOn Map einfach aus! Nähere Infos zu den Funktionen finden Sie außerdem hier.",
};

export async function initialize(): Promise<void> {
  dataStore.influencer = Array.from(accounts.values()).map((account) => {
    return {
      id: account.key,
      name: account.label,
      idee: Array.from(account.ideas),
      link: `https://instagram.com/${account.label}`,
      mentions: account.mentions,
      religion: Array.from(account.religions),
      /** The current api stored only the "religion" part of an interview identifier here. */
      interviews: Array.from(account.interviews).map((interview) => {
        return interview.split("-")[1];
      }),
      kategorie: [],
      _color: "#daeee8",
    };
  });

  dataStore.orte = Array.from(places.values()).map((place) => {
    return {
      id: place.key,
      bezeichnung: place.label,
      koordinate_l: String(place.coordinates.lng),
      koordinate_b: String(place.coordinates.lat),
      idee: Array.from(place.ideas),
      religion: Array.from(place.religions),
      /** Note that these are the full interview identifiers. */
      interview: Array.from(place.interviews),
    };
  });

  dataStore.ideen = Array.from(ideas.values()).map((idea) => {
    return {
      id: idea.key,
      name: idea.label,
      cooccurence: Array.from(idea.ideas).map((key) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return ideas.get(key)!.label;
      }),
      /** The current api stored only the "religion" part of an interview identifier here. */
      interviews: Array.from(idea.interviews).map((interview) => {
        return interview.split("-")[1];
      }),
      zitate: idea.quotes,
      _color: "#f4e2a3",
    };
  });

  dataStore.religionen = Array.from(religions.values()).map((religion) => {
    return {
      id: religion.key,
      name: religion.label,
    };
  });
}
