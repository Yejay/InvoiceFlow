Ich fand ja Ihre erste Präsentation gut.

Ich wollte noch Feedback geben.

Sie haben die Zeit ein bisschen überzogen, tatsächlich.

Es waren eher so 6,5 Minuten, die Sie genommen haben.

An irgendeiner Stelle haben Sie, glaube ich, haben Sie Zeit verloren.

Aber das kann ich jetzt nicht mehr nachvollziehen, wo das war.

Aber ja, das kann sein.

Aber der Vortrag war schon ganz straight und gut argumentiert.

Natürlich, wo Sie bei den monatlichen Kosten sind, habe ich Sie danach noch gefragt, dass man das natürlich mit reinnehmen müsste.

Da habe ich hier Kategorien in Ziel-Marketing-Folien.

Die waren vielleicht nicht ganz stimmig.

Da müsste ich ja mal gucken, was ich damit meinte.

Ich notiere mir für die Referate immer so eine Bandbreite und sehe da, was das heißt, ich habe mir 1,3 bis 1,7 mit Tendenz zu 1,7 notiert.

Also sie liegt dann im guten Bereich, auf jeden Fall.

Jetzt muss ich gerade mal für nächste Woche, weil ich hab da...

Ich hab da noch mal drüber nachgedacht, über diese Schwerpunkt-Themen, dass ich das vielleicht ein bisschen anders mache als das, was ich sonst gemacht habe.

Und da müsste ich hier was kurz angepassen.

Genau.

Moment.

Das verpasse ich.

Das ergesse ich nicht.

Vielleicht hier.

Ich mach das hier.

So, ich mache mal hier eine Freigabe.

Ja.

Genau, also zu dem Dokument, das hatte ich halt noch mal mit, damit es schöner formatiert ist und alles Mögliche, habe ich Claude genutzt.

Ach so, ah, oh mein, ich dachte, nee, nee, Entschuldigung.

Ja, ja, okay.

Ja, ja, ja.

Also ich habe jetzt noch mal eine freigabe genutzt.

Entschuldigung, ja, ja, ja, okay.

So.

Worauf geht es hier, ist diese Architekturdarstellung, auch mit Presentation, Application, Authentication Layer, Data Layer, Deployment Layer.

Also bis hin zum Deployment Layer kann man das so durchgehen lassen, sozusagen.

Ja.

Aber das Deployment ist eine andere Dimension.

Man kann natürlich die Verteilung von, mit Architektur meine ich eher, welche Komponenten gibt es, laufen die klein- und serverseitig und wie sind vielleicht klein- und serverseitige Anwendungsbestandteile strukturiert.

Ach so, okay.

Und das Deployment ist ja nicht auf derselben Ebene angesiedelt, sondern da wird dann die Frage gestellt, ja, und wie wird das deploit?

Also nehmen wir an, Sie haben verschiedene serverseitige Bestandteile in Ihrer Anwendung.

Dann stellt sich die Frage, laufen die alle auf einem Server oder wird das auf verschiedene Server verteilt oder auf die Serverfarmer oder wie auch immer?

Ja.

Und das geht ja aus diesem Bild sicher vor.

Ja, genau.

Dann würde man, denn das, was Sie jetzt als Authentication Layer haben, den jetzt irgendwie zwischen Application und, ach so, Application Layer, Application Layer ist bei Ihnen noch Kleinseite anscheinend.

Da steht jetzt Server Actions, React Hook Form, das ist auch jetzt nicht ganz klar, wo das angesiedelt ist.

Dann haben Sie Data Layer, Super Base, Post, Progress, Storage, LSPolicies, wo sich auch die Frage stellt, welche Serverseitige Funktion kommuniziert mit welcher Datenbank.

Also quasi nur die Layer mit so ein paar Labels in Kästchen zu packen und Pfeile dazwischen, das ist ein bisschen zu ungenau.

Okay, ja, ja, verstehe ich.

Ja, das müsste man nochmal präzisieren.

