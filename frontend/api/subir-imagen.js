const { randomUUID } = require('node:crypto');

const REPOSITORIO = 'YurianaCantilloS/tienda-imagenes';
const RAMA = 'main';
const PREFIJOS = new Set(['producto', 'proveedor', 'cotizacion']);
const EXTENSIONES = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'heic', 'heif', 'bmp', 'svg']);
const MAX_BASE64 = 4 * 1024 * 1024;

module.exports = async function subirImagen(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Inicia sesión para subir fotos.' });
  }

  const { GITHUB_IMAGE_TOKEN, SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!GITHUB_IMAGE_TOKEN || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(503).json({ error: 'Falta configurar el servicio de imágenes en Vercel.' });
  }

  const { prefijo, extension, contenido } = req.body || {};
  if (!PREFIJOS.has(prefijo) || !EXTENSIONES.has(extension) ||
      typeof contenido !== 'string' || !contenido.length) {
    return res.status(400).json({ error: 'El formato de la imagen no es válido.' });
  }
  if (contenido.length > MAX_BASE64) {
    return res.status(413).json({ error: 'La imagen debe pesar como máximo 3 MB.' });
  }
  if (contenido.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(contenido) ||
      Buffer.from(contenido, 'base64').toString('base64') !== contenido) {
    return res.status(400).json({ error: 'No se pudo leer el archivo de imagen.' });
  }

  try {
    const usuario = await fetch(new URL('/auth/v1/user', SUPABASE_URL), {
      headers: { Authorization: authorization, apikey: SUPABASE_ANON_KEY }
    });
    if (usuario.status === 401 || usuario.status === 403) {
      return res.status(401).json({ error: 'Vuelve a iniciar sesión e inténtalo de nuevo.' });
    }
    if (!usuario.ok) {
      return res.status(502).json({ error: 'No se pudo verificar la sesión.' });
    }

    const nombre = prefijo + '-' + randomUUID() + '.' + extension;
    const ruta = 'imagenes/' + nombre;
    const github = await fetch('https://api.github.com/repos/' + REPOSITORIO + '/contents/' + ruta, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + GITHUB_IMAGE_TOKEN,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Agregar foto ' + nombre, content: contenido, branch: RAMA })
    });
    if (!github.ok) {
      console.error('GitHub rechazó la subida de una imagen:', github.status);
      const error = github.status === 401 || github.status === 403
        ? 'GitHub rechazó la credencial de las fotos. Revisa el token y sus permisos en Vercel.'
        : 'GitHub no pudo guardar la imagen. Inténtalo de nuevo.';
      return res.status(502).json({ error });
    }

    return res.status(201).json({ url: 'https://cdn.jsdelivr.net/gh/' + REPOSITORIO + '@' + RAMA + '/' + ruta });
  } catch {
    return res.status(502).json({ error: 'No se pudo conectar con el servicio de imágenes.' });
  }
};
