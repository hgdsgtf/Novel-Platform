package APIs.AdminAPI

case class LoginMessage(userName:String, password:String) extends AdminMessage[String]
