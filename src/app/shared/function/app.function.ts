import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export function handleError(err: HttpErrorResponse): any{
    if(err.error){
      // this.loggerService.logError('An error occurred: ${obj.error.message}');
    }else{
      // this.loggerService.logError('An error occurred: status ${obj.status}, ${obj.error}');
    }
    return throwError(() => new Error('An error occurred. Please try again.'));
} 

