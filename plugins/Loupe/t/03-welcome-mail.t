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
    note 'send_welcome_mail method';
    local $ENV{HTTP_X_REQUESTED_WITH} = 'XMLHttpRequest';

    note 'Loupe is disabled';
    $app = _run_app(
        'MT::App::CMS',
        {   __test_user      => $admin,
            __request_method => 'POST',
            __mode           => 'send_welcome_mail',
        },
    );
    $out = delete $app->{__test_output};
    my $json = quotemeta '{"error":"Invalid request.\n"}';
    ok( $out =~ m/$json/, "Could not send mail." );

    note 'Loupe is enabled';
    my $mock_loupe = Test::MockModule->new('Loupe');
    $mock_loupe->mock( 'is_enabled', sub {1} );

    my $mock_mail = Test::MockModule->new('MT::Mail');
    $mock_mail->mock( '_send_mt_sendmail',
        sub { shift->_send_mt_debug(@_) } );

    my @suite = (
        { user => $admin,    ok => 1 },
        { user => $aikawa,   ok => 1 },
        { user => $ichikawa, ok => 0 },
        { user => $ukawa,    ok => 0 },
    );

    foreach my $test (@suite) {
        note 'user: ' . $test->{user}->name;

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
            {   __test_user      => $test->{user},
                __request_method => 'POST',
                __mode           => 'send_welcome_mail',
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
            $json = quotemeta '{"error":null,"result":{"to":"'
                . $test->{user}->email . '"}}';
            ok( $out =~ m/$json/, 'Welcome mail has been sent.' );

            is( $headers{Subject}, 'Welcome to Loupe',
                'Mail Subject is ok.' );
            is( $headers{From}, $test->{user}->email, 'Mail From is ok.' );
            is( $headers{To},   $test->{user}->email, 'Mail To is ok.' );

            ok( $mail_body
                    =~ m/This is Loupe\. You can see immediately the status of your site if you are using Loupe\./,
                'Mail content is ok.'
            );
        }
        else {
            ok( $out =~ m/Status: 302 Found/ && $out =~ m/permission=1/,
                'Welcome mail has not been sent.' );
        }

    }
}

{
    note 'itemset_action (send_welcome_mail)';

    note 'Loupe is disabled';
    $app = _run_app(
        'MT::App::CMS',
        {   __test_user            => $admin,
            __request_method       => 'POST',
            __mode                 => 'itemset_action',
            _type                  => 'author',
            action_name            => 'send_welcome_mail',
            id                     => 1,
            plugin_action_selector => 'send_welcome_mail',
        },
    );
    $out = delete $app->{__test_output};
    ok( $out =~ m/An error occurred/
            && $out
            =~ m/That action \(send_welcome_mail\) is apparently not implemented!/,
        'Cannot send mail by list actions.'
    );

    note 'Loupe is enabled';
    my $mock_loupe = Test::MockModule->new('Loupe');
    $mock_loupe->mock( 'is_enabled', sub {1} );

    my $mock_mail = Test::MockModule->new('MT::Mail');
    $mock_mail->mock( '_send_mt_sendmail',
        sub { shift->_send_mt_debug(@_) } );

    my @suite = (
        { user => $admin,    ok => 1 },
        { user => $aikawa,   ok => 0 },
        { user => $ichikawa, ok => 0 },
    );

    foreach my $test (@suite) {
        note 'user: ' . $test->{user}->name;

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
            {   __test_user            => $test->{user},
                __request_method       => 'POST',
                __mode                 => 'itemset_action',
                _type                  => 'author',
                action_name            => 'send_welcome_mail',
                id                     => 1,
                plugin_action_selector => 'send_welcome_mail',
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

            ok( $mail_body
                    =~ m/This is Loupe\. You can see immediately the status of your site if you are using Loupe\./,
                'Mail content is ok.'
            );
        }
        else {
            ok( $out =~ m/An error occurred/
                    && $out
                    =~ m/That action \(send_welcome_mail\) is apparently not implemented!/,
                'Welcome mail has not been sent.'
            );
        }

    }
}

done_testing;
