package APIs.ReaderAPI

case class LoginMessage(userName: String, password: String)
    extends ReaderMessage[String]
