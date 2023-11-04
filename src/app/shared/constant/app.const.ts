// export const API_URL = "http://localhost:8080/";

import { HttpHeaders } from "@angular/common/http";

export namespace APP{

    export class ENDPOINT{

        public static readonly SERVER = 'http://localhost:8081';
    }

    export class HTTP_OPTIONS{

        public static readonly JSON_SIMPLE = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
          }
    }

    export class DATAGRID{
        public static readonly DATAGRID_DEBOUNCE: number = 500;
    }
    
    export class TIMEOUT{
        public static readonly AUTH_USERINFO_UPDATE_INTERVAL: number = 10;
        public static readonly SESSION_IDLE_SECONDS = 600;
        public static readonly SESSION_TIMEOUT_SECONDS = 30;
    }

    export class DATE_FORMAT{
        public static readonly DATE_TIME_SLASH_FORMAT: string = 'MM/dd/yyyy h:mm a';
        public static readonly DATE_TIME_DASH_FORMAT: string = 'yyyy-MM-dd HH:mm:ss';
        public static readonly DATE_FORMAT: string = 'yyyy-MM-dd';
        public static readonly LONG_DATE: string = 'MMMM d, y';
    }

    


}

