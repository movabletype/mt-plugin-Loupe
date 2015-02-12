# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$
package MT::Plugin::Loupe;
use strict;
use warnings;
use base qw( MT::Plugin );

use Loupe::Const;

our $VERSION = '1.1';

my $plugin = MT::Plugin::Loupe->new(
    {   id   => 'Loupe',
        name => 'Loupe',
        description =>
            '<MT_TRANS phrase="Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics.">',
        version                => $VERSION,
        schema_version         => $VERSION,
        author_name            => 'Six Apart, Ltd.',
        author_link            => 'http://www.movabletype.org/',
        system_config_template => 'system_config.tmpl',
        settings               => new MT::PluginSettings(
            [   [ 'enabled', { Default => undef, Scope => 'system' } ],
                [   'file',
                    {   Default => $Loupe::Const::DEFAULT_HTML,
                        Scope   => 'system',
                    }
                ],
                [ 'html_path', { Default => undef, Scope => 'System' } ],
            ]
        ),
        l10n_class => 'Loupe::L10N',
        registry   => {
            applications => {
                cms => {
                    methods => {
                        save_loupe_config => {
                            code => '$Loupe::Loupe::App::save_loupe_config',
                        },
                        dialog_invitation_email => {
                            code =>
                                '$Loupe::Loupe::App::dialog_invitation_email',
                        },
                        send_invitation_email => {
                            code =>
                                '$Loupe::Loupe::App::send_invitation_email',
                        },
                    },
                    widgets => '$Loupe::Loupe::App::widgets',
                },
            },
            callbacks => {
                'MT::Config::post_save' =>
                    '$Loupe::Loupe::App::post_save_config',
                'MT::App::CMS::template_source.header' =>
                    '$Loupe::Loupe::App::template_source_header',
            },
            upgrade_functions => '$Loupe::Loupe::Upgrade::upgrade_functions',
        },
    }
);
MT->add_plugin($plugin);

sub save_config {
    my $self = shift;
    my ( $param, $scope ) = @_;

    require Loupe;
    Loupe->is_valid_file_path( $param->{file} )
        or die Loupe->errstr;

    Loupe->delete_html or die Loupe->errstr;

    if ( $param->{enabled} ) {
        Loupe->create_html( $param->{file} )
            or die Loupe->errstr;

        $param->{html_path} = Loupe->get_html_path( $param->{file} );
        $self->set_config_value( 'html_path', $param->{html_path} );
    }

    $self->SUPER::save_config( $param, $scope );
}

sub reset_config {
    my $self = shift;
    my ( $param, $scope ) = @_;

    require Loupe;
    Loupe->delete_html or die Loupe->errstr;

    $self->SUPER::reset_config( $param, $scope );
}

sub config_template {
    my $self = shift;
    my ( $param, $scope ) = @_;

    require Loupe;
    $param->{support_directory_url} = Loupe->support_directory_url;

    $self->SUPER::config_template( $param, $scope );
}

1;
