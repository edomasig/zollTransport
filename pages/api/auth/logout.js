import { serialize } from 'cookie';

export default async function (req, res) {
  if (req.method === 'POST') {
    const cookie = serialize('auth', 'false', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, // Expire the cookie immediately
      path: '/',
    });
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
