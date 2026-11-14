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

## Deploy with Cloudflare Pages

In Workers & Pages, create a Pages project and choose Import an existing Git repository. Connect this repository and enter:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `sh scripts/build-cloudflare.sh` |
| Build output directory | `.output/public` |
| Root directory | Leave blank |
| Build environment variables | `NODE_VERSION=22`, `PYTHON_VERSION=3.12.7` |

The build uses FFmpeg if available. Otherwise it installs a pinned FFmpeg binary package in a temporary Python virtual environment. The build checks the asset size limit before deployment. Save and Deploy, then open the `pages.dev` URL from the deployment summary.

For a Pages Direct Upload project, download the `cloudflare-pages` artifact from the GitHub Actions workflow, extract it, and upload the directory containing `index.html` and `media/`.

The deployed URL is publicly reachable by default. The included noindex settings control indexing. Use access controls for client-only review.

Cloudflare documentation: https://developers.cloudflare.com/pages/get-started/git-integration/
