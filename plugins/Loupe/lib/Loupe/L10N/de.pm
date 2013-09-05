# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$

package Loupe::L10N::de;

use strict;
use warnings;

use base 'Loupe::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (

## plugins/Loupe/lib/Loupe/App.pm
	'Could not send a invitation mail because Loupe is not enabled.' => 'Einladung konnte nicht verschickt werden, da Loupe nicht aktiviert ist.', # Translate - New # OK
	'Welcome to Loupe' => 'Willkommen bei Loupe', # Translate - New # OK

## plugins/Loupe/lib/Loupe/Mail.pm
	'Loupe invitation mail has been sent to [_3] for user \'[_1]\' (user #[_2]).' => 'Loupe-Einladung für \'[_1]\' (#[_2]) an [_3] verschickt.', # Translate - New # OK

## plugins/Loupe/lib/Loupe.pm
	'Loupe\'s HTML file name must not be blank.' => 'Der Name der Loupe-HTML-Datei muss mindestens ein Zeichen lang sein.', # Translate - New # OK
	'The URL should not include any directory name: [_1]' => 'Die URL darf keinen Verzeichnisnamen enthalten: [_1]', # Translate - New # OK
	'Could not create Loupe directory: [_1]' => 'Konnte Loup-Verzeichnis nicht anlegen: [_1]', # Translate - New # OK
	'Loupe HTML file has been created: [_1]' => 'Loupe-HTML-Datei angelegt: [_1]', # Translate - New # OK
	'Could not create Loupe HTML file: [_1]' => 'Konnte Loupe-HTML-Datei nicht anlegen: [_1]', # Translate - New # OK
	'Loupe HTML file has been deleted: [_1]' => 'Loupe-HTML-Datei gelöscht: [_1]', # Translate - New # OK
	'Could not delete Loupe HTML file: [_1]' => 'Konnte Loupe-HTML-Datei nicht löschen: [_1]', # Translate - New # OK

## plugins/Loupe/lib/Loupe/Upgrade.pm
	'Adding Loupe dashboard widget...' => 'Installiere Loupe-Dashboard-Widget...', # Translate - New # OK

## plugins/Loupe/Loupe.pl
	'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics.' => 'Loupe ist die benutzerfreundliche Lösung für Movable Type auf Mobilgeräten, mit der Sie Einträge und Kommentare freischalten, Fotos hochladen und Ihre Zugriffszahlen aufrufen können.', # Translate - New # OK

## plugins/Loupe/tmpl/system_config.tmpl
	'Enable Loupe' => 'Loupe aktivieren', # Translate - New # OK

## plugins/Loupe/tmpl/welcome_mail_html.tmpl
	'Your MT blog status at a glance' => 'Ihr Movable Type-Status auf einen Blick', # Translate - New
	'Dear [_1], ' => 'Hallo [_1],', # Translate - New # OK
	'With Loupe, you can check the status of your blog without having to sign in to your Movable Type account.' => 'mit Loupe verwalten Sie Ihre Blogs von unterwegs, ohne dazu das vollständige Movable-Type-Interface aufrufen zu müssen. ', # Translate - New # OK
	'View Access Analysis' => 'Zugriffszahlen ansehen', # Translate - New # OK
	'Approve Entries' => 'Einträge freischalten', # Translate - New # OK
	'Reply to Comments' => 'Kommentare beantworten', # Translate - New # OK
	'Loupe is best used with a smartphone (iPhone or Android 4.0 or higher)' => 'Loupe ist für Smartphones gemacht (iPhone, Android und andere)', # Translate - New # OK
	'Try Loupe' => 'Loupe jetzt testen', # Translate - New # OK
	'Perfect for Mini-tasking' => 'Perfektes Mini-Tasking', # Translate - New # OK
	'_LOUPE_BRIEF' => 'Welche Einträge sind momentan beliebt? Haben mir meine Autoren neue Einträge zur Freischaltung geschickt? Und diesen Kommentar möchte ich sofort beantworten. - Alle diese Dinge können Sie jetzt direkt von Ihrem Smartphone aus erledigen. Mit Loupe ist es so einfach wie nie, Ihr Blog auch unterwegs aktuell zu halten!', # Translate - New # OK
	'Use Loupe to help manage your Movable Type blogs no matter where you are!' => 'Mit Loupe verwalten Sie Ihre Movable-Type-Blogs egal wo Sie sind!', # Translate - New # OK
	'Social Media' => 'Social Media', # Translate - New # OK
	'https://twitter.com/movabletype' => 'https://twitter.com/movabletype', # Translate - New # OK
	'Contact Us' => 'Kontakt', # Translate - New # OK
	'http://www.movabletype.org/' => 'http://movabletype.org/', # Translate - New # OK
	'http://plugins.movabletype.org' => 'http://plugins.movabletype.org', # Translate - New # OK