Dann haben Sie dieses Sequenzdiagramm.

Das Sequenzdiagramm ist irgendwie, das finde ich, relativ schlüssig eigentlich.

Das ist eigentlich ganz gut dargestellt.

Ja, das ist so nach dem Flow, den ich quasi im aktuellen Entwicklungsstand so, da ist das noch nicht alles implementiert, aber wie das quasi dann aufgebaut wäre einfach von den Komponenten, die ich da eingesetzt habe.

Okay, und da haben Sie hier Authentication, Authorization.

Das ist, sagen wir so, das was Sie da mit Layer 1, also Authentication, Authorization, Input Validation, Row-Level Security.

Das ist natürlich, das sind auch interessante Punkte.

Die sind gerade von Interesse, wenn man so an, wenn man überlegt, wie man das hier eigentlich ein System entwickeln wollen, was mandantenfähig ist, bei dem jetzt verhindert wird, dass Nutzer durch einen Fehler, aber wie auch immer, gegenseitige Daten sehen, das sind das natürlich wichtige Punkte.

Aber ich würde das nicht, diese Sicherheitsaspekte, die könnte man als Zusatzinformation auf so ein Architekturdiagramm drauf platzieren.

Dass man erstmal die Architektur so sieht und dann so darstellt, das mit, was läuft klein-seitig, was läuft server-seitig, was für Datenbanken verwenden sie, wie kommunizieren die miteinander und dass man dann quasi in textueller Form, aber ohne das nochmal irgendwie in so einen Blöcke zu packen, dann die Sicherheitsaspekte dazu schreibt.

Also dann hat das glaube ich etwas mehr Hand im Fuß.

Dann ist die Frage des Datenmodells, haben Sie ja, beim Datenmodell haben Sie ja einerseits, Sie haben zwei, von zwei Entitäten haben Sie Beziehungen zu Invoices, nämlich zum einen von Customers und zum anderen von Users.

Also Sie haben, Invoices belong to User und Customers have Invoices oder so.

Aber Invoices has Customers, da ist man nicht ganz klar, was die, wie das von der Modellierung gemeint ist.

Ja, da ist, genau.

Ja, okay, verstehe.

Okay, Sie wollen damit sagen, dass ein User hat Quittungen, für jede Quittung ist ein Customer angegeben, aber der Customer steht natürlich auch unabhängig von der Quittung in Beziehung zum User.

Ja, genau.

Okay, verstehe, ja.

Ja, klar.

Und wenn man sozusagen, also das war die Überlegung so ein bisschen, das da jetzt vielleicht noch nicht ganz klar abgebildet, aber wenn man später in so ein richtiges, in eine richtige Rechnungsstellung Software geht, dann muss man ja auch sowas wie Multitenant anbieten und dann kann man halt so Tenants hinterlegen quasi in der Software.

Aber was sind denn das Tenants in Ihrem Verständnis?

Also quasi, dass man, wenn ich jetzt als Nutzer quasi, also ich bin der Freelancer und meine Idee war, dass man die Firmen, mit denen man quasi häufiger zusammenarbeitet, dass man die direkt hinterlegen kann, damit man dort sozusagen dann Templates anlegen kann für diese Kunden, weil ja jeder Kunde sozusagen eine andere Vorstellung von einer Rechnung hat und dann das sozusagen vereinfacht direkt schnell eine Rechnung erstellen kann.

Okay, das haben Sie damit in Ihrem Datenmodell noch nicht drin.

Nee, nee, genau.

Das wäre auch eine Sache, die würde glaube ich auch ein bisschen zu viel werden für die Veranstaltung, wenn ich erst mal das so quasi einfach...

Jetzt sagen wir so, was Sie für die Veranstaltung umsetzen und was Sie modellieren, das ist erst mal, das muss jetzt zunächst mal noch nicht...

Ja, deswegen hatte ich ja nochmal die E-Mail geschrieben.

Es ist schon Sinn von mehr zu modellieren als was Sie...

