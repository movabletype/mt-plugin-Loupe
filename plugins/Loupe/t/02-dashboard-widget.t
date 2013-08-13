#!/usr/bin/perl
use strict;
use warnings;

BEGIN {
    use Test::More;
    eval { require Test::MockModule }
        or plan skip_all => 'Test::MockModule is not installed.';

    $ENV{MT_CONFIG} = 'mysql-test.cfg';
}

use lib qw( lib extlib t/lib );

use MT::Test qw( :db :app );
use MT::Test::Permission;

my $admin  = MT::Author->load(1);
my $aikawa = MT::Test::Permission->make_author(
    name     => 'aikawa',
    nickname => 'Ichiro Aikawa',
);

my $website = MT::Website->load(1);

my $editor = MT::Role->load( { name => 'Editor' } );

require MT::Association;
MT::Association->link( $aikawa => $editor => $website );

my ( $app, $out );

subtest 'Plugin setting is not configured' => sub {

    subtest 'By administrator' => sub {
        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $admin,
                __mode      => 'dashboard',
            },
        );
        $out = delete $app->{__test_output};
        ok( $out && $out =~ m/Status: 200/, 'Request ok.' );
        my $widget = quotemeta
            '<div id="welcome_to_loupe" class="widget welcome-to-loupe">';
        ok( $out =~ m/$widget/, 'Dashboard has welcome to Loupe widget.' );
        my $msg = quotemeta
            'Loupe can be used without complex configuration, you can get started immediately.';
        ok( $out =~ m/$msg/, 'Widget message ok.' );
    };

    subtest 'By editor user' => sub {
        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $aikawa,
                __mode      => 'dashboard',
            },
        );
        $out = delete $app->{__test_output};
        ok( $out && $out =~ m/Status: 200/, 'Request ok.' );
        my $widget = quotemeta
            '<div id="welcome_to_loupe" class="widget welcome-to-loupe">';
        ok( $out !~ m/$widget/,
            'Dashboard does not have welcome to Loupe widget.' );
    };

};

subtest 'Plugin setting is configured' => sub {
    my $module = Test::MockModule->new('Loupe');
    $module->mock( 'is_enabled', sub {1} );

    subtest 'By administrator' => sub {
        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $admin,
                __mode      => 'dashboard',
            },
        );
        $out = delete $app->{__test_output};
        ok( $out && $out =~ m/Status: 200/, 'Request ok.' );
        my $widget = quotemeta
            '<div id="welcome_to_loupe" class="widget welcome-to-loupe">';
        ok( $out =~ m/$widget/, 'Dashboard has welcome to Loupe widget.' );
        my $links
            = quotemeta '<a href="'
            . $app->uri
            . '?__mode=list&_type=author&blog_id=0">Send invitation email to users.</a> | <a href="'
            . $app->uri
            . '?__mode=cfg_plugins&blog_id=0">Configure Loupe</a>';
        ok( $out =~ m/$links/, 'Widget has links' );
    };

    subtest 'By editor user' => sub {
        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $aikawa,
                __mode      => 'dashboard',
            },
        );
        $out = delete $app->{__test_output};
        ok( $out && $out =~ m/Status: 200/, 'Request ok.' );
        my $widget = quotemeta
            '<div id="welcome_to_loupe" class="widget welcome-to-loupe">';
        ok( $out =~ m/$widget/, 'Dashboard has welcome to Loupe widget.' );
        my $links
            = quotemeta '<a href="'
            . $app->uri
            . '?__mode=list&_type=author&blog_id=0">Send invitation email to users.</a> | <a href="'
            . $app->uri
            . '?__mode=cfg_plugins&blog_id=0">Configure Loupe</a>';
        ok( $out !~ m/$links/, 'Widget does not have links' );
    };

};

done_testing;

