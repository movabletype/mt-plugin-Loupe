# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$

package Loupe::L10N::nl;

use strict;
use warnings;

use base 'Loupe::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (

## plugins/Loupe/lib/Loupe/App.pm
	'Could not send a invitation mail because Loupe is not enabled.' => 'Kon geen uitnodiging mailen omdat Loupe niet is ingeschakeld.', # Translate - New
	'Welcome to Loupe' => 'Welkom bij Loupe', # Translate - New

## plugins/Loupe/lib/Loupe/Mail.pm
	'Loupe invitation mail has been sent to [_3] for user \'[_1]\' (user #[_2]).' => 'Loupe uitnodiging werd gemaild naar [_3] voor gebruiker \'[_1]\' (gebruiker #[_2]).', # Translate - New

## plugins/Loupe/lib/Loupe.pm
	'Loupe\'s HTML file name must not be blank.' => 'Naam HTML bestand voor Loupe mag niet leeg zijn.', # Translate - New
	'The URL should not include any directory name: [_1]' => 'De URL mag geen mapnaam bevatten: [_1]', # Translate - New
	'Could not create Loupe directory: [_1]' => 'Kon Loupe map niet aanmaken: [_1]', # Translate - New
	'Loupe HTML file has been created: [_1]' => 'Loupe HTML bestand werd aangemaakt: [_1]', # Translate - New
	'Could not create Loupe HTML file: [_1]' => 'Kon Loupe HTML bestand niet aanmaken: [_1]', # Translate - New
	'Loupe HTML file has been deleted: [_1]' => 'Loupe HTML bestand werd verwijderd: [_1]', # Translate - New
	'Could not delete Loupe HTML file: [_1]' => 'Kon Loupe HTML bestand niet verwijderen: [_1]', # Translate - New

## plugins/Loupe/lib/Loupe/Upgrade.pm
	'Adding Loupe dashboard widget...' => 'Bezig dashboardwidget voor Loupe toe te voegen...', # Translate - New

## plugins/Loupe/Loupe.pl
	'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics.' => 'Loupe is een mobiel-vriendelijke, alternatieve console voor Movable Type waarmee gebruikers berichten en reacties kunnen modereren, foto\'s kunnen uploaden en website en blogstatistieken kunnen bekijken.', # Translate - New

## plugins/Loupe/tmpl/system_config.tmpl
	'Enable Loupe' => 'Loupe inschakelen', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_html.tmpl
	'Your MT blog status at a glance' => 'De status van uw MT blog in een oogopslag', # Translate - New
	'Dear [_1], ' => 'Beste [_1]', # Translate - New
	'With Loupe, you can check the status of your blog without having to sign in to your Movable Type account.' => 'Met Loupe kunt u de staus van uw blog zien zonder u te moeten aanmelden met uw Movable Type account.', # Translate - New
	'View Access Analysis' => 'Toegangsanalyse bekijken', # Translate - New
	'Approve Entries' => 'Berichten goedkeuren', # Translate - New
	'Reply to Comments' => 'Antwoorden op reacties', # Translate - New
	'Loupe is best used with a smartphone (iPhone or Android 4.0 or higher)' => 'Loupe werkt best op een smartphone (iPhone of Android 4.0 of hoger)', # Translate - New
	'Try Loupe' => 'Probeer Loupe', # Translate - New
	'Perfect for Mini-tasking' => 'Perfect voor Mini-tasking', # Translate - New
	'_LOUPE_BRIEF' => '"Welke berichten van mij zijn het populairste op dit moment?" "Moet ik nog berichten of reacties goedkeuren?" "Ik moet dringend antwoorden op deze reactie..." Al dit soort mini-takkjes kunnen nu rechtstreeks op de smartphone gedaan worden. Loupe werd speciaal ontworpen om snel en makkelijk je blog te kunnen checken.', # Translate - New
	'Use Loupe to help manage your Movable Type blogs no matter where you are!' => 'Gebruik Loupe om u te helpen uw Movable Type blogs te beheren waar u ook bent', # Translate - New
	'Social Media' => 'Sociale Media', # Translate - New
	'https://twitter.com/movabletype' => 'https://twitter.com/movabletype', # Translate - New
	'Contact Us' => 'Contacteer ons', # Translate - New
	'http://www.movabletype.org/' => 'http://www.movabletype.org/', # Translate - New
	'http://plugins.movabletype.org' => 'http://plugins.movabletype.org', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_plain.tmpl
	'Loupe is ready for use!' => 'Loupe is klaar voor gebruik!', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_result.tmpl
	'Send Loupe welcome email' => 'Loupe welkomstmail versturen', # Translate - New

