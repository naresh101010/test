import { ToasterService } from './../services/toaster.service';
import { NgxSpinnerService } from "ngx-spinner";

export class ErrorConstants {
  public static errorNotFound = 'Details Not Found !! Service Error :( ';
  public static errorBadRquest = 'Bad Request';
  public static errorUniqueConstrain = 'Duplicate Value'
  public static errorServiceException = 'Service Exception'
  public static branchNotFoundErrorMessage ='Matching pincodes with : '
  public static branchNotFoundErrorMessage1 =' does not exist in propel-i'
  public static businessErrorNotFoundErrorCode = 'B_ERR-404'
  public static minCharacterSearchErrorMessage = 'Enter at least 3 characters'



  constructor(private tosterservice: ToasterService, public SpinnerService: NgxSpinnerService) {
    this.SpinnerService.hide();
    ErrorConstants.validateException.prototype.spinnerService = this.SpinnerService;

  }

  public static getValue(key){
    let map = new Map();
  //  map.set('DETAILS_NOT_FOUND', ob);
    map.set('RNFERR',ErrorConstants.errorNotFound);
    map.set(404,ErrorConstants.errorNotFound);
    map.set(501,ErrorConstants.errorUniqueConstrain);
    map.set(500,ErrorConstants.errorServiceException);
    map.set(400,ErrorConstants.errorBadRquest);
    return map.get(key);
  }


  public static  validateException(data) {
    debugger
     let  ob = {
        isSuccess: false,
        code: '',
        message : ''
      };
    if (data.status === 'Success' || data.status === 'success' || data.status === 'SUCCESS') {
      ob.isSuccess = true;
      return ob;
    } else {
      if (data.errors) {
        ob.isSuccess = false
        ob.code = data.errors.error[0].code;
        ob.message = data.errors.error[0].description;
        // this.prototype.SpinnerService.hide();
      }
      return ob
    }
  }



}





