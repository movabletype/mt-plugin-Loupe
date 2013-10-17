#!/usr/bin/perl
use strict;
use warnings;

BEGIN {
    $ENV{MT_CONFIG} = 'mysql-test.cfg';
}

use lib qw( lib extlib t/lib );

use MT::Test qw( :app :db );
use MT::Test::Permission;
use Test::More;

# Remove schema version of Loupe.
my $config    = MT::Config->load;
my $data      = $config->data;
my @lines     = split /\n/, $data;
my @new_lines = grep { $_ !~ m/Loupe/ } @lines;
my $new_data  = join "\n", @new_lines;
$config->data($new_data);
$config->save or die $config->errstr;

# Create user widgets data.
require MT::App::CMS;
my $core_widgets = MT::App::CMS::core_widgets( MT->app );
my %default_widgets;
my $scope = 'user';
foreach my $key ( keys %$core_widgets ) {
    my ( $view, $order, $set, $param, $default )
        = map { $core_widgets->{$key}{$_} }
        qw( view order set param default );

    my @views = ref($view) ? @$view : ($view);
    next unless grep { $scope eq $_ } @views;
    next unless ( ref($default) && $default->{$scope} ) || $default;

    $default_widgets{$key} = {
        order => ref($order) ? $order->{$scope} : $order,
        set   => ref($set)   ? $set->{$scope}   : $set,
        $param ? ( param => $param ) : (),
    };
}
my $widgets = { 'dashboard:user:1' => \%default_widgets };

my $admin = MT::Author->load(1);
$admin->widgets($widgets);
$admin->save or die $admin->errstr;

my ( $app, $out );

$app = _run_app(
    'MT::App::Upgrader',
    {   __request_method => 'POST',
        __mode           => 'upgrade',
        username         => 'Melody',
        password         => 'Nelson',
    },
);
$out = delete $app->{__test_output};
my $json_steps = $app->response;

while ( @{ $json_steps->{steps} || [] } ) {

    require MT::Util;
    $json_steps = MT::Util::to_json( $json_steps->{steps} );

    require MT::App::Upgrader;
    $app = _run_app(
        'MT::App::Upgrader',
        {   __request_method => 'POST',
            username         => 'Melody',
            password         => 'Nelson',
            __mode           => 'run_actions',
            steps            => $json_steps,
        },
    );
    $out = delete $app->{__test_output};

    $out =~ s/^.*JSON://s;

    require JSON;
    $json_steps = JSON::from_json($out);

    ok( !$json_steps->{error}, 'Upgrade request has no error.' );

}

$admin = MT::Author->load(1);
my $loupe_widget = {
    order => 150,
    set   => 'main',
};
is_deeply( $admin->widgets->{'dashboard:user:1'}{welcome_to_loupe},
    $loupe_widget, 'Added welcome to Loupe widget.' );

done_testing;