Es geht ja um die technische Konzeption.

Das habe ich schon mehrfach gesagt, was genau von dieser technischen Konzeption Sie umsetzen.

Das besprechen wir dann in den Wochen nochmal, nachdem Sie die Präsentation gemacht haben.

Das wollte ich eigentlich nochmal rausschicken an alle.

Letztendlich jede Anwendung, jede Anwendung, die Sie hier gebaut haben, eine Veranstaltung braucht eine Nutzerverwaltung, Nutzerautotifisierung.

Aber die Nutzerautotifierung hat da nichts mit.

Sie hat in allerwenigsten Fällen bei Ihnen vielleicht ein bisschen mehr.

Sie hat relativ wenig mit dem eigentlichen Anwendungszweck zu tun.

Deswegen würde ich sagen, auch wenn man sagen würde, am Ende brauche ich eine Nutzerautotifierung, brauche ich die an der Veranstaltung nur minimale umzusetzen.

Okay, das war nämlich für mich ein bisschen wichtig, weil natürlich auch von anderen Veranstaltungen kennt man es ja auch andersrum, wenn man so ein technisches Dokument abgibt, von was man umsetzen möchte, dass das quasi als Kriteriumsgrundlage gilt.

Nee, das ist es nicht.

Sowohl bei der inhaltlichen als auch technischen Konzeption würde ich gerne, dass Sie relativ weit Ihr Thema erfassen, aber mit der Breite können Sie das in so einer Veranstaltung nicht umsetzen.

Ja, ja, okay, perfekt.

Dann weiß ich Bescheid.

Okay, das heißt, diese Frage, meine Frage, die ich an das Datenmodell hatte, ja, warum hängt denn, warum ist denn der Nutzer, warum ist der Customer sowohl mit User als auch mit Rechnung assoziiert?

Das macht natürlich Sinn, ja, das ist schon klar, aber da ist halt so eine, da ist so eine, da ist die, finde ich persönlich, das war geschmackssache, um die Aussage kräftiger.

Man könnte nämlich sagen, ein Kunde gehört zu einem Nutzer und das heißt Komposition modellieren und dann die Beziehung zwischen Nutze, zwischen Kunde und Rechnung als Aggregation modellieren, von wegen ein Kunde kann natürlich in mehreren Rechnungen auftauchen, aber die Ebene, wo der Kunde quasi dazugehört, das ist der User und der User kann einen Kunden, kann dann wenn er eine Rechnung erstellt, aus dem Kunden wählen und die Kunden den Rechnung zuweisen, aber der Kunde könnte auch existieren, ohne dass sie jemals eine Rechnung für ihn geschrieben haben.

Aber das kann man in der PR-Diagramme jetzt nicht ausdrücken, sie können das so, ja.

Aber okay, dann weißt du in Zukunft die Diagramme vielleicht auch wieder mehr.

So, in vier Wochen, wir reden natürlich nicht, aber in vier Wochen ist die Präsentation dann erst.

Gehen Sie vielleicht so vor, das ist nur ein Vorschlag, das heißt nicht machen Sie es unmittelbar, wenn Sie zum Schluss kommen, Sie wollen es anders machen, dann machen Sie es anders.

Also die Cleaner muss halt so machen, ja.

Und was man machen könnte ist, man sagt, ja, ich erwehe nochmal kurz mein Projekt, worum es geht und stelle dann die Anforderungen da, die ich umsetzen möchte.

Und das jetzt schon so von wegen, was Sie sich vorstellen können, umzusetzen bis zum 10.

Februar.

Und anstelle einer bloßen Auflistung von Masthev-Neistorf könnte man natürlich da irgendwie so eine Story draus machen von wegen, ja, der Nutzer kann erstmal sich anmelden und dann kriegt er eine Liste von Kunden gezeigt oder hat wahlweise die Möglichkeit, sich Rechnungen aus dem letzten Zeitraum anschauen zu können.

