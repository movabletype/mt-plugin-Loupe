package Loupe::App;
use strict;
use warnings;

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
        require Loupe;
        Loupe->delete_html;
    }
}

1;
