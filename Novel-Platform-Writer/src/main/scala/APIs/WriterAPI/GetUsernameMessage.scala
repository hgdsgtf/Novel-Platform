package APIs.WriterAPI

case class GetUsernameMessage(email: String)
    extends WriterMessage[String]