Wenn er eine neue Rechnung anmelden möchte, hat er die Möglichkeit, halt über ein Formular die Rechnungsdaten einzugeben.

Kunde kann er auswählen außer Vorauswahl und wenn die Rechnung erstellt wird, wird ein PDF generiert, was ihm dann angezeigt wird, was auch versendet werden kann.

Ungefähr so, also so könnte man, so könnte eine Story aussehen zum Beispiel.

Und ja, das heißt, wie Sie das erzählen, also sagen wir so, das ist ja, das kann man auf der Tonspur machen, man kann aber auch, was weiß ich, eine Animation mit Zeichnung machen oder man kann, oder man kann Screenshots zeigen.

Also das, so in dieser Bandbreite bewegt sich das.

Also das kann auch Wirefile sein zum Beispiel.

Wichtig wärmer ist, wenn wir das jetzt nicht UI quasi dem Design nach erzählen, sondern einfach beschreiben, was Sie denken, das der Nutzer am Ende tun kann mit Ihrer Anwendung.

Das nicht, wenn man dann hier drauf zieht, dann geht ein Popup auf und da kann man dann auswählen, sondern man hat die Möglichkeit auszuwählen, welchen Kunden man der Rechnung, für welchen Kunden man die Rechnung erstellt.

Und dann Architektur umsetzen, das sind dann so die Punkte, über die wir gerade gesprochen haben, was ist die Klein-Server-Architektur, welche Komponenten laufen auf Klein, welche auf Serverseite, was sind Authentifizierungsaspekte.

Zum einen, wie wollen Sie das Deployment machen, das können Sie natürlich erwähnen.

Und wie sieht das Dart-Modell aus?

Und das Schwerpunkt-Thema, da wäre jetzt die Frage, was ist denn von den Technologien, mit denen Sie arbeiten, besonders interessant?

Ja, also ich glaube, tatsächlich für meinen Anwendungsfall gerade, ist die Integration mit, also das Dreiergespann aus Next.js, Clerc und SuperBase, weil das sozusagen die Foundation für alles bietet bei mir gerade.

SuperBase übernimmt quasi die Datenbankanbindung mit, also SuperBase und Clerc sind sehr eng miteinander integriert mittlerweile, weil die beiden zusammen arbeiten.

Was ist Clerc?

Clerc ist die Authentifizierung, aber auch quasi dieses, was man heutzutage fast überall sieht, diese Auflistung der unterschiedlichen Tiers nach Subscription Models, also Free Tier und Pro Tier und dann irgendwie Ultra.

Diese Anbindung kann Clerc einem direkt quasi out of the box liefern.

Und zusätzlich dazu kann man dann mithilfe von Clerc bestimmte Funktionalitäten der Anwendung sozusagen hinter eine Paywall packen.

Also die sind dann zum Beispiel nur für den Free Nutzer, wenn der 10 Rechnungen erreicht hat, dann kriegt er einen Popup von wegen, du müsstest halt upgraden, wenn du noch weitere Rechnungen erstellen möchtest.

Und diese ganze Integration, die kommt von Clerc und Clerc ist mit SuperBase integriert, weil SuperBase die Datenbank quasi managt, aber halt sozusagen auch schon die Endpunkte bereit liefert.

Also es ist sozusagen so eine all in one Lösung, als hätte man sein eigenes Spring Boot Backend aufgebaut.

Und die beiden integrieren sich zusammen und liefern dann halt auch die Authentication und Authorization.

Ok, dann gehen Sie darauf schwerpunktmäßig ein.

Ok, alles klar.

Schwerpunktmäßig heißt aber schon, nehmen Sie es nicht nur eine Folie und ein bisschen was dazu erzählen, sondern nehmen Sie es sich dann ein bisschen krass.

Also nix mehr als 3-4 Minuten ungefähr.

Ja, ich dachte mir auch, das ist wahrscheinlich am besten, weil Next.js ist halt einfach nur quasi React, aber in Fullstack.

