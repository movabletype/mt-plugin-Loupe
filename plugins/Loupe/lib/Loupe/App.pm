# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$
package Loupe::App;
use strict;
use warnings;

use Loupe;

sub save_loupe_config {
    my $app = shift;

    $app->validate_magic or return;

    return $app->errtrans('Invalid request.')
        unless $app->request_method eq 'POST';

    return $app->permission_denied()
        unless $app->can_do('save_plugin_setting');

    my $file = $app->param('file');
    my %args = ( loupe_file => $file );
    if ( !Loupe->is_valid_file_path($file) ) {
        $args{loupe_filepath_error} = 1;
    }
    elsif ( !Loupe->delete_html ) {
        $args{loupe_delete_error} = 1;
    }
    elsif ( !Loupe->create_html($file) ) {
        $args{loupe_create_error} = 1;
    }
    else {
        my $html_path = Loupe->get_html_path($file);
        my $plugin    = MT->component('Loupe');
        $plugin->set_config_value( 'html_path', $html_path );
        require MT::Plugin;
        MT::Plugin::save_config(
            $plugin,
            {   enabled   => 1,
                file      => $file,
                html_path => $html_path,
            }
        );

        %args = ( loupe_saved => 1 );
    }

    $app->request( 'loupe_config', \%args );

    # Need to change mode for forwarding to user dashboard.
    $app->mode('dashboard');
    $app->forward('dashboard');
}

sub dialog_invitation_email {
    my $app = shift;

    my $user = $app->user;
    return $app->perission_denied unless $user->is_superuser;

    my $plugin = $app->component('Loupe');
    my $hasher = sub {
        my ( $obj, $row ) = @_;
        $row->{label}       = $row->{name};
        $row->{description} = $row->{nickname};
    };

    # Change temporarily MT::Component::template_paths()
    # to load plugin's template file.
    require File::Spec;
    require MT::Component;
    my $template_paths = \&MT::Component::template_paths;
    no warnings 'redefine';
    local *MT::Component::template_paths = sub {
        (   File::Spec->catdir( $plugin->{path}, 'tmpl' ),
            $template_paths->(@_)
        );
    };

    $app->listing(
        {   type  => 'author',
            terms => {
                type   => MT::Author::AUTHOR(),
                status => MT::Author::ACTIVE(),
            },
            args => {
                sort => 'name',
                join => MT::Permission->join_on(
                    'author_id',
                    { permissions => { not => "'comment'" } },
                    { unique      => 1 },
                ),
            },
            code     => $hasher,
            template => 'dialog/select_users.tmpl',
            params   => {
                dialog_title  => $plugin->translate('Send invitation email'),
                items_prompt  => $app->translate("Selected author"),
                search_prompt => $app->translate(
                    "Type a username to filter the choices below."),
                panel_label       => $app->translate('Username'),
                panel_description => $app->translate('Display Name'),
                panel_type        => 'author',
                panel_multi       => 1,
                panel_searchable  => 1,
                panel_first       => 1,
                panel_last        => 1,
                list_noncron      => 1,
                idfield           => scalar( $app->param('idfield') ),
                namefield         => scalar( $app->param('namefield') ),
            },
        }
    );
}

sub send_invitation_email {
    my $app = shift;

    return $app->permission_denied()
        unless $app->user->is_superuser();

    return $app->errtrans('Invalid request.')
        unless $app->request_method eq 'POST';

    my $plugin = MT->component('Loupe');
    return $app->error(
        $plugin->translate(
            'Could not send a invitation mail because Loupe is not enabled.')
    ) unless Loupe->is_enabled;

    my @id = $app->param('ids');
    require Loupe::Mail;
    my ($msg_loop) = Loupe::Mail->send( $app, \@id );

    $plugin->load_tmpl( 'dialog/welcome_mail_result.tmpl',
        { message_loop => $msg_loop, return_url => $app->return_uri } );

}

