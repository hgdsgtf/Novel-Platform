package APIs.ReaderAPI

case class ResetMessage(
    userName: String,
    password: String
) extends ReaderMessage[Int]
