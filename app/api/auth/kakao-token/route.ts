import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { code, redirectUri } = await req.json()
  if (!code || !redirectUri) return NextResponse.json({ error: 'missing params' }, { status: 400 })

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: '0075002a176bc8fbe8a53072fde6e82c',
    redirect_uri: redirectUri,
    code,
  })

  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: params.toString(),
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data }, { status: 400 })

  return NextResponse.json({ idToken: data.id_token ?? null, accessToken: data.access_token })
}
