# This program is distributed under the terms of
# The MIT License (MIT)
#
# Copyright (c) 2013 Six Apart, Ltd.
#
# $Id$

package Loupe::L10N::ja;

use strict;
use warnings;

use base 'Loupe::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (

## plugins/Loupe/Loupe.pl
	'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics.' => 'Loupe は、スマートフォンに最適化された、まったく新しい Movable Type への入り口です。Loupe を使えば、Movable Type へログインをすることなく、承認待ちの記事やコメントを承認したり、画像のアップロードを行ったり、あなたのサイトの状態を即座に確認することが出来ます。',

## plugins/Loupe/lib/Loupe.pm
	'Loupe\'s HTML file name must not be blank.' => 'HTMLファイル名は必須です。',
	'The URL should not include any directory name: [_1]' => 'URLにはディレクトリ名を含めることはできません: [_1]',
	'Could not create Loupe directory: [_1]' => 'loupeディレクトリを作成することができません: [_1]',
	'Loupe HTML file has been created: [_1]' => 'LoupeのHTMLファイルを作成しました: [_1]',
	'Could not create Loupe HTML file: [_1]' => 'LoupeのHTMLファイルを作成することができませんでした: [_1]',
	'Loupe HTML file has been deleted: [_1]' => 'LoupeのHTMLファイルを削除しました: [_1]',
	'Could not delete Loupe HTML file: [_1]' => 'LoupeのHTMLファイルを削除することができませんでした: [_1]',

## plugins/Loupe/lib/Loupe/App.pm
	'Loupe settings has been successfully. You can send invitation email to users via <a href="[_1]">Loupe Plugin Settings</a>.' => 'Loupeの設定を保存しました。Loupeの<a href="[_1]">設定画面</a>から、LoupeのURLが記載された招待状を、ユーザーにメールで送ることができます。',
	'Error saving Loupe settings: [_1]' => 'Loupeの設定を保存できませんでした: [_1]',
	'Send invitation email' => 'ユーザーに招待状をメールで送信する',
	'Could not send a invitation mail because Loupe is not enabled.' => 'Loupeが無効になっているため、招待状を送信できません。',
	'Welcome to Loupe' => 'ようこそ、Loupeへ',

## plugins/Loupe/lib/Loupe/Mail.pm
	'Loupe invitation mail has been sent to [_3] for user \'[_1]\' (user #[_2]).' => 'Loupeの招待状をユーザー\'[_1]\'(ID: [_2])のメールアドレス \'[_3]\'に送信しました。',

## plugins/Loupe/lib/Loupe/Upgrade.pm
	'Adding Loupe dashboard widget...' => 'Loupeの紹介ウィジェットを追加しています...',

## plugins/Loupe/tmpl/dialog/welcome_mail_result.tmpl
	'Send Loupe welcome email' => 'Loupeの招待状を送信する',

## plugins/Loupe/tmpl/system_config.tmpl
	'Enable Loupe' => 'Loupeを利用する',
	q{The URL of Loupe's HTML file.} => q{LoupeのアクセスURLとなるHTMLファイルを指定してください。},

## plugins/Loupe/tmpl/welcome_mail_html.tmpl
	'Your MT blog status at a glance' => 'あなたの MT の状態をサッと確認',
	'Dear [_1], ' => '[_1]さん、',
	'With Loupe, you can check the status of your blog without having to sign in to your Movable Type account.' => 'Loupe を使えば、Movable Type へログインをしなくても、あなたのブログの状態を即座に確認することができます。',
	'View Access Analysis' => 'アクセス解析',
	'Approve Entries' => '記事承認',
	'Reply to Comments' => 'コメント返信',
	'Loupe is best used with a smartphone (iPhone or Android 4.0 or higher)' => 'スマートフォン（iPhone 又は Android 4.0 以上）からご利用ください。',
	'Try Loupe' => 'Loupeを使ってみる',
	'Perfect for Mini-tasking' => '小さいけど使えます',
	'_LOUPE_BRIEF' => '「今人気がある記事ってなに？」「今、承認しておきたい記事はどれ？」「コメントを即座に返信したい」そんな小さなタスクをスマートフォンですぐにできる。あなたのブログの状況をルーペを使って覗いているようなイメージで作りました。',
	'Use Loupe to help manage your Movable Type blogs no matter where you are!' => 'いつでもどこでも Movable Type が覗ける Loupe を、ぜひお試しください。',
	'Social Media' => 'ソーシャルメディア',
	'https://twitter.com/movabletype' => 'https://twitter.com/movabletypejp',
	'Contact Us' => 'お問い合わせ',
	'http://www.movabletype.org/' => 'http://www.movabletype.jp/',
	'http://plugins.movabletype.org' => 'http://plugins.movabletype.jp',

## plugins/Loupe/tmpl/welcome_mail_plain.tmpl
	'Loupe is ready for use!' => 'Loupeの準備が整いました。',

## plugins/Loupe/tmpl/welcome_mail_result.tmpl

## plugins/Loupe/tmpl/widget/welcome_to_loupe.tmpl
	'Loupe is a mobile-friendly alternative console for Movable Type to let users approve pending entries and comments, upload photos, and view website and blog statistics. <a href="http://www.movabletype.org/beta/60/loupe.html" target="_blank">See more details.</a>' => 'Loupe は、スマートフォンに最適化された、まったく新しい Movable Type への入り口です。Loupe を使えば、Movable Type へログインをすることなく、承認待ちの記事やコメントを承認したり、画像のアップロードを行ったり、あなたのサイトの状態を即座に確認することが出来ます。詳しい情報は<a href="http://www.movabletype.jp/beta/60/loupe.html">こちら</a>をご覧ください。',
	'Loupe can be used without complex configuration, you can get started immediately.' => 'Loupeは、難しい設定をしなくても簡単に、すぐに利用することができます。',
	'Configure Loupe' => 'Loupeの設定',

);

1;
