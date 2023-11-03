exports.ssoService = async (req, res, next) => {

    const msalConfig = {
       auth: {
           clientId: process.env['SSO_CLIENT_ID'],
           authority: process.env['SSO_AUTHORITY'],
           redirectUri: '/items',
           postLogoutRedirectUri: '/auth/index.html',
           navigateToLoginRequestUrl: false,
       },
       cache: {
           cacheLocation: 'localStorage',
           storeAuthStateInCookie: false,
       },
       system: {
           loggerOptions: {
               loggerCallback: (level, message, containsPii) => {
                   if(containsPii){
                       return;
                   }
                   switch(level){
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
   
    }
    res.set({'Content-Type' : 'application/json'});
    res.json(msalConfig);
   }