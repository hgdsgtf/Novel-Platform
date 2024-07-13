package APIs.ReaderAPI

case class GetUsernameMessage(email: String) extends ReaderMessage[String]
