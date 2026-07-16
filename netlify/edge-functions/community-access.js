function unauthorizedResponse() {
  return new Response(
    'This resource is intended for the ComedySportz community.',
    {
      status: 401,
      headers: {
        'WWW-Authenticate':
          'Basic realm="ComedySportz Games Database", charset="UTF-8"',
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );
}

export default async function communityAccess(request, context) {
  const password = Netlify.env.get('COMMUNITY_PASSWORD');

  if (!password) {
    return new Response(
      'Community access has not been configured.',
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  const authorization = request.headers.get('authorization');

  if (!authorization?.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  try {
    const encodedCredentials = authorization.slice('Basic '.length);
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(':');

    if (separatorIndex === -1) {
      return unauthorizedResponse();
    }

    const suppliedPassword = decodedCredentials.slice(separatorIndex + 1);

    if (suppliedPassword !== password) {
      return unauthorizedResponse();
    }

    return context.next();
  } catch {
    return unauthorizedResponse();
  }
}

export const config = {
  path: '/*',
};