Aber das ist jetzt glaube ich nicht super interessant für alle, aber ich glaube Clerc und SuperBase kennen vielleicht nicht alle.

Ok, machen Sie das.

Weil SuperBase ist auch eine Open Source Variante von Firebase.

Ja, ich weiß, ja ja.

Ok, dann klammer ich in Next.js erst nochmal ein bisschen, ja, aber dann machen Sie daraus ihren Schwerpunkt.

Ja, mach ich.

Find gut.

Ok. Genau.

Ja und aktueller Entwicklungsstand, wenn Sie, je nachdem wie viel Sie haben, erwähnen Sie, was gemacht ist.

Also auch da, das reicht dann von, ich zeige nochmal das Architekturbild, machen Haken an den Stellen, die umgesetzt sind oder so.

Ja.

Ja, wie auch immer.

Ich möchte es nicht zu viel Zeitungsvorlagen geben.

Ja, ok.

Aber wie gesagt, Sie können ganz gut und souverän präsentieren, das haben Sie in dem ersten Referat gesagt, das ist nicht gezeigt.

Da ist nichts, wo ich sagen muss, das müssen Sie ganz anders machen.

Gehen Sie ähnlich an die technische Umsetzung, an die technische Präsentation ran.

Und was Sie gerade erzählt haben, also dass Sie auf Anhieb sagten, ja, da finde ich irgendwie Clerc und SuperBase.

Und wie das zusammen spielt und vielleicht von Next.js angebunden werden kann, aber ohne zu sehr auf Next.js einzugehen.

Das klingt gut fundiert und informiert.

Also dann machen Sie das.

Ok, perfekt, dann mache ich das.

Genau, ansonsten, ich glaube von meiner Seite sind dann auch erstmal keine Fragen.

Ja, ok.

Dann haben wir eigentlich alles geklärt dann.

Ach so, ja und das hatten wir ja eh schon per E-Mail geklärt, aber das war ja ein Punkt, diese Validierung vom XML und sowas.

Also das würde ich dann nochmal quasi vielleicht ergänzen.

Bei der Abgabe müssen wir ja auch nochmal so ein technisches Dokument, eine Dokumentation.

Nein, müssen Sie nicht, wo haben Sie das her?

Ich dachte vielleicht, ich habe mehrere Projektmodule dieses Semesters und die verlaufen sich alle.

Ja, ich weiß, ich weiß, das ist das Letzte, was Sie irgendwie schriftlich machen bis zur Abgabe ist dann Creative Coding.

Ok, perfekt, dann weiß ich Bescheid, dann haben sich alle Fragen geklärt.

Ok. Ja, dann danke fürs Feedback auf jeden Fall.

Sollten Sie noch Fragen ergeben, dann wenden Sie sich per Mail an.

Ich bin allerdings über die zwei Wochen, über Weihnachten bin ich offline.

Ich bin dann am fünften wieder online und würde, wenn Fragen da wären, die noch beantworten.

Das ist natürlich knapp am fünften, ich weiß aber.

Ja, ich bin über Weihnachten wahrscheinlich auch weg.

Dann genießen Sie die Offline-Zeiten.

Gucken Sie vielleicht, dass Sie sich so im Bereich von 10 Minuten bleiben.

Das wäre, glaube ich, gut, dass es nicht zu sehr ausreißt.

Ja, das glaube ich gut für mich, weil ich tendiere manchmal ein bisschen zu viel.

Ja, genau, dann teilen Sie es mal auf 10 Minuten.

Ok, mache ich.

Alles klar, schön.

Ok, alles klar.

Bis dann, schöne Zeit noch.

Ja, ebenfalls.

Und guten Rutsch und wie auch immer.

Ja, genau, guten Rutsch und schöne Offline-Zeiten.

Das kann man uns noch schon sagen.

Ihr hört uns ja wahrscheinlich erst mal nicht geplant.

Ja, genau.

Alles klar, bis dann.

Tschüss.