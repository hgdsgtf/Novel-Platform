package APIs.AuditorAPI

case class LoginMessage(userName: String, password: String)
    extends AuditorMessage[String]
