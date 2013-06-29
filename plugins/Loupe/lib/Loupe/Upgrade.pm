package Loupe::Upgrade;
use strict;
use warnings;

sub upgrade_functions {
    return {
        add_welcome_to_loupe_widget => {
            priority => 4.1,
            updater  => {
                type  => 'author',
                label => 'Adding welcome to Loupe widget...',
                code  => \&_add_welcome_to_loupe_widget,
            },
        },
    };
}

sub _add_welcome_to_loupe_widget {
    my $user    = shift;
    my $widgets = $user->widgets;

    if ($widgets) {
        foreach my $key ( keys %$widgets ) {
            my @keys = split ':', $key;
            if ( $keys[0] eq 'dashboard' && $keys[1] eq 'user' ) {
                my @widget_keys = keys %{ $widgets->{$key} };
                unless ( grep { $_ eq 'welcome_to_loupe' } @widget_keys ) {
                    foreach my $widget_key (@widget_keys) {
                        if ( $keys[1] eq 'user' ) {
                            next
                                if ( $widget_key eq 'notification_dashboard'
                                || $widgets->{$key}->{$widget_key}->{set} eq
                                'main' );
                        }
                        $widgets->{$key}->{$widget_key}->{order} += 1;
                    }
                    $widgets->{$key}->{'welcome_to_loupe'} = {
                        order => 2,
                        set   => 'main',
                    };
                }
            }
        }
    }
    else {
        $widgets->{ 'dashboard:user:' . $user->id } = {
            welcome_to_loupe => {
                order => 2,
                set   => 'main',
            },
        };
    }

    $user->widgets($widgets);
    $user->save;

    1;
}

1;
