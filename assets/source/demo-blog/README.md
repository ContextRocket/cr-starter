# Starter demo blog image sources

The full-resolution originals live here so the starter can ship smaller demo
images without losing the source files. The checked-in derivatives under
`public/images/blog/` keep the same filenames and URLs used by the sample
posts.

The current derivatives are JPEG quality 82 with their longest side capped at
1280 pixels. On macOS, regenerate one with:

```bash
sips -s format jpeg -s formatOptions 82 -Z 1280 \
  assets/source/demo-blog/example.jpg \
  --out public/images/blog/example.jpg
```

Review the result visually before replacing a shipped image. Normal site builds
use the checked-in derivatives and do not need an image-processing dependency.
