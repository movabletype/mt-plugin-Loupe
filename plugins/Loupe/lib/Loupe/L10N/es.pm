# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$

package Loupe::L10N::es;

use strict;
use warnings;

use base 'Loupe::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (

## plugins/Loupe/lib/Loupe/App.pm
	'Could not send a invitation mail because Loupe is not enabled.' => 'No se pudo enviar un correo de invitación porque Loupe no está habilitado.', # Translate - New
	'Welcome to Loupe' => 'Bienvenido a Loupe', # Translate - New

## plugins/Loupe/lib/Loupe/Mail.pm
	'Loupe invitation mail has been sent to [_3] for user \'[_1]\' (user #[_2]).' => 'El correo de invitación a Loupe fue enviado a [_3] para el usuario \'[_1]\' (usuario #[_2]).', # Translate - New

## plugins/Loupe/lib/Loupe.pm
	'Loupe\'s HTML file name must not be blank.' => 'El nombre del fichero HTML de Loupe no puede estar en blanco.', # Translate - New
	'The URL should not include any directory name: [_1]' => 'La URL no debería incluir ningún nombre de directorio: [_1]', # Translate - New
	'Could not create Loupe directory: [_1]' => 'No se pudo crear el directorio para Loupe: [_1]', # Translate - New
	'Loupe HTML file has been created: [_1]' => 'Se ha creado el fichero HTML para Loupe: [_1]', # Translate - New
	'Could not create Loupe HTML file: [_1]' => 'No se pudo crear el fichero HTML para Loupe: [_1]', # Translate - New
	'Loupe HTML file has been deleted: [_1]' => 'El fichero HTML para Loupe ha sido borrado: [_1]', # Translate - New
	'Could not delete Loupe HTML file: [_1]' => 'No se pudo borrar el fichero HTML para Loupe: [_1]', # Translate - New

## plugins/Loupe/lib/Loupe/Upgrade.pm
	'Adding Loupe dashboard widget...' => 'Añadiendo panel de control para Loupe...', # Translate - New

## plugins/Loupe/Loupe.pl
	'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics.' => 'Loupe es una consola de Movable Type pensada para móbiles, que permite a los usuarios aprobar entradas pendientes, subir imágenes y comprobar las estadísticas.', # Translate - New

## plugins/Loupe/tmpl/system_config.tmpl
	'Enable Loupe' => 'Activar Loupe', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_html.tmpl
	'Your MT blog status at a glance' => 'El estado de su blog de MT de un vistazo', # Translate - New
	'Dear [_1], ' => 'Estimado/a [_1]', # Translate - New
	'With Loupe, you can check the status of your blog without having to sign in to your Movable Type account.' => 'Con Loupe, puede comprobar el estado del blog sin iniciar una sesión en Movable Type.', # Translate - New
	'View Access Analysis' => 'Ver estadísticas de acceso', # Translate - New
	'Approve Entries' => 'Aprobar entradas', # Translate - New
	'Reply to Comments' => 'Responder a comentarios', # Translate - New
	'Loupe is best used with a smartphone (iPhone or Android 4.0 or higher)' => 'Loupe está optimizado para móviles inteligentes (iPhone o Android 4.0 o mayor)', # Translate - New
	'Try Loupe' => 'Probar Loupe', # Translate - New
	'Perfect for Mini-tasking' => 'Perfecto para mini-tareas', # Translate - New
	'_LOUPE_BRIEF' => q{"¿Cuáles de mis entradas son populares en este momento?" "¿Tengo entradas pendientes de aprobación?" "Debo responder a este comentario cuanto antes..." Puede realizar todas estas minitareas desde un móvil inteligente. Hemos diseñado Loupe para que echar un ojo a sus blogs sea lo más simple posible.}, # Translate - New
	'Use Loupe to help manage your Movable Type blogs no matter where you are!' => '¡Utilice Loupe para administrar Movable Type allá donde se encuentre!', # Translate - New
	'Social Media' => 'Medios sociales', # Translate - New
	'https://twitter.com/movabletype' => 'https://twitter.com/movabletype', # Translate - New
	'Contact Us' => 'Contacto', # Translate - New
	'http://www.movabletype.org/' => 'http://www.movabletype.org/', # Translate - New
	'http://plugins.movabletype.org' => 'http://plugins.movabletype.org/', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_plain.tmpl
	'Loupe is ready for use!' => '¡Loupe está listo para su uso!', # Translate - New

## plugins/Loupe/tmpl/welcome_mail_result.tmpl
	'Send Loupe welcome email' => 'Enviar correo de bienvenida a Loupe', # Translate - New

## plugins/Loupe/tmpl/widget/welcome_to_loupe.tmpl
	'Thank you for installing Loupe!' => '¡Gracias por instalar Loupe!', # Translate - New
	q{Ready to use Loupe. Why don't you try Loupe right now?} => q{Listo para usar Loupe. ¿Por qué no lo prueba ahora mismo?}, # Translate - New
	'Try using Loupe!' => '¡Pruebe a usar Loupe!', # Translate - New
	'Send invitation email to users.' => 'Enviar invitación por correo a los usuarios.', # Translate - New
	'Configure Loupe' => 'Configurar Loupe', # Translate - New
	'Loupe can be used without complex configuration, you can get started immediately.' => 'Loupe no necesita una configuración compleja, puede comenzar a usarlo de inmediato.', # Translate - New
	'Loupe cannot be used now. Please contact your Movable Type System Administrator.' => 'En estos momentos no se puede usar Loupe. Por favor, contacte con su administrador de Movable Type.', # Translate - New
	'The email address that should receive an invitation email from Movable Type.' => 'La dirección de correo que debe recibir la invitación de Movable Type.', # Translate - New
	'Send Invitation Mail' => 'Enviar correo de invitación', # Translate - New
	'Sent the invitation email containing the access URL for Loupe to \'[_1]\'.' => 'Se envió el correo de invitación con la URL de acceso a Loupe a \'[_1]\'.', # Translate - New
        'This [_2] is using the settings of [_1].' => 'Este [_2] está usando la configuración de [_1].', # Translate - New
        'Error saving Loupe settings: [_1]' => 'Error guardando la configuración de Loupe', # Translate - New
        'Send invitation email' => 'Enviar correo de invitación', # Translate - New
        q{The URL of Loupe's HTML file.} => q{La URL del fichero HTML de Loupe.}, # Translate - New
        'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics. <a href="http://www.movabletype.org/documentation/loupe/" target="_blank">See more details.</a>' => 'Loupe es una consola alternativa para Movable Type especialmente diseñada para dispositivos móviles, que permite aprobar entradas y comentarios pendientes, subir fotografías, y consultar las estadísticas de los blogs y los sitios web. Consulta <a href="http://www.movabletype.org/documentation/loupe/" target="_blank">más información</a>.', # Translate - New

);

1;
