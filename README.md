# The Plastic Surgery Clinic
Homepage concept for client review. Plain HTML, CSS and JavaScript with no package dependencies or application server.

## Preview locally
Open `dist/index.html` in Chrome or Safari. Alternatively, with Python 3 and Node installed, run `npm run preview` and open http://localhost:8080. The four clips and three service photos are included. Dr Reddy’s official portrait and links to the existing clinic website require internet access. The concept collects no patient data.

## Validate and build
With Node.js 20+ and FFmpeg installed, run:
```sh
npm run check
npm run build
```
The build encodes all four clips as muted H.264 MP4s without changing their order or trimming their duration. It checks the 25 MiB Cloudflare Pages per-file limit and writes the deployable site to `.output/public`. Set `FFMPEG_PATH` to use a specific FFmpeg executable.

## GitHub and Cloudflare Pages
After review, add these project files to a private GitHub repository. The included GitHub Actions workflow installs FFmpeg, runs the checks, and produces the `cloudflare-pages` build artifact.

For the first deployment, download and extract that artifact and upload the resulting directory to a Cloudflare Pages **Direct Upload** project. Upload the directory whose root contains `index.html`, `_headers` and `media/`. You can also upload the local `.output/public` build from the command above. Pages Direct Upload supports a later automated deploy from GitHub Actions.

If you prefer Cloudflare to build on Git pushes, create a **Git-integrated** project instead. Set the framework preset to None, the root directory to the repository root, the build command to `npm run build`, and the output directory to `.output/public`. That environment must provide FFmpeg. Cloudflare does not support switching an existing Git-integrated project to Direct Upload.

Use Cloudflare Access or another host access control for client-only review. The included noindex settings are search-engine hints. Confirm the proposed footage and imagery with the clinic before public launch.

Cloudflare documentation: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
