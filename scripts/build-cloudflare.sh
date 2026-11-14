#!/bin/sh
set -eu

if [ -n "${FFMPEG_PATH:-}" ] || command -v ffmpeg >/dev/null 2>&1; then
  exec npm run build
fi

venv_dir=$(mktemp -d "${TMPDIR:-/tmp}/clinic-ffmpeg.XXXXXX")
trap 'rm -rf "$venv_dir"' EXIT
python3 -m venv "$venv_dir"
"$venv_dir/bin/python" -m pip install --disable-pip-version-check --only-binary=:all: 'imageio-ffmpeg==0.6.0'
FFMPEG_PATH=$("$venv_dir/bin/python" -c 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())')
export FFMPEG_PATH
npm run build
