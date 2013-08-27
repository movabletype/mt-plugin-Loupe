#!/usr/bin/perl
use strict;
use warnings;

BEGIN {
    $ENV{MT_CONFIG} = 'mysql-test.cfg';
}

use lib qw( lib extlib t/lib );

use MT::Test qw( :app :db );
use MT::Test::Permission;
use MT::Permission;
use Test::More;

# Prepare for tests
my $admin = MT::Author->load(1);

my $aikawa = MT::Test::Permission->make_author(
    name     => 'aikawa',
    nickname => 'Ichiro Aikawa',
);

my $perm = MT::Permission->new;
$perm->set_values(
    {   author_id   => $aikawa->id,
        blog_id     => 0,
        permissions => "'manage_plugins'",
    }
);
$perm->save or die $perm->errstr;

# Run tests
my ( $app, $out );

$app = _run_app(
    'MT::App::CMS',
    {   __test_user      => $admin,
        __request_method => 'POST',
        __mode           => 'save_plugin_config',
        plugin_sig       => 'Loupe/Loupe.pl',
        enabled          => 1,
        file             => 'index.html',
    },
);
$out = delete $app->{__test_output};
ok( $out =~ m/Status: 302 Found/ && $out =~ m/saved=1/, 'Enable Loupe.' );

my @suite = (
    { user => $admin,  has_button => 1 },
    { user => $aikawa, has_button => 0 },
);

foreach my $test (@suite) {
    subtest 'user: ' . $test->{user}->name => sub {
        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $test->{user},
                __mode      => 'cfg_plugins',
                blog_id     => 0,
            },
        );
        $out = delete $app->{__test_output};

        ok( $out =~ m/Status: 200/, 'Request OK.' );

        my $button = quotemeta('Send invitation email</button>');
        if ( $test->{has_button} ) {
            ok( $out =~ m/$button/, "Loupe's plugin settings screen has send invitation email button." );
        }
        else {
            ok( $out !~ m/$button/, "Loupe's plugin settings screen does not have send invitation email button." );
        }
    };
}

done_testing;

