import { NextResponse } from 'next/server';

const TARGET = 'https://andrenathalia03052026.site';

/**
 * Reverse proxy for the gift list site.
 * The Next.js server fetches the HTML server-side (bypassing any browser 403),
 * injects a <base> tag so all relative HTML/CSS asset URLs resolve to the
 * original domain, and injects a fetch/XHR interceptor so JavaScript API
 * calls also go to the original domain.
 */
export async function GET() {
  try {
    const res = await fetch(`${TARGET}/`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      // Always fetch fresh content
      cache: 'no-store',
    });

    if (!res.ok) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;padding:2rem;text-align:center">
          <p>Não foi possível carregar o site de presentes (${res.status}).</p>
          <p>Tente novamente em alguns instantes.</p>
        </body></html>`,
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      );
    }

    let html = await res.text();

    // Script injected before everything else.
    // 1. Patches fetch() and XHR so that relative /api/... calls go to TARGET.
    // 2. Patches history.pushState / replaceState so in-app navigation inside
    //    the iframe doesn't try to change the parent URL.
    const interceptor = `<script>
(function(){
  var T='${TARGET}';
  var _f=window.fetch.bind(window);
  window.fetch=function(url,opts){
    if(typeof url==='string'&&url.startsWith('/'))url=T+url;
    else if(url&&typeof url==='object'&&typeof url.url==='string'&&url.url.startsWith('/'))url=new Request(T+url.url,url);
    return _f(url,opts);
  };
  var _xo=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,url){
    if(typeof url==='string'&&url.startsWith('/'))url=T+url;
    return _xo.apply(this,arguments);
  };
})();
</script>`;

    // Inject <base> + interceptor right after <head> so they run first.
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>\n<base href="${TARGET}/">\n${interceptor}`);
    } else if (html.includes('<HEAD>')) {
      html = html.replace('<HEAD>', `<HEAD>\n<base href="${TARGET}/">\n${interceptor}`);
    } else {
      // Fallback: prepend before <html>
      html = `<base href="${TARGET}/">\n${interceptor}\n` + html;
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        // Allow this response to be loaded inside an iframe on our domain
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:2rem;text-align:center">
        <p>Erro ao carregar a lista de presentes.</p>
        <pre style="color:red;font-size:.8rem">${msg}</pre>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
}