## plugins/Loupe/tmpl/widget/welcome_to_loupe.tmpl
	'Thank you for installing Loupe!' => 'Bedankt om Loupe te installeren!', # Translate - New
	q{Ready to use Loupe. Why don't you try Loupe right now?} => q{Klaar om Loupe te gebruiken.  Waarom probeert u het niet meteen?}, # Translate - New
	'Try using Loupe!' => 'Probeer Loupe!', # Translate - New
	'Send invitation email to users.' => 'Uitnodiging versturen naar gebruikers.', # Translate - New
	'Configure Loupe' => 'Loupe configureren', # Translate - New
	'Loupe can be used without complex configuration, you can get started immediately.' => 'Loupe kan gebruikt worden zonder complexe instellingen, u kunt onmiddelijk beginnen.', # Translate - New
	'Loupe cannot be used now. Please contact your Movable Type System Administrator.' => 'Loupe kan momenteel niet gebruikt worden.  Neem contact op met uw Movable Type systeembeheerder.', # Translate - New
	'The email address that should receive an invitation email from Movable Type.' => 'Het email adres dat een uitnodiging moet ontvangen van Movable Type.', # Translate - New
	'Send Invitation Mail' => 'Uitnodiging versturen', # Translate - New
	'Sent the invitation email containing the access URL for Loupe to \'[_1]\'.' => 'Uitnodiging met toegangs-URL voor Loupe werd verstuurd naar \'[_1]\'.', # Translate - New
        'Page Views' => 'pageviews', # Translate - New
        'Invalid date \'[_1]\'; \'Published on\' dates should be earlier than the corresponding \'Unpublished on\' date \'[_2]\'.' => 'Ongeldige datum \'[_1]\; Publicatiedatums moeten vallen voor de corresponderende \'Einddatum\' \'[_2]\'.', # Translate - New
        'Class Name' => 'naam klasse', # Translate - New
        q{Some ([_1]) of the selected user(s) could not be re-enabled because they had some invalid parameter(s). Please check the <a href='[_2]'>activity log</a> for more details.} => q{Sommige ([_1]) van de geselecteerde gebruikers konden niet opnieuw geactiveerd worden omdat ze ongeldige instelling(en) hadden. Kijk in het <a href='[_2]'>activiteitenlog</a> voor meer details.}, # Translate - New
        'Statistics Settings' => 'Instellingen voor statistieken', # Translate - New
        'This [_2] is using the settings of [_1].' => 'Deze [_2] gebruikt de instellingen van [_1].', # Translate - New
        'Loupe settings has been successfully. You can send invitation email to users via <a href="[_1]">Loupe Plugin Settings</a>.' => 'Instellen van Loupe voltooid.  U kunt uitnodigingsmails sturen naar gebruikers via de <a href="[_1]">Loupe Plugin instellingen</a>.', # Translate - New
        'Error saving Loupe settings: [_1]' => 'Fout bij opslaan Loupe instellingen:', # Translate - New
        'Send invitation email' => 'Uitnodigingsmail sturen', # Translate - New
        q{The URL of Loupe's HTML file.} => q{De URL van het HTML bestand van Loupe.}, # Translate - New
        'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics. <a href="http://www.movabletype.org/documentation/loupe/" target="_blank">See more details.</a>' => 'Loupe is een mobiel-vriendelijke alternatieve console voor Movable Type waarmee gebruikers berichten en reacties kunnen goedkeuren, foto\'s kunnen uploaden en website- en blogstatistieken mee kunnen bekijken. <a href="http://www.movabletype.org/documentation/loupe/" target="_blank">Meer details lezen.</a>', # Translate - New


);

1;
