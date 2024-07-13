package APIs.WriterAPI

case class RegisterMessage(
    userName: String,
    userEmail: String,
    password: String,
    verificationCode: String
) extends WriterMessage[Int]
