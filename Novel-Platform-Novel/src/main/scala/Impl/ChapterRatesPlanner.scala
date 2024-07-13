package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, decodeType}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.{Decoder, Encoder, HCursor}

case class ChapterRatesPlanner(
                                title: String,
                                chapter: Int,
                                username: String, // 新增 username 参数
                                override val planContext: PlanContext
                              ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val chapterRatingQuery =
      s"SELECT rating FROM ${schemaName}.chapter_rating WHERE title = ? AND chapter = ?"
    val userRatingQuery =
      s"SELECT rating FROM ${schemaName}.reader_chapter_ratings WHERE readername = ? AND noveltitle = ? AND chapter_id = ?"

    val chapterParams = List(SqlParameter("String", title), SqlParameter("Int", chapter.toString))
    val userParams = List(SqlParameter("String", username), SqlParameter("String", title), SqlParameter("Int", chapter.toString))

    val readChapterRatingIO = readDBRows(chapterRatingQuery, chapterParams).map {
      case List(json) =>
        json.hcursor.downField("rating").as[Double] match {
          case Right(rating) => Some(rating)
          case Left(error) => throw new Exception(s"Failed to decode chapter rating: ${error.getMessage}")
        }
      case Nil => None
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
      chapterRating <- readChapterRatingIO
      userRating <- checkUserRatingIO
    } yield {
      Map(
        "chapterRating" -> chapterRating.asJson,
        "userRating" -> userRating.asJson
      ).asJson.noSpaces
    }).attempt.flatMap {
      case Right(json) => IO.pure(json)
      case Left(e) => IO.raiseError(new Exception("System error: " + e.getMessage))
    }
  }
}
