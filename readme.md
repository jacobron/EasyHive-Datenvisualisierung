# EasyHive Spektrum-App

Audiodatavisualisierung mit Hilfe von sox-generierten Spektren von einem raspberryPI.
Die Dateibenennung ist sehr spezifisch, weshalb für eine Adaption diese angepasst werden muss.

Demo gibt es hier:
[Live-Demo](http://easyhive.fablab-cottbus.de/4E/Spektrum-App/index.html)

## Funktionsweise
1. Audioaufzeichnung (arecord & flac) und Spektrumgenerierung (sox) auf dem raspberryPI

    `arecord -f dat -r 44100 -c 1 -D plughw:$CARD,0 -d 30 | flac - -f --compression-level-3 -s -o "$ENV/$DIR/$FILE"`

    `sox $ENV/$DIR/$FILE -n spectrogram -x 100 -y 300 -z 120 -r -o $ENV/$DIR/$FILEPIC`

2.  Upload der Audiodatei (.flac) sowie des Spektrums (.png) per ftp auf den Server.

3.  Die Spektrum App (Javascript) generiert eine Bildreihe aus den Einzelbildern anhand der Dateinamen.

## Einbindung

Einfach den Spektrum-App Ordner in den Ordner mit den Audioaufnahmen kopieren und über den Browser aufrufen.

## Thanks

## License

