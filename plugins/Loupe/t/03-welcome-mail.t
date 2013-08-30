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

use MT::Test qw( :app :db );
use MT::Test::Permission;
use Test::More;

# Prepare for tests
my $admin = MT::Author->load(1);
$admin->email('miuchi+admin@sixapart.com');
$admin->save or die $admin->errstr;

my $aikawa = MT::Test::Permission->make_author(
    name     => 'aikawa',
    nickname => 'Ichiro Aikawa',
    email    => 'miuchi+aikawa@sixapart.com',
);

my $ichikawa = MT::Test::Permission->make_author(
    name     => 'ichikawa',
    nickname => 'Jiro Ichikawa',
    email    => 'miuchi+ichikawa@sixapart.com',
);

my $ukawa = MT::Test::Permission->make_author(
    name     => 'ukawa',
    nickname => 'Saburo Ukawa',
    email    => 'miuchi+ukawa@sixapart.com',
);

my $editor    = MT::Role->load( { name => 'Editor' } );
my $commenter = MT::Role->load( { name => 'Commenter' } );

my $website = MT::Website->load;

require MT::Association;
MT::Association->link( $aikawa, $editor,    $website );
MT::Association->link( $ukawa,  $commenter, $website );

$ENV{HTTP_HOST} = 'localhost';

# Run tests
my ( $app, $out );

{
    note('dialog_invitation_email');

    my @suite = (
        { user => $admin,    can_view_dialog => 1 },
        { user => $ichikawa, can_view_dialog => 0 },
        { user => $ukawa,    can_view_dialog => 0 },
    );

    foreach my $test (@suite) {
        note( 'user: ' . $test->{user}->name );

        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $test->{user},
                __mode      => 'dialog_invitation_email',
                dialog      => 1,
            },
        );
        $out = delete $app->{__test_output};

        if ( $test->{can_view_dialog} ) {
            ok( $out && $out =~ m/Status: 200/, 'Request ok.' );
            ok( $out !~ m/permission=1/,
                'System administrator can access dialog_invitation_email.' );
        }
        else {
            ok( $out && $out =~ m/Status: 302/, 'Request ok.' );
            ok( $out =~ m/permission=1/,
                'Non-system administrator cannot access dialog_invitation_email.'
            );
        }
    }
}

{
    note('send_invitation_email');

    $app = _run_app(
        'MT::App::CMS',
        {   __test_user => $admin,
            __mode      => 'send_invitation_email',
            ids         => $admin->id,
        },
    );
    $out = delete $app->{__test_output};
    ok( $out && $out =~ m/Invalid request\./, 'ok' );

    my $mock_loupe = Test::MockModule->new('Loupe');
    $mock_loupe->mock( 'is_enabled', sub {1} );

    my $mock_mail = Test::MockModule->new('MT::Mail');
    $mock_mail->mock( '_send_mt_sendmail',
        sub { shift->_send_mt_debug(@_) } );

    my @suite = (
        { user => $admin,    post => 0, ok => 0 },
        { user => $admin,    post => 1, ok => 1 },
        { user => $aikawa,   post => 1, ok => 0 },
        { user => $ichikawa, post => 1, ok => 0 },
    );

    foreach my $test (@suite) {

        note( 'user: ' . $test->{user}->name );

        my ( $save_stderr, $read, $write );
        my %headers;
        my $mail_body;

        if ( $test->{ok} ) {
            $save_stderr = \*STDERR;
            pipe $read, $write;
            *STDERR = $write;
        }

        $app = _run_app(
            'MT::App::CMS',
            {   __test_user => $test->{user},
                $test->{post} ? ( __request_method => 'POST' ) : (),
                __mode => 'send_invitation_email',
                ids    => $test->{user}->id,
            },
        );

        if ( $test->{ok} ) {
            close $write;

            while ( ( my $line = <$read> ) ne "\n" ) {
                chomp $line;
                my ( $key, $value ) = split /: /, $line, 2;
                $headers{$key} = $value;
            }
            $mail_body = join '', <$read>;

            close $read;
            *STDERR = $save_stderr;
        }

        $out = delete $app->{__test_output};

        if ( $test->{ok} ) {
            ok( $out =~ m/Send Loupe welcome email/,
                'Welcome mail has been sent.'
            );

            is( $headers{Subject}, 'Welcome to Loupe',
                'Mail Subject is ok.' );
            is( $headers{From}, $test->{user}->email, 'Mail From is ok.' );
            is( $headers{To},   $test->{user}->email, 'Mail To is ok.' );

            ok( $mail_body =~ m/Content-Type: multipart\/alternative;/,
                'Mail content is ok.' );
        }
        else {
            my $like = $test->{post} ? 'permission=1' : "Invalid request\.";
            $like = quotemeta $like;

            ok( $out =~ m/$like/, 'Invitation email has not been sent.' );

        }

    }
}

done_testing;
