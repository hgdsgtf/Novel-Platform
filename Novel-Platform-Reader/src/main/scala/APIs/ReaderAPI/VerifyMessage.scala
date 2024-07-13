package APIs.ReaderAPI

case class VerifyMessage(
    userEmail: String,
    verificationCode: String
) extends ReaderMessage[Int]
