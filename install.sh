#!/bin/bash

pip install virtualenv
virtualenv env
cd env
source bin/activate
pip install -r ../requirements.txt
wget https://bitright.sfo2.digitaloceanspaces.com/tlsh.zip
unzip tlsh.zip
cd tlsh/py_ext
python setup.py install
cd ../../..
