package APIs

import APIs.AuditorAPI.AuditorMessage

case class GetQualifiedMessage(userName: String) extends AuditorMessage[String]
