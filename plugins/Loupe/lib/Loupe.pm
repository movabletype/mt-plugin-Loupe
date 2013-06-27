package Loupe;
use strict;
use warnings;
use base qw( MT::ErrorHandler );

use File::Spec;
use Loupe::Const;

sub is_valid_file_path {
    my ( $class, $file ) = @_;

    if ( !defined($file) || $file eq '' ) {
        return $class->error(
            _translate("Loupe's HTML file name must not be blank.") );
    }

    my $app          = MT->app;
    my $get_html_dir = _get_html_dir($file);
    my $html_dir
        = File::Spec->catdir( $app->support_directory_path, 'loupe' );
    $html_dir = File::Spec->rel2abs($html_dir);
    if ( $get_html_dir ne $html_dir ) {
        return $class->error(
            _translate(
                "A directory of Loupe's HTML file is wrong: [_1].",
                $get_html_dir
            )
        );
    }

    1;
}

sub create_html {
    my ( $class, $file ) = @_;

    my $html_dir = _get_html_dir($file);
    my $fmgr     = _get_fmgr();
    if ( !$fmgr->exists($html_dir) ) {
        $fmgr->mkpath($html_dir);
    }

    my $html_path = get_html_path($file);
    my $tmpl      = _plugin()->load_tmpl($Loupe::Const::TMPL_FILE);
    my $param     = _make_param();
    if ( $fmgr->put_data( $tmpl->output($param), $html_path ) ) {
        _log(
            _translate(
                "Loupe's HTML file has been created: [_1].", $html_path
            )
        );
        return 1;
    }
    else {
        return $class->error(
            _translate("Cannot create Loupe's HTML file: ") . $fmgr->errstr );
    }
}

sub delete_html {
    my ($class) = @_;

    my $html_path = _plugin()->get_config_value('html_path');
    return 1 unless $html_path;

    my $fmgr = _get_fmgr();
    return 1 unless $fmgr->exists($html_path);

    if ( $fmgr->delete($html_path) ) {
        _log(
            _translate(
                "Loupe's HTML file has been deleted: [_1].", $html_path
            )
        );
        return 1;
    }
    else {
        return $class->error(
            _translate("Cannot delete Loupe's HTML file: ") . $fmgr->errstr );
    }
}

sub support_directory_url {
    my $app = MT->app;
    my $url = $app->support_directory_url;
    if ( $url !~ m!^https?://! ) {
        my $cgi_path = $app->config->CGIPath;
        my $domain;
        if ( $cgi_path =~ m!^(https?://[^/]+)!i ) {
            $domain = $1;
        }
        else {
            $domain
                = 'http'
                . ( $app->is_secure ? 's' : '' ) . '://'
                . $ENV{'HTTP_HOST'};
        }
        if ( $url !~ /^\// ) {
            $url = '/' . $url;
        }
        $url = $domain . $url;
    }
    $url;
}

sub is_enabled {
    my $hash = _plugin()->get_config_hash;
    $hash->{enabled} && _get_fmgr()->exists( $hash->{html_path} );
}

sub official_site_url {$Loupe::Const::OFFICIAL_SITE_URL}

{
    my $fmgr;

    sub _get_fmgr {
        if ( !$fmgr ) {
            require MT::FileMgr;
            $fmgr = MT::FileMgr->new('Local');
        }
        $fmgr;
    }
}

sub _get_html_dir {
    my ($file) = shift;
    my $html_path = get_html_path($file);
    require File::Basename;
    File::Basename::dirname($html_path);
}

sub get_html_path {
    my $file = @_ == 1 ? $_[0] : $_[1];
    if ( !defined($file) || $file eq '' ) {
        $file = $Loupe::Const::DEFAULT_HTML;
    }
    my $app = MT->app;
    my $html_path
        = File::Spec->catfile( $app->support_directory_path, 'loupe', $file );
    File::Spec->rel2abs($html_path);
}

sub html_url {
    my $support_dir = support_directory_url();
    $support_dir =~ s/\/$//;
    join '/',
        (
        $support_dir, 'loupe',
        _plugin()->get_config_value('file') || $Loupe::Const::DEFAULT_HTML
        );
}

sub _make_param {
    my $cfg = MT->config;

    my $api_cgi_path = $cfg->CGIPath;
    if ( $api_cgi_path !~ /\/$/ ) {
        $api_cgi_path .= '/';
    }
    $api_cgi_path .= $cfg->DataAPIScript;

    my $static_web_path = $cfg->StaticWebPath;
    if ( $static_web_path !~ /\/$/ ) {
        $static_web_path .= '/';
    }
    my $api_path = $static_web_path . 'data-api/v1/js';
    my $lib_path = $static_web_path . 'plugins/Loupe';

    return {
        api_cgi_path => $api_cgi_path,
        api_path     => $api_path,
        lib_path     => $lib_path
    };
}

sub _log {
    my $msg = shift;
    return unless $msg;
    my $app = MT->app;
    MT->log(
        {   message   => $msg,
            class     => 'system',
            category  => 'loupe',
            level     => MT::Log::INFO(),
            author_id => $app->user->id,
            ip        => $app->remote_ip,
        }
    );
}

sub _plugin    { MT->component('Loupe') }
sub _translate { MT->component('Loupe')->translate(@_) }

1;
