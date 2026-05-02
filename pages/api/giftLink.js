const GIFT_URLS = [
  'https://andrenathalia03052026.site/',
  'https://www.andrenathalia03052026.site/'
];

const LOCAL_FALLBACK_PATH = '/lista-presentes?fallback=1';

async function checkUrl(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const headRes = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store'
    });

    if (headRes.status >= 200 && headRes.status < 400) {
      return true;
    }

    // Some hosts reject HEAD but allow GET.
    if (headRes.status === 405 || headRes.status === 501) {
      const getRes = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        cache: 'no-store'
      });
      return getRes.status >= 200 && getRes.status < 400;
    }

    return false;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

function redirect(res, location) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.writeHead(307, { Location: location });
  res.end();
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  for (const url of GIFT_URLS) {
    // Stops at the first healthy destination.
    // This avoids exposing guests to intermittent 403/availability issues.
    const reachable = await checkUrl(url);
    if (reachable) {
      return redirect(res, url);
    }
  }

  return redirect(res, LOCAL_FALLBACK_PATH);
}
