package MT::Plugin::Loupe;
use strict;
use warnings;
use base qw( MT::Plugin );

use Loupe::Const;

our $VERSION = '1.00';

my $plugin = MT::Plugin::Loupe->new(
    {   id   => 'Loupe',
        name => 'Loupe',
        description =>
            '<MT_TRANS phrase="Loupe is the application for operating the user daily task easily.">',
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
                        send_welcome_mail => {
                            code =>
                                '$Loupe::Loupe::App::send_welcome_mail_to_yourself',
                            app_mode => 'JSON',
                        },
                    },
                    widgets => '$Loupe::Loupe::App::widgets',
                    list_actions =>
                        { author => '$Loupe::Loupe::App::list_actions' },
                },
            },
            callbacks => {
                'MT::Config::post_save' =>
                    '$Loupe::Loupe::App::post_save_config',
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
