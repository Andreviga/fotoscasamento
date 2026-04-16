function getAdminPassword() {
  return (process.env.ADMIN_PASSWORD || '').trim();
}

export function isAdminTokenValid(token) {
  const expected = getAdminPassword();
  return Boolean(expected) && typeof token === 'string' && token === expected;
}

export function assertAdmin(req, res) {
  const token = req.headers['x-admin-token'];

  if (!isAdminTokenValid(token)) {
    res.status(401).json({ error: 'Nao autorizado' });
    return false;
  }

  return true;
}
