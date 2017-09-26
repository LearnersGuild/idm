#!/bin/bash

openssl genrsa -out ./private-key.pem 2048
openssl rsa -in ./private-key.pem -outform PEM -pubout -out ./public-key.pem

[[ $(grep -c "^$" .env.development) < 1 ]] && NEWLINE=$'\r' || NEWLINE=""

read -r -d '' PARSED_PRIVATE << EndOfMessage2

$( echo "$NEWLINE""JWT_PRIVATE_KEY=\"" | tr -d "\n" )$( cat ./private-key.pem | perl -pe 's/\n/\\n/g' | perl -pe 's/\\n$//g' )"
EndOfMessage2

read -r -d '' PARSED_PUBLIC << EndOfMessage
$( echo $'\n'"JWT_PUBLIC_KEY=\"" | tr -d "\n" )$( cat ./public-key.pem | perl -pe 's/\n/\\n/g' | perl -pe 's/\\n$//g' )"
EndOfMessage

echo $PARSED_PRIVATE >> ./.env.development
echo $PARSED_PUBLIC >> ./.env.development

rm ./public-key.pem
rm ./private-key.pem