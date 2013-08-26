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

use Loupe;

# Prepare tests
my $admin  = MT::Author->load(1);
my $aikawa = MT::Test::Permission->make_author(
    name     => 'aikawa',
    nickname => 'Ichiro Aikawa',
);

my $website = MT::Website->load(1);

my $editor = MT::Role->load( { name => 'Editor' } );

require MT::Association;
MT::Association->link( $aikawa => $editor => $website );

# Run tests
my ( $app, $out );

subtest 'Plugin setting is not configured' => sub {

    my @suite = (
        { name => 'By administrator', user => $admin,  has_widget => 1 },
        { name => 'By editor user',   user => $aikawa, has_widget => 0 },
    );

    foreach my $test (@suite) {

        subtest $test->{name} => sub {
            $app = _run_app(
                'MT::App::CMS',
                {   __test_user => $test->{user},
                    __mode      => 'dashboard',
                },
            );
            $out = delete $app->{__test_output};
            ok( $out && $out =~ m/Status: 200/, 'Request ok.' );
            my $widget = quotemeta
                '<div id="welcome_to_loupe" class="widget welcome-to-loupe">';
            if ( $test->{has_widget} ) {
                ok( $out =~ m/$widget/,
                    'Dashboard has welcome to Loupe widget.' );
                my $support_directory_url = Loupe->support_directory_url;
                ok( $out =~ m/$support_directory_url/,
                    'Loupe widget has support_direcotry_url.'
                );
            }
            else {
                ok( $out !~ m/$widget/,
                    'Dashboard does not have welcome to Loupe widget.' );
            }
        };

    }
};

subtest 'Plugin setting is configured' => sub {
    my $module = Test::MockModule->new('Loupe');
    $module->mock( 'is_enabled', sub {1} );

    my @suite = (
        { name => 'By administrator', user => $admin },
        { name => 'By editor user',   user => $aikawa },
    );

    foreach my $test (@suite) {

        subtest $test->{name} => sub {
            $app = _run_app(
                'MT::App::CMS',
                {   __test_user => $test->{user},
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

    }
};

subtest 'Check save_loupe_config method' => sub {

    my @suite = (
        {   name => 'Cannot use "save_loupe_config" method with GET.',
            post => 0,
            user => $admin,
            like => 'Invalid request.',
        },
        {   name =>
                'Non-system administrator cannot use "save_loupe_config" method.',
            post => 1,
            user => $aikawa,
            like => 'permission=1',
        },
        {   name =>
                'System administrator can use "save_loupe_config" method.',
            post   => 1,
            user   => $admin,
            like   => 'Status: 200',
            unlike => [ 'Invalid request.', 'permission=1' ],
        },
    );

    foreach my $test (@suite) {

        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $test->{user},
                $test->{post} ? ( __request_method => 'POST' ) : (),
                __mode => 'save_loupe_config',
                file   => 'index.html',
            },
        );
        $out = delete $app->{__test_output};

        if ( $test->{like} ) {
            my $likes
                = ref( $test->{like} ) ? $test->{like} : [ $test->{like} ];
            ok( grep( { $out =~ m/$_/ } @$likes ), $test->{name} );
        }

        if ( $test->{unlike} ) {
            my $unlikes
                = ref( $test->{unlike} )
                ? $test->{unlike}
                : [ $test->{unlike} ];
            ok( grep( { $out !~ m/$_/ } @$unlikes ), $test->{name} );
        }

    }

};

subtest 'Check system messages' => sub {

    my @suite = (
        {   file           => '',
            disable_method => undef,
            message => 'Error saving Loupe settings: file path is invalid.',
        },
        {   file           => 'index.html',
            disable_method => 'delete_html',
            message =>
                "Error saving Loupe settings: cannot delete old Loupe's HTML file.",
        },
        {   file           => 'index.html',
            disable_method => 'create_html',
            message =>
                "Error saving Loupe settings: cannot create Loupe's HTML file.",
        },
        {   file           => 'index.html',
            disable_method => undef,
            message        => 'Loupe settings has been successfully.',
        },
    );

    foreach my $test (@suite) {

        my $module = Test::MockModule->new('Loupe');
        if ( $test->{disable_method} ) {
            $module->mock( $test->{disable_method}, sub {0} );
        }

        $app = _run_app(
            'MT::App::CMS',
            {   __test_user      => $admin,
                __request_method => 'POST',
                __mode           => 'save_loupe_config',
                file             => $test->{file},
            },
        );
        $out = delete $app->{__test_output};
        ok( $out && $out =~ m/Status: 200/, 'Request ok.' );
        my $message = quotemeta $test->{message};
        ok( $out =~ m/$message/, 'Request has message: ' . $test->{message} );

    }

};

done_testing;

