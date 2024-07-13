package APIs

import Common.API.API
import Global.ServiceCenter.novelServiceCode
import io.circe.Decoder
case class ChapterInfo(chapter:Int,rating : Int)
  extends NovelMessage[String]