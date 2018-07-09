#!/bin/bash

files=$(ls ../3M/3M20180603-*)

for file in $files
do
  sox ../3M/$file -n spectrogram -x 100 -y 300 -z 120 -r -o ./spectrums/$file.png
  echo creating spectrum for $file
done
