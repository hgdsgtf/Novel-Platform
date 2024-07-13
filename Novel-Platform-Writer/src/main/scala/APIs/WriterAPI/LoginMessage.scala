package APIs.WriterAPI

case class LoginMessage(userName: String, password: String)
    extends WriterMessage[String]
