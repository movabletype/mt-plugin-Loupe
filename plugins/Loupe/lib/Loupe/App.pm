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
                $param->{user_email} = $app->user->email || '';
                $param->{loupe_is_enabled} = Loupe->is_enabled;
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
                my $app = MT->app;
                my $user = $app->user or return;
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

1;
