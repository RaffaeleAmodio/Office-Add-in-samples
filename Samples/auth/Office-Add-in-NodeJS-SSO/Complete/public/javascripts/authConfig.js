/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */

 const msalConfig = {
    auth: {
      clientId: "b48d21ef-5d0e-4834-a161-fad01549f7af", // This is the ONLY mandatory field that you need to supply.
      authority: "https://login.microsoftonline.com/common", // Defaults to "https://login.microsoftonline.com/common"
      redirectUri: "https://localhost:44355/dialog.html", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.href
      //postLogoutRedirectUri: "https://localhost:44355/signout", // Simply remove this line if you would like navigate to index page after logout.
      navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
      response_type: "access_token"
    },
    cache: {
      cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
      storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case msal.LogLevel.Error:
              console.error(message);
              return;
            case msal.LogLevel.Info:
              console.info(message);
              return;
            case msal.LogLevel.Verbose:
              console.debug(message);
              return;
            case msal.LogLevel.Warning:
              console.warn(message);
              return;
          }
        }
      }
    }
  };
  
  /**
   * Scopes you add here will be prompted for user consent during sign-in.
   * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
   * For more information about OIDC scopes, visit: 
   * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
   */
  const loginRequest = {
    scopes: ["api://localhost:44355/478aa78e-20ba-4c0d-9ffe-c4f62e5de3d5/access_as_user"],
  };
  
  /**
   * An optional silentRequest object can be used to achieve silent SSO
   * between applications by providing a "login_hint" property.
   */
  
  // const silentRequest = {
  //   scopes: ["openid", "profile"],
  //   loginHint: "example@domain.net"
  // };
  
  // exporting config object for jest
  if (typeof exports !== 'undefined') {
    module.exports = {
      msalConfig: msalConfig,
    };
  }