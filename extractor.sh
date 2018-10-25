#extracts audio from mp4 files 
#mp4 audio format can be checked with ffmpeg -i fss1.mp4

mkdir -p m4a 

SAVEIFS=$IFS
IFS=$'\n\b'

for i in `find . -type f -iname "*.mp4" -print`; do
echo $i
NAME=`echo $i | sed  -e 's/\.\///' -e  's/\.MP4//g' `
echo "doing '$NAME'"

if [ ! -f m4a/${NAME}.m4a ]; then
   ffmpeg -i $i -vn -acodec copy  m4a/${NAME}.m4a
fi

# Use for converting to MP3
#if [ ! -f mp3s/${NAME}.mp3 ]; then
 #   echo 'converting to mp3'
  #  faad --stdio m4a/${NAME}.m4a | lame --preset standard - "mp3s/${NAME}.mp3"
#fi
done

IFS=$SAVEIFS