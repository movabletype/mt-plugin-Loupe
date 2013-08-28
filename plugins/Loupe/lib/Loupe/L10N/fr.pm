# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$

package Loupe::L10N::fr;

use strict;
use warnings;

use base 'Loupe::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (

## plugins/Loupe/lib/Loupe/App.pm
	'Are you sure you want to send an invitation email to selected users?' => 'Êtes-vous sûr de vouloir envoyer une invitation aux utilisateurs séectionnés ?', # Translate - New
	'Could not send a invitation mail because Loupe is not enabled.' => 'Impossible d\'envoyer un e-mail d\'invitation car Loupe n\'est pas activée.', # Translate - New
	'Welcome to Loupe' => 'Bienvenue sur Loupe', # Translate - New
	'Send Loupe invitation email' => 'Envoyer une invitation à Loupe', # Translate - New

## plugins/Loupe/lib/Loupe/Mail.pm
	'Loupe invitation mail has been sent to [_3] for user \'[_1]\' (user #[_2]).' => 'Un e-mail d\'invitation a été envoyé à [_3] pour l\'utilisateur \'[_1]\' (utilisateur #[_2]).', # Translate - New

## plugins/Loupe/lib/Loupe.pm
	'Loupe\'s HTML file name must not be blank.' => 'Le nom du fichier HTML de Loupe ne peut pas être vide.', # Translate - New
	'The URL should not include any directory name: [_1]' => 'L\'URL ne doit contenir aucun nom de répertoire : [_1]', # Translate - New
	'Could not create Loupe directory: [_1]' => 'Impossible de créer le répertoire de Loupe : [_1]', # Translate - New
	'Loupe HTML file has been created: [_1]' => 'Le fichier HTML de Loupe a été créé : [_1]', # Translate - New
	'Could not create Loupe HTML file: [_1]' => 'Impossible de créer le fichier HTML de Loupe : [_1]', # Translate - New
	'Loupe HTML file has been deleted: [_1]' => 'Le fichier HTML de Loupe a été supprimé : [_1]', # Translate - New
	'Could not delete Loupe HTML file: [_1]' => 'Impossible de supprimer le fichier HTML de Loupe : [_1]', # Translate - New

## plugins/Loupe/lib/Loupe/Upgrade.pm
	'Adding Loupe dashboard widget...' => 'Ajout du widget Loupe au tableau de bord...', # Translate - New

## plugins/Loupe/Loupe.pl
	'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics.' => 'Loupe est une interface Movable Type alternative conçue pour mobile qui permet aux utilisateurs de modérer notes et commentaires, charger des images et voir les statistiques des sites et des blogs.', # Translate - New

## plugins/Loupe/tmpl/system_config.tmpl
	'Enable Loupe' => 'Activer Loupe', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_html.tmpl
	'Your MT blog status at a glance' => 'Le status de votre blog MT en un coup d\'œil', # Translate - New
	'Dear [_1], ' => 'Cher [_1]', # Translate - New
	'With Loupe, you can check the status of your blog without having to sign in to your Movable Type account.' => 'Avec Loupe vous pouvez surveiller l\'état de votre blog sans avoir à vous connecter à votre compte Movable Type.', # Translate - New
	'View Access Analysis' => 'Voir les statistiques d\'accès', # Translate - New
	'Approve Entries' => 'Approuver des notes', # Translate - New
	'Reply to Comments' => 'Répondre aux commentaires', # Translate - New
	'Loupe is best used with a smartphone (iPhone or Android 4.0 or higher)' => 'Loupe est conçu pour les smartphones (iPhone ou Android 4.0 ou supérieur)', # Translate - New
	'Try Loupe' => 'Essayez Loupe', # Translate - New
	'Perfect for Mini-tasking' => 'Parfait pour les mini-tâches', # Translate - New
	'_LOUPE_BRIEF' => '« Laquelle de mes notes est la plus populaire maintenant ? » « Ai-je des notes en attente d\'approbation ? » « Je dois vraiment répondre à ce commentaire rapidement… » Toutes ces mini-tâches peuvent être faites directement depuis votre smartphone. Nous avons conçu Loupe pour gérer vos blogs aussi facilement que possible.', # Translate - New
	'Use Loupe to help manage your Movable Type blogs no matter where you are!' => 'Utilisez Loupe pour gérer vos blogs Movable Type où que vous soyez !', # Translate - New
	'Social Media' => 'Média sociaux', # Translate - New
	'https://twitter.com/movabletype' => 'https://twitter.com/movabletype', # Translate - New
	'Contact Us' => 'Nous contacter', # Translate - New
	'http://www.movabletype.org/' => 'http://www.movabletype.org/', # Translate - New
	'http://plugins.movabletype.org' => 'http://plugins.movabletype.org', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_plain.tmpl
	'Loupe is ready for use!' => 'Loupe est prête à l\'emploi !', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_result.tmpl
	'Send Loupe welcome email' => 'Envoyer un e-mail d\'invitation à Loupe', # Translate - New

## plugins/Loupe/tmpl/widget/welcome_to_loupe.tmpl
	'Thank you for installing Loupe!' => 'Merci d\'avoir installé Loupe !', # Translate - New
	q{Ready to use Loupe. Why don't you try Loupe right now?} => q{Loupe est prête à l'emploi. Voudriez-vous l'essayer dès maintenant ?}, # Translate - New
	'Try using Loupe!' => 'Essayez Loupe !', # Translate - New
	'Send invitation email to users.' => 'Envoyer un e-mail d\'invitation aux utilisateurs.', # Translate - New
	'Configure Loupe' => 'Configurer Loupe', # Translate - New
	'Loupe can be used without complex configuration, you can get started immediately.' => 'Loupe peut être utilisée sans configuration compliquée, vous pouvez démarrer immédiatement.', # Translate - New
	'Loupe cannot be used now. Please contact your Movable Type System Administrator.' => 'Loupe ne peut pas être utilisée maintenant. Veuillez contacter votre administrateur système Movable Type.', # Translate - New
	'The email address that should receive an invitation email from Movable Type.' => 'L\'adresse e-mail à laquelle envoyer une invation depuis Movable Type.', # Translate - New
	'Send Invitation Mail' => 'Envoyer l\'e-mail d\'invitation', # Translate - New
	'Sent the invitation email containing the access URL for Loupe to \'[_1]\'.' => 'Envoyer l\'e-mail d\'invitation contenant l\'URL pour accéder à Loupe à \'[_1]\'.', # Translate - New


);

1;
