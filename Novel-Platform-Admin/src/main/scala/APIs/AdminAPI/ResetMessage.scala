package APIs.AdminAPI

case class ResetMessage(userName:String, userEmail:String, password:String, verificationCode:String) extends AdminMessage[Int]
