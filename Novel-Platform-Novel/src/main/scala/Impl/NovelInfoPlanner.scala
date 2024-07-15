package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, decodeType, readDBBoolean, writeDB}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import APIs.NovelInfo
import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.{Decoder, Encoder, HCursor}
import scala.util.{Failure, Success, Try}

case class NovelInfoPlanner(
                             title: String,
                             username: String, // 新增 username 参数
                             override val planContext: PlanContext
                           ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val novelInfoQuery =
      s"SELECT title, author, rating FROM ${schemaName}.novelinfo WHERE title = ?"
    val userRatingQuery =
      s"SELECT rating FROM ${schemaName}.reader_novel_ratings WHERE readername = ? AND novelname = ?"

    val novelParams = List(SqlParameter("String", title))
    val userParams = List(SqlParameter("String", username), SqlParameter("String", title))

    val readNovelInfoIO = readDBRows(novelInfoQuery, novelParams).map {
      case List(json) =>
        json.as[NovelInfo] match {
          case Right(novelInfo) => novelInfo
          case Left(error) => throw new Exception(s"Failed to decode novel info: ${error.getMessage}")
        }
      case Nil => throw new Exception("Novel not found")
    }

    val checkUserRatingIO = readDBRows(userRatingQuery, userParams).map {
      case List(json) =>
        json.hcursor.downField("rating").as[Int] match {
          case Right(rating) => Some(rating)
          case Left(_) => None
        }
      case Nil => None
    }

    (for {
      novelInfo <- readNovelInfoIO
      userRating <- checkUserRatingIO
    } yield {
      Map(
        "novelInfo" -> novelInfo.asJson,
        "userRating" -> userRating.asJson
      ).asJson.noSpaces
    }).attempt.flatMap {
      case Right(json) => IO.pure(json)
      case Left(e) => IO.raiseError(new Exception("System error"))
    }
  }
}
