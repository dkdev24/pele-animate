#!/bin/sh
# Regenerates the README images. Needs agent-browser, ffmpeg and `python3 -m http.server 8765` running in the repo root.
# Static: m1/p1/m2/p2.png (Mermaid, Pele). Animated: a1/a2/a3.gif (pele-animate): intro draw-in, then one hover-token cycle, looped.
set -e
cd "$(dirname "$0")"; OUT=$(pwd); TMP=$(mktemp -d); FPS=12; INTRO=3.6
agent-browser set viewport 760 2400 2 >/dev/null
agent-browser open http://localhost:8765/examples/compare.html >/dev/null; sleep 4
for id in m1 p1 m2 p2; do agent-browser screenshot "#$id" "$OUT/$id.png" >/dev/null; done
frames() { # id phase duration offset
  n=$(python3 -c "print(int($3*$FPS))"); i=0
  while [ $i -lt $n ]; do
    agent-browser eval "seek('$1', $i/$FPS, '$2')" >/dev/null
    agent-browser screenshot "#$1" "$TMP/$1-$4$(printf %03d $i).png" >/dev/null; i=$((i+1))
  done
}
for id in a1 a2 a3; do
  agent-browser eval "start('$id','intro')" >/dev/null; frames $id intro $INTRO i
  cycle=$(agent-browser eval "start('$id','tokens')" | tr -d '"'); frames $id tokens "$cycle" t
  ffmpeg -loglevel error -y -framerate $FPS -pattern_type glob -i "$TMP/$id-*.png" \
    -vf "scale=680:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=5" -loop 0 "$OUT/$id.gif"
done
rm -rf "$TMP"
