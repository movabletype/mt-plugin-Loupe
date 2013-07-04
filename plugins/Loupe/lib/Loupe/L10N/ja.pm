# Movable Type (r) (C) 2006-2013 Six Apart, Ltd. All Rights Reserved.
# This code cannot be redistributed without permission from www.sixapart.com.
# For more information, consult your Movable Type license.
#
# $Id$

package Loupe::L10N::ja;

use strict;
use warnings;

use base 'Loupe::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (

## plugins/Loupe/Loupe.pl
	'Loupe is the application for operating the user daily task easily.' => 'Loupe を使えば、Movable Type へログインをしなくても、あなたのブログの状態を即座に確認することができます。',

## plugins/Loupe/lib/Loupe.pm
	'Loupe\'s HTML file name must not be blank.' => 'HTMLファイル名は必須です。',
	'The URL should not include any directory name: [_1]' => 'URLにはディレクトリ名を含めることはできません: [_1]',
	'Could not create loupe directory: [_1]' => 'loupeディレクトリを作成することができません: [_1]',
	'Loupe HTML file has been created: [_1]' => 'LoupeのHTMLファイルを作成しました: [_1]',
	'Could not create Loupe HTML file: [_1]' => 'LoupeのHTMLファイルを作成することができませんでした: [_1]',
	'Loupe\'s HTML file has been deleted: [_1]' => 'LoupeのHTMLファイルが削除されました: [_1]',
	'Could not delete Loupe HTML file: [_1]' => 'LoupeのHTMLファイルを削除することができませんでした: [_1]',

## plugins/Loupe/lib/Loupe/App.pm
	'Are you sure you want to send invitation mail to selected users?' => 'Loupeの招待状を選択されたユーザーに送信してもよろしいですか？',
	'Could not send a invitation mail because Loupe is not enabled.' => 'Loupeが無効になっているため、招待状を送信できません。',
	'Welcome to Loupe' => 'ようこそ、Loupeへ',
	'Loupe invitation mail has been sent to [_3] for user \'[_1]\' (user #[_2]).' => 'Loupeの招待状をユーザー \'[_3]\'のメールアドレス \'[_1]\'に送信しました。 (ユーザー: [_2])',
	'Send Loupe invitation mail' => 'Loupeの招待状を送信する',

## plugins/Loupe/lib/Loupe/Upgrade.pm
	'Adding Loupe dashboard widget...' => 'Loupeの紹介ウィジェットを追加しています...',

## plugins/Loupe/tmpl/system_config.tmpl
	'Enable Loupe' => 'Loupeを利用する',

## plugins/Loupe/tmpl/welcome_mail.tmpl
	'Hi, [_1]", params="<mt:var name"username">' => 'こんにちわ、[_1]さん',
	'This is Loupe. You can see immediately the status of your site if you are using Loupe.' => 'Loupeを使えば、あなたのサイトの状態を即座に確認することができます。',
	'Try to use Loupe' => 'Loupeを使ってみる',

## plugins/Loupe/tmpl/welcome_mail_result.tmpl

## plugins/Loupe/tmpl/widget/welcome_to_loupe.tmpl
	'Thank you for installing Loupe!' => 'Loupeをインストールしていただき、ありがとうございます!',
	q{Ready to use the Loupe. Why don't you use Loupe right now?} => q{Loupeは利用可能です。早速、使ってみますせんか？},
	'Try to use the Loupe!' => 'Loupeを使う',
	'Send invitation mail to users.' => 'Loupeの招待状を送信する',
	'Configure the Loupe' => 'Loupeの設定',
	'Loupe can be used without complex configuration, you can get started immediately.' => 'Loupeは、難しい設定をしなくても簡単に、すぐに利用することができます。',
	'Loupe is not able to use now. Please contact to System Administrator.' => 'Loupeは現在利用できません。システム管理者に連絡してください。',
	'Failed to send invitation mail: ' => 'Loupeの招待メールを送信できませんでした:',
	'Sent the invitation mail that contains the access URL of the Loupe to \'[_1]\'.' => 'Loupeのアクセス先URLを記載した招待メールを \'[_1]\' に送信しました。',

);

1;
