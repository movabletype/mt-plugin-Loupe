# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$
package Loupe::Upgrade;
use strict;
use warnings;

sub upgrade_functions {
    return {
        add_welcome_to_loupe_widget => {
            priority => 4.1,
            updater  => {
                type  => 'author',
                label => 'Adding Loupe dashboard widget...',
                code  => \&_add_welcome_to_loupe_widget,
            },
        },
    };
}

sub _add_welcome_to_loupe_widget {
    my $user    = shift;
    my $widgets = $user->widgets;
    return 1 unless $widgets;

    foreach my $key ( keys %$widgets ) {
        my @keys = split ':', $key;
        if ( $keys[0] eq 'dashboard' && $keys[1] eq 'user' ) {
            my @widget_keys = keys %{ $widgets->{$key} };
            unless ( grep { $_ eq 'welcome_to_loupe' } @widget_keys ) {
                $widgets->{$key}->{'welcome_to_loupe'} = {
                    order => 150,
                    set   => 'main',
                };
            }
        }
    }

    $user->widgets($widgets);
    $user->save;

    1;
}

1;
