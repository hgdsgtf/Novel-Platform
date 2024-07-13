package APIs.AuditorAPI

case class SendCodeMessage(userEmail: String) extends AuditorMessage[String]
