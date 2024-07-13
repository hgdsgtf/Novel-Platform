package APIs.ReaderAPI

case class SendCodeMessage(userEmail: String) extends ReaderMessage[String]
