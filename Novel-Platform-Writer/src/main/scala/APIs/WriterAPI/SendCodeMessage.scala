package APIs.WriterAPI

case class SendCodeMessage(userEmail: String) extends WriterMessage[String]
