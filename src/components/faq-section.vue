<script lang="ts" setup>
import FaqDisclosure from '@/components/faq-disclosure.vue'
</script>

<template>
  <section>
    <div class="mx-auto grid max-w-5xl gap-12 border-t border-brand-cyan py-16 px-8">
      <h2 class="font-display text-2xl font-bold">Fragen zur YouBeOn Map</h2>
      <div class="grid gap-12">
        <faq-disclosure title="Was ist die YouBeOn Map genau?">
          <p>
            Die YouBeOn Map basiert auf qualitativen Interviews mit 41 jungen, religiösen Menschen
            aus sieben verschiedenen Religionstraditionen. Diese Religionstraditionen sind
            Alevismus, evangelisches Christentum, Islam, Judentum, katholisches Christentum,
            orthodoxes Christentum und Sikhismus. Die Interviews wurden zwischen März und September
            2021 geführt. Die YouBeOn Map basiert auf den Informationen aus diesen Interviews und
            ist ein Versuch die Lebenswelten der jungen Menschen durch das Zusammenspiel von drei
            Ebenen abzubilden. Diese Ebenen sind
          </p>
          <ul role="list">
            <li>
              eine geographische Ebene. Diese zeigt Orte, die die Befragten genannt haben und zu
              denen sie einen Bezug haben.
            </li>
            <li>
              ein Netzwerk von Instagram-Accounts. Dieses zeigt welchen Accounts die
              Teilnehmer*innen folgen.
            </li>
            <li>
              ein Netzwerk von wichtigen Ideen. Dieses zeigt konkrete oder abstrakte Konzepte, die
              den Teilnehmer*innen wichtig waren.
            </li>
          </ul>
          <p>
            Die verschiedenen Ebenen sind miteinander verbunden. Die Ebene der Ideen ist dabei das
            verbindende Element, da Ideen sowohl mit der Ebene der Accounts (online) als auch der
            Ebene der Orte (offline) verknüpft sind. Darüber hinaus ermöglicht es die YoBeOn Map
            Schnittpunkte verschiedener Religionen aufzuzeigen, die sowohl über gemeinsame Accounts,
            Orte und Ideen sichtbar werden.
          </p>
          <p>
            Als <em>Ideen</em> bezeichnen wir Konzepte und Begriffe, die von Teilnehmer*innen
            explizit genannt wurden (z.B. Gatka, Schabbat, beten, Familie). Darüber hinaus sind es
            abstrakte Konzepte und Vorstellungen (z.B. Ruhe finden, kritischer Umgang mit
            Informationsquellen, Gottesbeziehung). Diese Ideen wurden vom Forscher*innenteam im Zuge
            der Datenanalyse entwickelt.
          </p>
        </faq-disclosure>
        <faq-disclosure title="Wie sind die YouBeOn Interviews abgelaufen?">
          <p>
            Die Interviews wurden zwischen März und September 2021 geführt und waren in drei Teile
            gegliedert. Der erste Teil war ein biographisch-narratives Interview, in welchem wir
            Fragen zur Biografie, der Rolle von Religion und dem persönlichen Zugang zu Religion
            (Glaube und Praxis) gestellt haben. Im zweiten Teil haben uns die Teilnehmer*innen auf
            eine Tour durch ihren Instagram-Accounts mitgenommen und uns vor allem gezeigt, welchen
            Accounts sie folgen und was sie daran interessant finden. Im dritten Teil haben wir nach
            Orten gefragt (in Wien, aber auch weltweit), die für die Teilnehmer*innen eine besondere
            Bedeutung haben oder in ihrem Alltag eine wichtige Rolle spielen.
          </p>
        </faq-disclosure>
        <faq-disclosure title='Ist die YouBeOn Map eine "Landkarte der Religionen"?'>
          <p>
            Die YouBeOn Map gibt einen Einblick in vielfältige, individuelle Lebens- und
            Glaubenswelten von jungen Wiener*innen. Durch unseren Fokus auf sieben
            Religionstraditionen wird aber nur ein Teil der religiösen Vielfalt von Wien
            repräsentiert. Zudem zeigt die YouBeOn Map nur die Orte, Accounts und Ideen, welche die
            41 Teilnehmer*innen in den Interviews genannt haben. Das bedeutet, dass nicht alle
            Wiener Gotteshäuser und Tempel auf der Karte aufscheinen, nicht alle Accounts, denen
            religiöse Menschen folgen und nicht alle Ideen, die religiöse Menschen mit ihrer
            Glaubenswelt verbinden. Die YouBeOn Map versucht also kein objektives Abbild der
            Religionslandschaft Wiens zu geben, sondern repräsentiert die Lebenswelten der 41
            Teilnehmer*innen zum Zeitpunkt des Interviews. Daher ist die YouBeOn Map keine
            "Landkarte der Religionen".
          </p>
        </faq-disclosure>
        <faq-disclosure
          title="Aber wenn alles so subjektiv ist, was kann man dann aus der Karte erfahren?"
        >
          <p>
            Die YouBeOn Map zeigt, wo sich – bereits nach der Befragung von wenigen Personen –
            Gemeinsamkeiten zwischen Personen unterschiedlicher Religionen abbilden, und zeigt Ideen
            auf, die in vielen, manchmal allen Religionen eine Rolle spielen. Sie identifiziert auch
            Orte, an denen sich Personen unterschiedlicher Religionen im online bzw. im offline
            Alltag begegnen können. Durch die Zitate auf der Ideen-Ebene werden diese abstrakten
            Ideen zusätzlich veranschaulicht, wodurch sich charakteristische Eigenheiten und
            Gemeinsamkeiten besser verstehen lassen. Die YouBeOn Map bietet hier Ansatzpunkte um
            weiterzudenken und grundsätzliche Muster zu erkennen, erhebt aber aufgrund der Art der
            Daten, die verwendet wurden, keinen Anspruch auf Vollständigkeit oder Repräsentativität
            für die einzelnen Religionsgruppen.
          </p>
        </faq-disclosure>
        <faq-disclosure title="Wird sich die YouBeOn Map im Laufe der Zeit verändern?">
          <p>
            Die YouBeOn Map veranschaulicht die on- und offline Lebenswelt der Teilnehmer*innen zum
            Zeitpunkt der Interviews. Das heißt, auch wenn sich die Lebenswelt der Teilnehmer*innen
            verändern, werden diese hier weiterhin unverändert abgebildet. Die YouBeOn Map ist somit
            ein Snapshot eines bestimmten Zeitpunktes im Leben der Teilnehmer*innen.
          </p>
        </faq-disclosure>
        <faq-disclosure title="Wie kann ich die YouBeOn Map durchsuchen?">
          <p>
            Die YouBeOn Map kann auf unterschiedliche Weise navigiert werden. Zum Erforschen sind
            vor allem das Suchfeld und das Pop-Up Menü wichtig. Zwischen den Ebenen kann außerdem
            über die Reiter "Orte", "Accounts" und "Ideen" gewechselt werden.
          </p>
          <p>
            Mit dem Suchfeld lassen sich die Ebenen weiter erforschen. Es kann gezielt nach Orten,
            Ideen oder Accounts gesucht werden. Das drop-down Menü auf der Seite erlaubt es,
            entweder einzelne Orte, Ideen, oder Accounts zu suchen, oder alle Orte, Ideen, Accounts
            einer Religionsgruppe anzuzeigen.
          </p>
        </faq-disclosure>
        <faq-disclosure title="Was sehe ich im Pop-Up Menü?">
          <p>
            Das Pop-Up Menü zeigt Informationen zur eigenen Auswahl. Auf der Ebene der Ideen zeigt
            es zu jeder Idee auch noch Zitate aus den Interviews, um die (teilweise abstrakten)
            Begriffe der Ideen zu veranschaulichen. Über das Pop-Up Menü ist es auch möglich von
            einer Ebene auf eine andere Ebene zu springen, indem zB. ein verknüpfter Account
            angeklickt wird.
          </p>
        </faq-disclosure>
      </div>
    </div>
  </section>
</template>
