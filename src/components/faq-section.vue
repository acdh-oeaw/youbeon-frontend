<template>
  <section>
    <div class="mx-auto grid max-w-7xl gap-12 py-16 px-8">
      <h2 class="font-display text-2xl font-bold">Frequently Asked Questions</h2>
      <div class="grid gap-12">
        <div class="grid gap-4">
          <h3 class="font-display">Was ist die YouBeOn Map?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Die YouBeOn Map gibt Einblicke in die on- und offline Lebenswelten von 41 jungen,
              religiösen Menschen aus 7 verschiedenen Religionstraditionen in Wien. Das Team von
              YouBeOn hat zwischen März und September 2021 Interviews mit Ihnen geführt. Dabei haben
              wir nach der Religion (Glaube und Praxis), nach wichtigen Orten (in Wien und der
              ganzen Welt) und nach Social Media Aktivitäten (insbesondere auf Instagram) gefragt.
              Anhand der Informationen aus den Interviews veranschaulicht die YouBeOn Map die
              Vielfalt und Komplexität der Lebenswelten religiöser junger Menschen in Wien und zeigt
              Gemeinsamkeiten und Unterschiede zwischen Religionstraditionen auf.
            </p>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">Wie wurden die Teilnehmer*innen ausgesucht?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>Zu den Interviews wurden Personen eingeladen, die</p>
            <ul>
              <li>zum Zeitpunkt des Interviews zwischen 16 und 25 Jahren alt waren,</li>
              <li>in Wien oder im Wiener Umland wohnen,</li>
              <li>
                sich selbst als religiös/gläubig bezeichnen und sich zu einer der sieben
                ausgewählten Religionstraditionen dazuzählen,
              </li>
              <li>einen Instagram-Account nutzen.</li>
            </ul>
            <p>
              Meistens erfolgte die Kontaktaufnahme über religiöse (Jugend-)Organisationen der
              jeweiligen Glaubensgemeinschaften.
            </p>
            <table class="my-4 border border-neutral-200">
              <thead class="border-b border-neutral-200 bg-neutral-200">
                <tr>
                  <th :colspan="2" class="px-6 py-3 text-left text-sm font-semibold">
                    Religionsgruppen
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    katholische Christ*innen
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">
                    10
                  </td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    Muslim*innen
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">7</td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    Alevit*innen
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">5</td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    Jüd*innen
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">5</td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    orthodoxe Christ*innen
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">5</td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">Sikhs</th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">5</td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    evangelische Christ*innen
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">4</td>
                </tr>
              </tbody>
            </table>
            <table class="my-4 border border-neutral-200">
              <thead class="border-b border-neutral-200 bg-neutral-200">
                <tr>
                  <th :colspan="2" class="px-6 py-3 text-left text-sm font-semibold">
                    Genderidentifikation
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    nicht-binär
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">1</td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    weiblich
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">
                    21
                  </td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    männlich
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">
                    19
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="my-4 border border-neutral-200">
              <thead class="border-b border-neutral-200 bg-neutral-200">
                <tr>
                  <th :colspan="2" class="px-6 py-3 text-left text-sm font-semibold">
                    Interview hardfacts
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    Gesamtaufnahmedauer
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">
                    61:02:29 (01:29:20 / Interview)
                  </td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    Erwähnte Accounts und Hashtags (ohne Mehrfachnennungen)
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">
                    644
                  </td>
                </tr>
                <tr class="odd:bg-neutral-50 even:bg-neutral-100">
                  <th class="whitespace-nowrap px-6 py-4 text-left text-sm font-medium">
                    Erwähnte Orte (ohne Mehrfachnennungen)
                  </th>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-neutral-600">
                    530
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">Ist die YouBeOn Map eine "Landkarte der Religionen"?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Die YouBeOn Map ist aus mehreren Gründen keine "Landkarte der Religionen". Erstens,
              wurden nur Personen von sieben Religionsgruppen befragt, das heißt, es wird nur ein
              Teil der religiösen Vielfalt in Wien repräsentiert. Zweitens, zeigt die YouBeOn Map
              nur Orte, die den 41 Teilnehmer*innen wichtig waren. Daher scheinen beispielsweise
              nicht alle Gotteshäuser und Tempel in Wien auf, sondern nur jene, die mindestens
              einer*m der Interviewten wichtig waren. In anderen Worten, die Karte versucht nicht
              die gesamte Religionslandschaft abzubilden, sondern die subjektiven
              Religionslandschaften der Teilnehmer*innen.
            </p>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">Wird sich die YouBeOn Map im Laufe der Zeit verändern?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Derzeit ist keine Erweiterung der YouBeOn Map geplant. Generell ist zu sagen, dass die
              YouBeOn Map keine dynamische Darstellung bietet, sondern ein statischer Snapshot der
              persönlichen Lebenswelten der Teilnehmer*innen zum Zeitpunkt des Interviews ist. Im
              Laufe der Zeit verändern sich Bezugspunkte und Ideen. Diese ganz normalen
              Veränderungen in der eigenen Glaubens- und Lebenswelt kann die YouBeOn Map nicht
              abbilden.
            </p>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">Was sehe ich bei "Orte"?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Die Ebene der Orte zeigt Orte der Religionsausübung sowie nicht-religiöse Orte, die
              unseren Interviewteilnehmer*innen wichtig waren. Außerdem kann man hier die mit den
              Orten assoziierte Ideen erkunden, sehen welche Religionsgruppen welche Orte genannt
              haben und wo sich Personen unterschiedlicher Religionen begegnen (können).
            </p>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">Was sehe ich bei "Accounts"?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Die Ebene der Accounts zeigt die wichtigsten Accounts, denen unsere
              Interviewteilnehmer*innen auf der Plattform Instagram folgen. Die Accounts sind nach
              Religionsgruppen geclustert. In der Mitte befinden sich Accounts, die bei mehr als
              einer Religion vorkommen. Die Verbindung von einem Account zu einer Religion bedeutet,
              dass mindestens eine Person aus dieser Religionstradition diesem Account folgt.
            </p>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">Was sehe ich bei "Ideen"?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Die Ebene der Ideen zeigt die Begriffe und Konzepte, die den Teilnehmenden wichtig
              sind. Dazu hat das YouBeOn-Team Aussagen aus den Interviews systematisch aufgearbeitet
              und zu "Ideen" verdichtet. Die Ideen sind nach Religionsgruppen geclustert. In der
              Mitte befinden sich Ideen, die bei mehr als einer Religion vorkommen. Die Verbindung
              von einer Idee zu einer Religion bedeutet, dass mindestens ein*e Teilnehmer*in dieser
              Religionstradition etwas zu dieser Idee geäußert hat.
            </p>
            <p>
              Die Ebene der Ideen bietet darüber hinaus noch zwei weitere Ansichten. In der
              religionszentrierten Ansicht sieht man welche Ideen von den Teilnehmer*innen einer
              bestimmten Religionstradition genannt wurden. In der ideenzentrierten Ansicht sieht
              man, mit welchen anderen Ideen eine Idee im Zusammenhang steht.
            </p>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">Wie kann ich die YouBeOn Map durchsuchen?</h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Die YouBeOn Map bietet unterschiedliche Funktionen um die on- und offline Lebenswelten
              der 41 jungen, religiösen Interviewteilnehmer*innen einzutauchen. Zum Erforschen sind
              vor allem das Suchfeld und das Pop-Up Menü wichtig. Zwischen den Ebenen können Sie
              außerdem über einen Klick auf die Reiter "Orte", "Accounts" und "Ideen" wechseln.
            </p>
            <h4>
              Suchfeld
              <span>(die aktuelle Ansicht erforschen und Orte, Ideen und Accounts finden)</span>
            </h4>
            <p>
              Auf der Ebene der Ideen lässt sich die aktuelle Ansicht nach einzelnen Ideen
              durchsuchen.
            </p>
            <p>
              Auf der Ebene der Accounts lässt sich die aktuelle Ansicht nach einzelnen Accounts
              durchsuchen.
            </p>
            <p>
              Auf der Ebene der Orte kann die Karte über das Drop-Down Menü auf drei
              unterschiedliche Weisen durchsucht werden:
            </p>
            <ul>
              <li>
                Filter nach Religionen: Dabei werden alle Orte, die Teilnehmer*innen einer
                bestimmten Religion genannt haben, hervorgehoben. Punkte im kräftigeren Farbton
                markieren Orte, die für das religiöse Leben von mindestens einer Person der
                ausgewählten Religionsgruppe von Bedeutung sind. Orte im helleren Farbton wurden
                ebenfalls von Personen der ausgewählten Religionsgruppe genannt, spielen aber nicht
                unbedingt eine Rolle für deren religiöses Leben. Über den Schieberegler in der
                Suchleiste können diese nicht-religiösen Orte aus- und eingeblendet werden. Es
                können auch mehrere Religionstraditionen gemeinsam ausgewählt werden.
              </li>
              <li>
                Filter nach Ideen: Dabei werden alle Orte hervorgehoben, die von den
                Interviewteilnehmer*innen mit einer bestimmten Idee in Zusammenhang gebracht wurden
                ("Gottesdienst", "Park", "Feminismus", "Moschee"). Es können auch mehrere Ideen
                gemeinsam ausgewählt werden.
              </li>
              <li>
                Suche nach Orten: Dabei kann nach spezifischen Orten gesucht werden. Es können auch
                mehrere Orte gemeinsam ausgewählt werden.
              </li>
            </ul>
            <h4>
              Pop-Up Menü
              <span
                >(Informationen zur eignen Auswahl erhalten und zwischen den Ebenen der Orte,
                Accounts und Ideen navigieren)</span
              >
            </h4>
            <p>
              Zum gerade ausgewählten Punkt (Ort/Idee/Account) werden im Pop-Up Menü weitere Orte,
              Ideen und Accounts, die mit der aktivierten Auswahl verknüpft sind, angezeigt. Über
              einen Klick auf eine der dort angeführten Orte, Ideen oder Accounts wird man auf die
              entsprechende Ebene (Orte, Ideen oder Accounts) weitergeleitet und sieht dort die
              eigene Auswahl.
            </p>
            <p>
              Auf der Ebene der Ideen zeigt das Pop-Up Menü zusätzlich Zitate aus den Interviews,
              die weitere Informationen zu der ausgewählten Ideen bieten.
            </p>
            <h4>
              Reiter: Orte / Accounts / Ideen
              <span>(Zwischen den Ebenen wechseln, zu zuvor besuchten Ebenen zurückkehren)</span>
            </h4>
            <p>
              Die Reiter helfen dabei rasch zwischen den Ebenen der Orte, der Accounts und der Ideen
              zu wechseln. Dabei wird immer die letzte Ansicht auf der entsprechenden Seite
              angezeigt.
            </p>
          </div>
        </div>
        <div class="grid gap-4">
          <h3 class="font-display">
            Wie sind die unterschiedlichen Kategorien (Ideen, Orte, Accounts) definiert?
          </h3>
          <div class="grid max-w-xl gap-2 text-sm font-medium leading-relaxed text-neutral-500">
            <p>
              Als <strong>Ideen</strong> bezeichnen wir Konzepte, die in den Interviews vorgekommen
              sind. Zum einen sind es Begriffe, die von Teilnehmer*innen explizit genannt wurden
              (z.B. Gatka, Schabbat) sowie Überbegriffe (z.B. beten, Familie). Zum anderen sind es
              Begriffe, die Gemeinsamkeiten verschiedener Aussagen oder Handlungen herausstreichen
              (z.B. Ruhe finden, kritischer Umgang mit Informationsquellen); diese Begriffe wurden
              vom Forscher*innenteam erarbeitet.
            </p>
            <p>
              <strong>Orte</strong> bezeichnen wichtige Orte, die in den Interviews genannt wurden
              und die geographisch lokalisiert sind. Auch wenn jeder Ort an einem spezifischen Punkt
              auf der Landkarte verortete ist, können dabei Gebiete unterschiedlicher Größe
              angezeigt werden, z.B.
            </p>
            <ul>
              <li>Gebäude: Evangelische Kirche, lutherischer Stadtkirche, 1010</li>
              <li>Plätze: Stephansplatz, 1010</li>
              <li>Markante Orte: Wienerwald</li>
              <li>Bezirke: Innere Stadt, 1.Bezirk</li>
              <li>Dörfer: Hacibektas, Neveshir, Türkei</li>
              <li>Städte: Linz</li>
              <li>Regionen: Waldviertel</li>
              <li>Länder: Serbien</li>
            </ul>
            <p>Nur Orte, die in den Interviews genannt wurden, scheinen auf der Karte auf.</p>
            <p>
              <strong>Accounts</strong> bezeichnet Instagram-Accounts, denen
              Interviewteilnehmer*innen folgen und die sie angesprochenen haben.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
