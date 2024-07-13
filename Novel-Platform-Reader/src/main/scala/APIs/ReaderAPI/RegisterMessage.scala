package APIs.ReaderAPI

case class RegisterMessage(
    userName: String,
    userEmail: String,
    password: String,
    verificationCode: String
) extends ReaderMessage[Int]
