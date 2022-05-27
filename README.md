# youbeon_frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Kommunikation mit Server

### API:

Zugriff auf die API erfolgt über [db.youbeon.eu](db.youbeon.eu). Abgesehen davon kann auf spezifische Ideen mit 'db.youbeon.eu/idee/filter/?ids=a,b,c' (a,b,c) steht für gewünschte ids auf spezifische Ideen zugegriffen werden. 


### Daten hinzufügen

Das hinzufügen neuer Daten kann entweder durch einzelne Einheiten in der Api, oder mithilfe von 4 excel Dateien hinzugefügt werden. Der Momentane Ablauf dafür ist die api lokal laufen zu lassen (mit VPN zu ACDH), die momentanen Daten zu löschen (python manage.py flush), einen neuen user hinzuzufügen (python manage.py createsuperuser) und dann das entsprechende Formular unter /upload mit den Excel Dateien zu befüllen.

Wichtig hierbei ist, dass die Spalten die richtige Form haben ('ID', 'Referenz', 'Kodes', 'Dokument'). Der Upload selber dauert länger, meistens um die 20 Minuten. Die Django Application ist unter [youbeon_django](https://gitlab.com/acdh-oeaw/youbeon/youbeon_django) aufrufbar.

### Excelsheets auswerten
Um Daten hinzuzufügen müssen 4 Excelfiles angegeben werden:

- Das  Hauptfile enthält alle Daten durch enstprechende Kodes differenziert (e.g I: ... Ideen, A: ... Accounts, O: ... Orte). Daten die in der selbe Zeile stehen hängen zusammen und werden entsprechend in der Datenbank gespeichert. 

- Ein Ortspezifisches File enthält eine Auflistung aller genannten Orte in Kombination mit derer Koordinaten

- Ein Accouontspezifisches File enthält alle Accounts in KOmbination mit Links zu deren Instagram Seiten

- Ein Ideenspezifisches File enthält alle Ideen und zugehörige Zitate aus den Interviews

# Aufbau der Web-App

Die Seite besteht aus 3 Haupt-Komponenten die auch über die Navigationsbar auffindbar sind (Idee, Influencer (Account), Orte). Außerdem gibt es einen weiteren Komponenten der die Legende auf der Orte Seite bestimmt. Ein Store lädt die initialen Daten, die in jedem Komponent benötigt werden. Die App ist mit Vue und Vuetify gestaltet.

### Place.vue

Die Orte Seite stellt die Religiösen Orte dar die von den Interviewern angegeben werden. Es werden immer alle Orte angezeigt, mithilfe des autocomplete fields können bestimmte Orte hervorgehoben werden. Dies passiert über 3 verschiedene Varianten:

- Alle Orte einer bestimmten Religion werden hervorgehoben. Bei dieser Auswahl gibt es einen kleinen switch wo zwischen explizit religiößen Orten und Orten die nur innerhalb eines Interviews einer Person mit dem jeweiligen Glauben unterschieden werden kann.
- Alle Orte die mit einer bestimmten Idee verknüft sind
- Einzele Orte die in den Interviews genannt wurden.

Die Karte selbst ist mit leaflet und mithilfe von geo-jsons designed.

### Idea.vue

Die Ideen Seite stellt alle in den Interviews genannten Konzepte in der Form eines Netzwerk Diagrams dar. Dieses ist mit d3 programmiert. Die Funktion die das diagram erstellt ist generatNetwork. Mithilfe der Suchleiste können Ideen hervorgehoben werden. Das Netzwerkdiagramm kann in 3 verschiedenen Darstellungen angezeigt werden:

- In der zentralen Darstellung werden alle Ideen zu den jeweiligen religionen angezeigt. Ideen die mit mehreren Religionen verknüpft sind (in Interviews zu verschiedenen Religion genannt wurden) wandern in die Mitte mit verbindungslinienen zu den jeweiligen Religionen
- In der Ideen-fokusierten Darstellung wird eine Idee und alle Ideen die mit dieser in verbindung stehen angezeigt. Diese Ansicht kann durch Klicken auf eine Idee in der zentralen Darstellung erreicht werden.
- In der Religionsfokusierten Darstellung wird nur noch eine Religion und ihre Verknüpften Ideen angezeigt. Sie wird erreicht durch klicken auf eine Religions-Node erreicht. 

Durch suchen und klicken auf eine Idee wird in der unteren rechten Ecke ein Fenster geöffnet, dass detailierte Informationen zu den Ideen enthält. Dieses Fenster wird in einem eigenen Punkt erklärt. 

### Influencer.vue (Account Seite)

Die Account Seite stellt alle in den Interviews genannten Online Präsenten in der Form eines Netzwerk Diagrams dar. Dieses ist mit d3 programmiert. Die Funktion die das diagram erstellt ist generatNetwork. Mithilfe der Suchleiste können Accounts hervorgehoben werden. Das Netzwerkdiagramm kann in 2 verschiedenen Darstellungen angezeigt werden:

- In der zentralen Darstellung werden alle Accounts zu den jeweiligen Religionen angezeigt. Accounts die mit mehreren Religionen verknüpft sind (in Interviews zu verschiedenen Religion genannt wurden) wandern in die Mitte mit Verbindungslinienen zu den jeweiligen Religionen.
- In der Religionsfokusierten Darstellung wird nur noch eine Religion und ihre verknüpften Accounts angezeigt. Sie wird erreicht durch klicken auf eine Religions-Node erreicht.

Durch suchen und klicken auf eine Idee wird in der unteren rechten Ecke ein Fenster geöffnet, dass detailierte Informationen zu den Ideen enthält. Dieses Fenster wird in einem eigenen Punkt erklärt.

### Detailierte Ansicht
Die Detaillierte Ansicht ist auf allen 3 Unterseiten aufrufbar und bietet mehr Informationen zu der Auswahl. Je nach Unterseite werden hier verschiedene Dinge angezeigt. Diese sind in Folder versteckt. Durch klicken auf die einzelnen Items kann auf die jeweilige andere Unterseite mit dem gewählten Item im Fokus gesprungen werrden (e.g durch Klick auf eine Idee wird die Ideen-Seite geöffnet mit der Idee in der Suchleiste ausgewählt und in dem Netzwerk markiert)




