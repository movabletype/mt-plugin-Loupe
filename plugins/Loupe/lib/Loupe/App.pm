package Loupe::App;
use strict;
use warnings;

use Loupe;

sub send_welcome_mail_to_yourself {
    my $app = shift;

    return $app->errtrans('Invalid request.')
        unless $app->request_method eq 'POST' && Loupe->is_enabled;

    my $user = $app->user or return;
    return $app->permission_denied
        unless $user->is_superuser
        || MT::Permission->count( { author_id => $user->id } );

    my ( $msg_loop, $error ) = _send_mail_core( $app, [ $user->id ] );

    $error ? $app->json_error(@$msg_loop) : $app->json_result();
}

sub widgets {
    my $app = MT->app;
    my $user = $app->user or return;
    return if !$user->is_superuser && !Loupe->is_enabled;
    return {
        welcome_to_loupe => {
            label    => 'Welcome to Loupe',
            template => 'widget/welcome_to_loupe.tmpl',
            handler  => sub { $_[2]->{loupe_is_enabled} = Loupe->is_enabled },
            singular => 1,
            set      => 'main',
            view     => 'user',
            order => { user => 150 },
            default => 1,
        },
    };
}

sub list_actions {
    return {
        send_welcome_mail => {
            label                   => 'Send welcome mail of Loupe',
            order                   => 100,
            continue_prompt_handler => sub {
                MT->translate(
                    'You are about to send email(s) to allow the selected user(s) to invite to Loupe. Do you wish to continue?'
                );
            },
            condition => sub {
                my $app = MT->app;
                my $user = $app->user or return;
                $user && $user->is_superuser && Loupe->is_enabled;
            },
            code => \&_send_welcome_mail,
        },
    };
}

sub _send_welcome_mail {
    my $app = shift;

    return $app->permission_denied()
        unless $app->user->is_superuser();

    return $app->errtrans('Invalid request.')
        unless $app->request_method eq 'POST';

    my $plugin = MT->component('Loupe');
    return $app->error(
        $plugin->translate(
            'Cannot send welcome mail because Loupe is not enabled.')
    ) unless Loupe->is_enabled;

    my @id = $app->param('id');
    my ($msg_loop) = _send_mail_core( $app, \@id );

    $plugin->load_tmpl( 'welcome_mail_result.tmpl',
        { message_loop => $msg_loop, return_url => $app->return_uri } );
}

sub _send_mail_core {
    my ( $app, $ids ) = @_;

    require MT::Mail;
    my $plugin = MT->component('Loupe');
    my $param  = {
        loupe_html_url => Loupe->html_url,
        loupe_site_url => Loupe->official_site_url,
    };
    my $tmpl = $plugin->load_tmpl( 'welcome_mail.tmpl', $param );
    my @msg_loop;
    my $error;

    foreach (@$ids) {
        my $author = MT::Author->load($_)
            or next;
        my $res;
        if ( $author->email ) {
            my %head = (
                id   => 'send_welcome_mail',
                To   => $author->email,
                From => $app->config('EmailAddressMain') || $app->user->email,
                Subject => $plugin->translate('Welcome to Loupe.'),
            );
            my $body = $app->build_page_in_mem($tmpl);
            if ( MT::Mail->send( \%head, $body ) ) {
                $res
                    = $plugin->translate(
                    "A welcome mail of Loupe has been sent to [_3] for user  '[_1]' (user #[_2]).",
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
        Loupe->delete_html;
    }
}

1;
