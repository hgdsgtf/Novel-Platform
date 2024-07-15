package APIs

import io.circe.generic.auto.*
import io.circe.syntax.*
import APIs.StyleAPI.StyleMessage
import io.circe.Json

case class GetPageStyleMessage(pageName: String, styleId: Int) extends StyleMessage[Json]

