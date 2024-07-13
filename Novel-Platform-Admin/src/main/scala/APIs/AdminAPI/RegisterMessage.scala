package APIs.AdminAPI


case class RegisterMessage(userName:String, userEmail:String, password:String,verificationCode:String) extends AdminMessage[Int]
