---
title: Troubleshooting
description: Common issues and workarounds when developing with UmBootstrap.
---

## Multiple Umbraco sites on localhost

### Problem

When running multiple Umbraco sites simultaneously on `localhost` (e.g. `https://localhost:44395` and `https://localhost:44390`), logging into one site logs you out of the other.

### Cause

Umbraco's backoffice authentication uses OAuth tokens stored in cookies named `__Host-umbAccessToken` and `__Host-umbRefreshToken`. These cookie names are **hardcoded** in Umbraco's `HideBackOfficeTokensHandler.cs` and cannot be changed via configuration.

Since cookies are scoped by domain (not port), all Umbraco sites running on `localhost` share the same cookies. When you log into one site, it overwrites the token cookies set by the other, effectively logging you out.

### Partial fix: AuthCookieName

Umbraco does allow you to change the `UMB_UCONTEXT` cookie name via `appsettings.json`:

```json
{
  "Umbraco": {
    "CMS": {
      "Security": {
        "AuthCookieName": "UMB_UCONTEXT_MYSITE"
      }
    }
  }
}
```

This changes the session context cookie but **does not fix the problem** because the OAuth token cookies (`__Host-umbAccessToken`, `__Host-umbRefreshToken`) remain shared.

### Workarounds

#### Browser profiles (recommended)

Use separate browser profiles for each Umbraco site. Each profile has its own cookie jar, so the sites won't interfere with each other.

In Edge/Chrome: click your profile icon in the top-right corner and select a different profile for each site.

#### Custom hostnames via hosts file

Edit your hosts file (`C:\Windows\System32\drivers\etc\hosts`) to give each site a unique hostname:

```
127.0.0.1  umbootstrap.local
127.0.0.1  updoc.local
```

Then update each project's `launchSettings.json` to use the custom hostname. This gives each site a completely separate cookie domain.

**Note:** The default .NET dev certificate only covers `localhost`. You'll need [mkcert](https://github.com/FiloSottile/mkcert) or similar to generate trusted certificates for the custom hostnames.

#### Incognito/InPrivate window

Open one site in a normal window and the other in an incognito/InPrivate window. Quick but resets every time you close the window.

### Root cause in Umbraco source

The cookie names are defined as `const` strings in `Umbraco.Cms.Api.Common`:

```csharp
// HideBackOfficeTokensHandler.cs
private const string AccessTokenCookieName = "umbAccessToken";
private const string RefreshTokenCookieName = "umbRefreshToken";
private const string PkceCodeCookieName = "umbPkceCode";
```

Until Umbraco makes these configurable (or scopes them by port/path), the browser profile approach is the most practical workaround for local development.
