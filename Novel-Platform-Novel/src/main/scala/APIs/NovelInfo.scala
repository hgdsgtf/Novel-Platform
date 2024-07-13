package APIs

import Common.API.API
import Global.ServiceCenter.novelServiceCode
import io.circe.Decoder
import APIs.NovelMessage
case class NovelInfo(title: String, author: String, rating: Double) extends NovelMessage[String]

