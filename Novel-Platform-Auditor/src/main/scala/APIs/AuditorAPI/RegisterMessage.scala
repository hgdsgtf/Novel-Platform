package APIs.AuditorAPI

case class RegisterMessage(
    userName: String,
    userEmail: String,
    password: String,
    verificationCode: String
) extends AuditorMessage[Int]
