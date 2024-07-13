package APIs

import APIs.AuditorAPI.AuditorMessage

case class GetPermissionMessage(userName: String) extends AuditorMessage[String]