sub widgets {
    my $app = MT->app;
    my $user = $app->user or return;
    return {
        welcome_to_loupe => {
            label    => 'Welcome to Loupe',
            template => 'widget/welcome_to_loupe.tmpl',
            condition =>
                sub { MT->app->user->is_superuser && !Loupe->is_enabled },
            handler => sub {
                my $app = shift;
                my ( $tmpl, $param ) = @_;
                my $plugin = $app->component('Loupe');
                my $hash   = $plugin->get_config_hash;
                $param->{$_} = $hash->{$_} foreach qw( enabled file );
                $param->{support_directory_url}
                    = Loupe->support_directory_url;
                my $loupe_config = $app->request('loupe_config');
                $param->{loupe_error}
                    = $loupe_config->{loupe_filepath_error}
                    || $loupe_config->{loupe_delete_error}
                    || $loupe_config->{loupe_create_error};

                if ( $param->{loupe_error} ) {
                    $param->{file} = $loupe_config->{loupe_file};
                }
            },
            singular => 1,
            set      => 'main',
            view     => 'user',
            order    => { user => 150 },
            default  => 1,
        },
    };
}

sub list_actions {
    return {
        send_welcome_mail => {
            label                   => 'Send Loupe invitation email',
            order                   => 100,
            continue_prompt_handler => sub {
                MT->translate(
                    'Are you sure you want to send an invitation email to selected users?'
                );
            },
            condition => sub {
                my $app  = MT->app;
                my $user = $app->user;
                $user && $user->is_superuser && Loupe->is_enabled;
            },
            code => \&_send_welcome_mail,
        },
    };
}

sub _send_welcome_mail {
    my $app = shift;

    return $app->permission_denied()
        unless $app->user->is_superuser();

    return $app->errtrans('Invalid request.')
        unless $app->request_method eq 'POST';

    my $plugin = MT->component('Loupe');
    return $app->error(
        $plugin->translate(
            'Could not send a invitation mail because Loupe is not enabled.')
    ) unless Loupe->is_enabled;

    my @id = $app->param('id');
    require Loupe::Mail;
    my ($msg_loop) = Loupe::Mail->send( $app, \@id );

    $plugin->load_tmpl( 'welcome_mail_result.tmpl',
        { message_loop => $msg_loop, return_url => $app->return_uri } );
}

sub post_save_config {
    my $app = MT->app;
    return unless $app && $app->isa('MT::App::CMS');

    my $mode       = $app->mode                || '';
    my $plugin_sig = $app->param('plugin_sig') || '';
    my $state      = $app->param('state')      || '';

    if (   $mode eq 'plugin_control'
        && $state eq 'off'
        && ( $plugin_sig eq '*' || $plugin_sig eq 'Loupe/Loupe.pl' ) )
    {
        Loupe->delete_html;
    }
}

sub template_source_header {
    my ( $cb, $app, $tmpl ) = @_;

    my $blog_id = $app->param('blog_id');
    return
        unless $app->mode eq 'dashboard'
        && !defined($blog_id);

    my $loupe_config = $app->request('loupe_config');
    return unless $loupe_config;

    my $plugin = $app->component('Loupe');
    my $msg;
    if ( $loupe_config->{loupe_saved} ) {
        require MT::Util;
        my $plugin_hash
            = MT::Util::perl_sha1_digest_hex( $plugin->{plugin_sig} );
        $msg = <<"__TMPL__";
    <mt:setvarblock name="system_msg" append="1">
      <mtapp:statusmsg
        id="enabled_loupe"
        class="success">
        <__trans phrase="Loupe settings has been successfully. You can send invitation email to users via <a href="[_1]">Loupe Plugin Settings</a>." params="<mt:var name="script_url">?__mode=cfg_plugins&blog_id=0#plugin-$plugin_hash">
      </mtapp:statusmsg>
    </mt:setvarblock>
__TMPL__
    }
    elsif ($loupe_config->{loupe_filepath_error}
        || $loupe_config->{loupe_delete_error}
        || $loupe_config->{loupe_create_error} )
    {
        my $phrase;
        if ( $loupe_config->{loupe_filepath_error} ) {
            $phrase = "file path is invalid.";
        }
        elsif ( $loupe_config->{loupe_delete_error} ) {
            $phrase = "cannot delete old Loupe's HTML file.";
        }
        elsif ( $loupe_config->{loupe_create_error} ) {
            $phrase = "cannot create Loupe's HTML file.";
        }
        $plugin = $plugin->translate($phrase);

        $msg = <<"__TMPL__";
    <mt:setvarblock name="system_msg" append="1">
      <mtapp:statusmsg
        id="error_loupe"
        class="error"
        can_close=0>
        <__trans phrase="Error saving Loupe settings: [_1]", params="$phrase">
      </mtapp:statusmsg>
    </mt:setvarblock>
__TMPL__
    }

    $$tmpl = $msg . $$tmpl;
}

1;
