#!/bin/bash

aliascmd='alias lox="node index.js"'
start_msg='Creating alias...'
complete_msg='Finished. Please open a new terminal window.'

if [ "$(uname)" == "Darwin" ]
then
  echo $start_msg
  echo $aliascmd >> ~/.bash_profile
  source ~/.bash_profile
  echo $complete_msg
  exit 0
fi

if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]
then
  echo $start_msg
  echo $aliascmd >> ~/.profile
  source ~/.profile
  echo $complete_msg
  exit 0
fi

echo 'Unsupported OS'
exit 1


