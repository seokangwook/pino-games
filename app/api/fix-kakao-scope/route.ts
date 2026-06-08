import { NextResponse } from 'next/server'

// Temporary route: fix Kakao OAuth scope in Supabase auth config
// Remove after KOE205 is resolved
export async function POST() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'no service key configured' }, { status: 500 })

  const sbUrl = 'https://yiduavoxineujidorcbx.supabase.co'

  // Step 1: read current auth config
  const getRes = await fetch(`${sbUrl}/auth/v1/admin/config`, {
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
  })
  const config = await getRes.json()

  // Step 2: patch only the kakao scopes field
  const patchRes = await fetch(`${sbUrl}/auth/v1/admin/config`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...config,
      external: {
        ...config.external,
        kakao: {
          ...config.external?.kakao,
          additional_redirect_urls: config.external?.kakao?.additional_redirect_urls ?? [],
          scopes: 'profile_nickname profile_image',
        },
      },
    }),
  })

  const result = await patchRes.json()
  return NextResponse.json({
    status: patchRes.status,
    kakaoScopes: result?.external?.kakao?.scopes ?? result,
  })
}
