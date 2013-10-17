# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$

package Loupe::L10N::en_us;

use strict;
use warnings;

use base 'Loupe::L10N';
use vars qw( %Lexicon );

%Lexicon = (
## plugins/Loupe/tmpl/welcome_mail_html.tmpl
## plugins/Loupe/tmpl/welcome_mail_plain.tmpl
    '_LOUPE_BRIEF' =>
        '"Which of my entries are the most popular right now?" "Do I have any entries currently pending approval?" "I really need to respond to this comment sooner rather than later..." All of these mini-tasks can now be done directly from your smartphone. We designed Loupe to make checking in on your blogs as easy as possible.'
);

1;
