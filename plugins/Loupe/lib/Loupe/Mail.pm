# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$
package Loupe::Mail;
use strict;
use warnings;

use Email::MIME;

use MT::Mail;
use Loupe;
use Loupe::Mail::StaticResource;

sub send {
    my ( $class, $app, $ids ) = @_;

    my $plugin = MT->component('Loupe');
    my @msg_loop;
    my $error;

    foreach (@$ids) {
        my $author = MT::Author->load($_)
            or next;
        my $param = {
            loupe_html_url => Loupe->html_url,
            loupe_site_url => Loupe->official_site_url,
            username       => $author->nickname,
        };

        my $res;
        if ( $author->email ) {
            my $mail = _create_multipart_mail( $app, $param );
            my $body = $mail->body_raw;
            my %head = (
                'Content-Type' => $mail->content_type,
                id             => 'send_welcome_mail',
                To             => $author->email,
                From => $app->config('EmailAddressMain') || $app->user->email,
                Subject => $plugin->translate('Welcome to Loupe'),
            );
            if ( MT::Mail->send( \%head, $body ) ) {
                $res
                    = $plugin->translate(
                    "Loupe invitation mail has been sent to [_3] for user '[_1]' (user #[_2]).",
                    $author->name, $author->id, $author->email );
                $app->log(
                    {   message  => $res,
                        level    => MT::Log::INFO(),
                        class    => 'system',
                        category => 'loupe'
                    }
                );
            }
            else {
                $error = 1;
                $res   = $plugin->translate(
                    "Error sending e-mail ([_1]); Please fix the problem, then "
                        . "try again to recover your password.",
                    MT::Mail->errstr
                );
                $app->log(
                    {   message  => $res,
                        level    => MT::Log::ERROR(),
                        class    => 'system',
                        category => 'loupe',
                    }
                );
            }
        }
        else {
            $error = 1;
            $res
                = $plugin->translate(
                "User '[_1]' (user #[_2]) does not have email address",
                $author->name, $author->id );
        }

        push @msg_loop, { message => $res };
    }

    return ( \@msg_loop, $error );
}

sub _create_multipart_mail {
    my ( $app, $param ) = @_;

    my $plain_param = {%$param};
    my $html_param  = {%$param};

    my @png_mime;
    foreach my $name (qw( logo main_access main_approve main_comments )) {
        my ( $mime, $cid ) = _create_png_part($name);
        push @png_mime, $mime;
        $html_param->{$name} = $cid;
    }

    my $plain_mime = _create_plain_part( $app, $plain_param );
    my $html_mime = _create_html_part( $app, $html_param );

    my $mime = Email::MIME->create(
        attributes => { content_type => 'multipart/related', },
        parts      => [
            do {
                my $mime = Email::MIME->create;
                _remove_headers($mime);
                $mime->header_set(
                    'Content-Type' => 'multipart/alternative' );
                $mime->parts_set( [ $plain_mime, $html_mime ] );
                $mime;
            },
            @png_mime,
        ],
    );
    _remove_headers($mime);
    return $mime;
}

sub _create_png_part {
    my $name = shift;
    my $mime = Email::MIME->create(
        attributes => {
            content_type => 'image/png',
            name         => $name . '.png',
        },
        body => Loupe::Mail::StaticResource->$name(),
    );
    _remove_headers($mime);
    my $cid = $mime->_get_cid;
    $mime->header_set( 'Content-ID'                => "<$cid>" );
    $mime->header_set( 'Content-Transfer-Encoding' => 'base64' );
    return ( $mime, $cid );
}

sub _create_plain_part {
    my ( $app, $param ) = @_;
    my $plugin = MT->component('Loupe');

    my $mime = Email::MIME->create(
        attributes => {
            content_type => 'text/plain',
            charset      => 'UTF-8',
            encoding     => 'base64',
        },
        body_str => do {
            my $tmpl
                = $plugin->load_tmpl( 'welcome_mail_plain.tmpl', $param );
            $app->build_page_in_mem($tmpl);
        },
    );
    _remove_headers($mime);
    return $mime;
}

sub _create_html_part {
    my ( $app, $param ) = @_;
    my $plugin = MT->component('Loupe');

    my $mime = Email::MIME->create(
        attributes => {
            content_type => 'text/html',
            charset      => 'UTF-8',
            encoding     => 'base64',
        },
        body_str => do {
            my $tmpl = $plugin->load_tmpl( 'welcome_mail_html.tmpl', $param );
            $app->build_page_in_mem($tmpl);
        },
    );
    _remove_headers($mime);
    return $mime;
}

sub _remove_headers {
    my $mime = shift;
    foreach (qw( Date MIME-Version )) {
        $mime->header_set( $_ => () );
    }
}

1;
