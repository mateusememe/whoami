# Custom domain

The site is published at `https://mateusememe.github.io/whoami/` by the
`Deploy to GitHub Pages` workflow (a custom GitHub Actions workflow, not
branch publishing). This page lists every step to serve it from a domain
you own, following GitHub's documentation:

- [About custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Verifying a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Securing the site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Troubleshooting](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)

The examples use `example.com`; replace it with your domain.

## What changes

- The site moves to the root of the domain: `https://example.com/`, not
  `https://example.com/whoami/`. The build base path becomes `/`.
- Once the domain is set on this repository, GitHub serves the site there
  and should redirect the old `github.io/whoami/` address to it. Check
  after the switch with `curl -sI https://mateusememe.github.io/whoami/`:
  expect a 301 with `Location: https://example.com/`.
- With a custom Actions workflow, **no `CNAME` file is needed**: GitHub
  ignores one. The domain lives only in the repository's Pages settings.

## 1. Verify the domain (before anything else)

GitHub recommends verifying the domain first, so no one else can take it
over on GitHub Pages.

1. Your profile picture → **Settings** → **Pages** (under "Code,
   planning, and automation") → **Add a domain**, type `example.com`,
   **Add domain**.
2. GitHub shows a TXT record. Create it at your DNS provider; its name has
   the form `_github-pages-challenge-mateusememe.example.com`. Copy the
   value from the Pages screen.
3. Wait for DNS (immediate, or up to 24 hours). Check with:

   ```bash
   dig _github-pages-challenge-mateusememe.example.com +nostats +nocomments +nocmd TXT
   ```

4. Back in **Settings → Pages**, open the domain's menu → **Continue
   verifying** → **Verify**. Keep the TXT record afterwards.

## 2. Set the domain on this repository

Repository **Settings** → **Pages** → **Custom domain**: type the domain
(apex `example.com` or `www.example.com`) → **Save**. GitHub then runs a
DNS check.

Do step 5 right after this one: until a deploy runs with `BASE_PATH=/`,
the pages ask for their files under `/whoami/` and break on the new
domain.

## 3. DNS records

At your DNS provider (remove any default records it created at `@` first):

Apex domain (`example.com`), either all eight address records:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

or one `ALIAS`/`ANAME` record at `@` pointing to `mateusememe.github.io`,
if the provider supports it.

`www` subdomain, recommended even when the apex is the main address:

| Type | Host | Value |
|---|---|---|
| CNAME | www | mateusememe.github.io |

The CNAME points to `mateusememe.github.io`, **without** the repository
name. With both set up, GitHub redirects one to the other: if the domain
saved in step 2 is `example.com`, `www.example.com` redirects to it.

Check the records:

```bash
dig example.com +noall +answer -t A
dig example.com +noall +answer -t AAAA
dig www.example.com +noall +answer -t CNAME
```

Avoid wildcard records (`*.example.com`). If the domain has CAA records,
one of them must allow `letsencrypt.org`.

## 4. HTTPS

After the DNS check passes, GitHub requests a Let's Encrypt certificate.
It can take up to an hour for the site to answer over HTTPS, and up to 24
hours before **Enforce HTTPS** can be ticked in **Settings → Pages**. Tick
it. If the certificate does not appear after several minutes, remove the
domain and save it again.

## 5. Point the build at the new address

1. Repository **Settings** → **Secrets and variables** → **Actions** →
   **Variables**: add `SITE_URL` = `https://example.com` and
   `BASE_PATH` = `/`. The deploy workflow reads both.
2. In `src/seo/site.ts`, set `DEFAULT_SITE_URL = "https://example.com"`.
   The committed generated files (the `<head>` block in `index.html`,
   `sitemap.xml`, `llms.txt`, the Markdown profiles, the JSON Resume) use
   it, and the tests compare them.
3. Run `npm run generate` and `npm run og:image` (the share cards print
   the address), update the address in `README.md`, `AGENTS.md`,
   `CLAUDE.md` and `package.json` (`homepage`), run `npm test`, commit and
   push. The deploy publishes the site with the new canonical URLs, and the
   résumé PDFs print the new address.

## Rolling back

Remove the domain in **Settings → Pages**, delete the `SITE_URL` and
`BASE_PATH` variables, restore `DEFAULT_SITE_URL`, regenerate and push.
If you stop using the domain, delete its DNS records too: a domain that
still points at GitHub Pages with no site behind it can be taken over.
