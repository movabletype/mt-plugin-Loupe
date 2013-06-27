package Loupe::App;
use strict;
use warnings;

use Loupe;

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
                MT->app->user->is_superuser && Loupe->is_enabled;
            },
            code => \&_send_welcome_mail,
        },
    };
}

sub _send_welcome_mail {
    my $app = shift;

    return $app->permission_denied()
        unless $app->user->is_superuser();

    my $plugin = MT->component('Loupe');
    return $app->error(
        $plugin->translate(
            'Cannot send welcome mail because Loupe is not enabled.')
    ) unless Loupe->is_enabled;

    require MT::Mail;
    my @msg_loop;
    my $tmpl = $plugin->load_tmpl('welcome_mail.tmpl');
    my @id   = $app->param('id');
    foreach (@id) {
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
            my $param = {
                loupe_html_url => Loupe->html_url,
                loupe_site_url => Loupe->official_site_url,
            };
            my $body = $app->build_page_in_mem( $tmpl, $param );
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
                $res = $plugin->translate(
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
            $res
                = $plugin->translate(
                "User '[_1]' (user #[_2]) does not have email address",
                $author->name, $author->id );
        }

        push @msg_loop, { message => $res };
    }

    $plugin->load_tmpl( 'welcome_mail_result.tmpl',
        { message_loop => \@msg_loop, return_url => $app->return_uri } );
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
