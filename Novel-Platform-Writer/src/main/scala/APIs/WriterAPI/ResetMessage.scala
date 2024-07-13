package APIs.WriterAPI

case class ResetMessage(
    userName: String,
    password: String
) extends WriterMessage[Int]
