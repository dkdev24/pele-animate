#!/bin/sh
# Regenerates the README images. Needs agent-browser, ffmpeg and `python3 -m http.server 8765` running in the repo root.
# Static: c1/c2/m2/p2.png (Mermaid, Pele). Animated: a2.gif (sequence; intro draw-in, then one hover-token cycle, looped) and,
# recorded live in autoplay step mode, one exact loop each of c3/c4.gif (home page comparison) and a3.gif (home page hero).
set -e
cd "$(dirname "$0")"; OUT=$(pwd); TMP=$(mktemp -d); FPS=12; INTRO=3.6
agent-browser set viewport 1240 2400 2 >/dev/null
agent-browser open http://localhost:8765/examples/compare.html >/dev/null; sleep 4
for id in c1 c2 m2 p2; do agent-browser screenshot "#$id" "$OUT/$id.png" >/dev/null; done
frames() { # id phase duration offset
  n=$(python3 -c "print(int($3*$FPS))"); i=0
  while [ $i -lt $n ]; do
    agent-browser eval "seek('$1', $i/$FPS, '$2')" >/dev/null
    agent-browser screenshot "#$1" "$TMP/$1-$4$(printf %03d $i).png" >/dev/null; i=$((i+1))
  done
}
for id in a2; do
  agent-browser eval "start('$id','intro')" >/dev/null; frames $id intro $INTRO i
  cycle=$(agent-browser eval "start('$id','tokens')" | tr -d '"'); frames $id tokens "$cycle" t
  ffmpeg -loglevel error -y -framerate $FPS -pattern_type glob -i "$TMP/$id-*.png" \
    -vf "scale=680:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=5" -loop 0 "$OUT/$id.gif"
done

# Live autoplay panels: record the page, find each panel's loop restarts (marker squares), cut one loop, crop to the panel.
agent-browser set viewport 1240 1000 2 >/dev/null # the recording shows the viewport only
agent-browser record start "$TMP/live.webm" http://localhost:8765/examples/compare.html >/dev/null; sleep 22
RECTS=$(agent-browser eval "JSON.stringify(Object.fromEntries(['c3','c4','a3'].map((i)=>{const r=document.getElementById(i).getBoundingClientRect();return [i,[r.x,r.y,r.width,r.height]]})))" | python3 -c "import sys,json;print(json.loads(sys.stdin.read()))")
agent-browser record stop >/dev/null
RECTS="$RECTS" TMP="$TMP" OUT="$OUT" python3 - <<'PY'
import ast, os, subprocess
rects, tmp, out = ast.literal_eval(os.environ['RECTS']), os.environ['TMP'], os.environ['OUT']
video = f'{tmp}/live.webm'
# the webm frame rate is variable: use each frame's own timestamp, not index / fps
pts = [float(t) for t in subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'frame=pts_time', '-of', 'csv=p=0', video]).decode().split()]
for n, (id, (x, y, w, h)) in enumerate(rects.items()):
    px = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', video, '-fps_mode', 'passthrough', '-vf', f'crop=8:8:{n * 12 + 2}:2,scale=1:1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']) # marker n: 6px css squares, 2x
    red = [px[i] > 150 and px[i + 1] < 100 for i in range(0, len(px), 3)]
    edges = [pts[i] for i in range(1, len(red)) if red[i] and not red[i - 1]]
    assert len(edges) >= 3, f'{id}: loop restarts not found ({edges})'
    start, length = edges[1], edges[2] - edges[1]
    nominal = {'c3': 4.8, 'c4': 4.8, 'a3': 6.0}[id]  # (steps - 1) * 1.2 s + 2.4 s hold; the recording's own clock drifts, so retime the cut to it
    subprocess.check_call(['ffmpeg', '-loglevel', 'error', '-y', '-ss', f'{start:.2f}', '-t', f'{length:.2f}', '-i', video,
        '-vf', f'scale=in_range=pc:out_range=pc,crop={round(w * 2)}:{round(h * 2)}:{round(x * 2)}:{round(y * 2)},setpts=PTS*{nominal / length:.4f},fps=12,scale={round(w)}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=5',
        '-loop', '0', f'{out}/{id}.gif'])
    print(id, f'loop {length:.1f}s recorded, {nominal}s nominal')
PY
rm -rf "$TMP"