## plugins/Loupe/tmpl/welcome_mail_plain.tmpl
	'Loupe is ready for use!' => 'Loupe ist bereits startklar!', # Translate - New # OK

## plugins/Loupe/tmpl/welcome_mail_result.tmpl
	'Send Loupe welcome email' => 'Loupe-Begrüßungsmail verschicken', # Translate - New # OK

## plugins/Loupe/tmpl/widget/welcome_to_loupe.tmpl
	'Thank you for installing Loupe!' => 'Danke, dass Sie Loupe installiert haben!', # Translate - New # OK
	q{Ready to use Loupe. Why don't you try Loupe right now?} => q{Loupe ist bereits startklar. Probieren Sie es gleich aus!}, # Translate - New # OK
	'Try using Loupe!' => 'Loupe jetzt ausprobieren', # Translate - New # OK
	'Send invitation email to users.' => 'Begrüßungsmail an Benutzer verschicken', # Translate - New # OK
	'Configure Loupe' => 'Loupe konfigurieren', # Translate - New # OK
	'Loupe can be used without complex configuration, you can get started immediately.' => 'Sie können sofort anfangen - Loupe braucht nicht erst aufwendig konfiguriert zu werden', # Translate - New # OK
	'Loupe cannot be used now. Please contact your Movable Type System Administrator.' => 'Loupe steht derzeit nicht zur Verfügung. Bitte wenden Sie sich an Ihren Movable-Type-Administrator.', # Translate - New # OK
	'The email address that should receive an invitation email from Movable Type.' => 'Begrüßungsmail an diese Adresse schicken:', # Translate - New # OK
	'Send Invitation Mail' => 'Begrüßungsmail abschicken', # Translate - New # OK
	'Sent the invitation email containing the access URL for Loupe to \'[_1]\'.' => 'Begrüßungsmail mit der Loupe-URL an \'[_1]\' schicken.', # Translate - New # OK
        'Loupe settings has been successfully. You can send invitation email to users via <a href="[_1]">Loupe Plugin Settings</a>.' => 'Loupe ist jetzt eingerichtet. Laden Sie auch Ihre Benutzer zu Loupe ein. Einladungen können Sie in den <a href="[_1]">Loupe-Einstellungen</a> verschicken.', # Translate - New # OK
        'Error saving Loupe settings: [_1]' => 'Konnte Loupe-Einstellungen nicht sichern: [_1]', # Translate - New # OK
        'Send invitation email' => 'Einladungs-Mail verschicken', # Translate - New # OK
        q{The URL of Loupe's HTML file.} => q{Adresse (URL) der Loupe-HTML-Datei.}, # Translate - New # OK
        'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics. <a href="http://www.movabletype.org/beta/60/loupe.html" target="_blank">See more details.</a>' => 'Loupe ist die benutzerfreundliche Lösung für Movable Type auf Mobilgeräten, mit der Sie Einträge und Kommentare freischalten, Fotos hochladen und Ihre Zugriffszahlen aufrufen können. <a href="http://www.movabletype.org/beta/60/loupe.html" target="_blank">Weitere Informationen in englischer Sprache</a>.', # Translate - New # OK


);

1;
