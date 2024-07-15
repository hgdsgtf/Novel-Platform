package APIs

import APIs.NovelMessage
case class NovelsRanking(title: String, rating: Double) extends NovelMessage[String]
